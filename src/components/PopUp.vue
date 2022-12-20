<template> 
   <!-- ALL KOD FÖR POPUP-WINDOW-->
   <div class="modal-vue">
      <button id="help" :src="uiLabels.changeLanguage" @click="showModal=true">
        ?
      </button>
      <div class="overlay" v-if="showModal"
      @click="showModal=false">
      </div>
      <div class="modal" v-if="showModal">
        <h3>{{uiLabels.whatIsQC}}</h3>
        <p>{{uiLabels.kopplingTillJSON}}</p>
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
    lang: String
  },

  data: function () {
    return {
      id: "",
      showModal: false
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
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  overflow-y: auto;
}

.modal-vue .close{
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #FE5F55;
  border-radius: 5px;
  cursor:pointer;
}
.modal-vue .close:hover{
background-color: #e36f67;
}
</style>