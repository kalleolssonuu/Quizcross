<template>
<header>
  <div>
      <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" >
      <button v-on:click="togglePopup"></button>
      </Modal>
    </div>
</header>

<div id="div1" class="inputFieldWrapper">
          
    <div class="inputField"> <!-- måste emitta word så att vi kan använda -->
      <h2>{{uiLabels.yourWord}}</h2>
      <input type="text" id="wordInput" v-model="word" required="required" placeholder="Word sv/en">
    </div>
    <br>

    <div class="inputField" style="display: inline-block">
        <h2>{{uiLabels.wordDescription}}</h2>
        <input type="text"  id="descInput" v-model="desc" required="required" placeholder="Word desc sv/en">
    </div>
    <br>
    
    <button v-if="this.enableWordButtons || this.word =='' || this.desc==''"  class="button-disabled" disabled> {{uiLabels.addWord}} </button>
    <button v-else v-on:click="this.findPotentialMatches"> {{uiLabels.addWord}} </button>
    <!-- <button v-on:click="this.findPotentialMatches">{{uiLabels.addWord}}</button>  -->
    <br>

    <div class="solutionsWrapper">
      <img id="showSolutions" :src="uiLabels.showPrevious" v-on:click="this.showPreviousSolution">
      <img id="showSolutions" :src="uiLabels.showNext" v-on:click="this.showNextSolution">
    </div>
    
    <button v-if="!this.enableWordButtons" class="button-disabled" disabled> Confirm </button>
    <button v-else v-on:click="this.confirmWord"> Confirm </button>

    <button v-if="!this.enableWordButtons" class="button-disabled" disabled> Discard </button>
    <button v-else v-on:click="this.discardWord"> Discard </button>


  </div>       

    <div id="div2"> 
        <Crossword  v-bind:sourceName="sourceName"
                    v-bind:wordPositions="this.wordPositions.actual.list"
                    v-bind:matrixDims="this.matrixDims">
        </Crossword>
    </div>
        
        <div id="div3">
          <!--<button v-on:click="this.emptyTextFields"> Empty Input </button> ---><!-- gör detta när användaren har valt ett ord istället för en knapp. Det rensar även textfältet -->
          <button v-on:click="this.resetData">
            {{uiLabels.resetCrossword}}
          </button> 
          <br>

          <button v-on:click="this.confirmCreateCrossword" @click="$router.push('/Lobby/'+lang)"> <!-- JESSIE ÄNDRA SKICKA MED ID?????? -->
            {{uiLabels.confirmCreate}}  <!--JESSIE OBS OLIKA NAMN - Jessie igen: vet ej vad jag menade med denna kommentar --> 
          </button>
        </div>
        <br>

        Iterator: {{ this.userIterator }}

</template>
  
<script>
  import Crossword from '../components/Crossword.vue'
  import Modal from '../components/PopUp.vue'
  import io from 'socket.io-client';
  /* import Vue from 'vue'; */

  const socket = io();
 /*  const initialData = {
    word: "",
    desc: "",

    userIterator: 0,
    matchesIterator: 0,
    prioIterator: 0, 
    wordInOrder: 1,
    amountWordsAdded: 0,

    enableWordButtons: false,
    wordCollision: false,
    noMatches: false,

    matrixDims: {x: 15, y: 15},
    wordPositions: {actual.list: [], temp: []},
    wordPositionsCopy: [],
    crosswordPackage: {crosswordName: "", 
                        wordPositions: [],
                        wordDesc: [],
                        matrixDims: {},
                        },

    showModal: false,
    uiLabels: {},        
    lang: "en",

    sourceName: "CreateCrosswordView",
  } */


