<template>
  <header>
    <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName"
      v-on:switchLanguage="switchLanguage">
      <button v-on:click="togglePopup"></button>
    </Modal>
  </header>

  <div class="gameWrapper">

    <div id="allGamesList">
      {{ uiLabels.gameList }}




      <div class="scroll">
        <div id="listOfGames" v-for="(game, key) in shownGames" :key="key">
          <button id="selectGameButtonStyle" v-on:click="emitGameChoice(game)">
            {{ game }}
          </button>
        </div>
      </div>

      <div class="searchWrapper">
        <input v-on:keyup="searchGame" v-if="this.lang == 'en'" v-model="searchTerm" id="searchInput"
          placeholder="Search for a game...">
        <input v-on:keyup="searchGame" v-else v-model="searchTerm" id="searchInput" placeholder="Sök efter ett spel...">
      </div>


    </div>

  </div>
  <div id="textCreate">
    {{ uiLabels.createFromLobby }}
  </div>
  <button class="createButtonLobby" @click="$router.push('/PreCreate/' + lang)">{{ uiLabels.create }}</button>



  <HomepageButton v-bind:uiLabels="uiLabels" v-bind:lang="lang"></HomepageButton>

</template>

<script>
import Modal from '../components/PopUp.vue'
import io from 'socket.io-client';
const socket = io();
import HomepageButton from '../components/HomepageComponent.vue'

export default {
  name: 'PlayView',
  components: {
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

      socket.on("init", (labels) => {
        this.uiLabels = labels
      });

      socket.on('currentCrosswordNames', data => {
        this.crosswordNames = data
        this.shownGames = JSON.parse(JSON.stringify(this.crosswordNames));

      });




    },

  data: function () {
    return {
      crosswordNames: null,

      gameID: "",
      lang: "",

      gameName: "",

      shownGames: [],


      searchTerm: "",


      selectedGame: "",
      uiLabels: {},

      showModal: false,
      sourceName: "LobbyView"
    }
  },

  methods: {
    emitGameChoice: function (game) {
      this.$router.push('/playView/' + this.lang + '/' + game)
    },

    searchGame: function () {
      this.shownGames = this.crosswordNames.filter(item => item.toLowerCase().includes(this.searchTerm.toLowerCase()));

    },

    selectGame: function (game) {
      document.getElementById("selectedGame").value = game;
      this.selectedGame = game;
    },

    switchLanguage: function () {
      if (this.lang === "en")
        this.lang = "sv"
      else
        this.lang = "en"

      socket.emit("switchLanguage", this.lang)
      this.$router.push(this.lang)
    },

    togglePopup: function () {
      this.showModal = !this.showModal;
    }
  }
}

</script>

<style>
.gameWrapper {

  float: left;
  width: 50vw;
  margin-left: 25vw;

}

#allGamesList {
  width: 35vw;
  height: 70vh;
  border-radius: 0.5vw;
  border-color: #a6d8d4;
  margin: 2vw;
  color: white;
  background-color: #43918a;
  font-family: "Comic Sans MS", "Comic Sans";
  font-size: 2.5vw;
  position: relative;
}

div.scroll {
  margin: 1vw;
  background-color: #ffffff;
  height: 50vh;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: justify;
  color: black;
  border-radius: 0.2vw;
}


.gameWrapper {
  display: flex;
  justify-content: center;

}

#selectGameButtonStyle {
  background-color: #43918a;
  text-align: center;
  width: 90%;
  height: 10vh;
  cursor: pointer;
  border-width: 0ch;
  color: white;
  margin-left: 2vw;
  margin-right: 2vw;
  margin-top: 2vw;
  font-family: "Comic Sans MS", "Comic Sans";
  font-size: 1.5vw;
  border-radius: 0.5vw;
}

#selectGameButtonStyle:hover {
  opacity: 75%;

}

#searchInput {
  width: 90%;
  height: 4vh;
  border-radius: 0.5rem;
  text-align: center;
  vertical-align: middle;
  position: relative;
  font-family: "Comic Sans MS", "Comic Sans";
  font-size: 1vw;
  color: #43918a;
  border-color: #2d635f;
}


.createButtonLobby {
  width: 10vw;
  height: 5vw;
  border-radius: 1.5vw;
  border-color: #ba0c00;
  color: white;
  background-color: #FE5F55;
  font-family: "Comic Sans MS", "Comic Sans";
  font-size: 1.5vw;
  cursor: pointer;
  margin-top: 1vw;
  margin-right: 8vw;
}

.createButtonLobby:hover {
  opacity: 0.80;
}

#homepagebutton {
  width: 10vw;
  height: 4vh;
  bottom: 0;
  left: 0;
}


.scroll::-webkit-scrollbar {
  width: 12px;
}

.scroll::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

.scroll::-webkit-scrollbar-thumb {
  border-radius: 2px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  background: #43918a;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.searchWrapper {
  display: flex;
  justify-content: center;
  margin: 1.75vw;
}

#textCreate {
  font-size: 1.5vw;
  margin-right: 8vw;
  margin-top: 15vw;

}
</style>