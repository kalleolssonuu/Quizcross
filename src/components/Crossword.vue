<template>
<div>
  {{ matrixDims }}
  {{ dimsX }}
  {{ dimsY }}
  <table id="crosswordwrapper">
    <tr v-for="(list, ykey) in crossword" v-bind:key="'y' + ykey">
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
          v-bind:matrixDims="this.matrixDims">
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
        dimsX: String(40 / this.matrixDims.x) + "rem",
        dimsY: String(40 / this.matrixDims.y) + "rem"
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


#crosswordwrapper {
  table-layout: auto;
  justify-content: center;
  background-color: #A7CAB1;
  height: 40rem;
  width: 40rem;
  max-height: 40rem;
  max-width: 40rem;
}


  </style>
  
  