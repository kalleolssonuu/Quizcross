 <template>

  <div v-if="(this.sourceName == 'PlayView')" class="box">
      <div v-if="(!this.inHorizontal) && (!this.inVertical)" id="nullLetter">
   
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
        borderSize: String((40 / this.cellsAmount) / 35) + 'vw',
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
      sendOccupied: function() { 
        this.$emit("PositionFromBox", {x: this.xkey, y: this.ykey})
       },
      occupyWordBox: function () {

      },
      watch: {
        cellsAmount: {
          handler: function (newValue, oldValue) {
            this.dims = String(40 / newValue) + "vw"
            console.log(oldValue)
            this.borderSize = String((40 / newValue) / 35) + 'vw'
            this.fontSize = String((50 / newValue) * 0.4) + 'vw',
            this.numberSize = String((40 / newValue) * 0.3) + 'vw'

            document.querySelector(':root').style.setProperty('--dims', this.dims);
            document.querySelector(':root').style.setProperty('--borderSize', this.borderSize);
            document.querySelector(':root').style.setProperty('--fontSize', this.fontSize);
            document.querySelector(':root').style.setProperty('--numberSize', this.numberSize);

          },
          deep: true
        }
      }
    },
    mounted() {

    const element = document.querySelector(':root');
    element.style.setProperty('--dims', this.dims);
    element.style.setProperty('--borderSize', this.borderSize);
    element.style.setProperty('--fontSize', this.fontSize);
    element.style.setProperty('--numberSize', this.numberSize);
    },
    
  }

</script>


<style>

:root {
  --borderSize: var(--borderSize);
  --fontSize: var(--fontSize);
  --numberSize: var(--numberSize);
}

.box {
  width: 100%;
  height: 100%;
}

.letter {
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

#nullLetter {
  background-color: #A7CAB1;
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