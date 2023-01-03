<template>
<div>
  
  <table id="crosswordwrapper">
    <tr v-for="(list, ykey) in wordPositions" v-bind:key="'y' + ykey">
      <td v-for="(element, xkey) in list" v-bind:key="'x' + xkey">
        <WordBox v-if="this.sourceName == 'CreateView'" class="letterbox letterbox-CreateView"
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
        <WordBox v-if="this.sourceName == 'PlayView'" class="letterbox letterbox-PlayView"
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
        <WordBox v-if="this.sourceName == 'PreCreate'" class="letterbox"
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
/*     this.wordPositions.actual.forEach((item, yindex) => {
      console.log("Outer wordPositions.actual index: " + yindex);
      item.forEach((item, xindex) => {
        console.log("Inner wordPositions.actual index: " + xindex)
      })
    }); */
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

.letterbox {
  background-color: white;
 width: 95%;
  height: 95%;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-weight: bold;
  font-size: 1rem;
  border: black 0.15rem solid;
  color:black;
}

/* .letterbox-CreateView {
  
} */

.letterbox-CreateView:hover {
  cursor: default;
}

.letterbox-PlayView {
  cursor: default;
}

#crossword {
  display: table;
  height: 20rem;
  width: 20rem;

}

#crosswordwrapper {
  display: table;
  table-layout: auto;
  margin: 0 auto;
  justify-content: center;
  background-color: #A7CAB1;
  height: 600px;
  width: 600px;
  max-height: 600px;
}


  </style>
  
  