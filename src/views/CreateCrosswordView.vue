<template>
<header>
  <div>
      <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" >
      <button v-on:click="togglePopup"></button>
      </Modal>
    </div>
</header>

<button v-on:click="this.testUserID"> test IP ID </button>

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
    
    <button v-on:click="this.findPotentialMatches">{{uiLabels.addWord}}</button> 
    <br>

    <div class="solutionsWrapper">
      <img id="showSolutions" :src="uiLabels.showPrevious" v-on:click="this.showPreviousSolution">
      <img id="showSolutions" :src="uiLabels.showNext" v-on:click="this.showNextSolution">
    </div>
    <!-- <button id="showSolutions" v-on:click="this.showPreviousSolution">{{uiLabels.showPrevious}}</button>
    <button id="showSolutions" v-on:click="this.showNextSolution">{{uiLabels.showNext}}</button> -->

    <button v-on:click="this.confirmWordPosition"> Confirm word Position  </button>


  </div>
        

    <div id="div2"> 
        <Crossword  v-bind:sourceName="sourceName"
                    v-bind:wordPositions="this.wordPositions"
                    v-bind:matrixDims="this.matrixDims">
        </Crossword>
    </div>

        
        <div id="div3">
          <!--<button v-on:click="this.emptyTextFields"> Empty Input </button> ---><!-- gör detta när användaren har valt ett ord istället för en knapp. Det rensar även textfältet -->
          <button v-on:click="this.fillPositionsNull">
            {{uiLabels.resetCrossword}}
          </button> 
          <br>

          <button v-on:click="this.confirmCreateCrossword">
            {{uiLabels.confirmCreate}}  <!--JESSIE OBS OLIKA NAMN-->
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
  
