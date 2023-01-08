<template>

  <div> <!-- id="crosswordWrapper" -->
    <table style="border-collapse: collapse; border-spacing: 0;" cellspacing="0" cellpadding="0">
      <tr v-for="(list, ykey) in crossword" v-bind:key="'y' + ykey">
        <td v-for="(element, xkey) in list" v-bind:key="'x' + xkey" id="tdSize"><!-- id="tdSize" -->
          <WordBox
            v-on:PositionFromBox="this.sendPositionToPlayView($event)"

            v-bind:xkey="xkey" 
            v-bind:ykey="ykey" 
            v-bind:letter="element.letter"
            v-bind:direction="element.direction"
            v-bind:inHorizontal="element.inHorizontal"
            v-bind:inVertical="element.inVertical"
            v-bind:isFirstLetter="element.isFirstLetter"
            v-bind:wordInOrder="element.wordInOrder"
            v-bind:isOccupied="element.isOccupied"
            v-bind:sourceName="this.sourceName"
            v-bind:matrixDims="this.matrixDims">
          </WordBox>
        </td> 
      </tr>
    </table>
  </div>

</template>
  


<script>

import WordBox from '../components/WordBox.vue' 

  export default {
    data: function() {
      return {
        /* sourceName: "" */
        dimsX: String(50 / this.matrixDims.x) + "vw",
        dimsY: String(50 / this.matrixDims.y) + "vh"
      }
    },
    name: 'CrossWord',
    components: {
      WordBox,
    },
    props: {
      crossword: Array,
      matrixDims: Object,
      solutionsList: Object,
      sourceName: String,
      wordInOrder: Number
    },
    watcher: {
      crossword: {

      }
    },
    created: function () {
      this.tempFunc()
    },
    methods: {
      tempFunc: function () {
        console.log(this.wordPositions)
      },
      testLog: function() {
        console.log("test")
      },
      sendPositionToPlayView: function (event) {
        this.$emit("sendPosition", event)
        /* console.log("Event from Crossword" + event) */
      },
      updateLayout: function(event) {
        this.on("updateLayout", event)
        this.$set(this.crossword[this.occupiedPosition.y][this.occupiedPosition.x], this.crossword[this.occupiedPosition.y][this.occupiedPosition.x].letter, event.key)
      }
    },
    watch: {
    matrixDims: {
      handler: function (newValue, oldValue) {
        this.dimsX = String(50 / newValue.x) + "%"
        this.dimsY = String(50 / newValue.y) + "%"
        document.querySelector(':root').style.setProperty('--dimsX', this.dimsX)
        document.querySelector(':root').style.setProperty('--dimsY', this.dimsY)

        console.log(oldValue)
      },
      deep: true
    }
    }
  }
  </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

:root {
  --dimsX: 1em;
  --dimsY: 1em;
}

#crosswordWrapper {
  /* table-layout: auto; */
  /* justify-content: center; */
  height: 50vw; 
  width: 50vh; 
  margin: 0 auto;
  background-color: #A7CAB1;

}

table {
  table-layout: auto;
  height: 50vw; 
  width: 50vh; 
  border-spacing: 0;
}

#tdSize {
  height: var(--dimsY);
  width: var(--dimsX);
  /* padding: var(--padding); */
  padding: 0;
}

  </style>
  
  