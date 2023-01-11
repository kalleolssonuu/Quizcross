 <template>

  <div v-if="(this.sourceName == 'PlayView')" class="box">
      <div v-if="(!this.inHorizontal) && (!this.inVertical)" id="nullLetter">
        <!-- ingenting -->
      </div>

      <div v-else-if="this.isOccupied" class="box letter occupied">
          <div v-if="this.isFirstLetter" @click="sendOccupied" class="clickable">
            <span id="number"> {{ wordInOrder }} </span>
            {{ letter }}
          </div>
          <div v-else @click="sendOccupied" class="occupied clickable">
            {{ letter }}
          </div>
      </div>

      <div v-else-if="this.isOccupied == false" class="box letter">
          <div v-if="this.isFirstLetter" @click="sendOccupied" class="clickable">
            <span id="number"> {{ wordInOrder }} </span>
            {{ letter }}
          </div>
          <div v-else @click="sendOccupied" class="clickable">
            {{ letter }}
          </div>
      </div>
  </div>

  <div v-else-if="(this.sourceName == 'CreateView')" class="box letter">
        <div v-if="this.isFirstLetter" id="number"> {{ wordInOrder }} </div>
        {{ letter }}      
  </div>

  <div v-else-if="(this.sourceName == 'PreCreate')" class="box letter">      
  </div>

 </template>


 <script>

  export default {
    data: function() {
      return {
        name: 'WordBox',
        dims: String(40 / this.cellsAmount) + "vw",
        /* dimsY: String(50 / this.matrixDims.y) + "vh", */
        borderSize: String((40 / this.cellsAmount) / 35) + 'vw',
        // outerBorderSize: String((40 / this.matrixDims.y) / 50) + 'rem',
        fontSize: String((50 / this.cellsAmount) * 0.4) + 'vw',
        numberSize: String((50 / this.cellsAmount) * 0.3) + 'vw'
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
        cellsAmount: Number
    },
    computed: {

    },
    methods: {
      sendOccupied: function() { /* ÄNDRA SENARE SÅ ATT ENDAST PlayView ÄR TILLÅTET SOM sourceName */
        this.$emit("PositionFromBox", {x: this.xkey, y: this.ykey})
        /* console.log("Event from WordBox? : " + {x: this.xkey, y: this.ykey}) */
      },
      occupyWordBox: function () {

      },
      watch: {
        cellsAmount: {
          handler: function (newValue, oldValue) {
            this.dims = String(40 / newValue) + "vw"
            /* this.dimsY = String(50 / newValue.y) + "vh" */
            console.log("Från watch handler: this.dims = " + this.dims)


            this.borderSize = String((40 / newValue) / 35) + 'vw'
            /* this.outerBorderSize = String((50 / this.matrixDims.y) / 50) + '%', */
            this.fontSize = String((50 / newValue) * 0.4) + 'vw',
            this.numberSize = String((40 / newValue) * 0.3) + 'vw'

            document.querySelector(':root').style.setProperty('--dims', this.dims);
            /* document.querySelector(':root').style.setProperty('--dimsY', this.dims); */
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
    element.style.setProperty('--dims', this.dims);
      /* console.log(this.dimsX)
      console.log(this.dimsY) */

    /* element.style.setProperty('--dimsY', this.dimsY); */
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
/*   --dimsX: var(--dimsX);
  --dimsY: var(--dimsY); */
  --borderSize: var(--borderSize);
  /* --outerBorderSize: var(--outerBorderSize); */
  --fontSize: var(--fontSize);
  --numberSize: var(--numberSize);
}

.box {
  /* width: var(--dims);
  height: var(--dims); */
  width: 100%;
  height: 100%;
}

.letter {
/*   width: var(--dimsX); */
  width: calc(var(--dims) - var(--borderSize));
  height: calc(var(--dims) - var(--borderSize));
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-family: "Comic Sans MS", "Comic Sans";
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
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
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
  font-size: var(--numberSize);
  color: black;
  z-index: 1;
}

</style>