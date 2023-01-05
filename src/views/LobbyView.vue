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
          <Game v-for="game in games"
            v-bind:game="game" 
            v-bind:key="game.name"
            v-on:selectedGame="selectGame($event)"/> 
          </div>
      <div class="wrapper">
    
        <input v-if="this.lang == 'en'" v-model="searchTerm" id="searchInput" placeholder="Search for a game">
        <input v-else v-model="searchTerm" id="searchInput" placeholder="Sök efter ett spel">
        <button v-on:click="searchGame" id="searchButton" > Search game</button> <!-- är vore det fint med en sån där sök-ikon -->
      </div>
      </div>
    </div>
  </div>


      <button id="create" @click="$router.push('/PreCreate/'+lang)">{{uiLabels.create}}</button>



  <div>
    <text id="crossText">{{gameName}}</text> 
    <input type="number" id="selectedid" placeholder="game name">

 
      <textarea readonly id="selectedGame">

      </textarea>
                 
    <button id="playButton" v-on:click="playCross" @click="$router.push('/PlayView/'+lang)">
      {{uiLabels.playPlay}}
    </button>
    
  </div>

  <div>
    <!-- JESSIE: FIXA SÅ:
          - LOBBY, VID VAL AV KORSNAMN, SKICKAR KORSNAMN OCH ID TILL SERVER
          - SERVER KOLLAR VILKET PAKET SOM MATCHAR, ANTINGEN NAMN ELLER IDMATCH?
          - SKICKAR MOTSVARANDE PAKET TILL ACTUALPLAY  -->
    {{"servertest av confirmCreate:"}}
    <ul v-if="this.crosswordPackageInfo" >
      {{this.crosswordPackageInfo}}   
    </ul>
    
    <ul>

      <label>
        Write poll id: 
        <input type="text" v-model="id">
      </label>

      <router-link v-bind:to="'/playView/'+id"> {{uiLabels.participateGame}} </router-link>
      <!-- router-link is used to create links for navigating between routes 
            - så eftersom id är dynamiskt blir det olika länkar beroende på vilket id som skrivs in, 
            - betyder det att den skapar nya playviews med varje nytt id?? 
            - Lösa:
              - betyder det nu att alla som har tillgång till ett id spelar samma spel? men behöver väl fortfarnde skicka paket med ändringar?
              - hur bestäms id från createview
              - fixa så även språket hänger med, se hur playknappen är skapad nu
              - obs kolla hela språkgrejen så det sker rätt, det där micke sa. se kommentarer i created i startview
              - användarid?
              - diskutera hur micke gör allt i servern i data!!! vi gör typ inget där men kanske ej behövs?

      -->

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
    socket.emit('pageLoaded')

    socket.on("init", (labels) => {  // VAD GÖR DENNA FÖRSTÅ DET
      this.uiLabels = labels
    });

    socket.on('currentPackageInfoForLobby', data => { // tar emot korsordsinfo från server, ursprung confirmCreate
        this.crosswordPackageInfo = data
    }); 

  },  

  data: function() {
    return{
      crosswordPackageInfo: null,
      id: "", // för participantid
      
      gameName: "",

      shownGames:["Hugos spel","Elins spel","Kung Charles spel","Emils spel"],

      allGames: ["Hugos spel","Elins spel","Kung Charles spel","Emils spel"],

      searchTerm: "",

      games: gameInfo,


      selectedGame: {},
      uiLabels: {},
     
      lang: "en",
      showModal: false,
      sourceName: "LobbyView"
    }
  },
  methods: {
   
    searchGame: function() {
      this.shownGames = this.allGames.filter(item => item.toLowerCase().includes(this.searchTerm.toLowerCase()));

      console.log("sökta spel " + this.shownGames)

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