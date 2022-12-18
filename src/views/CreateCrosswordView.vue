<template>
    <div>
        <Crossword v-bind:wordObjects="this.wordObjects" 
                    v-bind:tempWordObjects="this.tempWordObjects"
                    v-bind:wordPositions="this.wordPositions"
                    v-bind:matrixDims="this.matrixDims"
                    v-bind:word="this.word"
                    v-bind:desc="this.desc">
        </Crossword>


        <div class="inputFieldWrapper">
          <div class="inputField"> <!-- måste emitta word så att vi kan använda -->
            <input type="text" id="inputField" v-model="word" required="required" placeholder="Word sv/en">
          </div>
          <div class="inputField" id="inputField" style="display: inline-block">
              <input type="text" v-model="desc" required="required" placeholder="Word desc sv/en">
          </div>
        </div>

        <button v-on:click="this.findPotentialMatches"> Find Potential Matches </button> <br>
        <button v-on:click="this.emptyTextFields"> Empty Input </button> <!-- gör detta när användaren har valt ett ord istället för en knapp. Det rensar även textfältet -->
        <button v-on:click="this.fillPositionsNull"> Reset Crossword </button> <br>
        <button v-on:click="this.showNextSolution"> Show next solution </button>
        <button v-on:click="this.showPreviousSolution"> Show previous </button> <br>
        <button> Confirm and Create </button>
        
        <br>

        Iterator: {{ this.userIterator }}

    </div>
  </template>
  
  <script>
  import Crossword from '../components/Crossword.vue'
  import io from 'socket.io-client';
  const socket = io();
  
