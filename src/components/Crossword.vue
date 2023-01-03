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
          v-bind:sourceName="this.sourceName"
          v-bind:dimsX="this.dimsX"
          v-bind:dimsY="this.dimsY">
        </WordBox>
      </td> 
    </tr>
  </table>

</div>
<div class="letterbox">
  Hej
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
    element.style.setProperty('--dimsX', this.dimsX);
    element.style.setProperty('--dimsY', this.dimsY);
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
  }
  </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

:root {
  --dimsX: 1em;
  --dimsY: 1em;
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
  
  