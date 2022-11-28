<template>
    <div>
      QuizCross name: 
      <input type="text" v-model="pollId">
      <button v-on:click="createPoll">
        Create crossword
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
  
  const wordFromInput = function(inputWord, inputDesc) {
    this.word = inputWord;
    this.desc = inputDesc;
}



  export default {
    name: 'CreateView',
    data: function () {
      return {
        matrix: {},
        wordPositions: [[]], /* vi loopar igenom matrisen genom att loopa:
                                for h in matrix.width:
                                    for v in matrix.height:
                                        någonting matrix[h, v]             */

        wordObjects: {}, /* {"clown": {beskrivning: "pajas", horisontellt: true, pos: {clown.split()[0]: [1, 1],
                                                                                       clown.split()[1]: [1, 2],
                                                                                       ...
                                                                                      }
                                      }
                             "lakan": {beskrining: "ligger man på"} ...
                            }                                                           */
        wordKeyPairs: [], /* [{ord: beskrivning}] vi matar in via v-model. Syftet med dessa är att kunna skicka
                            smidigare till spelarvyn. Kanske ej behövs, kolla hur mycket det underlättar! */
        wordFromInput: {}, 

        /* SKICKA wordObjects TILL SPELARVYN */
        /* All info ligger under data, dvs. data.wordObjects."clown".beskrivning = "pajas" */
      }
    },
    created: function () {
      this.lang = this.$route.params.lang;
      socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels
      })
      socket.on("dataUpdate", (data) =>
        this.data = data
      )
      socket.on("pollCreated", (data) =>
        this.data = data)
    },
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
      },
      testAddWordObject: function (wordObject) {
        this.words.push(wordObject) /* dessa 'word' är alltså objekt */
      },
      testAddWord: function (wrd, description) {
        this.word.key = wrd; 
        this.word.description = description;
        
        wordFromInput = new wordFromInput("","");
      }, 
      findPotentialMatches: function (word, desc) {
        /* let potentialMatches: [{word: desc}]; */
        wordKeys = word.split();
        
      }
      
    }
  }
  </script>
  