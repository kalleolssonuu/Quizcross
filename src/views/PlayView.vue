<template>
<header>
  <div>
      <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" >
        <button v-on:click="togglePopup"></button>
      </Modal>
  </div>
</header>

  Change input direction: <!-- uiLabels + layout-fix -->
  <button v-on:click="changeDirection">
    {{ inputDirection }}
  </button>

  <div id="div2">
        <Crossword  v-on:sendPosition="this.storePosition($event)"
                    v-on:updateLayout="this.updateLayout($event)"
        
                    v-bind:sourceName="this.sourceName"
                    v-bind:crossword="this.userCrossword"
                    v-bind:matrixDims="this.matrixDims"
                    v-bind:word="this.word"    
                    v-bind:desc="this.desc"> 
        </Crossword>
  </div>

  <!-- JESSIE: FIXA SÅ SKICKAR ETT PAKET INTE ALLA, SE ANTECK I LOBBY -->
  <div class ="wordDescriptionWrapper"> 
    <ol id="horizontalDescriptions">
      <u>Horisontella ord</u> <!-- lägg till i uiLabels-->
      <li>pajas</li>
      <li>motsats till nej</li>
      <li>tung artilleripjäs</li>
    </ol>
    <ol id="verticalDescriptions">
      <u>Vertikala ord</u>
      <li>sängklädesplagg</li>
    </ol>
    </div>

    <div>
    {{"servertest av confirmCreate:"}}

    <ul v-if="this.crosswordPackages" >
      {{Object.keys(this.crosswordPackages)}}

      <!-- <li v-for="(item,key) in crossworPackages">
        {{ this.crosswordPackages[ID].package.wordDescPairs }}
      </li> -->
    </ul>

        <!-- {{"servertest av uppdaterade positioner" }}
    <ul v-if="this.occupiedWordboxes" >
      {{this.occupiedWordboxes}}
    </ul>
     -->
    
  </div>

   <button id="finishedGame" @click="$router.push('/lobby/'+lang)">{{'Avsluta spel'}}</button>  
  
</template>

<script>

import Crossword from '../components/Crossword.vue'
  import Modal from '../components/PopUp.vue'
  import io from 'socket.io-client';
  const socket = io();

