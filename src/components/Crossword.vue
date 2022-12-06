<template>
  <div>


    <!-- använd v-model för att lösa problemet med positioner i tabellen? -->

<!--     <div class="letterbox" v-for="(list, key) in wordPositions" v-bind:key="key">
      <tr v-for="(list, key) in wordPositions" v-bind:key="key">
          <td v-for="(letter, key) in list.items()" v-bind:key="key"> 
            <button v-on:click="tempFunc"> 
              {{ letter }}
              T
            </button>
            T
          </td>
      </tr>

    </div> -->

    <table id="crosswordwrapper">
      <tr v-for="(list, key) in [[1,2,3,4],[2,3,4,5],[3,4,5,6]]" v-bind:key="key">
        <td class="letterbox" v-for="(letter, key) in list" v-bind:key="key"> 
          {{ letter }}
        </td>
      </tr>
    </table>

  </div>
</template>
  
  <script>
  export default {
    data: function() {
      return {
        amountOrdered: 0
      }
    },  
    name: 'OneBurger',
    props: {
      wordObjects: Object,
      tempWordObjects: Object,
      wordPositions: [],
      matrixDims: Object
    },
    created: function () {
      this.tempFunc()
    },
    methods: {
      tempFunc: function () {
        console.log("test")
        console.log(this.wordPositions)
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>


.letterbox {
  background-color: green;
  height: 2rem;
  width: 2rem;
  margin: 2em;
  /* object-position: center; */
}
  .letterbox:empty {
  background-color: red;
}

#crossword {
  display: table;
  height: 20rem;
  width: 20rem;

}

#crosswordwrapper {
  display: table;
  table-layout: auto;
  justify-content: center;
  background-color: #A7CAB1;
}


  </style>
  
  