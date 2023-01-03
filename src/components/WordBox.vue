 <template>

  <div v-if="(this.sourceName == 'PlayView')" class="box">
      <div v-if="(!this.inHorizontal) && (!this.inVertical)" id="nullLetter">
        
      </div>
      <div v-else @click="testClick" class="box letter">
        <span id="number" v-if="isFirstLetter"> {{ wordInOrder }} </span>
        {{ letter }}
      </div>
  </div>

  <div v-else-if="(this.sourceName == 'CreateView')" class="box">
    <div class="box letter">
        <div v-if="isFirstLetter" id="number"> {{ wordInOrder }} </div>
        {{ letter }}
    </div>
      
  </div>

  <div v-else-if="(this.sourceName == 'PreCreate')" class="box">
    <div class="box letter">

    </div>
      
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
        inHorizontal: Boolean,
        inVertical: Boolean,
        isFirstLetter: Boolean,
        sourceName: String,
        wordInOrder: Number,
        matrixDims: Object
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

:root {
  --dimsX: 1em;
  --dimsY: 1em;
}

.box {
  min-width: var(--dimsX);
  min-height: var(--dimsY);
  max-width: var(--dimsX);
  max-height: var(--dimsY);
  border: #A7CAB1 0.15rem solid;
}

.box.letter {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-weight: bold;
    font-size: 1rem;
    background-color: white;
    border: black 0.15rem solid;
    color: black;
}

/* .letterbox {
  background-color: rgb(250, 244, 192);
  min-width: var(--dimsX);
  min-height: var(--dimsY);
  max-width: var(--dimsX);
  max-height: var(--dimsY);
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-weight: bold;
  font-size: 1.5rem;
  border: black 0.15rem solid;
} */

#nullLetter {
  background-color: #A7CAB1;
/*   border: 0cm; */
}

.letterbox:hover {
  cursor: pointer;
}

#number{
  position: absolute;
  top: 0;
  left: 0;
  font-size: 1rem;
  color: black;
  display: flex;
  align-items: center;
  z-index: 1;
}

</style>