/* LOGG:

  2023-01-02
  Fixa sista problemen med algoritmen.
  - Lilla siffran blir fel vid genomgång av wordPositions.temp
  - Orden hamnar ett steg förskjutet
  - isFirstLetter --> rätt siffra i hörnet
  * Undersök möjlighet att öka iterator vid confirm istället

  - Visa beskrivningar löpande så att användaren alltid får se vad den skapar
  - Layout i olika Views, knappar osv.

*/

  export default {
    name: 'CreateView',
    components: {
        Crossword,
        Modal
    },
    data: function () {
      return {
        word: "",
        desc: "",

        userIterator: 0,
        matchesIterator: 0,
        prioIterator: 0, 
        wordInOrder: 1,
        wordInOrderCopy: 1,
        amountWordsAdded: 0,
        letterMatchCounter: 0,

        enableWordButtons: false,
        wordCollision: false,
        noMatches: false,

        
        wordPositions: {actual: {list: [], 
                                           startPos: {x: 0, 
                                                      y: 0
                                                     }
                                }, 
                        temp: {list: [], 
                               startPos: {x: 0, 
                                          y:0
                                         }
                              }
                       },
        wordPositionsCopy: [],
        crosswordPackage: {crosswordName: "", 
                           wordPositions: [],
                           wordDesc: [],
                           matrixDims: {},
                           },

        showModal: false,
        uiLabels: {},   

        matrixDims: null,
        gameID: "",
        lang: "",
        sourceName: "CreateView",
      }
    },
    created: function () {
      this.lang = this.$route.params.lang;
      this.gameID = this.$route.params.gameID;
      this.matrixDims = JSON.parse(this.$route.params.dims);

      socket.emit('pageLoaded', this.lang)
      socket.on("init", (labels) => {
        this.uiLabels = labels
      })
      socket.on("dataUpdate", (data) =>
        this.data = data
      )
      this.fillPositionsNull()  // fyller matris
    },
    methods: {
      switchLanguage: function() {
        if (this.lang === "en")
          this.lang = "sv"
        else
          this.lang = "en"
        socket.emit("switchLanguage", this.lang)
      },

      togglePopup: function () {
        this.showModal = ! this.showModal;
      },

      resetData: function () {
        location.reload()
      },

      findPotentialMatches: function () {
        if (this.word != "") {
        
          this.enableWordButtons = true
          this.matchesIterator = 0;
          this.userIterator = 0;
          this.swapIterator = 0;
          let word = this.word.toUpperCase();                 /* för att spara plats längre ner */
          let wordSplit = word.split("");
          console.log("wordSplit = " + wordSplit);
          const horiz = this.matrixDims.x; /* för att spara plats längre ner */
          const vert = this.matrixDims.y;    /* för att spara plats längre ner */

          this.wordPositionsCopy = JSON.parse(JSON.stringify(this.wordPositions.actual.list))
          

          for (let h = 0; h < horiz; h++) {
          for (let v = 0; v < vert; v++) {

              if (this.wordPositions.actual.list[v][h].letter === wordSplit[0] || this.wordPositions.actual.list[v][h].letter === null) {

                  if (wordSplit.length <= vert - v) { /* FÅR PLATS VERTIKALT? */
                      /* h = 1, v = 0 */
                      for (let iv = 0; iv < wordSplit.length; iv++) {

                          if ((this.wordPositions.actual.list[v + iv][h].letter === wordSplit[iv]) || (this.wordPositions.actual.list[v + iv][h].letter === null)) { /* räcker med att spara första och sista positionen för ordet! */

                            if (this.wordPositions.actual.list[v + iv][h].letter === wordSplit[iv]) {
                              this.wordCollision = true
                              this.letterMatchCounter++
                            }

                            if (iv == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */                            
                              if (this.letterMatchCounter != wordSplit.length) {
                                if (this.wordCollision) {
                                  console.log("lägger till prio. h = " + h + ", v = " + v + ", prioIterator = " + this.prioIterator)
                                  this.wordPositions.temp.list.splice(this.prioIterator, 0, this.getNewTempPositionVert(h, v, wordSplit))
                                  this.prioIterator++

                                } else {
                                  this.wordPositions.temp.list[this.matchesIterator] = this.getNewTempPositionVert(h, v, wordSplit)
                                }
                                this.matchesIterator++;
                              }
                            }
                          } else {
                            break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                          }
                      }
                  }
                  this.letterMatchCounter = 0
                  this.wordCollision = false

                  if (wordSplit.length <= horiz - h) { /* FÅR PLATS HORISONTELLT? */
                      
                    for (let ih = 0; ih < wordSplit.length; ih++) {

                          if ((this.wordPositions.actual.list[v][h + ih].letter === wordSplit[ih]) || (this.wordPositions.actual.list[v][h + ih].letter === null)) { /* räcker med att spara första och sista positionen för ordet! */
                            
                            if (this.wordPositions.actual.list[v][h + ih].letter === wordSplit[ih]) {
                              this.wordCollision = true
                              this.letterMatchCounter++
                            }

                            if (ih == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */

                              if (this.letterMatchCounter != wordSplit.length) {
                                if (this.wordCollision) {
                                  console.log("lägger till prio. h = " + h + ", v = " + v + ", prioIterator = " + this.prioIterator)
                                  this.wordPositions.temp.list.splice(this.prioIterator, 0, this.getNewTempPositionHoriz(h, v, wordSplit))
                                  this.prioIterator++

                                } else {
                                  this.wordPositions.temp.list[this.matchesIterator] = this.getNewTempPositionHoriz(h, v, wordSplit)
                                }
                                this.matchesIterator++;
                              }
                              }
                          } else {
                              break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                          }
                      }
                  }
                  this.letterMatchCounter = 0
                  this.wordCollision = false
                  this.wordPositions.actual.list[h][v].wordInOrderOld = null
                  this.wordPositions.temp.startPos.x = h
                  this.wordPositions.temp.startPos.y = v
              }
          }
          }


          this.prioIterator = 0

          if (this.wordPositions.temp.list.length == 0) {
              this.alertNoMatches();
          } else {
            this.wordPositions.actual.list = JSON.parse(JSON.stringify(this.wordPositions.temp.list[this.userIterator]))
            const startPos = this.wordPositions.temp.list[this.userIterator].startPos

            if (this.wordPositions.actual.list[startPos.y][startPos.x].wordInOrder != this.wordPositions.actual.list[startPos.y][startPos.x].wordInOrderOld) {
              this.wordPositions.actual.list[startPos.y][startPos.x].wordInOrder = JSON.parse(JSON.stringify(this.wordPositions.actual.list[startPos.y][startPos.x].wordInOrderOld))
              this.wordPositions.actual.list[startPos.y][startPos.x].wordInOrderOld = null
              this.wordInOrder--
            }
            console.log("Amount of words added: " + this.amountWordsAdded)
            console.log("wordInOrder: " + this.wordInOrder)
            this.wordInOrder++
          }
        }
      }, 
   
      confirmWord: function () {
        this.wordPositionsCopy = JSON.parse(JSON.stringify(this.wordPositions.actual.list))

        this.crosswordPackage.wordDesc[this.amountWordsAdded] = {word: this.word, desc: this.desc}
        this.amountWordsAdded++

        this.word = ""
        this.desc = ""
        console.log(this.crosswordPackage.wordDesc)
        this.enableWordButtons = false
      },

      discardWord: function () {
        this.word = ""
        this.desc = ""
        this.amountWordsAdded--
        this.wordPositions.actual.list = JSON.parse(JSON.stringify(this.wordPositionsCopy))
        this.enableWordButtons = false
      },

      testSocketSend: function () {       // Till någon: vad är detta?
        socket.on("matrixDimsTransfer", data => {
          this.matrixDims = data.matrixDims
          console.log("matrixDimsTransfer has been found")
        })
      },

      alertNoMatches: function () {
        alert("no matches! Try another word.")
      },

      confirmCreateCrossword: function () {    // JESSIE ÄNDRA
        socket.emit("emittedCrosswordPackage", {sourceName: this.sourceName,    // innehåll i paket ska ändras
                                                  wordPositionActual: this.wordPositions.actual.list,
                                                  matrixDims: this.matrixDims,
                                                  wordDescPairs: this.wordDescForPackage,
                                                  })
        console.log("i confirmCreateCrossword")
      },

      fillPositionsNull: function () {
        for (let v = 0; v < this.matrixDims.y; v++) {
            this.wordPositions.actual.list[v] = [];
            /* wordPositions = [[null, null, null, null]] */
            for (let h = 0; h < this.matrixDims.x; h++) {
            this.wordPositions.actual.list[v][h] = {letter: null, 
                                               inHorizontal: false,
                                               inVertical: false,
                                               isFirstLetter: false, 
                                               wordInOrder: this.wordInOrder,
                                               wordInOrderOld: this.wordInOrder}
            }
        }

        this.wordPositions.temp.list = []
        console.log(this.wordPositions.actual.list)
      },

      getNewTempPositionVert: function (h, v, wordSplit) {
        if (this.wordPositions.temp.list != []) {
          let newWordPositions = JSON.parse(JSON.stringify(this.wordPositions.actual.list))

          for (let i = 0; i < wordSplit.length; i++) {
              newWordPositions[v + i][h].letter = wordSplit[i]
              newWordPositions[v + i][h].inVertical = true
              if (i == 0) {
                newWordPositions[v + i][h].isFirstLetter = true
                if (newWordPositions[v][h].wordInOrder != null) {
                  newWordPositions[v][h].wordInOrderOld = JSON.parse(JSON.stringify(this.wordPositions.actual.list[v][h].wordInOrder))
                }
                newWordPositions[v + i][h].wordInOrder = JSON.parse(JSON.stringify(this.wordInOrder))
              } else {
                newWordPositions[v + i][h].isFirstLetter = false
                newWordPositions[v + i][h].wordInOrder = null
              }
          }
          return newWordPositions
        }
      },

      getNewTempPositionHoriz: function (h, v, wordSplit) {
        if (this.wordPositions.list != []) {
          let newWordPositions = JSON.parse(JSON.stringify(this.wordPositions.actual.list))

          for (let i = 0; i < wordSplit.length; i++) {
              newWordPositions[v][h + i].letter = wordSplit[i]
              newWordPositions[v][h + i].inHorizontal = true
              if (i == 0) {
                newWordPositions[v][h + i].isFirstLetter = true
                if (newWordPositions[v][h].wordInOrder != null) {
                  newWordPositions[v][h].wordInOrderOld = JSON.parse(JSON.stringify(this.wordPositions.actual.list[v][h].wordInOrder))
                }
                newWordPositions[v][h + i].wordInOrder = JSON.parse(JSON.stringify(this.wordInOrder))
              } else {
                newWordPositions[v][h + i].isFirstLetter = false
                newWordPositions[v][h + i].wordInOrder = null
              }
          }
          return newWordPositions
        }
      },

      showNextSolution: function () {

        if (this.enableWordButtons) {
          if (this.userIterator == this.matchesIterator - 1) {
            this.wordPositions.actual.list = JSON.parse(JSON.stringify(this.wordPositions.temp.list[this.userIterator]))
          } else {
            this.userIterator++
            this.wordPositions.actual.list = JSON.parse(JSON.stringify(this.wordPositions.temp.list[this.userIterator]))
          }
        }
        
      },

      showPreviousSolution: function () {
        if (this.enableWordButtons) {  
          if (this.userIterator == 0) {
            this.wordPositions.actual.list = JSON.parse(JSON.stringify(this.wordPositions.temp.list[this.userIterator]))
          } else {
            this.userIterator--
            this.wordPositions.actual.list = JSON.parse(JSON.stringify(this.wordPositions.temp.list[this.userIterator]))
          }
        }
      }
    }  
}   

