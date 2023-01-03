<template>
  <header>
    <div>
      <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" >
      <button v-on:click="togglePopup"></button>
      </Modal>
    </div>
  </header>
  <div id="homepic">
    <div class="logo"><img src="/img/Logotyp.png"></div>
  </div>
  <div class="wrapper">
    <!-- <button id="play" @click="$router.push('/actualPlay/'+lang)">{{'Actual PlayView'}}</button> -->
    <button id="play" @click="$router.push('/preCreate/'+lang)">{{uiLabels.createCross}}</button>
    <button id="play" @click="$router.push('/lobby/'+lang)">{{uiLabels.playCross}}</button>
    <!-- <button id="play" @click="$router.push('/CreateView/'+lang)">{{'Göra korsord test'}}</button> -->
  </div>

  <audio ref="audioPlayer" src="01 Manboy.m4a"></audio>
  <button @click="togglePlayback">
    {{ playbackToggle ? src='Pause Music': 'Play Music' }}
  </button>

</template>

<script>
import io from 'socket.io-client';
import Modal from '../components/PopUp.vue'
const socket = io();

export default {
  name: 'StartView',
  components: {
    Modal
  },
  props: {
  modal: Object,
  },
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "en",
      showModal: false,
      sourceName: 'StartView',
      playbackToggle: false
    }
  },

  created: function () {
    socket.emit('pageLoaded')
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
    console.log("created har anropats")
  },
  methods: {
    switchLanguage: function() {
      if (this.lang === "en")
        this.lang = "sv"
      else
        this.lang = "en"

      socket.emit("switchLanguage", this.lang)
      this.$router.push(this.lang)
    },
    /* FÖR ATT FÅ FRAM POP-UP RUTA*/
    togglePopup: function () {
      this.showModal = ! this.showModal;
    },

    togglePlayback() {
      this.playbackToggle ? this.$refs.audioPlayer.pause() : this.$refs.audioPlayer.play();
      this.playbackToggle = !this.playbackToggle;
    }
  }
}
</script>

<style scoped>
.language{
    height: 1rem;
    width: 1rem;
    cursor:pointer;
    margin: 0.5rem;
}
#flag {
  width: 5rem;
  height: 3.5rem;
  border-radius: 20%;
}

#help {
    height: 3rem;
    width: 3rem;
    background-color: #FFFDD0;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 30px;
    text-align: center;
    cursor:pointer;
    border-radius: 50%;
    border-color: black;
    position: absolute;
    top: 0;
    right:0;
    margin: 0.5rem;
  }
  
  .help {
    height: 3rem;
    width: 3rem;
    background-color: #FFFDD0;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 30px;
    text-align: center;
    cursor:pointer;
    border-radius: 50%;
    border-color: black;
    position: absolute;
    top: 0;
    right:0;
    margin: 0.5rem;
  }

  .wrapper{
    display: flex;
    justify-content: center;
  }

  #homepic {
    background-color: #A7CAB1;
    width: 100%;
    height: 25em;
  }

  #create {
    width: 18rem;
    height: 6rem;
    border-radius: 15px;
    border-color: #ba0c00;
    margin: 2.5rem;
    color: white;
    background-color: #FE5F55;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 30px;
    cursor:pointer;
    position: relative;
    
  }

#play {
    width: 18rem;
    height: 6rem;
    border-radius: 15px;
    border-color: #ba0c00;
    margin: 2.5rem;
    color: white;
    background-color: #FE5F55;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 30px;
    cursor:pointer;
    position: relative;
    
  }

  #create:hover{
    background-color: #fb6d63;
    
  }
  #play:hover{
    background-color: #fb6d63;
    
  }


  .logo img {
    height:25rem;
    vertical-align: bottom;
    margin-right: 0.5rem; 
  }
  .hamburger {
    color:white;
    width:1em;
    display: flex;
    align-items: center;
    justify-content: left;
    padding:0.5rem;
    top:0;
    left:0;
    height: 2rem;
    cursor: pointer;
    font-size: 1.5rem;
  }

@media screen and (max-width:50em) {
  .logo {
    font-size: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hamburger::before {
    content: "☰";
  }
  .close::before {
    content: "✕";
  }
  .hide {
    left:-12em;
  }
}
</style>
