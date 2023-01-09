<template>
    <header>
    <div>
      <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" >
        <button v-on:click="togglePopup"></button>
      </Modal>
    </div>
    </header>  
        
        <h2 style="text-align: center;"> {{ this.cellsAmount }} </h2>   
            <div class="plusMinusWrapper">
                <button id="minusButton" v-on:click=decrease type="button">
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
                            v-bind:cellsAmount="this.cellsAmount">
                </Crossword>    
<!--             </div>

            <div id="buttonArea"> -->
                    <!--  <form id="myForm">   -->               
                        <input v-if="this.lang == 'en'" type="text" v-model="gameID" id="gameName" name="gameName" placeholder="  Enter game name..."> 
                        <input v-else type="text" v-model="gameID" id="gameName" name="gameName" placeholder=" Namnge korsordet...">
                   <!--  </form>  -->
                    <!-- JESSIE FRÅGA: GLÖM EJ måste fixa så ej kan skriva ett namn som redan finns!!!!! -->
                
                    <button class="standardButtonPreCreate" id="confirmAndCreate" @click="$router.push('/CreateView/'+lang+'/'+gameID+'/'+ JSON.stringify(cellsAmount))">
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
    cellsAmount: 8,
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
        console.log(this.crossword.actual.posList)
    },

    methods: {
        increase: function() {
            if (this.cellsAmount <= 18) {
                this.cellsAmount ++
                this.fillPositionsNull()
            }
        },

        decrease: function() {
            if(this.cellsAmount >= 6) {
                this.cellsAmount --
                this.fillPositionsNull()
            }
        },


        fillPositionsNull: function () {
            
            this.crossword.actual.posList = []
            
            for (let v = 0; v < this.cellsAmount; v++) {
                this.crossword.actual.posList[v] = [];
                /* crossword = [[null, null, null, null]] */     // JESSIE FRÅGA: ok att ta bort?
                for (let h = 0; h < this.cellsAmount; h++) {
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
        width: 85vw;
        height: 100vh;
        margin-left: 15vw;
        justify-content: center;
        
        
       
    }
     #buttonArea{
        width: 100vw;
        height: 25vh;
        justify-content: center;
    } 


     #gameName {
        width: 20vw;
        height: 5.5vw;
        position: absolute;
        right: 19vw; top: 17vw;
        font-family: "Comic Sans MS", "Comic Sans";
        font-size:1.5rem;
        border-radius: 1rem;
        /* margin:1%; */
    } 
    
        
    .standardButtonPreCreate{
        width: 10vw;
        height: 6vw;
        /* display: flex; */
        position: absolute;
        right: 7vw; top: 17vw;
        justify-content: center;
        align-items: center;
        border-radius: 1rem;
        border-color: #ba0c00;
        /* margin: 1rem; */
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
    align-items: center;
    margin:1%;
    width: 100vw;
    height: 5vw;
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