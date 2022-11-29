<template>
  <header>
    <button><img id="help" src="/img/help_pic.png">

    </button>

  </header>
  <div id="homepic">
    <div class="logo"><img src="/img/Logotyp.png"></div>
  </div>
  <div class="wrapper">
    <button id="red" @click="$router.push('/create/'+lang)">{{uiLabels.createPoll}}</button>
    <button id="red" @click="$router.push('/play/'+lang)">{{'Play'}}</button>
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
  
  #help {
    height: 2em;
    width: 4em;
    margin-top: 1px;
    margin-right: 2px;
  }

  #homepic {
    background-color: #A7CAB1;
    width: 100%;
    height: 25em;
  }

  button {
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
    
  }

  button:hover{
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
