<template>
  <div id="crosswordwrapper">


    <!-- använd v-model för att lösa problemet med positioner i tabellen? -->

    <div class="letterbox" v-for="list in wordPositions" >
      <tr>
        <span v-for="letter in list.items()">
            <td> {{ letter }} </td>
        </span>
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
      wordPositions: []
    },
    methods: {

    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>

  .letterbox:empty {
  background-color: whitesmoke;
}

.letterbox {
  background-color: white;
  /* object-position: center; */
}


#crosswordwrapper {
  display: table;
  table-layout: auto;
  background-color: #A7CAB1;
}


  </style>
  
  