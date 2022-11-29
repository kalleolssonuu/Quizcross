<template>
  <header>
    <button class="language" v-on:click="switchLanguage">{{uiLabels.changeLanguage}}</button>
    <button class="help">
      ?
    </button>

  </header>
  <div id="homepic">
    <div class="logo"><img src="/img/Logotyp.png"></div>
  </div>
  <div class="wrapper">
    <button id="create" @click="$router.push('/create/'+lang)">{{uiLabels.createPoll}}</button>
    <button id="play" @click="$router.push('/play/'+lang)">{{uiLabels.playCross}}</button>
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
      hideNav: true
    }
  },
  created: function () {
    socket.on("init", (labels) => {
      this.uiLabels = labels
    })
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
    }
  }
}
</script>
<style scoped>

header{

}

.language{
  height: 3rem;
    width: 3rem;
    background-color: #FFFDD0;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 1rem;
    text-align: center;
    cursor:pointer;
    border-radius: 50%;
    border-color: black;
    position: absolute;
    top:0;
    left:0;
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
    width: 100%;
    display: grid;
    grid-gap: 3rem;
    grid-auto-flow: column;

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
