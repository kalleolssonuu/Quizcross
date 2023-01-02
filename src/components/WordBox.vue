 <template>

  <div class="letterbox" @click="testClick">

    <!-- 

    <button v-if="!this.enableWordButtons" class="button-disabled" disabled> Confirm </button>
    <button v-else v-on:click="this.confirmWord"> Confirm </button>

    <button v-if="!this.enableWordButtons" class="button-disabled" disabled> Discard </button>
    <button v-else v-on:click="this.discardWord"> Discard </button> 
  
  -->

      <!-- här måste jag på nåt sätt veta vilket ord i ordningen det är så att rätt siffra kan skrivas ut mha nån funktion.
          crossword.vue är väl föräldern i det här fallet? har den något som kan skickas ner till barnet kanske-->
    <span id="number-horiz" v-if="isFirstLetter && inHorizontal"> {{ wordInOrder }} </span>
    <span id="number-vert" v-if="isFirstLetter && inVertical"> {{ wordInOrder }} </span>
    {{ letter }}
  </div>


 </template>


 <script>

  export default {
    data: function() {
      return {
        name: 'WordBox',
      }
    },
    props: {
        xkey: Number,
        ykey: Number,
        letter: String,
        direction: String,
        inHorizontal: Boolean,
        inVertical: Boolean,
        isFirstLetter: Boolean,
        sourceName: String,
        wordInOrder: Number,
    },
    computed: {

    },
    methods: {
      testClick: function() { /* ÄNDRA SENARE SÅ ATT ENDAST PlayView ÄR TILLÅTET SOM sourceName */
        if ((this.sourceName == "CreateCrosswordView" || this.sourceName == "PlayView") && this.isFirstLetter == true) {
          alert("x coordinate: " + this.xkey + ", y coordinate: " + this.ykey)
        } else {
          alert("test noclick")
        }
      },
      occupyWordBox: function () {

      }
    }
}

</script>


<style>



/* .letterbox {
  background-color: rgb(250, 244, 192);
  height: 3rem;
  width: 3rem;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-weight: bold;
  font-size: 2rem;
  border: black 0.15rem solid;
} */


.letterbox:hover {
  cursor: pointer;
}

#number-horiz{
  font-size: 1rem;
  position:absolute;
  margin-left: -0.6rem;
  z-index: 1;
}

#number-vert{
  font-size: 1rem;
  position:absolute;
  margin-left: -0.6rem;
  margin-bottom: 0.3rem;
  z-index: 1;
}

</style>