/* LOGG:

  2022-12-15
  * Spara ord- och beskrivningspar så att vi kan skicka med det. Alternativt skicka ett stort 'paket' som innehållar all information om korsordet.
  * Börja med att kolla alla positioner där ordet har en gemensam bokstav med wordPositions.actual. Därefter byt plats på den matchningen och
    en som ligger på en före-detta-null-plats. Ny iterator this.swapIterator. Visualisera: typ som hur pivotelementet rör sig i QuickSort.
  * PlayView: vi borde kunna ha komponenter som element i vårt table. Har kollat med OpenAI! Dvs. vi kan har egenskaper såsom
    'ingår i ett vertikalt ord' eller 'är första bokstaven (viktigt när vi ska sätta en liten siffra för att indikera vilket beskrivning
    som berör ordet)'.
  * Indikera första- och sista bokstav i ett ord så att vi kan ha ord som ligger intill varandra och inte behöva kolla omkringliggande ord/riktning?


  Gjort idag:
    - Fixat hela algoritmen (ej fullt optimerad version)
    - Funderat på funktioner vi kan undersöka vidare

  2022-12-12 (natten 13:e)

  * För att snabba på processen för användaren: 
  Loopa först igenom alla matchningar där första bokstaven träffar en annan bokstav, alternativt ordna wordPositions.temp så att bokstavsträffar läggs först i listan.

  * Vi behöver ej göra enligt Mikaels instruktioner för att grafiken ska uppdateras löpande. Kanske behöver undersöka server-socket-kommunikation dock.
  

  Gjort idag:
    - Fixat loopmekanismen så att man kan se alla wordPosition.temp som har hittats. Lagt till knappar för iterering osv. så att man lättare man undersöka.
      I princip en massa meckande med olika index, kanske syns bäst i en merge editor vad som har ändrats.

  Nästa steg:
    - Fixa klart så att få-plats-testet för ord fungerar som det ska. Just nu räcker i vissa fall att ett av platstesten uppfylls för att vi ska generera matchningar. 
    - Testa att lägga till nya ord i wordPositions.actual via inputfältet
    - Undersök: hur lätt är det att lägga till egenskaper på de enskilda rutorna? Komponent-i-komponent?
    - Layout (någon annan?)

*/

  export default {
    name: 'CreateCrosswordView',
    components: {
        Crossword
    },
    data: function () {
      return {
        word: "",
        desc: "",
        boxes: {}, /* tänkt att innehålla information till WordBox sen */
        userIterator: 0,
        matchesIterator: 0,
        swapIterator: 0, 
        wordCollision: false,
        noMatches: false,
        matrixDims: {x: 13, y: 10},
        /* wordPositions: [], */
        wordPositions: {actual: [], temp: []},
        /* tempWordPositions: [], */
        crosswordPack: {}, /* { crossword: this.wordPositions.actual, wordKeypairs: [{ord: "clown", beskrivning: "pajas", riktning: horisontellt}, 
                                                                                    { ... }, { ... }],
                                ID: -- någonting med IP-adress -- }

                            */
        tempWordObjects: {},
        wordKeyPairs: {},
        wordPosChecked: false
      }
    },
    created: function () {
      this.lang = this.$route.params.lang;
      socket.emit("pageLoaded", this.lang);
      socket.on("init", (labels) => {
        this.uiLabels = labels
      })
      socket.on("dataUpdate", (data) =>
        this.data = data
      ),
      this.fillPositionsNull();  // fyller matris
    },
    methods: {
      testAddWordObject: function (wordObject) {
        this.words.push(wordObject) /* dessa 'word' är alltså objekt */
      },
      testAddWord: function (wrd, description) {
        this.word.key = wrd; 
        this.word.description = description;
        /* wordFromInput = new wordFromInput("",""); */
      }, 
      pickWord: function () {
        this.wordObjects = Object.assign(this.wordObjects, this.tempWordObjects[this.matchesIterator]);
      },
      findPotentialMatches: function () {
        this.matchesIterator = 0;
        this.userIterator = 0;
        let word = this.word;                 /* för att spara plats längre ner */
        let wordSplit = word.split("");
        console.log("wordSplit = " + wordSplit);
        const horiz = this.matrixDims.x; /* för att spara plats längre ner */
        const vert = this.matrixDims.y;    /* för att spara plats längre ner */

        for (let h = 0; h < horiz; h++) {
          
          /* console.log("kommit in? horisontellt") */
        for (let v = 0; v < vert; v++) {
          /* console.log("kommit in? vertikalt") */
            if (this.wordPositions.actual[v][h] === wordSplit[0] || this.wordPositions.actual[v][h] === null) {

                /* console.log("har kommit förbi bokstavskoll") */
                
                if (wordSplit.length <= vert - v) { /* FÅR PLATS VERTIKALT? */

                  /* console.log("har kommit förbi få-plats-koll") */    // JESS: iv??? varför behövs
                    for (let iv = 0; iv < wordSplit.length; iv++) {
                        
                        /* console.log("h = " + h + ", v = " + v + ", this.matchesIterator = " + this.matchesIterator) */
                        
                        if ((this.wordPositions.actual[v + iv][h] === wordSplit[iv]) || (this.wordPositions.actual[v + iv][h] === null)) { /* räcker med att spara första och sista positionen för ordet! */

                          if (this.wordPositions.actual[v + iv][h] === wordSplit[iv]) {
                            this.wordCollision = true
                          }

                          console.log("h = " + h)
                          console.log("v = " + v)
                          console.log("iv = " + iv)
                          console.log("matchesIterator = " + this.matchesIterator)
                          console.log(this.wordPositions.actual)
                          console.log("värde på positionen: " + this.wordPositions.actual[v + iv][h])
                          console.log("bokstav == null?" + (this.wordPositions.actual[v + iv][h] === null))
                            
                          if (iv == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */

                            console.log("Good Match Found (vertical). Starting at h = " + h + ", and v = " + v)
                            
                            this.wordPositions.temp[this.matchesIterator] = this.getNewTempPositionVert(h, v, wordSplit) // JESS: Vad sker här?? massa JSON grejer i func. går typ igenom hela ordet igen? för att spara alla bokstavspos?
                            console.log("this.getNewTempPositionVert(h, v, wordSplit)) --- ")
                            console.log(this.getNewTempPositionVert(h, v, wordSplit))
                          
                            if (this.wordCollision) {
                              [this.wordPositions.temp[this.matchesIterator], this.wordPositions.temp[this.swapIterator]] = 
                              [this.wordPositions.temp[this.swapIterator], this.wordPositions.temp[this.matchesIterator]] /* byter plats på position med bokstavsmatchning och null-matchning */
                              this.swapIterator++
                              this.wordCollision = false
                            }

                            console.log("this.wordPositions.actual --- ")
                            console.log(this.wordPositions.actual)

                            console.log("this.wordPositions.temp[this.matchesIterator] --- ")
                            console.log(this.wordPositions.temp[this.matchesIterator])

                            this.matchesIterator++;
                            console.log("matchesIterator increased to: " + this.matchesIterator)
                          }
                        } else {
                          break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                        }
                    }
                }
                if (wordSplit.length <= horiz - h) { /* FÅR PLATS HORISONTELLT? */
                    
                  for (let ih = 0; ih < wordSplit.length; ih++) {

                        if ((this.wordPositions.actual[v][h + ih] === wordSplit[ih]) || (this.wordPositions.actual[v][h + ih] === null)) { /* räcker med att spara första och sista positionen för ordet! */
                          
                          if (this.wordPositions.actual[v][h + ih] === wordSplit[ih]) {
                            this.wordCollision = true
                          }

                          console.log("h = " + h)
                          console.log("v = " + v)
                          console.log("ih = " + ih)
                          console.log("matchesIterator = " + this.matchesIterator)
                          console.log(this.wordPositions.actual)
                          console.log("värde på positionen: " + this.wordPositions.actual[v][h + ih])
                          console.log("bokstav == null?" + (this.wordPositions.actual[v][h + ih] === null))

                          if (ih == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */

                            console.log("Good Match Found (horizontal). Starting at h = " + h + ", and v = " + v)

                            this.wordPositions.temp[this.matchesIterator] = this.getNewTempPositionHoriz(h, v, wordSplit)
                            console.log("this.getNewTempPositionHoriz(h, v, wordSplit)) --- ")
                            console.log(this.getNewTempPositionHoriz(h, v, wordSplit))

                            if (this.wordCollision) {
                              [this.wordPositions.temp[this.matchesIterator], this.wordPositions.temp[this.swapIterator]] = 
                              [this.wordPositions.temp[this.swapIterator], this.wordPositions.temp[this.matchesIterator]] /* byter plats på position med bokstavsmatchning och null-matchning */
                              this.swapIterator++
                              this.wordCollision = false
                            }
                          
                            console.log("this.wordPositions.actual --- ")
                            console.log(this.wordPositions.actual)

                            console.log("this.wordPositions.temp[this.matchesIterator] --- ")
                            console.log(this.wordPositions.temp[this.matchesIterator])

                            /* this.wordPositions.temp.push(this.getNewTempPositionHoriz(h, v, wordSplit)) */
                            this.matchesIterator++;
                            console.log("matchesIterator increased to: " + this.matchesIterator)
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
            this.wordPositions.actual[v][h] = null;
            }
        }
        console.log(this.wordPositions.actual)
      },
      fillPositionsLetterC: function () {
        for (let v = 0; v < this.matrixDims.y; v++) {
            this.wordPositions.actual[v] = [];
            /* wordPositions = [[null, null, null, null]] */
            for (let h = 0; h < this.matrixDims.x; h++) {
              
              this.wordPositions.actual[v][h] = "c";
              this.wordPositions.actual[2][3] = null;
              this.wordPositions.actual[3][4] = null;
              
            }
        }

        console.log(this.wordPositions.actual)
      },
      getNewTempPositionVert: function (h, v, wordSplit) {
        let newWordPositions = JSON.parse(JSON.stringify(this.wordPositions.actual))

        console.log("inside of vertical func")     // JESS: VARFÖR SKRIVA UT FLERA GGR DETTA

        for (let i = 0; i < wordSplit.length; i++) {
            newWordPositions[v + i][h] = wordSplit[i]
        }

        console.log("From getNewTempPositionVert, newWordPositions: ")
        console.log(newWordPositions)
        return newWordPositions
      },
      getNewTempPositionHoriz: function (h, v, wordSplit) {
        let newWordPositions = JSON.parse(JSON.stringify(this.wordPositions.actual))

        console.log("inside of horizontal func")

        for (let i = 0; i < wordSplit.length; i++) {
            newWordPositions[v][h + i] = wordSplit[i]
        }

        console.log("From getNewTempPositionHoriz, newWordPositions: ")
        console.log(newWordPositions)
        return newWordPositions
      },
      testClick: function() {
        console.log(this.word);
        console.log(this.desc);
      },
      emptyTextFields: function() {
        this.word = ""
        this.desc = ""
      },
      iterateWordPosTemp: function () {
        this.userIterator++
      },
      decreaseWordPosTemp: function () {
        this.userIterator--
      },
      wordPositionsTempToActual: function () {
        this.wordPositions.actual = JSON.parse(JSON.stringify(this.wordPositions.temp[this.userIterator]))
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
      logWordPositionActual: function () {
        console.log(this.wordPositions.actual)
        console.log(this.wordPositions.actual[0][0])
      },
      compareMatrices: function () {
        console.log(this.wordPositions.actual)
        console.log(this.wordPositions.temp[1])
      }

    }
      
}   

</script>

<style>





</style>