export default {
    name: 'PlayView',
    components: {
        Crossword,
        Modal
    },
    props: {
    modal: Object,
    },
    data: function () {
      return {
        word: "",
        desc: "",
        matrixDims: {x: 13, y: 10},
        occupiedPosition: {x: null, y: null},
       
        crossword: {actual: {posList: [], 
                             startPos: {x: 0, 
                                        y: 0
                                       }
                            }, 
                    temp: []
                    },
        userCrossword: [], 

        showModal: false,
        uiLabels: {},
        id: "",
        lang: "en",
        sourceName: "PlayView",
        inputDirection: "Horizontal",

        crosswordPackages: null, // OBS SKICKAR JU NU ALLA PAKET DET ÄR FEL, VILL SKICKA ETT
      }
    },

    created: 
    function () {
      socket.emit('pageLoaded')
      socket.on("init", (labels) => {
        this.uiLabels = labels
      })
      socket.on("dataUpdate", (data) =>
        this.data = data
      ),
      this.fillPremadeCrossword();
      this.userCrossword = this.getUserCrossword()

      // sockets för skapadet av korsord-ish
      socket.on('currentCrosswordPackages', data => { // tar emot korsordsinfo från server, ursprung confirmCreate
        this.crosswordPackages = data}); 
      socket.on("currentOccupied", data => {
        this.occupiedWordboxes = data})
      window.addEventListener('keydown', this.enterLetterFromKeyPress)
    },
    beforeUnmount() {
      window.removeEventListener('keydown', this.enterLetterFromKeyPress)
    },
    /* watch: {
      userCrossword(newValue) {
        this.userCrossword = newValue

      }
    }, */
    methods: {
      updateOccupied: function() { // ska aktiveras när en klient klickar på en ruta          
        //  this.occupiedWordboxes 

         // socket.emit('updatedOccupied', this.occupiedWordboxes )
          socket.emit('updatedOccupied', "hejhej" )
      },


      enterLetterFromKeyPress: function (event) {
        console.log("Inuti event click handler, event.key = " + event.key)

        if (this.inputDirection == "Horizontal" && typeof(event.key) == "string") {
          this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter = event.key.toUpperCase()
          
          if (this.crossword.actual.posList[this.occupiedPosition.y][this.occupiedPosition.x + 1].letter != null ||
              this.crossword.actual.posList[this.occupiedPosition.y][this.occupiedPosition.x + 1].letter != undefined) {
            this.occupiedPosition.x++
          }

        } else {
          this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter = event.key.toUpperCase()
          if (this.crossword.actual.posList[this.occupiedPosition.y + 1][this.occupiedPosition.x].letter != null || 
              this.crossword.actual.posList[this.occupiedPosition.y + 1][this.occupiedPosition.x].letter != undefined) {
            this.occupiedPosition.y++
          }
        }
        console.log(this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter)


        let allMatchesCorrect = true
        for (let v = 0; v < this.matrixDims.y; v++) {
            for (let h = 0; h < this.matrixDims.x; h++) {

              if (typeof(this.crossword.actual.posList[v][h].letter) == "string") {
                this.crossword.actual.posList[v][h].letter = JSON.parse(JSON.stringify(this.crossword.actual.posList[v][h].letter.toUpperCase()))
              }
              
              if (this.crossword.actual.posList[v][h].letter != this.userCrossword[v][h].letter) {
                allMatchesCorrect = false
              }
            }
        }

        if (allMatchesCorrect) {
          alert("du har löst korsordet")
        }

      },

      getUserCrossword: function () {

        let tempUserCrossword = JSON.parse(JSON.stringify(this.crossword.actual.posList))

        tempUserCrossword.forEach((outerList) => {
          outerList.forEach(element => {
            element.letter = null
          })
        })

        return tempUserCrossword
      },

      fillPremadeCrossword: function () {
          for (let v = 0; v < this.matrixDims.y; v++) {
              this.crossword.actual.posList[v] = [];
              /* crossword = [[null, null, null, null]] */
              for (let h = 0; h < this.matrixDims.x; h++) {
              this.crossword.actual.posList[v][h] = {letter: null, 
                                                  inHorizontal: false,
                                                  inVertical: false,
                                                  isFirstLetter: false,
                                                  wordInOrder: 1} /* if (wordInOrder != 0) { lägg till siffra i hörnet } */
              }
          }

          this.crossword.actual.posList[0][0].letter = "c"; this.crossword.actual.posList[0][0].inHorizontal = true
          this.crossword.actual.posList[0][0].isFirstLetter = true

          this.crossword.actual.posList[0][1].letter = "l"; this.crossword.actual.posList[0][1].inHorizontal = true; this.crossword.actual.posList[0][1].inVertical = true
          this.crossword.actual.posList[0][1].isFirstLetter = true

          this.crossword.actual.posList[0][2].letter = "o"; this.crossword.actual.posList[0][2].inHorizontal = true
          this.crossword.actual.posList[0][3].letter = "w"; this.crossword.actual.posList[0][3].inHorizontal = true
          this.crossword.actual.posList[0][4].letter = "n"; this.crossword.actual.posList[0][4].inHorizontal = true

          this.crossword.actual.posList[1][1].letter = "a"; this.crossword.actual.posList[1][1].inHorizontal = false; this.crossword.actual.posList[1][1].inVertical = true
          this.crossword.actual.posList[2][1].letter = "k"; this.crossword.actual.posList[2][1].inHorizontal = true; this.crossword.actual.posList[2][1].inVertical = true
          this.crossword.actual.posList[2][1].isFirstLetter = true

          this.crossword.actual.posList[3][1].letter = "a"; this.crossword.actual.posList[3][1].inHorizontal = true; this.crossword.actual.posList[3][1].inVertical = true
          this.crossword.actual.posList[4][1].letter = "n"; this.crossword.actual.posList[4][1].inHorizontal = false; this.crossword.actual.posList[4][1].inVertical = true
          this.crossword.actual.posList[3][0].letter = "j"; this.crossword.actual.posList[3][0].inHorizontal = true /* från JA */
          this.crossword.actual.posList[3][0].isFirstLetter = true

          this.crossword.actual.posList[2][2].letter = "a"; this.crossword.actual.posList[2][2].inHorizontal = true /* från KANON */
          this.crossword.actual.posList[2][3].letter = "n"; this.crossword.actual.posList[2][3].inHorizontal = true
          this.crossword.actual.posList[2][4].letter = "o"; this.crossword.actual.posList[2][4].inHorizontal = true
          this.crossword.actual.posList[2][5].letter = "n"; this.crossword.actual.posList[2][5].inHorizontal = true
        },

        changeDirection: function() {
          if (this.inputDirection === "Horizontal") {
            this.inputDirection = "Vertical"
          } else {
            this.inputDirection = "Horizontal"
          }
        },

        storePosition: function (event) {
          this.occupiedPosition.x = event.x
          this.occupiedPosition.y = event.y
          console.log("Occupied position test: " + this.occupiedPosition)
          console.log("... x = " + this.occupiedPosition.x)
          console.log("... y = " + this.occupiedPosition.y)
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

#div2{
  float:left;
  width: 50%;
  margin: 5%;
}

.wordDescriptionWrapper{
  display: flex;
}

#horizontalDescriptions{
  width: 25rem;
  height: 15rem;
  border-radius: 5px;
  border-color: #a6d8d4;
  margin-left: 5%;
  margin-top: 6%;
  color: white;
  background-color:#43918a;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 20px;
  position: relative;
  float:left;
}

#verticalDescriptions{
  width: 25rem;
  height: 15rem;
  border-radius: 5px;
  border-color: #a6d8d4;
  margin-left: 5%;
  color: white;
  background-color:#43918a;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-size: 20px;
  position: relative;
  float:left;
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
#finishedGame{
  width: 10rem;
  height: 3rem;
  position: absolute;
  left: 45%;
  background-color: #FE5F55;
  border-radius: 5px;
  color: white;
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

</style>