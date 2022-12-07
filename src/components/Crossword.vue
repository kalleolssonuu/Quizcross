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

    <div id="crosswordwrapper">
      <tr>
        <td class="letterbox"> T </td>
        <td class="letterbox"> D </td>
        <td class="letterbox"> T </td>
      </tr>
      <tr>
        <!-- <td class="letterbox"> T </td> -->
      </tr>
    </div>

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
    methods: {
      tempFunc: function () {
        console.log("test")
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>


.letterbox {
  background-color: green;
  height: relative;
  width: relative;
  margin: 2em;
  /* object-position: center; */
}
  .letterbox:empty {
  background-color: red;
}


#crosswordwrapper {
  display: table;
  table-layout: auto;
  justify-content: center;
  background-color: #A7CAB1;
  height: 20em;
  width: 20em;
}


  </style>
  
  