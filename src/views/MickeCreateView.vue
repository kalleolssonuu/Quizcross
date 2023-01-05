<template>

  <header>
    <div class="logo">Quizcross</div>
    <button class="language" v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>
  </header>
  
  <div>

    <!-- här bestäms id för spelet -->
    Poll link: 
    <input type="text" v-model="pollId">


      <!-- createpoll skickar in pollid och lang och  
        TOMT poll skapas i server i lista this.polls med pollID som key -->
    <button v-on:click="createPoll">
      Create poll
    </button>

    <div>
      {{uiLabels.question}}:
      <input type="text" v-model="question">

      <div>
        Answers:
        <input v-for="(_, i) in answers" 
               v-model="answers[i]" 
               v-bind:key="'answer'+i">

        <button v-on:click="addAnswer">
          Add answer alternative
        </button>
      </div>

    </div>

    <button v-on:click="addQuestion">
      Add question
    </button>

    <input type="number" v-model="questionNumber">
    
    <button v-on:click="runQuestion">
      Run question
    </button>


    {{data}}
    <router-link v-bind:to="'/result/'+pollId">Check result</router-link>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'MickeCreateView',
  data: function () {
    return {
      lang: "",
      pollId: "",
      question: "",
      answers: ["", ""],
      questionNumber: 0,
      data: {},
      uiLabels: {}
    }
  },
  created: function () {
    this.lang = this.$route.params.lang; // är detta att den sparar det aktuella språket som lang? 
                                          //asså är det kvar sen sidan innan fattar ej
                                          // ja verkar som det eftersom micke ej hade 
    socket.emit("pageLoaded", this.lang);
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
    socket.on("dataUpdate", (data) =>
      this.data = data
    )
    socket.on("pollCreated", (data) =>
      this.data = data)
      // data består av:  this.polls[pollId];
  },  // som är ett tomt poll me pollid

  methods: {
    createPoll: function () {
      socket.emit("createPoll", {pollId: this.pollId, lang: this.lang })
    },
    addQuestion: function () {
      socket.emit("addQuestion", {pollId: this.pollId, q: this.question, a: this.answers } )
    },
    addAnswer: function () {
      this.answers.push("");
    },
    runQuestion: function () {
      socket.emit("runQuestion", {pollId: this.pollId, questionNumber: this.questionNumber})
    }
  }
}
</script>

  <style>
 header {
    background-color: #A7CAB1;
    width: 100%;
    height: 33%;
  }

  .logo {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 2.5rem;
    color: white;
    padding-top:0.2em;
    text-align: center;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
  }
  .logo img {
    height:2.5rem;
    vertical-align: bottom;
    margin-right: 0.5rem; 
  }
</style>