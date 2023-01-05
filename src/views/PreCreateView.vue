<template>
    <header>
    <div>
      <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" >
      <button v-on:click="togglePopup"></button>
      </Modal>
    </div>
    </header>
    
    <div id="crosswordArea">
        <h2>{{ matrixDims.x }}   x    {{ matrixDims.y }}</h2>   
        <div class="plusMinusWrapper" id="PlusMinusButtons">

    <button id="minusButton" v-on:click=decrease type="button">
    -
    </button>
    <button id="plusButton" v-on:click=increase type="button">
    +
    </button>
    </div>
    <Crossword  v-bind:sourceName="sourceName"
                      v-bind:crossword="this.crossword.actual.posList"
                      v-bind:matrixDims="this.matrixDims">
          </Crossword>
        
    </div>

    <div class="nameWrapper" id="nameAndCreate">
            <br>
        <form id="gameNameAndSize">
            <div id="section1">
                <form id="myForm">                    
                    <input v-if="this.lang == 'en'" type="text" v-model="gameID" id="gameName" name="gameName" placeholder="Enter game name here...">
                    <input v-else type="text" v-model="gameID" id="gameName" name="gameName" placeholder="Ge korsordet ett namn...">
                </form>
            </div>
        </form>
    
    <!-- jessies testknapp
    <button v-on:click="this.confirmNameDims()">
    {{uiLabels.confirmAndCreate}}
    </button> -->

    <button id="confirmAndCreate" @click="$router.push('/CreateView/'+lang+'/'+gameID+'/'+ JSON.stringify(matrixDims))">
        {{uiLabels.confirmAndCreate}}
    </button> 

    <button id="returnButton" @click="$router.push('/'+lang)">{{uiLabels.backButton}}</button>
</div>

</template>
    
    <script>
    import Crossword from '../components/Crossword.vue'
    import Modal from '../components/PopUp.vue'
    import io from 'socket.io-client';
    const socket = io();

    export default {
    components: {
        Crossword,
        Modal
    },
    data: function () {
    return {
    matrixDims: {x: 8, y: 8},    
    x: 8,
    y: 8,
   crossword: {actual: {posList: [], 
                                   startPos: {x: 0, 
                                              y: 0
                                             }
                                  }, 
                          temp: []
                         },
    showModal: false,
        uiLabels: {},
        
        gameID: "",   
        lang: "",
        sourceName: "PreCreate"
    }
    },
    created: function(){
        this.lang = this.$route.params.lang;

      socket.emit('pageLoaded', this.lang)
      socket.on("init", (labels) => {
      this.uiLabels = labels
    })
        this.fillPositionsNull();
    },

    methods: {
        // submitDims() { 
        // console.log("x: " + this.x + ", y: " + this.y);
        // console.log(this.matrixDims)
        // },



        // storeValues() {
        // this.matrixDims.x = this.x
        // this.matrixDims.y = this.y
        // this.fillPositionsNull()
        // },

        increase: function() {
            if(this.matrixDims.x <= 25){
            this.matrixDims.x ++
            this.matrixDims.y ++
            this.fillPositionsNull()
        }
        },

        decrease: function() {
            if(this.matrixDims.x >= 6){
                this.matrixDims.x --
                this.matrixDims.y --
                this.fillPositionsNull()
            }
        },


        fillPositionsNull: function () {
            this.crossword.actual.posList = []
            
            for (let v = 0; v < this.matrixDims.y; v++) {
                this.crossword.actual.posList[v] = [];
                /* crossword = [[null, null, null, null]] */
                for (let h = 0; h < this.matrixDims.x; h++) {
                this.crossword.actual.posList[v][h] = {letter: null, 
                                                    inHorizontal: false,
                                                    inVertical: false,
                                                    isFirstLetter: false, 
                                                    wordInOrder: null}
                }
            }
  
          console.log(this.crossword.actual.posList)
        },

        switchLanguage: function() {
            if (this.lang === "en")
                this.lang = "sv"
            else
                this.lang = "en"

            socket.emit("switchLanguage", this.lang)
            this.$router.push(this.lang)
        },

        /* FÖR ATT FÅ FRAM POP-UP RUTA*/
        togglePopup: function () {
            this.showModal = ! this.showModal;
        },
      
    }
    }
    </script>
    
    <style>
    
    #crosswordArea {
        justify-content: center;

    }

    #nameAndCreate {
    justify-content: center;
    }

    #confirmAndCreate {
        width: 10rem;
        height: 5rem;
        bottom: 60%;
        right: 5%;
        font-family: "Comic Sans MS", "Comic Sans", cursive;
        border-color: #ba0c00;
        background-color: #FE5F55;
        border-radius: 15px;
        color: white;
        position: absolute;
    }
    #gameName {
        width: 18rem;
        height: 4.6rem;
        bottom: 60%;
        right: 16%;
        font-family: "Comic Sans MS", "Comic Sans", cursive;
        font-size: 25px;
        border-radius: 15px;
        position: absolute;
    }
    #returnButton {
        bottom: 53%;
        right: 18%;
        margin: 0.5rem;
        background-color: #FE5F55;
        border-color: #ba0c00;
        border-radius: 5px;
        color: white;
        font-family: "Comic Sans MS", "Comic Sans", cursive;
        position: absolute;
        }
    .nameWrapper{
    display: relative;
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

    #minusButton, #plusButton {
        height: 2rem;
        width: 2rem;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

   
</style>