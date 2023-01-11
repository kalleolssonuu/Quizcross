<template>
  <header>
    <div>
        <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" style="position: fixed">
          <button v-on:click="togglePopup"></button>
        </Modal>
      </div>
  </header>
  <meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  
  <meta name="viewport" content="width=device-width, initial-scale=1">
<!-- HÄMTAR IKONEN FÖR DESC POP UP -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  
  <div id="inputFieldWrapper">
            
      <div class="inputField"> <!-- måste emitta word så att vi kan använda -->
     
        <input v-if="this.lang == 'en'" type="text" id="wordInput" v-model="word" required="required" placeholder="Enter a word...">
        <input v-else type="text" id="wordInput" v-model="word" required="required" placeholder="Ge ett ord... ">


      </div>
      <br>

  <!-- style="display: inline-block" behövs denna i klassen nedan?-->
      <div class="inputField" style="margin-left: 2.3vw">
     
          <input v-if="this.lang == 'en'" type="text"  id="wordInput" v-model="desc" required="required" placeholder="Enter a description... ">
          <input v-else type="text" id="wordInput" v-model="desc" required="required" placeholder="Ge en beskrivning... ">
          <button class="descPopUp" v-on:click="togglePopupDescription"> 
              <i class="fa fa-bars"></i>
            </button>
      </div>
      <br>
      
      <button v-if="this.enableWordButtons || this.word =='' || this.desc==''"  class="standardButton disabled" disabled> {{uiLabels.addWord}} </button>
      <button v-else v-on:click="this.findPotentialMatches" class="standardButton"> {{uiLabels.addWord}} </button>
      <!-- <button v-on:click="this.findPotentialMatches">{{uiLabels.addWord}}</button>  -->
      <br>
  
      <div class="solutionsWrapper">
        <div id="wordPlacement">
          {{uiLabels.wordPlacement}}
        </div>
        <div id="placementArrows">
            <img id="showSolutions" :src="uiLabels.showPrevious" v-on:click="this.showPreviousSolution">
            <img id="showSolutions" :src="uiLabels.showNext" v-on:click="this.showNextSolution">
        </div>

        <div id="confirmDiscardButtons">
          <button v-if="!this.enableWordButtons" class="standardButton disabled"  disabled style="width: 7vw;"> {{uiLabels.discard}} </button>
          <button v-else v-on:click="this.discardWord" class="standardButton" style="width: 7vw;"> {{uiLabels.discard}} </button>

          <button v-if="!this.enableWordButtons" class="standardButton disabled" disabled style="width: 7vw;"> {{uiLabels.confirm}} </button>
          <button v-else v-on:click="this.confirmWord" class="standardButton" style="width: 7vw;"> {{uiLabels.confirm}} </button>
        </div>
      </div>
      
      
   
    </div>
          
      <div id="div4"> 
          <Crossword  v-bind:sourceName="sourceName"
                      v-bind:crossword="this.crossword.actual.posList"
                      v-bind:cellsAmount="this.cellsAmount">
          </Crossword>
      </div>
      
          
          <div id="div5">
            <button v-if="!this.enableCreateButton" class="standardButton disabled" v-on:click="this.confirmCreateCrossword" @click="$router.push('/Lobby/'+lang)">{{uiLabels.createCrossword}}</button>
            <button v-else class="standardButton" v-on:click="this.confirmCreateCrossword" @click="$router.push('/Lobby/'+lang)">{{uiLabels.createCrossword}}</button>
            <br>
            <!--<button v-on:click="this.emptyTextFields"> Empty Input </button> ---><!-- gör detta när användaren har valt ett ord istället för en knapp. Det rensar även textfältet -->
            <button class="standardButton" v-on:click="this.resetData">
              <i class="fa fa-trash-o" style="font-size:3vw;color:white"></i> <br>
              <text style="font-size: 1.2vw">{{uiLabels.resetCrossword}}</text>
            </button> 
            <br>

          </div>
          <br>
          <HomepageButton v-bind:uiLabels="uiLabels" v-bind:lang="lang"></HomepageButton>

          <!--Popup för beskrivningar till ord på ett knapptryck (knapp har label, starta om server)-->
          <div class="modalDescription">
              <div class="overlay" v-if="showModalDescription"
                  @click="showModalDescription=false">
              </div>
              <div class="modal" v-if="showModalDescription">
                  <div class ="wordDescriptionWrapper"> 
        
        <div id="horizontalDescriptions">
  
            <div id="wordDescTop">{{uiLabels.horizontalWords}}</div>
            <div id="orderedList"  class="scroll">
              <ul style="list-style: none;">
                <li v-for="(value, key) in this.getSortedDescs()" :key="key">
                  <span v-if="value.direction == 'Horizontal'">
                    {{ value.wordInOrder + ". " + value.desc }}
                  </span>
                  <span v-else style="display: none;">
                  </span>
                </li>
              </ul>
            </div>
  
        </div>
  
  
  
        <div id="verticalDescriptions">
  
          <div id="wordDescTop">{{uiLabels.verticalWords}}</div>
          <div id="orderedList"  class="scroll">
            <ul style="list-style: none;">
              <li v-for="(value, key) in this.getSortedDescs()" :key="key">
                <span v-if="value.direction == 'Vertical'">
                  {{ value.wordInOrder + ". " + value.desc }}
                </span>
                <span v-else style="visibility: hidden;">
                </span>
              </li>
            </ul>
          </div>
        </div>
  
    </div>
                  <button class="close" @click="showModalDescription = false">x</button>
              </div>
          </div>
          
  </template>
    
  <script>
    import Crossword from '../components/Crossword.vue'
    import Modal from '../components/PopUp.vue'
    import io from 'socket.io-client';   
    import HomepageButton from '../components/HomepageComponent.vue'
  
    const socket = io();
  
    export default {
      name: 'CreateView',
      components: {
          Crossword,
          Modal,
          HomepageButton
      },
      data: function () {
        return {
          word: "",
          desc: "",
  
          userIterator: 0,
          matchesIterator: 0,
          prioIterator: 0, 
          wordInOrder: 1,
          amountWordsAdded: 0,
          letterMatchCounter: 0,
  
          enableWordButtons: false,
          enableCreateButton: false,
          wordCollision: false,
          noMatches: false,
  
          cellsAmount: 8,

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
                             wordDesc: [],    /* används till beskrivningsmeny till höger i PlayView */
                             cellsAmount: 8,
                             },
  
          showModal: false,
          showModalDescription: false,
          uiLabels: {},
          
          gameID:"",
          lang: "",  
          sourceName: "CreateView",
      }
    },
    created: function () {
      this.lang = this.$route.params.lang;
      this.gameID = this.$route.params.gameID;
      this.cellsAmount = JSON.parse(this.$route.params.cellsAmount);

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
        togglePopupDescription: function () {
          this.showModalDescription = ! this.showModalDescription;
        },
    
        resetData: function () {
          location.reload()
        },

        getSortedDescs: function () {
            return this.crosswordPackage.wordDesc.sort((a, b) => a.wordInOrder - b.wordInOrder)
          },
  
        findPotentialMatches: function () { // JESSIE FRÅGA: ha kvar kommentarer i längre algoritmer eller ta bort?
        
          this.crossword.temp = []

          this.matchesIterator = 0;
          this.userIterator = 0;
          this.swapIterator = 0;

          let word = this.word.toUpperCase();                 /* för att spara plats längre ner */
          let wordSplit = word.split("");
          console.log("wordSplit = " + wordSplit);
          const horiz = this.cellsAmount; /* för att spara plats längre ner */
          const vert = this.cellsAmount;    /* för att spara plats längre ner */

          this.crosswordCopy = JSON.parse(JSON.stringify(this.crossword.actual.posList))
          

          for (let h = 0; h < horiz; h++) {
          for (let v = 0; v < vert; v++) {

              if (this.crossword.actual.posList[v][h].letter === wordSplit[0] || this.crossword.actual.posList[v][h].letter === null) {

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
                          this.crossword.temp[this.matchesIterator].startPos.x = h
                          this.crossword.temp[this.matchesIterator].startPos.y = v
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
                              this.crossword.temp[this.matchesIterator].startPos.x = h
                              this.crossword.temp[this.matchesIterator].startPos.y = v
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

              }
          }
          } /* alla positioner-loopen: slut */

          this.prioIterator = 0

          if (this.crossword.temp.length == 0) {
            this.alertNoMatches();
            this.word = ""
            this.desc = ""
          } else {
            this.enableWordButtons = true

            console.log("this.matchesIterator = " + this.matchesIterator)
            this.crossword.actual.posList = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].posList))  /* visa första matchningen */
            this.crossword.actual.startPos = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].startPos))
          }
          console.log(this.crossword.actual.posList)
        }, 
     
        confirmWord: function () {
          const audio = new Audio("https://audio-previews.elements.envatousercontent.com/files/317218604/preview.mp3?response-content-disposition=attachment%3B+filename%3D%22MQR9VVH-confirm-pop.mp3%22")
          audio.play()

          this.crosswordCopy = JSON.parse(JSON.stringify(this.crossword.actual.posList))
          const startPos = JSON.parse(JSON.stringify(this.crossword.temp[this.userIterator].startPos))

          /* actual.startPos */

          console.log("---- INNE I CONFIRM ----")
          console.log("Kopians wordInOrder på positionen: " + this.crosswordCopy[startPos.y][startPos.x].wordInOrder)
          console.log("Actuals wordInOrder på positionen: " + this.crossword.actual.posList[startPos.y][startPos.x].wordInOrder)

          if (this.crosswordCopy[startPos.y][startPos.x].wordInOrder != this.wordInOrder &&
                this.crossword.actual.posList[startPos.y][startPos.x].wordInOrder != null) {

              this.crossword.actual.posList[startPos.y][startPos.x].wordInOrder = this.crosswordCopy[startPos.y][startPos.x].wordInOrder
            } else {
              this.crossword.actual.posList[startPos.y][startPos.x].wordInOrder = this.wordInOrder
              this.wordInOrder++
          }

          this.crosswordPackage.wordDesc[this.amountWordsAdded] = 
          {word: this.word, desc: this.desc, wordInOrder: this.crossword.actual.posList[startPos.y][startPos.x].wordInOrder, 
            startPos: startPos, direction: this.crossword.actual.posList[startPos.y][startPos.x].isHorizontalWord ? "Horizontal" : "Vertical"}

          this.amountWordsAdded++
          this.word = ""
          this.desc = ""
          this.enableWordButtons = false
          this.enableCreateButton = true

          console.log(this.crosswordPackage.wordDesc)
        },
  
        discardWord: function () {
          const audio = new Audio("https://audio-previews.elements.envatousercontent.com/files/145365988/preview.mp3?response-content-disposition=attachment%3B+filename%3D%222Y687H5-throwing-garbage-in-garbage-can-2.mp3%22")
          audio.play()
          this.word = ""
          this.desc = ""

          this.crossword.actual.posList = JSON.parse(JSON.stringify(this.crosswordCopy))
          this.enableWordButtons = false
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
        },
  
        alertNoMatches: function () {
          alert("No matches! Try another word.")
        },
  
        confirmCreateCrossword: function () {  
         this.crosswordPackage.crosswordName = this.gameID
         this.crosswordPackage.crossword = this.crossword.actual.posList
         this.crosswordPackage.cellsAmount = this.cellsAmount
          socket.emit("createdCrosswordPackage", this.crosswordPackage)
        },
  
        fillPositionsNull: function () {
          for (let v = 0; v < this.cellsAmount; v++) {
              this.crossword.actual.posList[v] = [];
              /* crossword = [[null, null, null, null]] */
              for (let h = 0; h < this.cellsAmount; h++) {
              this.crossword.actual.posList[v][h] = {letter: null, 
                                                 inHorizontal: false,
                                                 inVertical: false,
                                                 isFirstLetter: false, 
                                                 wordInOrder: null,
                                                 isOccupied: false,
                                                 isHorizontalWord: false}
              }
          }
  
          this.crossword.temp = []
          console.log(this.crossword.actual.posList)
        },
  
        getNewTempPositionVert: function (h, v, wordSplit) {
          if (this.crossword.temp != []) {
            let newTempCrossword = {posList: JSON.parse(JSON.stringify(this.crossword.actual.posList)), startPos: {x: h, y: v}}
  
            for (let i = 0; i < wordSplit.length; i++) {
                newTempCrossword.posList[v + i][h].letter = wordSplit[i]
                newTempCrossword.posList[v + i][h].inVertical = true
                if (i == 0) {
                  newTempCrossword.posList[v][h].isFirstLetter = true
                  newTempCrossword.posList[v][h].isHorizontalWord = false

                  if (newTempCrossword.posList[v][h].wordInOrder == null) {
                    newTempCrossword.posList[v][h].wordInOrder = JSON.parse(JSON.stringify(this.wordInOrder))
                  } else {
                    newTempCrossword.posList[v][h].wordInOrder = JSON.parse(JSON.stringify(this.crossword.actual.posList[v][h].wordInOrder))
                  }

                } else {
                  /* newTempCrossword.posList[v + i][h].isFirstLetter = false */
                  /* newTempCrossword.posList[v + i][h].wordInOrder = null */
                }
            }
            return newTempCrossword
          }
        },
  
        getNewTempPositionHoriz: function (h, v, wordSplit) {
          if (this.crossword.posList != []) {
            let newTempCrossword = {posList: JSON.parse(JSON.stringify(this.crossword.actual.posList)), startPos: {x: h, y: v}} /* h 0 v 2 */
  
            for (let i = 0; i < wordSplit.length; i++) {
              newTempCrossword.posList[v][h + i].letter = wordSplit[i]
              newTempCrossword.posList[v][h + i].inHorizontal = true
                if (i == 0) {
                  newTempCrossword.posList[v][h + i].isFirstLetter = true
                  newTempCrossword.posList[v][h].isHorizontalWord = true

                  if (newTempCrossword.posList[v][h].wordInOrder == null) {
                    newTempCrossword.posList[v][h].wordInOrder = JSON.parse(JSON.stringify(this.wordInOrder))
                  } else {
                    newTempCrossword.posList[v][h].wordInOrder = JSON.parse(JSON.stringify(this.crossword.actual.posList[v][h].wordInOrder))
                  }
                }
            }
            return newTempCrossword
          }
        }
      }  
  }   
  
  </script>
  
  <style>
  
  .standardButton{
    width: 14vw;
    height: 5.5vw;
    border-radius: 0.94rem;
    border-color: #ba0c00;
    margin-top: 1vw;
    margin-bottom: 2vw;
    margin-right: 0.5vw;

    color: white;
    background-color: #FE5F55;
    font-family: "Comic Sans MS", "Comic Sans";
    font-size: 1.25vw;
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
  .descPopUp{
    width: 2.5vw;
    height: 2.5vw;
    color: white;
    background-color: #A7CAB1;
    border: 0;
    font-family: "Comic Sans MS", "Comic Sans";
    font-size: 1.5vw;
    cursor:pointer;
    position: relative;   
  }
  .descPopIp:hover{
    opacity: 0.80;
  }


  #inputFieldWrapper {
    float: left;
    width: 25vw;
    justify-content: center;
    margin-top: 3vw;
  }
  #placementArrows{
    justify-content: center;
    margin-top: 4.5vw;
    position:absolute;
  
  }
  #confirmDiscardButtons{
    position: absolute;
    justify-content: center;
    margin-top: 10vw;
  }
  #div4 {
    float: left;
    width: 48vw;
    margin-left: 4vw;
    margin-top:3vw;

  }
  #div5 {
    margin-top: 5vw;
    margin-right:3vw;
    float: left;
    width: 18vw;

  }
