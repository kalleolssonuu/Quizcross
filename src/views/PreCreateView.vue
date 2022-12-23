<template>
    <h3>Pre Create Lobby</h3>
    <div>
    <h3>X: {{ x }}</h3>
    <button v-on:click=decreaseX type="button">
    -
    </button>
    <button v-on:click=increaseX type="button">
    +
    </button>
    <h3>Y: {{ y }}</h3>
    <button v-on:click=decreaseY type="button">
    -
    </button>
    <button v-on:click=increaseY type="button">
    +
    </button>
    </div>
    


    <div id="crosswordArea">
    <Crossword  v-bind:sourceName="sourceName"
                    v-bind:wordObjects="this.wordObjects" 
                    v-bind:tempWordObjects="this.tempWordObjects"
                    v-bind:wordPositions="this.wordPositions"
                    v-bind:matrixDims="this.matrixDims"
                    v-bind:word="this.word"
                    v-bind:desc="this.desc">
        </Crossword>
    </div>
    <button v-on:click=submitsDim>
    Confirm and create
    </button>

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
        },

        storeValues() {
        this.matrixDims.x = this.x
        this.matrixDims.y = this.y
        this.fillPositionsNull()
        },

        increaseX: function() {
            this.x += 1
            this.storeValues()
        },

        decreaseX: function() {
            if(this.x >= 1){
                this.x -= 1
                this.storeValues()
            }
        },
        increaseY: function() {
            this.y += 1
            this.storeValues()
        },

        decreaseY: function() {
            if(this.y >= 1){
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
        margin-left: 20%;
        margin-right: 20%;
        justify-content: center;
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
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

   
    </style>