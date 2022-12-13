<template>
  <header>
  <div class="logo">Quizcross</div>
  <div
    v-on:click="togglePopup">
    <Modal v-bind:hideNav="hideNav">
    <button v-on:click="togglePopup"></button>
    </Modal></div>
</header>

  <div class="gameWrapper">
    <div id="userGames">
        User created games
        <div id="gameList">
          <div class="scroll">
          <Game v-for="game in games"
            v-bind:game="game" 
            v-bind:key="game.name"
            v-on:selectedGame="selectGame($event)"/> 
      </div>
      <textarea id="select">
         hej           
      </textarea>
      </div>
    </div>

    <div id="myGames">
        My games
      <div class="scroll">
        -Hugo <br>
        -Hugo <br>


        
      </div>

      <button id="create" @click="$router.push('/create/en')">{{'Create'}}</button>
    </div>
  </div>
  <div>
    Play link: 
    <!----<input type="text" v-model="playId">-->
    <button v-on:click="playCross">
      Play cross
    </button>
  </div>
  <button @click="$router.push('/'+lang)">{{'Homepage'}}</button>
</template>

<script>
import Game from '../components/GameComponent.vue' 
import gameInfo from '../assets/gameInfo.json'  

/*import io from 'socket.io-client'; 
const socket = io();*/

export default{
  name: 'PlayView',
  components:{
    Game
  },
  props: {
  modal: Object
},

  created: function () {
    this.lang = this.$route.params.lang
  },

  data: function(){
    return{
      games: gameInfo,
      selectedGame: {},
      uiLabels: {},
      id: "",
      lang: "en",
      hideNav: true,
      showModal: false
    }
  },
  methods: {
  selectGame: function (games){ 
    console.log(this.selectedGame)
    document.getElementById("select").value=games.name + ', id:' +games.id

  },

/* FÖR ATT FÅ FRAM POP-UP RUTA*/
togglePopup: function () {
    this.showModal = ! this.showModal;
  },

}
}



</script>

<style>
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
</style>