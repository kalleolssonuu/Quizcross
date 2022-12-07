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
      <tr v-for="(list, key) in [['C','L', 'O', 'W', 'N', ''],['','A','','', '', ''],['','K','A','N', 'O', 'N'],
                                  ['J', 'A', '', '', '', ''], ['', 'N', '', '', '', '']]" v-bind:key="key">
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
      matrixDims: Object,
      word: String,
      desc: String
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
  background-color: rgb(250, 244, 192);
  height: 5rem;
  width: 5rem;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-weight: bold;
  font-size: 2rem;
  border: black 0.15rem solid;
  /* object-position: center; */
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
  display: table;
  table-layout: auto;
  justify-content: center;
  background-color: #A7CAB1;
}


  </style>
  
  