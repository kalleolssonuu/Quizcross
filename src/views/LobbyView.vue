<template>
  <header>
    <Modal 
          v-bind:uiLabels="uiLabels" 
          v-bind:lang="lang" 
          v-bind:sourceName="sourceName" 
          v-on:switchLanguage="switchLanguage" >
    <button v-on:click="togglePopup"></button>
    </Modal>
  </header>

<div class="gameWrapper">
    <div id="allGamesList">
      {{uiLabels.gameList}}
        <div id="gameList">
          <div class="scroll">
          <Game v-for="game in premadeGames"
            v-bind:game="game" 
            v-bind:key="game.name"
            v-on:selectedGame="selectGame($event)"/> 
          </div>
      <div class="wrapper">
    
        <input v-model="searchTerm" id="searchInput" placeholder="search for game">
        <button v-on:click="searchGame" id="searchButton" > search game</button> <!-- är vore det fint med en sån där sök-ikon -->
      </div>
      </div>
    </div>
  </div>


      <button id="create" @click="$router.push('/PreCreate/'+lang)">{{uiLabels.create}}</button>



  <div>
    <text id="crossText">{{uiLabels.crossID}}</text> 
    <input type="text" v-model="gameID" id="selectedid" placeholder="ex: jjjessiesSpel">
     
    <textarea readonly id="selectedGame">

    </textarea>

    <button id="playButton" v-on:click="emitGameChoice()" @click="$router.push('/playView/'+lang+'/'+ gameID)"> 
      {{uiLabels.playPlay}}
    </button>    
  </div>

  <div>
    {{"servertest:"}}
    <ul v-if="this.crosswordNames" >
      {{this.crosswordNames}}   
    </ul>

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
    this.lang = this.$route.params.lang; 

    socket.emit('pageLoaded')
    socket.on("init", (labels) => {  // VAD GÖR DENNA FÖRSTÅ DET
      this.uiLabels = labels
    });
    socket.on('currentCrosswordNames', data => { 
        this.crosswordNames= data
    }); 

    console.log("crosswordNames mottaget i lobbyview är:");
    console.log(this.crosswordNames);
  },  

  data: function() {
    return{
      crosswordNames: null, 
      gameID: "", 
      lang: "",

      gameName: "",

      shownGames:"",

      allGames: ["Hugos spel","Elins spel","Kung Charles spel","Emils spel"],

      searchTerm: "",

      games: gameInfo,      
      premadeGames: gameInfo,
      /* myGames: myGameInfo, */
      selectedGame: {},
      uiLabels: {},     
      
      showModal: false,
      sourceName: "LobbyView"
    }
  },
  methods: {

    emitGameChoice: function() { 
      socket.emit("chosenGame", this.gameID ); 

      console.log("I emitgamechoice")
      

    },
   
    searchGame: function() {
      this.shownGames = this.allGames.filter(item => item.toLowerCase().includes(this.searchTerm.toLowerCase));

      console.log("sökta spel" + this.shownGames)

    },

  selectGame: function (games){ 
    console.log(this.selectedGame)
    this.gameName=games.name;
    document.getElementById("selectedGame").value=this.gameName;
   /*  document.getElementById("selectedid").value=games.id */
  },
  /* listenAddGame: function(games) {
    socket.on("receiveGameFromCreateView") {
      games.push()
    }
  }, */

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

/* #help {
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

} */

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

#allGamesList {
  width: 40rem;
  height: 30rem;
  border-radius: 0.5rem;
  border-color: #a6d8d4;
  margin: 2.5rem;
  color: white;
  background-color: #43918a;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 2rem;
  position: relative;
}
div.scroll {
              margin:0.5rem;
              background-color: #ffffff;
              width: 39rem;
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
#selectedGame{
  font-size: 1rem;
  width: 2rem;
  position: relative;
  text-align: center;
}

#searchInput{
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

#searchButton{
  width: 7rem;
  height: 1.5rem;
  border-radius: 5px;
  
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
  background-color: #FE5F55;
  color: #ffffff;
  border-color: #ba0c00;
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
  border-color: #ba0c00;
  border-radius: 5px;
  color: white;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
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