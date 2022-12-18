<template>
<div>
  
  <table id="crosswordwrapper">
    <tr v-for="(list, ykey) in wordPositions.actual" v-bind:key="'y' + ykey">
        <WordBox v-for="(letter, xkey) in list" v-bind:key="'x' + xkey"> 
          
          <!-- <WordBox v-bind:key="key" v-bind:letter="letter" v-bind:direction="direction">
            {{ letter }}
          </WordBox> -->

          {{ letter }}
        </WordBox>
    </tr>
  </table>


<!--     <table id="crosswordwrapper"> nedan lista är hur wordPositions kommer se ut i verkligheten
      <tr v-for="(list, key) in [['C','L', 'O', 'W', 'N', ''],['','A','','', '', ''],['','K','A','N', 'O', 'N'],
                                  ['J', 'A', '', '', '', ''], ['', 'N', '', '', '', '']]" v-bind:key="key">
        <td class="letterbox" v-for="(letter, key) in list" v-bind:key="key"> 
          {{ letter }}
        </td>
      </tr>
    </table> -->

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
      wordPositions: Object, /* .actual[] .temp[[]] */
      matrixDims: Object,
      word: String,
      desc: String
    },
    mounted() {
    this.wordPositions.actual.forEach((item, yindex) => {
      console.log("Outer wordPositions.actual index: " + yindex);
      item.forEach((item, xindex) => {
        console.log("Inner wordPositions.actual index: " + xindex)
      })
    });

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
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>


.letterbox {
  background-color: rgb(250, 244, 192);
  height: 3rem;
  width: 3rem;
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
  margin: 0 auto;
  justify-content: center;
  background-color: #A7CAB1;
}


  </style>
  
  