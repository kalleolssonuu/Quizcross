<template>
  <header>
    <!--<div class="language">
      <img id="flag" :src="uiLabels.changeLanguage" v-on:click="switchLanguage">
    </div>-->
  <div class="logo">Quizcross</div>
  <div>
    <Modal v-bind:uiLabels="uiLabels">
    <button v-on:click="togglePopup"></button>
    </Modal></div>
</header>

  <div class="gameWrapper">
    <div id="userGames">
      {{uiLabels.userCreatedGames}}
        <div id="gameList">
          <div class="scroll">
          <Game v-for="game in games"
            v-bind:game="game" 
            v-bind:key="game.name"
            v-on:selectedGame="selectGame($event)"/> 
      </div>
      <div class="wrapper">
      <text id="selectedText">{{uiLabels.selectedGameLang}}</text>
      <textarea readonly id="selectedname">

      </textarea>
      </div>
      </div>
    </div>

    <div id="myGames">
        {{uiLabels.myGamesLang}}
      <div class="scroll">
        <Game v-for="game in games"
            v-bind:game="game" 
            v-bind:key="game.name"
            v-on:selectedGame="selectGame($event)"/> 
        
      </div>

      <button id="create" @click="$router.push('/create/en')">{{'Create'}}</button>
    </div>
  </div>
  <div>
    <text id="crossText">{{uiLabels.crossID}}</text> 
    <input type="number" id="selectedid" placeholder="ex. 1234..">
                  
                
    <button id="playButton" v-on:click="playCross">
      {{uiLabels.playPlay}}
    </button>
  </div>
  <button id="homepagebutton" @click="$router.push('/'+lang)">{{uiLabels.backButton}}</button>
</template>

<script>
import Game from '../components/GameComponent.vue' 
import gameInfo from '../assets/gameInfo.json'  
import Modal from '../components/PopUp.vue'
import io from 'socket.io-client'; 
const socket = io();

export default{
  name: 'PlayView',
  components:{
    Game,
    Modal
  },
  props: {
  modal: Object
},

  created: 
  function () {
    //this.lang = this.$route.params.lang
    //socket.emit('pageLoaded', this.lang)
    socket.emit('pageLoaded')
    socket.on("init", (labels) => {
      this.uiLabels = labels
    });
  },
  

  data: function(){
    return{
      games: gameInfo,
      selectedGame: {},
      uiLabels: {},
      id: "",
      lang: "en",
      showModal: false,
    }
  },
  methods: {
  selectGame: function (games){ 
    console.log(this.selectedGame)
    document.getElementById("selectedname").value=games.name
    document.getElementById("selectedid").value=games.id
  },

  switchLanguage: function() {
    if (this.lang === "en")
      this.lang = "sv"
    else
      this.lang = "en"
    socket.emit("switchLanguage", this.lang)
    },
/* FÖR ATT FÅ FRAM POP-UP RUTA*/
togglePopup: function () {
    this.showModal = ! this.showModal;
  }
}
}

</script>

<style>
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

header {
  background-color: #A7CAB1;
  width: 100%;
  height: 33%;
}

#help {
  height: 3rem;
  width: 3rem;
  background-color: #EEF5DB;
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
.gameWrapper{
  display: flex;
  justify-content: center;
  
}

#userGames {
  width: 18rem;
  height: 30rem;
  border-radius: 5px;
  border-color: #a6d8d4;
  margin: 2.5rem;
  color: white;
  background-color: #43918a;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 25px;
  position: relative;
}
#myGames {
  width: 18rem;
  height: 30rem;
  border-radius: 5px;
  border-color: #a6d8d4;
  margin: 2.5rem;
  color: white;
  background-color: #43918a;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 25px;
  position: relative;
}
div.scroll {
              margin:4px;
              background-color: #ffffff;
              width: 17.5rem;
              height: 24rem;
              overflow-x: hidden;
              overflow-y: auto;
              text-align:justify;
              color:black;
          }

  #create {
  width: 6rem;
  height: 2rem;
  border-radius: 15px;
  border-color: #ba0c00;
  margin: 1rem;
  color: white;
  background-color: #FE5F55;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 15px;
  cursor:pointer;
}
textarea {
  resize: none;
  overflow:hidden;
}
.wrapper{
    display: flex;
    justify-content: center;
  }

#selectedname{
  width: 10rem;
  height: 1.5rem;
  margin-top: 0.5rem;
  margin-left: 25%;
  border-radius: 5px;
  text-align: center;
  vertical-align: middle;
  position: relative;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 1rem;
  color: #43918a;
}
#selectedText{
  font-size: 1rem;
  width: 2rem;
  position: relative;
  text-align: center;
}

#selectedid{
  width: 10rem;
  height: 1.5rem;
  border-radius: 5px;
  text-align: center;
  vertical-align: middle;
  position: relative;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 1rem;
  color: #43918a;
  border-color: #2d635f;
}
#crossText{
  font-size: 1.25rem;
  width: 2rem;
  position: relative;
  text-align: center;
  color: #ffffff;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
}

#playButton{
  width: 5rem;
  height: 1.8rem;
  border-radius: 5px;
  text-align: center;
  vertical-align: middle;
  position: relative;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 1rem;
  background-color: #43918a;
  color: #ffffff;
  border-color: #2d635f;
  cursor: pointer;
}
#playButton:hover{
  opacity: 75%;
}

#homepagebutton {
  bottom: 0;
  left: 0;
  margin: 0.5rem;
  background-color: #FE5F55;
}


#play{
  width: 6rem;
  height: 2rem;
  border-radius: 15px;
  border-color: #ba0c00;
  margin: 1rem;
  color: white;
  background-color: #FE5F55;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 15px;
  cursor:pointer;
}

#create:hover{
    background-color: #fb6d63;
    
  }
  #play:hover{
    background-color: #fb6d63;
    
  }

  #select{
    margin-top: -20px;
  }
.scroll::-webkit-scrollbar {
    width: 12px;
}
 
.scroll::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
    border-radius: 2px;
}
 
.scroll::-webkit-scrollbar-thumb {
    border-radius: 2px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    background: #43918a;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>