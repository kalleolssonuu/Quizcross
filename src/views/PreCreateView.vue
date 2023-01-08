<template>
    <header>
    <div>
      <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" >
        <button v-on:click="togglePopup"></button>
      </Modal>
    </div>
    </header>  
        
        <h2 id="xy">{{ matrixDims.x }}   x    {{ matrixDims.y }}</h2>   
            <div class="plusMinusWrapper">
                <button id="minusButton" v-on:click=decrease >
                -
                </button>
                <button id="plusButton" v-on:click=increase >
                +
                </button>
            </div>
            <!-- <div class="buttonWrapper"> -->
            <div id="crosswordArea">
                <Crossword  v-bind:sourceName="sourceName"
                            v-bind:crossword="this.crossword.actual.posList"
                            v-bind:matrixDims="this.matrixDims">
                </Crossword>    
            </div>
            <div id="buttonArea">
                    <!--  <form id="myForm">   -->               
                        <input v-if="this.lang == 'en'" type="text" v-model="gameID" id="gameName" name="gameName" placeholder="Enter game name here..."> 
                        <input v-else type="text" v-model="gameID" id="gameName" name="gameName" placeholder="Ge korsordet ett namn...">
                   <!--  </form>  -->
                    <!-- JESSIE FRÅGA: GLÖM EJ måste fixa så ej kan skriva ett namn som redan finns!!!!! -->
                      <br>  
                    <button class="standardButtonPreCreate" @click="$router.push('/CreateView/'+lang+'/'+gameID+'/'+ JSON.stringify(matrixDims))">
                    {{uiLabels.confirmAndCreate}}
                    </button> 
            </div>
            <!-- </div> -->
            <HomepageButton v-bind:uiLabels="uiLabels" v-bind:lang="lang"></HomepageButton>
</template>
    
    <script>
    import Crossword from '../components/Crossword.vue'
    import Modal from '../components/PopUp.vue'
    import io from 'socket.io-client';
    const socket = io();
    import HomepageButton from '../components/HomepageComponent.vue'

    export default {
    components: {
        Crossword,
        Modal,
        HomepageButton
    },
    data: function () {
    return {
    matrixDims: {x: 8, y: 8},    
    x: 8,  // JESSIE FRÅGA: är dessa nödvändiga?
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
        increase: function() {
            if(this.matrixDims.x <= 25) {
                this.matrixDims.x ++
                this.matrixDims.y ++
                this.fillPositionsNull()
            }
        },

        decrease: function() {
            if(this.matrixDims.x >= 6) {
                this.matrixDims.x --
                this.matrixDims.y --
                this.fillPositionsNull()
            }
        },


        fillPositionsNull: function () {
            this.crossword.actual.posList = []
            
            for (let v = 0; v < this.matrixDims.y; v++) {
                this.crossword.actual.posList[v] = [];
                /* crossword = [[null, null, null, null]] */     // JESSIE FRÅGA: ok att ta bort?
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
        
        togglePopup: function () {
            this.showModal = ! this.showModal;
        },      
    }
    }
    </script>
    
    <style>

    #crosswordArea{
        float: left;
        width: 50vw;
        height: 50vh;
        margin-left: 25%;
        justify-content: center;
        
        
       
    }
     #buttonArea{
        float: right;
        width: 25%;
        justify-content: center;

    } 


     #gameName {
        width: 80%;
        height: 6vh;
        font-family: "Comic Sans MS", "Comic Sans", cursive;
        font-size:1.5rem;
        border-radius: 1rem;
        margin:1%;
    } 
    
        
    .standardButtonPreCreate{
        width: 50%;
        height: 8vh;
        border-radius: 1rem;
        border-color: #ba0c00;
        margin: 1rem;
        background-color: #FE5F55;
        font-family: "Comic Sans MS", "Comic Sans";
        color:white;
        font-size: 1.5rem;
        cursor:pointer;
        
     
    }
    .standardButtonPreCreate:hover{
    opacity: 0.80;
    }


  .plusMinusWrapper{
    display: flex;
    justify-content: center;
    margin:1%

  }

    #xy {
        justify-content: center;
        display: flex;
        margin-left:2%;
    }

    #minusButton{
        height: 5vh;
        width: 4%;
        background-color: #FE5F55;
        border-color: #ba0c00;
        color: white;
        font-size: 1.5rem;
        font-family: "Comic Sans MS", "Comic Sans";
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
        cursor: pointer;
    }
    #plusButton {
        height: 5vh;
        width: 4%;
        background-color: #FE5F55;
        border-color: #ba0c00;
        color: white;
        font-size: 1.5rem;
        font-family: "Comic Sans MS", "Comic Sans";
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
        cursor: pointer;
    }
    #plusButton:hover{
        background-color: #fb6d63;
    }
    #minusButton:hover{
        background-color: #fb6d63;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

   
</style>