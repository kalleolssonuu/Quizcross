<template>
<div>
  {{ matrixDims }}
  {{ dimsX }}
  {{ dimsY }}
  <table id="crosswordwrapper">
    <tr v-for="(list, ykey) in wordPositions" v-bind:key="'y' + ykey">
      <td v-for="(element, xkey) in list" v-bind:key="'x' + xkey">
        <WordBox
          v-bind:xkey="xkey" 
          v-bind:ykey="ykey" 
          v-bind:letter="element.letter"
          v-bind:direction="element.direction"
          v-bind:inHorizontal="element.inHorizontal"
          v-bind:inVertical="element.inVertical"
          v-bind:isFirstLetter="element.isFirstLetter"
          v-bind:wordInOrder="element.wordInOrder"
          v-bind:sourceName="this.sourceName">
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
        dimsX: String(600 / this.matrixDims.x) + "px",
        dimsY: String(600 / this.matrixDims.y) + "px"
      }
    },  
    name: 'CrossWord',
    components: {
      WordBox, 
    },
    props: {
      wordPositions: Array,
      matrixDims: Object,
      solutionsList: Object,
      sourceName: String,
      wordInOrder: Number
    },
    mounted() {
    /*   this.wordPositions.actual.forEach((item, yindex) => {
        console.log("Outer wordPositions.actual index: " + yindex);
        item.forEach((item, xindex) => {
          console.log("Inner wordPositions.actual index: " + xindex)
        })
      }); */
    const element = document.querySelector(':root');
    element.style.setProperty('--dimsX', this.matrixDims);
    element.style.setProperty('--dimsY', this.matrixDims);
    console.log(this.matrixDims)
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
      }
    },

    computed: {
    cellWidth() {
      return (600 / this.matrixDims.x) + 'px'
    },
    cellHeight() {
      return (600 / this.matrixDims.y) + 'px'
    },
  },
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

:root {
  --X: var(--dimsX);
  --Y: var(--dimsY);

}

.letterbox {
  background-color: rgb(250, 244, 192);
  min-width: var(--X);
  min-height: var(--Y);
  max-width: var(--X);
  max-height: var(--Y);
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-weight: bold;
  font-size: 1.5rem;
  border: black 0.15rem solid;
}

.letterbox:empty {
  background-color: white;
  /* background-color: #A7CAB1; */
}

#crossword {
  display: table;
  height: 20rem;
  width: 20rem;
}

#crosswordwrapper {
  table-layout: auto;
  justify-content: center;
  background-color: #A7CAB1;
  height: 600px;
  width: 600px;
  max-height: 600px;
}


  </style>
  
  