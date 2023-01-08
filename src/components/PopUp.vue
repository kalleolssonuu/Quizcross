<template> 
   <!-- ALL KOD FÖR POPUP-WINDOW-->
   <div class="header">
    <img id="flag" :src="uiLabels.changeLanguage" v-on:click="switchLanguage">
    <span class="logoText" v-if="sourceName != 'StartView'"> QUIZCROSS</span>
   </div>

   <div class="modal-vue">
      <button id="help" :src="uiLabels.changeLanguage" @click="showModal=true">
        ?
      </button>
      <div class="overlay" v-if="showModal"
      @click="showModal=false">
      </div>
      <div class="modal" v-if="showModal">
          <h3 v-if="sourceName == 'StartView'"> {{uiLabels.whatIsQC}}</h3>
          <h3 v-if="sourceName =='LobbyView'"> {{uiLabels.pageDescriptionLobbyView}}</h3>
          <h3 v-if="sourceName =='PlayView'"> {{uiLabels.pageDescriptionPlayView}}</h3>
          <h3 v-if="sourceName =='CreateView'"> {{uiLabels.pageDescriptionCreateView}}</h3>
          <h3 v-if="sourceName =='PreCreate'"> {{uiLabels.pageDescriptionPreCreateView}}</h3>
        <button class="close" @click="showModal = false">x</button>
      </div>
    </div>
</template>


<script>


export default {
  name: 'PopUp',
  props: {
    modal: Object,
    uiLabels: Object,
    lang: String,
    sourceName: String
  },

  data: function () {
    return {
      id: "",
      showModal: false,
    }
  },
  methods:{
    togglePopup: function () {
      this.showModal = ! this.showModal;
    },
    switchLanguage: function() { 
      this.$emit("switchLanguage")
  }     
}
}
</script>

<style>
  
   #help {
    height: 3rem;
    width: 3rem;
    background-color: #FFFDD0;
    font-family: "Comic Sans MS", "Comic Sans";
    font-size: 30px;
    text-align: center;
    cursor:pointer;
    border-radius: 50%;
    border-color: black;
    position: absolute;
    top: 0;
    right:0;
    margin: 0.5rem; 
    color: black;
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
  position: absolute;
  top: 25%;
  left: 30%;
  height: 20%;
  width: 40%;
  z-index: 9999;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #FFFDD0;
  color: #000;
  border-radius: 15px;
  font-family: "Comic Sans MS", "Comic Sans";
  overflow-y: auto;
}

.modal-vue .close{
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #FE5F55;
  border-radius: 5px;
  cursor:pointer;
  height: 1.8rem;
  width: 1.8rem;
}
.modal-vue .close:hover{
background-color: #e36f67;
}
#flag {
    position: absolute;
    width: 4rem;
    height: 3rem;
    border-radius: 10%;
    margin: 0.5rem;
    cursor: pointer;
    position: absolute;
    top: 0;
    left:0;
}
.logoText {
  /*letter-spacing: 0.25em;*/
  font-size: 3rem;
  color: white;
  padding-top:0.1em;
  /*text-align: center;*/
  font-family: "Comic Sans MS", "Comic Sans";
}
</style>