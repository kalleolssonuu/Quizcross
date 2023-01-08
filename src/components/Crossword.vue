<template>

  <div id="crosswordWrapper">
    <table>
      <tr v-for="(list, ykey) in crossword" v-bind:key="'y' + ykey">
        <td v-for="(element, xkey) in list" v-bind:key="'x' + xkey" id="tdSize">
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
        dimsX: '',
        dimsY: ''
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
    handler: function () {
      /* this.dimsX = String(40 / this.matrixDims.x) + "rem"
      this.dimsY = String(40 / this.matrixDims.y) + "rem" */
      this.dimsX = String(40 / this.matrixDims.x) + "rem"
      this.dimsY = String(40 / this.matrixDims.y) + "rem" /* 600 px ~ 40 rem */
      document.querySelector(':root').style.setProperty('--dimsX', this.dimsX);
      document.querySelector(':root').style.setProperty('--dimsY', this.dimsY);
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
  height: 40rem !important; /* 40rem; */
  width: 40rem !important; /* 40rem; */
  margin: 0 auto;
  background-color: #A7CAB1;

}

table {
  /* table-layout: auto; */
  width: 100%;
  height: 100%;
  /* border-spacing: 0; */
}

#tdSize {
  height: var(--dimsY);
  width: var(--dimsX);
}

  </style>
  
  