<template>
  <header>
    <div>
        <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" >
          <button v-on:click="togglePopup"></button>
        </Modal>
    </div>
  </header>
  
    
  
    <div id="div2">
      Change input direction: <br><!-- uiLabels + layout-fix -->
    <button v-on:click="changeDirection">
      {{ inputDirection }}
    </button>

    <div>
    {{"servertest:"}}

    <ul>
      <li v-for="(value, key) in this.crosswordToPlay" :key="key">
        {{ key }}: {{ value.wordDesc }}
      </li>
    </ul>

  </div>
    
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
        <div id="wordDescTop">Horisontella ord</div><br> <!-- lägg till i uiLabels-->
        <li>pajas</li>
        <li>motsats till nej</li>
        <li>tung artilleripjäs</li>
      </ol>
      <ol id="verticalDescriptions">
        <div id="wordDescTop">Vertikala ord</div>
        <li>sängklädesplagg</li>
      </ol>
      </div>
      <div>
        <button id="finishedGame" @click="$router.push('/lobby/'+lang)">{{'Avsluta spel'}}</button>
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
          crosswordToPlay: null, // bättre namn??

          word: "",
          desc: "",
          matrixDims: {x: 10, y: 10},
          occupiedPosition: {x: null, y: null},
          latestOccupied: {x: 0, y: 0},
         
          crosswordAnswer: {posList: [], 
                            startPos: {x: 0, 
                                       y: 0
                                      }  
                           },
          userCrossword: [], 
          firstMouseClick: true,
  
          showModal: false,
          uiLabels: {},
          id: "",
          lang: "",
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
  
        socket.on('gameToBePlayed', data  => { // ursprung: lobby
        this.crosswordToPlay = data}) 

      console.log("matchingGames mottaget i playview är")
      console.log(this.crosswordToPlay)
    
      socket.on("currentOccupied", data => { // ursprung: annans playview
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

        storePosition: function (event) {

          if (this.firstMouseClick) {
            this.occupiedPosition.x = event.x
            this.occupiedPosition.y = event.y
            this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = true
          } else {
            this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = false
            this.userCrossword[event.y][event.x].isOccupied = true
          }

          this.firstMouseClick = false

          this.occupiedPosition.x = event.x
          this.occupiedPosition.y = event.y

          /* this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = true */

          console.log("Position occupied? " + this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied)

          /* this.userCrossword[this.latestOccupied.y][this.latestOccupied.x].isOccupied = false */
          /* rutan jag trycker på blir occupied */

          console.log("Occupied position test: " + this.occupiedPosition)
          console.log("... x = " + this.occupiedPosition.x)
          console.log("... y = " + this.occupiedPosition.y)
        },

        enterLetterFromKeyPress: function (event) {
          console.log("Inuti event click handler, event.key = " + event.key)


            if ((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122)) {
                if (this.inputDirection == "Horizontal" && typeof(event.key) == "string") {

                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter = event.key.toUpperCase()
                  console.log(this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter)

                  if (this.crosswordAnswer.posList[this.occupiedPosition.y][this.occupiedPosition.x + 1].letter != null ||
                      this.crosswordAnswer.posList[this.occupiedPosition.y][this.occupiedPosition.x + 1].letter != undefined) {

                      this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = false
                      this.occupiedPosition.x++

                      this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = true
                      this.firstMouseClick = false
                  }
                } else {
                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter = event.key.toUpperCase()
                  console.log(this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter)

                  if (this.crosswordAnswer.posList[this.occupiedPosition.y + 1][this.occupiedPosition.x].letter != null || 
                      this.crosswordAnswer.posList[this.occupiedPosition.y + 1][this.occupiedPosition.x].letter != undefined) {

                      this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = false
                      this.occupiedPosition.y++
                      
                      this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = true
                      this.firstMouseClick = false
                  }
                }
            } else if (event.key == "Backspace") {
              if (this.inputDirection == "Horizontal") {
                if ((this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x - 1].letter != null || /* om vi faktiskt har en bokstav bakåt */
                     this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x - 1].letter != undefined) && 
                     this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter == null) {

                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x - 1].letter = null

                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = false
                  this.occupiedPosition.x--
                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = true

                } else if (this.crosswordAnswer.posList[this.occupiedPosition.y][this.occupiedPosition.x - 1].letter == null || /* om vi faktiskt har en bokstav bakåt */
                          this.crosswordAnswer.posList[this.occupiedPosition.y][this.occupiedPosition.x - 1].letter == undefined) {

                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter = null

                } else if (this.crosswordAnswer.posList[this.occupiedPosition.y][this.occupiedPosition.x].letter != null ||
                           this.crosswordAnswer.posList[this.occupiedPosition.y][this.occupiedPosition.x + 1].letter != null ||
                           this.crosswordAnswer.posList[this.occupiedPosition.y][this.occupiedPosition.x + 1].letter != undefined) {

                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter = null

                }
              } else {
                if ((this.userCrossword[this.occupiedPosition.y - 1][this.occupiedPosition.x].letter != null || /* om vi faktiskt har en bokstav bakåt */
                     this.userCrossword[this.occupiedPosition.y - 1][this.occupiedPosition.x].letter != undefined) && 
                     this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter == null) {

                  this.userCrossword[this.occupiedPosition.y - 1][this.occupiedPosition.x].letter = null

                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = false
                  this.occupiedPosition.y--
                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].isOccupied = true

                } else if (this.crosswordAnswer.posList[this.occupiedPosition.y - 1][this.occupiedPosition.x].letter == null || /* om vi faktiskt har en bokstav bakåt */
                          this.crosswordAnswer.posList[this.occupiedPosition.y - 1][this.occupiedPosition.x].letter == undefined) {

                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter = null

                } else if (this.crosswordAnswer.posList[this.occupiedPosition.y][this.occupiedPosition.x].letter != null ||
                           this.crosswordAnswer.posList[this.occupiedPosition.y + 1][this.occupiedPosition.x].letter != null ||
                           this.crosswordAnswer.posList[this.occupiedPosition.y + 1][this.occupiedPosition.x].letter != undefined) {

                  this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter = null
                }
              }


            }
                    



          console.log(this.userCrossword[this.occupiedPosition.y][this.occupiedPosition.x].letter)
  
  
          let allMatchesCorrect = true
          for (let v = 0; v < this.matrixDims.y; v++) {
              for (let h = 0; h < this.matrixDims.x; h++) {
  
                if (typeof(this.crosswordAnswer.posList[v][h].letter) == "string") {
                  this.crosswordAnswer.posList[v][h].letter = JSON.parse(JSON.stringify(this.crosswordAnswer.posList[v][h].letter.toUpperCase()))
                }
  
                if (this.crosswordAnswer.posList[v][h].letter != this.userCrossword[v][h].letter) {
                  allMatchesCorrect = false
                }
              }
          }
  
          if (allMatchesCorrect) {
            alert("du har löst korsordet")
          }
  
        },
  
        getUserCrossword: function () {
  
          let tempUserCrossword = JSON.parse(JSON.stringify(this.crosswordAnswer.posList))
  
          tempUserCrossword.forEach((outerList) => {
            outerList.forEach(element => {
              element.letter = null
            })
          })
  
          return tempUserCrossword
        },
  
        fillPremadeCrossword: function () {
            for (let v = 0; v < this.matrixDims.y; v++) {
                this.crosswordAnswer.posList[v] = [];
                /* crossword = [[null, null, null, null]] */
                for (let h = 0; h < this.matrixDims.x; h++) {
                this.crosswordAnswer.posList[v][h] = {letter: null, 
                                                    inHorizontal: false,
                                                    inVertical: false,
                                                    isFirstLetter: false,
                                                    isOccupied: false,
                                                    wordInOrder: 1} /* if (wordInOrder != 0) { lägg till siffra i hörnet } */
                }
            }
  
            this.crosswordAnswer.posList[0][0].letter = "c"; this.crosswordAnswer.posList[0][0].inHorizontal = true
            this.crosswordAnswer.posList[0][0].isFirstLetter = true
  
            this.crosswordAnswer.posList[0][1].letter = "l"; this.crosswordAnswer.posList[0][1].inHorizontal = true; this.crosswordAnswer.posList[0][1].inVertical = true
            this.crosswordAnswer.posList[0][1].isFirstLetter = true
  
            this.crosswordAnswer.posList[0][2].letter = "o"; this.crosswordAnswer.posList[0][2].inHorizontal = true
            this.crosswordAnswer.posList[0][3].letter = "w"; this.crosswordAnswer.posList[0][3].inHorizontal = true
            this.crosswordAnswer.posList[0][4].letter = "n"; this.crosswordAnswer.posList[0][4].inHorizontal = true
  
            this.crosswordAnswer.posList[1][1].letter = "a"; this.crosswordAnswer.posList[1][1].inHorizontal = false; this.crosswordAnswer.posList[1][1].inVertical = true
            this.crosswordAnswer.posList[2][1].letter = "k"; this.crosswordAnswer.posList[2][1].inHorizontal = true; this.crosswordAnswer.posList[2][1].inVertical = true
            this.crosswordAnswer.posList[2][1].isFirstLetter = true
  
            this.crosswordAnswer.posList[3][1].letter = "a"; this.crosswordAnswer.posList[3][1].inHorizontal = true; this.crosswordAnswer.posList[3][1].inVertical = true
            this.crosswordAnswer.posList[4][1].letter = "n"; this.crosswordAnswer.posList[4][1].inHorizontal = false; this.crosswordAnswer.posList[4][1].inVertical = true
            this.crosswordAnswer.posList[3][0].letter = "j"; this.crosswordAnswer.posList[3][0].inHorizontal = true /* från JA */
            this.crosswordAnswer.posList[3][0].isFirstLetter = true
  
            this.crosswordAnswer.posList[2][2].letter = "a"; this.crosswordAnswer.posList[2][2].inHorizontal = true /* från KANON */
            this.crosswordAnswer.posList[2][3].letter = "n"; this.crosswordAnswer.posList[2][3].inHorizontal = true
            this.crosswordAnswer.posList[2][4].letter = "o"; this.crosswordAnswer.posList[2][4].inHorizontal = true
            this.crosswordAnswer.posList[2][5].letter = "n"; this.crosswordAnswer.posList[2][5].inHorizontal = true
          },
  
          changeDirection: function() {
            if (this.inputDirection === "Horizontal") {
              this.inputDirection = "Vertical"
            } else {
              this.inputDirection = "Horizontal"
            }
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
    flex-direction: column;
    float:right;
    align-items: center;
    height: 50rem;
    width: 22rem;
    margin-right: 6rem;
    margin-top: 6rem;
  }
  
  #horizontalDescriptions{
    width: 20rem;
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
    width: 20rem;
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
  #wordDescTop{
    width: 16rem;
    height: 3rem;
    border-radius: 5px;
    border-color: #43918a;
    margin-left: 5%;
    color: #43918a;
    background-color: white;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 2rem;
    position: relative;
    float:left;
    margin:0.5rem;
    margin-right: 1rem;
    margin-left: 1rem;
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