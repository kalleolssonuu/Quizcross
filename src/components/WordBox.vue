 <template>

  <div v-if="(this.sourceName == 'PlayView')" class="box">
      <div v-if="(!this.inHorizontal) && (!this.inVertical)" id="nullLetter">
        
      </div>
      <div v-else class="box letter">
            <div v-if="this.isFirstLetter" @click="testClick" id="clickable">
                <span id="number"> {{ wordInOrder }} </span>
                {{ letter }}
            </div>
            <div v-else>
                {{ letter }}
            </div>
      </div>
  </div>

  <div v-else-if="(this.sourceName == 'CreateView')" class="box">
    <div class="box letter">
        <div v-if="this.isFirstLetter" id="number"> {{ wordInOrder }} </div>
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
        dimsX: String(40 / this.matrixDims.x) + "rem",
        dimsY: String(40 / this.matrixDims.y) + "rem",
        borderSize: String((40 / this.matrixDims.y) / 34) + 'rem',
        fontSize: String((40 / this.matrixDims.y) * 0.4) + 'rem',
        numberSize: String((40 / this.matrixDims.y) * 0.3) + 'rem'
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
        this.$emit("PositionFromBox", {x: this.xkey, y: this.ykey})
        console.log("Event from WordBox? : " + {x: this.xkey, y: this.ykey})
      },
      occupyWordBox: function () {

      }
    },
    mounted() {
    /*   this.wordPositions.actual.forEach((item, yindex) => {
        console.log("Outer wordPositions.actual index: " + yindex);
        item.forEach((item, xindex) => {
          console.log("Inner wordPositions.actual index: " + xindex)
        })
      }); */
    const element = document.querySelector(':root');
    element.style.setProperty('--dimsX', this.dimsX);
    element.style.setProperty('--dimsY', this.dimsY);
    element.style.setProperty('--borderSize', this.borderSize);
    element.style.setProperty('--fontSize', this.fontSize);
    element.style.setProperty('--numberSize', this.numberSize);
    console.log(this.matrixDims)
    },
    
}

</script>


<style>

:root {
  --dimsX: 1em;
  --dimsY: 1em;
  --borderSize: 0.1rem;
  --fontSize: 1rem;
}

.box {
  /* min-width: var(--dimsX); */
  /* min-height: var(--dimsY); */
  width: var(--dimsX);
  height: var(--dimsY);
  border: #A7CAB1 0.15rem solid;
}

.box.letter {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-weight: bold;
  font-size: var(--fontSize);
  background-color: white;
  border: black var(--borderSize) solid;
  color: black;
}

#clickable {
  height: 100%;
  width: 100%;
  cursor: pointer;
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
  font-size: var(--numberSize);
  color: black;
  display: flex;
  align-items: center;
  z-index: 1;
}

</style>