</script>

<style>

button {
  width: 10rem;
  height: 4rem;
  border-radius: 15px;
  border-color: #ba0c00;
  margin: 1.5rem;
  color: white;
  background-color: #FE5F55;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 1rem;
  cursor:pointer;
  position: relative;   
}

.button-disabled {
  opacity: 30%;
  cursor: default;
  background-color: #ba0c00;
}

#descInput {
  height: 2rem;
  width: 9rem;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 1rem;
  text-align: center; 
}

#div1 {
  float: left;
  width: 25%;
  justify-content: center;
  margin-top: 5%;
}
#div2 {
  float: left;
  width: 50%;
  margin-top: 2%;
}
#div3 {
  float: left;
  width: 25%;
  justify-content: center;
  margin-top: 10%;
}

#flag {
  width: 5rem;
  height: 3.5rem;
  border-radius: 20%;
}

#help {
  height: 3rem;
  width: 3rem;
  background-color: #FFFDD0;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 30px;
  text-align: center;
  cursor:pointer;
  border-radius: 50%;
  border-color: black;
  color: black;
  position: absolute;
  top: 0;
  right:0;
  margin: 0.5rem;
}

.language{
    height: 1rem;
    width: 1rem;
    cursor:pointer;
    margin: 0.5rem;
}

.logo {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 2.5rem;
  color: white;
  padding-top:0.2em;
  text-align: center;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
}

#showSolutions {
  width: 5rem;
  height: 4.5rem;
  cursor:pointer; 
  margin: 0.5rem;
}

.solutionsWrapper{
  display: flex;
  justify-content: center;
}
 

  #wordInput {
    height: 2rem;
    width: 9rem;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 1rem;
    text-align: center; 
 }
</style>