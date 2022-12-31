<template>
<header>
  <div>
      <Modal v-bind:uiLabels="uiLabels" v-bind:lang="lang" v-bind:sourceName="sourceName" v-on:switchLanguage="switchLanguage" >
      <button v-on:click="togglePopup"></button>
      </Modal>
    </div>
</header>

  <h1>Change input direction: </h1>
  <button v-on:click="changeDirection">
    {{ inputDirection }}
  </button>

  <div id="div2"> 
        <Crossword  v-bind:sourceName="sourceName"
                    v-bind:wordPositions="this.wordPositions" 
                    v-bind:matrixDims="this.matrixDims"
                    v-bind:word="this.word"    
                    v-bind:desc="this.desc"
                    > 
                    
                    <!-- v-bind:wordPositions="data.allCrosswords.ID.wordPositions" -->
                    <!-- v-bind:matrixDims="data.allCrosswords.ID.matrixDims" -->
        </Crossword> <!-- hur få ut rätt word och desc? Typ for-loop "for crosswordpackages.word, gör det ovan"  -->
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
    
  </div>

  
    <p>
       <label for="inputWord">Ord</label>
       <input type="text" id="inputWord" v-model="input" >
   </p>

   <button id="finishedGame" @click="$router.push('/lobby/'+lang)">{{'Avsluta spel'}}</button>  
  
</template>

<script>

import Crossword from '../components/Crossword.vue'
  import Modal from '../components/PopUp.vue'
  import io from 'socket.io-client';
  const socket = io();

export default {
    name: 'CreateCrosswordView',
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
        /* wordPositions: [], */
        wordPositions: {actual: [], temp: []},
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

      socket.on('currentCrosswordPackages', data => { // tar emot korsordsinfo från server, ursprung confirmCreate
        this.crosswordPackages = data}); 
      /* this.loadUserCrossword() */
    },

    methods: {
      loadUserCrossword: function () {
        console.log("Inside of loadusercrossword")
        this.userCrossword = JSON.parse(JSON.stringify(this.wordPositions.actual))
        this.userCrossword.forEach((item, index) => {
          item[index].letter = "c"
        })
        console.log(this.userCrossword)
      },
      fillPremadeCrossword: function () {
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

          this.wordPositions.actual[0][0].letter = "c"; this.wordPositions.actual[0][0].inHorizontal = true
          this.wordPositions.actual[0][0].isFirstLetter = true

          this.wordPositions.actual[0][1].letter = "l"; this.wordPositions.actual[0][1].inHorizontal = true; this.wordPositions.actual[0][1].inVertical = true
          this.wordPositions.actual[0][1].isFirstLetter = true

          this.wordPositions.actual[0][2].letter = "o"; this.wordPositions.actual[0][0].inHorizontal = true
          this.wordPositions.actual[0][3].letter = "w"; this.wordPositions.actual[0][0].inHorizontal = true
          this.wordPositions.actual[0][4].letter = "n"; this.wordPositions.actual[0][0].inHorizontal = true

          this.wordPositions.actual[1][1].letter = "a"; this.wordPositions.actual[1][1].inHorizontal = false; this.wordPositions.actual[1][1].inVertical = true
          this.wordPositions.actual[2][1].letter = "k"; this.wordPositions.actual[2][1].inHorizontal = true; this.wordPositions.actual[2][1].inVertical = true
          this.wordPositions.actual[2][1].isFirstLetter = true

          this.wordPositions.actual[3][1].letter = "a"; this.wordPositions.actual[3][1].inHorizontal = true; this.wordPositions.actual[3][1].inVertical = true
          this.wordPositions.actual[4][1].letter = "n"; this.wordPositions.actual[4][1].inHorizontal = false; this.wordPositions.actual[4][1].inVertical = true
          this.wordPositions.actual[3][0].letter = "j"; this.wordPositions.actual[3][0].inHorizontal = true /* från JA */
          this.wordPositions.actual[3][0].isFirstLetter = true

          this.wordPositions.actual[2][2].letter = "a"; this.wordPositions.actual[2][2].inHorizontal = true /* från KANON */
          this.wordPositions.actual[2][3].letter = "n"; this.wordPositions.actual[2][3].inHorizontal = true
          this.wordPositions.actual[2][4].letter = "o"; this.wordPositions.actual[2][4].inHorizontal = true
          this.wordPositions.actual[2][5].letter = "n"; this.wordPositions.actual[2][5].inHorizontal = true
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

.wordDescriptioWrapper{
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