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
      <div class="searchWrapper">        
            <input v-on:keyup="searchGame" v-if="this.lang == 'en'" v-model="searchTerm" id="searchInput" placeholder="Search for a game...">
            <input v-on:keyup="searchGame" v-else v-model="searchTerm" id="searchInput" placeholder="Sök efter ett spel...">
           
          </div>

      <div id="gameList">

          <div class="scroll">
            <div id="listOfGames" v-for="(game, key) in shownGames" :key="key">              
              <button id="selectGameButtonStyle" v-on:click=selectGame(game)>
                {{game}}
              </button>
            </div>
          </div>

     
          <div class="selectWrapper">
          {{uiLabels.selectedGameLang}}  
          <textarea readonly id="selectedGame"> 
      
          </textarea> 
        </div>
        
       
      </div>

    </div>

  </div>

  
 <div>
  


               
  
    <button class="standardButtonLobby" v-on:click="emitGameChoice()" @click="$router.push('/playView/'+lang+'/'+ selectedGame)"> 
      {{uiLabels.playPlay}}
    </button>
    
  </div>

  <!-- HA kvar servertest lite till!! -->
  <div>  
    {{"servertest :"}}
    <ul v-if="this.crosswordNames" >
      {{this.crosswordNames}}   
    </ul>

  </div>  
  <HomepageButton v-bind:uiLabels="uiLabels" v-bind:lang="lang"></HomepageButton>
</template>

<script> 
import Modal from '../components/PopUp.vue'
import io from 'socket.io-client'; 
const socket = io();
import HomepageButton from '../components/HomepageComponent.vue'

export default{
  name: 'PlayView',
  components:{
    Modal,
    HomepageButton
  },
  
  props: {
    modal: Object
  },

  created: 
  function () {
    this.lang = this.$route.params.lang; 

    socket.emit('pageLoaded')

    socket.on("init", (labels) => {  //JESSIE FRÅGA: VAD GÖR DENNA
      this.uiLabels = labels
    });

    socket.on('currentCrosswordNames', data => { 
        this.crosswordNames = data
    }); 

    this.shownGames = JSON.parse(JSON.stringify(this.allGames));
    console.log(this.crosswordNames)


  },  

  data: function() {
    return{
      crosswordNames: null, 
      gameID: "", 
      lang: "",

      gameName: "",

      shownGames:[],

      allGames: ["server test", "Hugos spel","Elins spel","Kung Charles spel","Emils spel", "Hugos spel","Elins spel","Kung Charles spel","Emils spel"],

      searchTerm: "",


      selectedGame: "",
      uiLabels: {},
     
      showModal: false,
      sourceName: "LobbyView"
    }
  },

  methods: {
    emitGameChoice: function() { 
      socket.emit("chosenGame", this.selectedGame ); 

      console.log("I emitgamechoice")
    },
   
    searchGame: function() {
      this.shownGames = this.allGames.filter(item => item.toLowerCase().includes(this.searchTerm.toLowerCase()));

      console.log("sökta spel " + this.shownGames)
    },

  selectGame: function (game){ 
    document.getElementById("selectedGame").value=game;
    this.selectedGame = game;
   /*  document.getElementById("selectedid").value=games.id */
  },

  switchLanguage: function() {
    if (this.lang === "en")
      this.lang = "sv"
    else
      this.lang = "en"

    socket.emit("switchLanguage", this.lang)
    this.$router.push(this.lang)
    },

  togglePopup: function () {
      this.showModal = ! this.showModal;
    }
  }
}

</script>

<style>

.gameWrapper{
  display: flex;
  justify-content: center;
  
}

#allGamesList {
  width: 40rem;
  height: 33rem;
  border-radius: 0.5rem;
  border-color: #a6d8d4;
  margin: 2rem;
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

.gameWrapper{
  display: flex;
  justify-content: center;
  
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


textarea {
  resize: none;
  overflow:hidden;
}


/* #selectedname{
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
} */
#selectedGame{
  width: 15rem;
  height: 1.75rem;
  margin: 0.2rem;
  border-radius: 0.5rem;
  text-align: center;
  vertical-align: middle;

  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 1.25rem;
  border-color: white;
  background-color: #43918a;
  color: white;
}

/* #selectadGameText{  
  font-size: 1rem;
} */

#selectGameButtonStyle {
 background-color:#43918a;
 text-align: center;
 width: 90%;
 height: 4rem;
 cursor: pointer;
 border-width: 0ch;
 color:white;
 margin-left: 5%;
 margin-right: 5%;
 margin-top: 2%;
 font-family: "Comic Sans MS", "Comic Sans", cursive;
 font-size: medium;
 border-radius: 0.25rem;
}
#selectGameButtonStyle:hover{
    opacity: 75%;
    
  }

#searchInput{
  width: 18rem;
  height: 2rem;
  border-radius: 0.5rem;
  text-align: center;
  vertical-align: middle;
  position: relative;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 1rem;
  color: #43918a;
  border-color: #2d635f;
}

/* #searchButton{
  width: 7rem;
  height: 1.5rem;
  border-radius: 5px;
  
} */
.standardButtonLobby{
  width: 10rem;
    height: 4rem;
    border-radius: 15px;
    border-color: #ba0c00;
  
 
    color: white;
    background-color: #FE5F55;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 1rem;
    cursor:pointer;
    position: relative;
}
.standardButtonLobby:hover{
  opacity: 0.80;
}
/* #crossText{
  font-size: 1.25rem;
  width: 2rem;
  position: relative;
  text-align: center;
  color: #ffffff;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
} */

#playButton{
  width: 5rem;
  height: 1.8rem;
  border-radius: 10px;
}

#homepagebutton {
  width: 5rem;
  height: 2.5rem;
  bottom: 0;
  left: 0;
}

#play{
  width: 6rem;
  height: 2rem;
  border-radius: 15px;
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

.searchWrapper{
    display: flex;
    justify-content: center;
    margin: 0.25rem;
    font-size: 1.5rem;
  }
.selectWrapper{
  display: flex;
  justify-content: center;
  font-size: 1.5rem;

}

</style>