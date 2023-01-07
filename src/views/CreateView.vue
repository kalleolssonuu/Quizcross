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
     
        <input v-if="this.lang == 'en'" type="text" id="wordInput" v-model="word" required="required" placeholder="Enter a word...">
        <input v-else type="text" id="wordInput" v-model="word" required="required" placeholder="Ge ett ord... ">
      </div>
      <br>
  
      <div class="inputField" style="display: inline-block">
     
          <input v-if="this.lang == 'en'" type="text"  id="wordInput" v-model="desc" required="required" placeholder="Enter a description... ">
          <input v-else type="text" id="wordInput" v-model="desc" required="required" placeholder="Ge en beskrivning... ">
      </div>
      <br>
      
      <button v-if="this.enableWordButtons || this.word =='' || this.desc==''"  class="standardButton disabled" disabled> {{uiLabels.addWord}} </button>
      <button v-else v-on:click="this.findPotentialMatches" class="standardButton"> {{uiLabels.addWord}} </button>
      <!-- <button v-on:click="this.findPotentialMatches">{{uiLabels.addWord}}</button>  -->
      <br>
  
      <div class="solutionsWrapper">
        <img id="showSolutions" :src="uiLabels.showPrevious" v-on:click="this.showPreviousSolution">
        <img id="showSolutions" :src="uiLabels.showNext" v-on:click="this.showNextSolution">
      </div>
      
      <button v-if="!this.enableWordButtons" class="standardButton disabled"  disabled style="width: 6rem;"> {{uiLabels.discard}} </button>
      <button v-else v-on:click="this.discardWord" class="standardButton" style="width: 6rem;"> {{uiLabels.discard}} </button>

      <button v-if="!this.enableWordButtons" class="standardButton disabled"  disabled style="width: 6rem;"> {{uiLabels.confirm}} </button>
      <button v-else v-on:click="this.confirmWord" class="standardButton" style="width: 6rem;"> {{uiLabels.confirm}} </button>
   
    </div>
          
      <!-- JESSIE FRÅGA:VAR ÄR matrixdims i vitt ovanför korsord???? -->
      <div id="div2"> 
          <Crossword  v-bind:sourceName="sourceName"
                      v-bind:crossword="this.crossword.actual.posList"
                      v-bind:matrixDims="this.matrixDims">
          </Crossword>
      </div>
  
          
          <div id="div3">
            <!--<button v-on:click="this.emptyTextFields"> Empty Input </button> ---><!-- gör detta när användaren har valt ett ord istället för en knapp. Det rensar även textfältet -->
            <button class="standardButton" v-on:click="this.resetData">
              {{uiLabels.resetCrossword}}
            </button> 
            <br>
            
            <button class="standardButton" v-on:click="this.confirmCreateCrossword" @click="$router.push('/Lobby/'+lang)"> <!-- JESSIE ÄNDRA SKICKA MED ID?????? -->
            {{uiLabels.confirmCreate}}   
            </button>

            <button class="standardButton"  @click="$router.push('/Lobby/'+lang)"> 
            {{uiLabels.QuitGame}} 
            </button>

          </div>
          <br>
          
          <!-- JESSIE FRÅGA: varför denna? -->
          Iterator: {{ this.userIterator }}  
  
  </template>
    
  <script>
    import Crossword from '../components/Crossword.vue'
    import Modal from '../components/PopUp.vue'
    import io from 'socket.io-client';   
  
    const socket = io();
   /*  const initialData = {  // JESSIE FRÅGA: Ok att ta bort allt detta?
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
      crossword: {actual.posList: [], temp: []},
      crosswordCopy: [],
      crosswordPackage: {crosswordName: "", 
                          crossword: [],
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
    - Lilla siffran blir fel vid genomgång av crossword.temp
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
          amountWordsAdded: 1,
          letterMatchCounter: 0,
  
          enableWordButtons: false,
          wordCollision: false,
          noMatches: false,
  
          matrixDims: {},

          crossword: {actual: {posList: [], 
                                   startPos: {x: 0, 
                                              y: 0
                                             }
                                  },
                          temp: []
                         },
          crosswordCopy: [],
          crosswordPackage: {crosswordName: "", 
                             crossword: [],
                             wordDesc: [],
                             matrixDims: {},
                             },
  
          showModal: false,
          uiLabels: {},
          
          gameID:"",
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
        this.fillPositionsNull()  
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
  
        findPotentialMatches: function () { // JESSIE FRÅGA: ha kvar kommentarer i längre algoritmer eller ta bort?
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
  
            this.crosswordCopy = JSON.parse(JSON.stringify(this.crossword.actual.posList))
            
  
            for (let h = 0; h < horiz; h++) {
            for (let v = 0; v < vert; v++) {
  
                if (this.crossword.actual.posList[v][h].letter === wordSplit[0] || this.crossword.actual.posList[v][h].letter === null) {
  
                    if (wordSplit.length <= vert - v) { /* FÅR PLATS VERTIKALT? */
                        /* h = 1, v = 0 */
                        for (let iv = 0; iv < wordSplit.length; iv++) {
  
                            if ((this.crossword.actual.posList[v + iv][h].letter === wordSplit[iv]) || (this.crossword.actual.posList[v + iv][h].letter === null)) { /* räcker med att spara första och sista positionen för ordet! */
  
                              if (this.crossword.actual.posList[v + iv][h].letter === wordSplit[iv]) {
                                this.wordCollision = true
                                this.letterMatchCounter++
                              }
  
                              if (iv == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */                            
                                if (this.letterMatchCounter != wordSplit.length) {
                                  if (this.wordCollision) {
                                    console.log("lägger till prio. h = " + h + ", v = " + v + ", prioIterator = " + this.prioIterator)
                                    this.crossword.temp.splice(this.prioIterator, 0, this.getNewTempPositionVert(h, v, wordSplit))
                                    this.prioIterator++
  
                                  } else {
                                    this.crossword.temp[this.matchesIterator] = this.getNewTempPositionVert(h, v, wordSplit)
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
  
                            if ((this.crossword.actual.posList[v][h + ih].letter === wordSplit[ih]) || (this.crossword.actual.posList[v][h + ih].letter === null)) { /* räcker med att spara första och sista positionen för ordet! */
                              
                              if (this.crossword.actual.posList[v][h + ih].letter === wordSplit[ih]) {
                                this.wordCollision = true
                                this.letterMatchCounter++
                              }
  
                              if (ih == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */
  
                                if (this.letterMatchCounter != wordSplit.length) {
                                  if (this.wordCollision) {
                                    console.log("lägger till prio. h = " + h + ", v = " + v + ", prioIterator = " + this.prioIterator)
                                    this.crossword.temp.splice(this.prioIterator, 0, this.getNewTempPositionHoriz(h, v, wordSplit))
                                    this.prioIterator++
  
                                  } else {
                                    this.crossword.temp[this.matchesIterator] = this.getNewTempPositionHoriz(h, v, wordSplit)
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
                    this.crossword.actual.posList[h][v].wordInOrderOld = null
                    this.crossword.temp[this.matchesIterator-1].startPos.x = h
                    this.crossword.temp[this.matchesIterator-1].startPos.y = v
                }
            }
            }
  
  
            this.prioIterator = 0
  
            if (this.crossword.temp.length == 0) {
                this.alertNoMatches();
            } else {
              this.crossword.actual.posList = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].posList))
              const startPos = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].startPos))
              console.log("startPos.x = " + String(startPos.x) + String(startPos.y))
              console.log("word in order på startpos: " + this.crossword.actual.posList[startPos.y][startPos.x].wordInOrder)
              
              if (this.crossword.actual.posList[startPos.y][startPos.x].wordInOrder != this.wordInOrder &&
                  this.crossword.actual.posList[startPos.y][startPos.x].wordInOrder != null) {

                    
                this.crossword.actual.posList[startPos.y][startPos.x].wordInOrder = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].posList[startPos.y][startPos.x].wordInOrder))
                this.wordInOrder--
                console.log("wordInOrder subtraheras till: " + this.wordInOrder)
              }
              console.log("Amount of words added: " + this.amountWordsAdded)
              console.log("wordInOrder: " + this.wordInOrder)
              this.wordInOrder++
            }
          }
          console.log(this.crossword.actual.posList)
        }, 
     
        confirmWord: function () {
          const audio = new Audio("https://audio-previews.elements.envatousercontent.com/files/317218604/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22MQR9VVH-confirm-pop.mp3%22")
          audio.play()
          this.crosswordCopy = JSON.parse(JSON.stringify(this.crossword.actual.posList))
  
          this.crosswordPackage.wordDesc[this.amountWordsAdded] = {word: this.word, desc: this.desc}
          this.amountWordsAdded++
  
          this.word = ""
          this.desc = ""
          console.log(this.crosswordPackage.wordDesc)
          this.enableWordButtons = false
        },
  
        discardWord: function () {
          const audio = new Audio("https://audio-previews.elements.envatousercontent.com/files/145365988/preview.mp3?response-content-disposition=attachment%3B+filename%3D%222Y687H5-throwing-garbage-in-garbage-can-2.mp3%22")
          audio.play()
          this.word = ""
          this.desc = ""
          this.amountWordsAdded--
          this.wordInOrder--
          this.crossword.actual.posList = JSON.parse(JSON.stringify(this.crosswordCopy))
          this.enableWordButtons = false
        },     
  
        alertNoMatches: function () {
          alert("no matches! Try another word.")
        },
  
        confirmCreateCrossword: function () {  
         this.crosswordPackage.crosswordName = this.gameID
         this.crosswordPackage.crossword = this.crossword.actual.posList
         this.crosswordPackage.matrixDims = this.matrixDims         
          socket.emit("createdCrosswordPackage", this.crosswordPackage)
         },
  
        fillPositionsNull: function () {
          for (let v = 0; v < this.matrixDims.y; v++) {
              this.crossword.actual.posList[v] = [];
              /* crossword = [[null, null, null, null]] */
              for (let h = 0; h < this.matrixDims.x; h++) {
              this.crossword.actual.posList[v][h] = {letter: null, 
                                                 inHorizontal: false,
                                                 inVertical: false,
                                                 isFirstLetter: false, 
                                                 wordInOrder: null,
                                                 isOccupied: false}
              }
          }
  
          this.crossword.temp = []
          console.log(this.crossword.actual.posList)
        },
  
        getNewTempPositionVert: function (h, v, wordSplit) {
          if (this.crossword.temp != []) {
            let newCrossword = {posList: JSON.parse(JSON.stringify(this.crossword.actual.posList)), startPos: {x: h, y: v}}
  
            for (let i = 0; i < wordSplit.length; i++) {
                newCrossword.posList[v + i][h].letter = wordSplit[i]
                newCrossword.posList[v + i][h].inVertical = true
                if (i == 0) {
                  newCrossword.posList[v][h].isFirstLetter = true
                  if (newCrossword.posList[v][h].wordInOrder != null) {
                    newCrossword.posList[v][h].wordInOrder = JSON.parse(JSON.stringify(this.crossword.actual.posList[v][h].wordInOrder))
                  } else {
                    newCrossword.posList[v][h].wordInOrder = JSON.parse(JSON.stringify(this.wordInOrder))
                  }
                } else {
                  newCrossword.posList[v + i][h].isFirstLetter = false
                  newCrossword.posList[v + i][h].wordInOrder = null
                }
            }
            return newCrossword
          }
        },
  
        getNewTempPositionHoriz: function (h, v, wordSplit) {
          if (this.crossword.posList != []) {
            let newCrossword = {posList: JSON.parse(JSON.stringify(this.crossword.actual.posList)), startPos: {x: h, y: v}}
  
            for (let i = 0; i < wordSplit.length; i++) {
              newCrossword.posList[v][h + i].letter = wordSplit[i]
              newCrossword.posList[v][h + i].inHorizontal = true
                if (i == 0) {
                  newCrossword.posList[v][h + i].isFirstLetter = true
                  if (newCrossword.posList[v][h].wordInOrder != null) {
                    newCrossword.posList[v][h].wordInOrder = JSON.parse(JSON.stringify(this.crossword.actual.posList[v][h].wordInOrder))
                  } else {
                    newCrossword.posList[v][h].wordInOrder = JSON.parse(JSON.stringify(this.wordInOrder))
                  }
                } else {
                  newCrossword.posList[v][h + i].isFirstLetter = false
                  newCrossword.posList[v][h + i].wordInOrder = null
                }
            }
            return newCrossword
          }
        },
  
        showNextSolution: function () {  
          if (this.enableWordButtons) {
            if (this.userIterator == this.matchesIterator - 1) {
              this.crossword.actual.posList = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].posList))
            } else {
              this.userIterator++
              this.crossword.actual.posList = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].posList))
            }
          }
          
        },
  
        showPreviousSolution: function () {
          if (this.enableWordButtons) {  
            if (this.userIterator == 0) {
              this.crossword.actual.posList = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].posList))
            } else {
              this.userIterator--
              this.crossword.actual.posList = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].posList))
            }
          }
        }
      }  
  }   
  
  </script>
  
  <style>
  
  .standardButton{
    width: 10rem;
    height: 4rem;
    border-radius: 15px;
    border-color: #ba0c00;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    margin-left: 0.5rem;
    color: white;
    background-color: #FE5F55;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 1rem;
    cursor:pointer;
    position: relative;   
  }
  .standardButton:hover{
    opacity: 0.80;
  }
  
  .standardButton.disabled {
    opacity: 30%;
    cursor: default;
    background-color: #ba0c00;
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
    width: 15%;
    height: 25rem;
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
    background-color: #FE5F55;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 1rem;
    cursor:pointer;
    position: relative;   
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
      height: 3rem;
      width: 12rem;
      text-align: center; 
      font-family: "Comic Sans MS", "Comic Sans", cursive;
      font-size: 1rem;
      border-radius: 1rem;
      margin-top: 0.5rem
    
   }
  </style>