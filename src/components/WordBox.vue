 <template>

  <div v-if="(!this.inHorizontal) && (!this.inVertical) && (this.sourceName == 'PlayView')" id="nullLetter" @click="testClick">
    <!-- <span id="number" v-if="isFirstLetter"> {{ wordInOrder }} </span>
    {{ letter }} -->
  </div>

  <div v-else @click='testClick'>
    <span id="number" v-if="isFirstLetter"> {{ wordInOrder }} </span>
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
        if ((this.sourceName == "CreateView" || this.sourceName == "PlayView") && this.isFirstLetter == true) {
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

#nullLetter {
  background-color: #A7CAB1;
  border: 0cm;
}

.letterbox:hover {
  cursor: pointer;
}

#number{
  font-size: 1rem;
  position:absolute;
  margin-left: -0.6rem;
  z-index: 1;
}

</style>