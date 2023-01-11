<template>

  <header>
    <div>
      <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName"
        v-on:switchLanguage="switchLanguage">
        <button v-on:click="togglePopup"></button>
      </Modal>
    </div>
  </header>

  <div id="homepic">
    <div class="logo"><img src="/img/Logotyp.png"></div>
  </div>

  <div class="wrapper">
    <button id="playAndCreateButton" @click="$router.push('/PreCreate/' + lang)">{{ uiLabels.createCross }}</button>
    <button id="playAndCreateButton" @click="$router.push('/Lobby/' + lang)">{{ uiLabels.playCross }}</button>
  </div>

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
  },
  methods: {
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
    },

  }
}
</script>

<style scoped>
#homepic {
  background-color: #A7CAB1;
  height: 100%;
  width: 100%;
}


.logo img {
  height: 60vh;
  width: 55vw;
  vertical-align: bottom;
}


#playAndCreateButton {

  height: 15vh;
  width: 25vw;
  border-radius: 1.5rem;
  border-color: #ba0c00;
  margin: 5%;
  font-size: 1.5rem;
  color: white;
  background-color: #FE5F55;
  font-family: "Comic Sans MS", "Comic Sans";
  cursor: pointer;
  position: relative;

}

#playAndCreateButton:hover {
  background-color: #fb6d63;

}

.wrapper {
  display: flex;
  justify-content: center;
}
</style>