.modalDescription .overlay {    /*STYLING FÖR TONAD SVART BAKGRUND*/
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}

.modalDescription .modal {    /*STYLING FÖR SJÄLVA POPUPEN*/
  position: absolute;
  top: 5vw;
  left: 27vw;
  height: 70vh;
  width: 40vw;
  z-index: 9999;
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #A7CAB1;
  color: black;
  border-radius: 15px;
  font-family: "Comic Sans MS", "Comic Sans";
  justify-content: center;
}

.modalDescription .close{     /*STYLING FÖR STÄNG NED KNAPP*/
  position: absolute;
  top: 0.5vw;
  right: 0.5vw;
  background-color: #FE5F55;
  border-radius: 5px;
  cursor:pointer;
  height: 2vw;
  width: 2vw;
  color: black;
  border-color: black;
  text-align: center;
}
.modalDescription .close:hover{
background-color: #e36f67;
}

  #showSolutions {
    width: 6vw;
    height: 5vw;
    cursor:pointer; 
    margin-right: 0.6vw;
  }
  #showSolutions:hover{
    opacity: 0.80;
  }
  #showSolutions.disabled {
    opacity: 0.30;
    cursor:default; 
  }
  .solutionsWrapper{
    display: flex;
    justify-content: center;
    height: 18vw;
    width: 20vw;
    margin-left: 2.5vw;
    border-radius: 2rem;
    background-color: #93b39c;
    border-color: #43918a;
    border-style: solid;
  }
  #wordPlacement{
    font-size: 1.4vw;
    width: 20vw;
    height: 3vw;
    margin: 1vw;
    display: flex;
    justify-content: center;

  }
  
    #wordInput {
      height: 4vw;
      width: 16vw;
      text-align: center; 
      font-family: "Comic Sans MS", "Comic Sans";
      font-size: 1.5vw;
      border-radius: 1rem;
      margin-top: 0.5vw
   }

   .wordDescriptionWrapper{
    display: flex;
    flex-direction: column;
    float:right;
    align-items: center;
    height: 70vh;
    width: 22vw;
    margin-right: 9vw;
    margin-left: 9vw;
  }
  
  #horizontalDescriptions{
    width: 20vw;
    height: 31vh;
    border-radius: 5px;
    border-color: #a6d8d4;
    margin-left: 5%;
    margin-top: 6%;
    color: white;
    background-color:#43918a;
    font-family: "Comic Sans MS", "Comic Sans";
    font-size: 20px;
    position: relative;
    float:left;
    margin-bottom: 2rem;
  }
  
  #verticalDescriptions{
    width: 20vw;
    height: 31vh;
    border-radius: 5px;
    border-color: #a6d8d4;
    margin-left: 5%;
    color: white;
    background-color:#43918a;
    font-family: "Comic Sans MS", "Comic Sans";
    font-size: 20px;
    position: relative;
    float:left;
  }
  #wordDescTop{
    width: 19.2vw;
    height: 6vh;
    border-top-left-radius: 0.5vw;
    border-top-right-radius: 0.5vw;
    border-color: #43918a;
    margin-left: 5%;
    color: #43918a;
    background-color: white;
    font-family: "Comic Sans MS", "Comic Sans";
    font-size: 1.5vw;
    position: relative;
    float:left;
    margin:0.4vw;
    text-align: center;
  }

  #orderedList {
    width: 19vw;
    margin-left: 0.4vw;
    height: 22vh;
    overflow-y: auto;
    border: 0.1vw solid white;
    border-bottom-left-radius: 0.5vw;
    border-bottom-right-radius: 0.5vw;
    text-align: left;
  }

  ol { 
    margin-block-start: 0;
    margin-block-end: 0;
  }

  div.scroll {
      margin:1%;
      overflow-x: hidden;
      overflow-y: auto;
      text-align:justify;
              }
  
    .scroll::-webkit-scrollbar {
      width: 2vh;
      border-radius: 2vw;
    }
 
    .scroll::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(255, 253, 253, 0.3); 
    }
 
    .scroll::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
      background: #43918a;
      border-bottom-right-radius: 0.5vw;
      border-bottom-left-radius: 0.5vw;
    }
  </style>