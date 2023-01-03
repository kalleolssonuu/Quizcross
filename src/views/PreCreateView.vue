<template>
    <h3>Pre Create Lobby</h3>
    
    <div id="crosswordArea">
      <h2>{{ x }}   x    {{ y }}</h2>  
        <div class="plusMinusWrapper" id="PlusMinusButtons">

    <button id="minusButton" v-on:click=decrease type="button">
    -
    </button>
    <button id="plusButton" v-on:click=increase type="button">
    +
    </button>
    </div>
    <Crossword  v-bind:sourceName="sourceName"
                    v-bind:wordObjects="this.wordObjects" 
                    v-bind:tempWordObjects="this.tempWordObjects"
                    v-bind:wordPositions="this.wordPositions"
                    v-bind:matrixDims="this.matrixDims"
                    v-bind:word="this.word"
                    v-bind:desc="this.desc">
        </Crossword>
        
    </div>
    <div class="nameWrapper" id="nameAndCreate">
        <h2>Game name:</h2>
        <br>
    <form id="gameNameAndSize">
        <div id="section1">
            <form id="myForm">
  <input type="text" id="gameName" name="gameName">
</form>
  </div>
    </form>
    <button v-on:click=submitsDim id="confirmAndCreate">
    Confirm and create
    </button>
    </div>
    </template>
    
    <script>
    import Crossword from '../components/Crossword.vue'

    export default {
    components: {
        Crossword
    },
    data: function () {
    return {
    matrixDims: {x: 8, y: 8},
    wordPositions: {actual: [], temp: []},
    x: 8,
    y: 8

    }
},
    created: function(){
        this.fillPositionsNull();
    },

    methods: {
        submitsDim() {
        console.log("x: " + this.x + ", y: " + this.y);
        console.log(this.matrixDims)
        },

        storeValues() {
        this.matrixDims.x = this.x
        this.matrixDims.y = this.y
        this.fillPositionsNull()
        },

        increase: function() {
            this.x += 1
            this.y += 1
            this.storeValues()
        },

        decrease: function() {
            if(this.x >= 6){
                this.x -= 1
                this.y -= 1
                this.storeValues()
            }
        },


        fillPositionsNull: function () { //tar x och y som inparametrar med input
            this.wordPositions.actual = []
        for (let v = 0; v < this.matrixDims.y; v++) {
            this.wordPositions.actual[v] = [];
            /* wordPositions = [[null, null, null, null]] */
            for (let h = 0; h < this.matrixDims.x; h++) {
            this.wordPositions.actual[v][h] = {letter: null, 
                                               inHorizontal: false,
                                               inVertical: false,
                                               isFirstLetter: false, 
                                               wordInOrder: this.wordInOrder} /* if (wordInOrder != 0) { lägg till siffra i hörnet } */
            }
        }

        this.wordPositions.temp = []
        console.log(this.wordPositions.actual)
      },
      
    }
    }
    
    </script>
    
    <style>
    
    #crosswordArea {
        justify-content: center;
        float: left;

    }

    #nameAndCreate {
    float: left;
    width: 25%;
    justify-content: center;
    margin-top: 10%;
    }

    #confirmAndCreate {
        width: 10rem;
        height: 5rem;
        font-family: "Comic Sans MS", "Comic Sans", cursive;
    }
    #gameName {
        width: 18rem;
        height: 4.6rem;
        font-family: "Comic Sans MS", "Comic Sans", cursive;
        font-size: 25px;
    }

    .nameWrapper{
    display: flex;
    justify-content: center;
  }

  .XYWrapper{
    display: flex;
    justify-content: center;
  }

  .plusMinusWrapper{
    display: flex;
    justify-content: center;
    margin: 1rem;
  }

    #x {
        width: 3rem;
        height: 3rem;
        font-family: "Comic Sans MS", "Comic Sans", cursive;
        font-size: 30px;
        text-align: center;
    }

    #y {
        width: 3rem;
        height: 3rem;
        font-family: "Comic Sans MS", "Comic Sans", cursive;
        font-size: 30px;
        text-align: center;
    }

    #minusButtonX, #plusButtonX, #minusButtonY, #plusButtonY{
        height: 2rem;
        width: 2rem;
    }
    
    #plusButtonX {
        margin-right: 1rem;
    }
    #minusButtonY {
        margin-left: 1rem;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

   
    </style>