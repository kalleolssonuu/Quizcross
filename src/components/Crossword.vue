<template>
  <div id="crosswordwrapper">
    <div class="letterbox" v-for="word in wordObjects" >
      {{ word.pos.key() }}

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
      increaseAmount: function () {
        this.amountOrdered += 1;
        this.$emit('orderedBurger', {name: this.burger.name, amount: this.amountOrdered
        })
      }, 
      decreaseAmount: function () {
        if (this.amountOrdered > 0) {
          this.amountOrdered -= 1;
        }
        this.$emit('orderedBurger', {name: this.burger.name, amount: this.amountOrdered
        })
      }
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  
.letterbox {

}

#crosswordwrapper {
  display: grid;
  grid-area: auto;
  background-color: #A7CAB1;
}


  </style>
  
  