/* LOGG:

  Från tidigare:
    * Vi behöver ej göra enligt Mikaels instruktioner för att grafiken ska uppdateras löpande. Kanske behöver undersöka server-socket-kommunikation dock.
  2022-12-30: Undersök detta.

*/

  export default {
    name: 'CreateCrosswordView',
    components: {
        Crossword,
        Modal
    },
    data: function () {
      return {
        word: "",
        desc: "",
        boxes: {}, /* tänkt att innehålla information till WordBox sen */
        userIterator: 0,
        matchesIterator: 0,
        swapIterator: 0, 
        wordInOrder: 1,
        wordCollision: false,
        noMatches: false,
        matrixDims: {x: 15, y: 15},
        /* wordPositions: [], */
        wordPositions: {actual: [], temp: []},
        
        showModal: false,
        uiLabels: {},        
        lang: "en",
        sourceName: "CreateCrosswordView",

        wordDescForPackage: {} // ska ändras
      }
    },
    created: function () {
      socket.emit('pageLoaded')
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
    /* FÖR ATT FÅ FRAM POP-UP RUTA*/
      togglePopup: function () {
        this.showModal = ! this.showModal;
      },
      testUserID: function () {
        console.log(this.$getIPAddress)
      },
      findPotentialMatches: function () {
        if (this.word != "") {
        
          this.matchesIterator = 0;
          this.userIterator = 0;
          this.swapIterator = 0;
          let word = this.word.toUpperCase();                 /* för att spara plats längre ner */
          let wordSplit = word.split("");
          console.log("wordSplit = " + wordSplit);
          const horiz = this.matrixDims.x; /* för att spara plats längre ner */
          const vert = this.matrixDims.y;    /* för att spara plats längre ner */



          for (let h = 0; h < horiz; h++) {
            /* console.log("kommit in? horisontellt") */
          for (let v = 0; v < vert; v++) {
            /* console.log("kommit in? vertikalt") */
              if (this.wordPositions.actual[v][h].letter === wordSplit[0] || this.wordPositions.actual[v][h].letter === null) {

                  /* console.log("har kommit förbi bokstavskoll") */
                  
                  if (wordSplit.length <= vert - v) { /* FÅR PLATS VERTIKALT? */

                    /* console.log("har kommit förbi få-plats-koll") */
                      for (let iv = 0; iv < wordSplit.length; iv++) {
                          
                          /* console.log("h = " + h + ", v = " + v + ", this.matchesIterator = " + this.matchesIterator) */
                          
                          if ((this.wordPositions.actual[v + iv][h].letter === wordSplit[iv]) || (this.wordPositions.actual[v + iv][h].letter === null)) { /* räcker med att spara första och sista positionen för ordet! */

                            if (this.wordPositions.actual[v + iv][h].letter === wordSplit[iv]) {
                              this.wordCollision = true
                            }

                            console.log("h = " + h)
                            console.log("v = " + v)
                            console.log("iv = " + iv)
                            console.log("matchesIterator = " + this.matchesIterator)
                            console.log(this.wordPositions.actual)
                            console.log("värde på positionen: " + this.wordPositions.actual[v + iv][h].letter)
                              
                            if (iv == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */

                              console.log("Good Match Found (vertical). Starting at h = " + h + ", and v = " + v)
                              
                              
                              console.log("this.getNewTempPositionVert(h, v, wordSplit)) --- ")
                              console.log(this.getNewTempPositionVert(h, v, wordSplit))
                            
                              if (this.wordCollision) {
                                this.wordPositions.temp.splice(this.swapIterator, 0, this.getNewTempPositionVert(h, v, wordSplit))
                                /* [this.wordPositions.temp[this.matchesIterator], this.wordPositions.temp[this.swapIterator]] = 
                                [this.wordPositions.temp[this.swapIterator], this.wordPositions.temp[this.matchesIterator]] */
                                this.swapIterator++
                                this.wordCollision = false
                              } else {
                                this.wordPositions.temp[this.matchesIterator] = this.getNewTempPositionVert(h, v, wordSplit)
                              }
                                
                              console.log("this.wordPositions.actual --- ")
                              console.log(this.wordPositions.actual)

                              console.log("this.wordPositions.temp[this.matchesIterator] --- ")
                              console.log(this.wordPositions.temp[this.matchesIterator])

                              this.matchesIterator++;
                              console.log("matchesIterator increased to: " + this.matchesIterator)

                              /* this.wordInOrder++
                              console.log("Amount of words added: " + this.wordInOrder) */
                            }
                          } else {
                            break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                          }
                      }
                  }
                  if (wordSplit.length <= horiz - h) { /* FÅR PLATS HORISONTELLT? */
                      
                    for (let ih = 0; ih < wordSplit.length; ih++) {

                          if ((this.wordPositions.actual[v][h + ih].letter === wordSplit[ih]) || (this.wordPositions.actual[v][h + ih].letter === null)) { /* räcker med att spara första och sista positionen för ordet! */
                            
                            if (this.wordPositions.actual[v][h + ih].letter === wordSplit[ih]) {
                              this.wordCollision = true
                            }

                            console.log("h = " + h)
                            console.log("v = " + v)
                            console.log("ih = " + ih)
                            console.log("matchesIterator = " + this.matchesIterator)
                            console.log(this.wordPositions.actual)
                            console.log("värde på positionen: " + this.wordPositions.actual[v][h + ih].letter)

                            if (ih == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */

                              console.log("Good Match Found (horizontal). Starting at h = " + h + ", and v = " + v)

                              this.wordPositions.temp[this.matchesIterator] = this.getNewTempPositionHoriz(h, v, wordSplit)
                              console.log("this.getNewTempPositionHoriz(h, v, wordSplit)) --- ")
                              console.log(this.getNewTempPositionHoriz(h, v, wordSplit))

                              if (this.wordCollision) {
                                this.wordPositions.temp.splice(this.swapIterator, 0, this.getNewTempPositionHoriz(h, v, wordSplit))
                                /* [this.wordPositions.temp[this.matchesIterator], this.wordPositions.temp[this.swapIterator]] = 
                                [this.wordPositions.temp[this.swapIterator], this.wordPositions.temp[this.matchesIterator]] */
                                this.swapIterator++
                                this.wordCollision = false
                              } else {
                                this.wordPositions.temp[this.matchesIterator] = this.getNewTempPositionHoriz(h, v, wordSplit)
                              }
                            
                              console.log("this.wordPositions.actual --- ")
                              console.log(this.wordPositions.actual)

                              console.log("this.wordPositions.temp[this.matchesIterator] --- ")
                              console.log(this.wordPositions.temp[this.matchesIterator])

                              /* this.wordPositions.temp.push(this.getNewTempPositionHoriz(h, v, wordSplit)) */
                              this.matchesIterator++
                              console.log("matchesIterator increased to: " + this.matchesIterator)

                              /* this.wordInOrder++
                              console.log("Amount of words added: " + this.wordInOrder) */
                              }
                          } else {
                              break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                          }
                      }
                  }
              }
          }
          }

          if (this.wordPositions.temp.length == 0) {
              this.alertNoMatches();
          } else {
            this.wordPositions.actual = JSON.parse(JSON.stringify(this.wordPositions.temp[this.userIterator]))
           this.wordInOrder++
            console.log("Amount of words added: " + this.wordInOrder)
  
          }
        }
      }, 
      getPositions: function (word, h, v, horizontal) { /* används ej */
        let pos = {};

        if (horizontal) {
            for (let i = 0; i < word.length; i++) {
                pos = Object.assign(pos, {i: {x: h + i, y: v}
              })   
            }
        } else {
            for (let i = 0; i < word.length; i++) {
                pos = Object.assign(pos, {i: {x: h, y: v + i}
              })
            }
        }
        return pos;
      },
      testSocketSend: function () {
        socket.on("matrixDimsTransfer", data => {
          this.matrixDims = data.matrixDims
          console.log("matrixDimsTransfer has been found")
        })
      },
      alertNoMatches: function () {
        alert("no matches! Try another word.")
      },
      confirmNewWord: function () {
        socket.emit("updateGrid", this.tempWordObjects, this.matchesIterator) /* Hur ska vi låta användaren iterera över alla möjliga positioner? */
      },

      fillPositionsNull: function () {
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
      getNewTempPositionVert: function (h, v, wordSplit) {
        if (this.wordPositions.temp != []) {
          let newWordPositions = JSON.parse(JSON.stringify(this.wordPositions.actual))

          console.log("inside of vertical func")

          for (let i = 0; i < wordSplit.length; i++) {
              newWordPositions[v + i][h].letter = wordSplit[i]
              newWordPositions[v + i][h].inVertical = true
              if (i == 0) {
                newWordPositions[v + i][h].isFirstLetter = true
                newWordPositions[v + i][h].wordInOrder = JSON.parse(JSON.stringify(this.wordInOrder))
              } else {
                newWordPositions[v + i][h].isFirstLetter = false
                newWordPositions[v + i][h].wordInOrder = null
              }
          }

          console.log("From getNewTempPositionVert, newWordPositions: ")
          console.log(newWordPositions)
          return newWordPositions
        }
      },
      getNewTempPositionHoriz: function (h, v, wordSplit) {
        if (this.wordPositions != []) {
          let newWordPositions = JSON.parse(JSON.stringify(this.wordPositions.actual))

          console.log("inside of horizontal func")

          for (let i = 0; i < wordSplit.length; i++) {
              newWordPositions[v][h + i].letter = wordSplit[i]
              newWordPositions[v][h + i].inHorizontal = true
              if (i == 0) {
                newWordPositions[v][h + i].isFirstLetter = true
                newWordPositions[v][h + i].wordInOrder = JSON.parse(JSON.stringify(this.wordInOrder))
              } else {
                newWordPositions[v][h + i].isFirstLetter = false
                newWordPositions[v][h + i].wordInOrder = null
              }
          }

          console.log("From getNewTempPositionHoriz, newWordPositions: ")
          console.log(newWordPositions)
          return newWordPositions
        }

      },
      showNextSolution: function () {
        if (this.userIterator == this.matchesIterator - 1) {
          this.wordPositions.actual = JSON.parse(JSON.stringify(this.wordPositions.temp[this.userIterator]))
        } else {
          this.userIterator++
          this.wordPositions.actual = JSON.parse(JSON.stringify(this.wordPositions.temp[this.userIterator]))
        }
      },
      showPreviousSolution: function () {
        if (this.userIterator == 0) {
          this.wordPositions.actual = JSON.parse(JSON.stringify(this.wordPositions.temp[this.userIterator]))
        } else {
          this.userIterator--
          this.wordPositions.actual = JSON.parse(JSON.stringify(this.wordPositions.temp[this.userIterator]))
        }
      },

      confirmWordPosition: function () { // lagrar orden och beskrivningarna som vi vill skicka när vi trycker på confirmCreate
        this.wordDescForPackage[this.word] = this.desc;     

        this.word = ""    
        this.desc = ""

        console.log("Lista med words och desc som confirmats är:")
        console.log(this.wordDescForPackage) // för att se om det är problem med alias när word och desc clearas
      },

      confirmCreateCrossword: function () {    //skickar ETT färdigt korsord som lagras i lista blad alla andra skickade korsord i server
        socket.emit("emittedCrosswordPackage", {sourceName: this.sourceName,    // innehåll i paket ska ändras
                                                  wordPositionActual: this.wordPositions.actual,
                                                  matrixDims: this.matrixDims,
                                                  wordDescPairs: this.wordDescForPackage,
                                                  })  
        console.log("i confirmCreateCrossword")
      },
    }  
}   

</script>

<style>
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

.language{
    height: 1rem;
    width: 1rem;
    cursor:pointer;
    margin: 0.5rem;
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

.logo {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  font-size: 2.5rem;
  color: white;
  padding-top:0.2em;
  text-align: center;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
}
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
  .solutionsWrapper{
    display: flex;
    justify-content: center;
  }
  #showSolutions {
    width: 5rem;
    height: 4.5rem;
    cursor:pointer; 
    margin: 0.5rem;
  }

  #wordInput {
    height: 2rem;
    width: 9rem;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 1rem;
    text-align: center; 
 }

  #descInput {
    height: 2rem;
    width: 9rem;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 1rem;
    text-align: center; 
  }
</style>