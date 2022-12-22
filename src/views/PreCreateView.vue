<template>
    <h3>Pre Create Lobby</h3>
    <div>
    <label for="x">X:</label>
    <input type="number" v-model.number="x" id="x">
    <br>
    <label for="y">Y:</label>
    <input type="number" v-model.number="y" id="y">
    <br>
    <button @click="storeValues">Submit</button>
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
    </template>
    
    <script>
    import Crossword from '../components/Crossword.vue'

    export default {
    components: {
        Crossword
    },
    data: function () {
    return {
    matrixDims: {x: 13, y: 10},
    wordPositions: {actual: [], temp: []},
    x: 5,
    y: 5

    }
},
    created: function(){
        this.fillPositionsNull();
    },

    methods: {
        storeValues() {
        console.log("x: " + this.x + ", y: " + this.y);
        this.matrixDims.x = this.x
        this.matrixDims.y = this.y
        this.fillPositionsNull()
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
        margin-bottom: 20%;
        margin-left: 20%;
        margin-right: 20%;
        justify-content: center;
    }

    #x {
        width: 4rem;
        height: 3rem;
    }

    #y {
        width: 4rem;
        height: 3rem;
    }

    input {
	color: rgb(0, 0, 0);
	width: 2em;
	font-size: 2em;
	border-radius: 2px;
	border: 2px solid rgb(0, 0, 0);
	padding: 5px;
	padding-left: 10px;
	}
	input[type=number]::-webkit-inner-spin-button {
	cursor: pointer;
	display: block;
	width: 15px;
	text-align: center;
	position: relative;
	}
	input[type=number]::-webkit-inner-spin-button::before,
	input[type=number]::-webkit-inner-spin-button::after {
	content: "";
	position: absolute;
	right: 0;
	width: 0;
	height: 0;
	}
	input[type=number]::-webkit-inner-spin-button::before {
	top: 7px;
	}
	input[type=number]::-webkit-inner-spin-button::after {
	bottom: 7px;
	transform: rotate(180deg);
	}
    </style>