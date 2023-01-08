 <template>

  <div v-if="(this.sourceName == 'PlayView')">
      <div v-if="(!this.inHorizontal) && (!this.inVertical)" class="box" id="nullLetter">
        <!-- ingenting -->
      </div>

      <div v-else-if="this.isOccupied" :class="['box', 'letter']">
          <div v-if="this.isFirstLetter" @click="testClick" :class="['clickable', 'occupied']">
            <span id="number"> {{ wordInOrder }} </span>
            {{ letter }}
          </div>
          <div v-else class="occupied">
            {{ letter }}
          </div>
      </div>

      <div v-else-if="this.isOccupied == false" :class="['box', 'letter']">
          <div v-if="this.isFirstLetter" @click="testClick" class="clickable">
            <span id="number"> {{ wordInOrder }} </span>
            {{ letter }}
          </div>
          <div v-else>
            {{ letter }}
          </div>
      </div>
  </div>

  <div v-else-if="(this.sourceName == 'CreateView')" :class="['box', 'letter']">
        <div v-if="this.isFirstLetter" id="number"> {{ wordInOrder }} </div>
        {{ letter }}      
  </div>

  <div v-else-if="(this.sourceName == 'PreCreate')" :class="['box', 'letter']">      
  </div>

 </template>


 <script>

  export default {
    data: function() {
      return {
        name: 'WordBox',
        dimsX: String(50 / this.matrixDims.x) + "%",
        dimsY: String(50 / this.matrixDims.y) + "%",
        borderSize: String((40 / this.matrixDims.y) / 35) + 'rem',
        // outerBorderSize: String((40 / this.matrixDims.y) / 50) + 'rem',
        fontSize: String((50 / this.matrixDims.y) * 0.4) + '%',
        numberSize: String((50 / this.matrixDims.y) * 0.3) + '%'
      }
    },
    props: {
        xkey: Number,
        ykey: Number,

        letter: String,
        inHorizontal: Boolean,
        inVertical: Boolean,
        isFirstLetter: Boolean,
        isOccupied: Boolean,
        sourceName: String,
        wordInOrder: Number,
        matrixDims: Object
    },
    computed: {

    },
    methods: {
      testClick: function() { /* ÄNDRA SENARE SÅ ATT ENDAST PlayView ÄR TILLÅTET SOM sourceName */
        this.$emit("PositionFromBox", {x: this.xkey, y: this.ykey})
        /* console.log("Event from WordBox? : " + {x: this.xkey, y: this.ykey}) */
      },
      occupyWordBox: function () {

      },
      watch: {
        matrixDims: {
          handler: function (newValue, oldValue) {
            this.dimsX = String(50 / newValue.x) + "%"
            this.dimsY = String(50 / newValue.y) + "%"
            this.borderSize = String((newValue.y - 1) / 5) + 'rem',
            /* this.outerBorderSize = String((50 / this.matrixDims.y) / 50) + '%', */
            this.fontSize = String((50 / newValue.y) * 0.4) + '%',
            this.numberSize = String((40 / newValue.y) * 0.3) + 'rem'

            document.querySelector(':root').style.setProperty('--dimsX', this.dimsX);
            document.querySelector(':root').style.setProperty('--dimsY', this.dimsY);
            document.querySelector(':root').style.setProperty('--borderSize', this.borderSize);
/*             document.querySelector(':root').style.setProperty('--outerBorderSize', this.outerBorderSize); */
            document.querySelector(':root').style.setProperty('--fontSize', this.fontSize);
            document.querySelector(':root').style.setProperty('--numberSize', this.numberSize);

            console.log("Old value: " + oldValue)
            console.log("New value: " + newValue)
            console.log("BORDER SIZE ------" + this.borderSize)
          },
          deep: true
        }
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
      console.log(this.dimsX)
      console.log(this.dimsY)

    element.style.setProperty('--dimsY', this.dimsY);
    element.style.setProperty('--borderSize', this.borderSize);
    /* element.style.setProperty('--outerBorderSize', this.outerBorderSize); */
    element.style.setProperty('--fontSize', this.fontSize);
    element.style.setProperty('--numberSize', this.numberSize);
    /* console.log(this.matrixDims) */
    },
    
  }

</script>


<style>

:root {
  --dimsX: var(--dimsX);
  --dimsY: var(--dimsY);
  --borderSize: var(--borderSize);
  /* --outerBorderSize: var(--outerBorderSize); */
  --fontSize: var(--fontSize);
  --numberSize: var(--numberSize);
}

.box {
/*   width: var(--dimsX); */
  width: 100%;
  height: 100%;
}

.letter {
/*   width: var(--dimsX); */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-weight: bold;
  font-size: var(--fontSize);
  background-color: white;
  border: black var(--borderSize) solid;
  /* border: black 0.2rem solid; */
  /* border: black 0.2rem solid; */
  color: black;
}

.occupied {
  background-color: #FFFDD0;
  justify-content: center;
  align-items: center;
}

.clickable {
/*   width: var(--dimsX);
  height: var(--dimsY); */
  cursor: pointer;
}

/* div {
  height: 100%;
  width: 100%;
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
  width: var(--dimsX);
  height: var(--dimsY);
  font-size: var(--numberSize);
  color: black;
  display: flex;
  z-index: 1;
}

</style>