<template>
  <header>
    <div class="language">
      <img id="flag" :src="uiLabels.changeLanguage" v-on:click="switchLanguage"></div>

    <!-- ALL KOD FÖR POPUP-WINDOW-->
    <div class="modal-vue">
      <button id="help" @click="showModal=true">
        ?
      </button>
      <div class="overlay" v-if="showModal"
      @click="showModal=false">
      </div>
      <div class="modal" v-if="showModal">
        <button class="close" @click="showModal = false">x</button>
        <h3>What is Quizcross?</h3>
        <p>Description here:</p>
      </div>
    </div>

  </header>
  <div id="homepic">
    <div class="logo"><img src="/img/Logotyp.png"></div>
  </div>
  <div class="wrapper">
    <button id="create" @click="$router.push('/create/'+lang)">{{uiLabels.createPoll}}</button>
    <button id="play" @click="$router.push('/play/'+lang)">{{uiLabels.playCross}}</button>
    <button id="play" @click="$router.push('/kalletest/'+lang)">{{'Göra korsord test'}}</button>
  </div>
</template>

<script>
import io from 'socket.io-client';
const socket = io();

export default {
  name: 'StartView',
  data: function () {
    return {
      uiLabels: {},
      id: "",
      lang: "en",
      hideNav: true,
      showModal: false
    }
  },

  created: function () {
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
    },
    toggleNav: function () {
      this.hideNav = ! this.hideNav;
    },
    /* FÖR ATT FÅ FRAM POP-UP RUTA*/
    togglePopup: function () {
      this.showModal = ! this.showModal;
    },
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
  .modal-vue .overlay {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}

.modal-vue .modal {
  position: relative;
  width: 300px;
  z-index: 9999;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #FFFDD0;
  border-radius: 15px;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
}

.modal-vue .close{
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #FE5F55;
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
