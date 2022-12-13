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
        <button v-on:click="this.testClick"> Test V-Model word desc </button>
        <button v-on:click="this.findPotentialMatches"> Test wordPositions and tempWordPositions </button> <br>
        <button v-on:click="this.emptyTextFields"> Empty Input </button> <!-- gör detta när användaren har valt ett ord istället för en knapp. Det rensar även textfältet -->
        <button v-on:click="this.fillPositionsLetterC"> Fill with "c" </button>
        <button v-on:click="this.fillPositionsNull"> Fill with null </button> <br>
        <button v-on:click="this.iterateWordPosTemp"> Increase wordPositions.temp </button>
        <button v-on:click="this.decreaseWordPosTemp"> Decrease wordPositions.temp </button> <br>
        <button v-on:click="this.wordPositionsTempToActual"> Take temp and put as actual </button> <br>
        <button v-on:click="this.logWordPositionActual"> Print actual list in console </button> <br>

        Iterator: {{ this.userIterator }}

    </div>
  </template>
  
  <script>
  import Crossword from '../components/Crossword.vue'
  import io from 'socket.io-client';
  const socket = io();
  
/* LOGG:

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


/*   const wordFromInput = function(inputWord, inputDesc) {
    this.word = inputWord; /* Första steget kör split på ordet och leta igenom matrisen. Resultat ["c", "l", "o", "w", "n"] 
    this.desc = inputDesc;
} */

  export default {
    name: 'CreateCrosswordView',
    components: {
        Crossword
    },
    data: function () {
      return {
        word: "",
        desc: "",
        boxes: {},
        userIterator: 0,
        matchesIterator: 0,
        noMatches: false,
        matrixDims: {x: 13, y: 10},
        /* wordPositions: [], */
        wordPositions: {actual: [], temp: []},
        /* tempWordPositions: [], */
        wordObjects: {}, /* {id: {ord: "clown", beskrivning: "pajas", horisontellt: true, pos: {bokstavIOrdningen[0]: [1, 1],
                                                                                       bokstavIOrdningen[1]: [1, 2],
                                                                                       ...
                                                                                      }
                                      }
                             "lakan": {beskrivning: "bäddar man sängen med"} ...
                            }            
                            
                            1. Skapa en grid och hitta ett sätt att kommunicera mellan:
                                wordObjects.clown.pos.bokstavIOrdningen[i] och positionen i grid (20x20). Var ska vi sätta WordBox:en som innehåller
                                vår bokstav?
                            2. Sätt nya nycklar i wordObjects (exempelvis ett index i) så att wordObjects[matchesIterator].namn = "clown"
                                                                     wordObjects[matchesIterator].beskrivning = "pajas"
                            3. Fundera!

                            */
        tempWordObjects: {},
        wordKeyPairs: {}, /* [{ord: beskrivning}] vi matar in via v-model. Syftet med dessa är att kunna skicka
                            smidigare till spelarvyn. Kanske ej behövs, kolla hur mycket det underlättar! */
        /* SKICKA wordObjects TILL SPELARVYN */
        /* All info ligger under data, dvs. data.wordObjects."clown".beskrivning = "pajas" */
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
      this.fillPositionsNull();
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
        for (let v = 0; v < vert; v++) {
            if (this.wordPositions.actual[h][v] === wordSplit[0] || this.wordPositions.actual[h][v] === null) {

                console.log("har kommit förbi bokstavskoll")
                console.log("wordPosition.actual (inne i loop efter bokstavskoll) = " + this.wordPositions.actual)
                
                if (wordSplit.length <= vert - v) { /* FÅR PLATS VERTIKALT? */
                    console.log("wordSplit.length = " + wordSplit.length)
                    console.log("har kommit förbi längdkontroll") /* här sitter vi fast */
                    for (let i = 1; i < wordSplit.length; i++) {
                        
                        console.log("h = " + h + ", v = " + v + ", this.matchesIterator = " + this.matchesIterator)
                        
                        if ((this.wordPositions.actual[h][v + i] === wordSplit[i]) || (this.wordPositions.actual[h][v + i] === null)) { /* räcker med att spara första och sista positionen för ordet! */

                            console.log("h = " + h)
                            console.log("v = " + v)
                            console.log("i = " + i)

                            console.log("same letter?: " + this.wordPositions.actual[h][v + i] === wordSplit[i])
                            console.log("is this null!?!?: " + this.wordPositions.actual[h][v + i])
                            console.log((this.wordPositions.actual[h + i][v] === null))
                            
                          if (i == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */

                                console.log("kontrollera krock med andra bokstäver än första. h = " + h + ", v = " + v)

                                this.wordPositions.temp[this.matchesIterator] = this.getNewTempPositionVert(h, v, wordSplit);
                                this.matchesIterator++;
                                console.log("matchesIterator = " + this.matchesIterator)


                            
                            }
                        } else {
                            break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                        }
                    }
                }
                if (wordSplit.length <= horiz - h) { /* FÅR PLATS HORISONTELLT? */
                    for (let i = 1; i < wordSplit.length; i++) {
                        if (this.wordPositions.actual[h + i][v] === wordSplit[i] || this.wordPositions.actual[h + i][v] === null) { /* räcker med att spara första och sista positionen för ordet! */
                            if (i == wordSplit.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */

                                this.wordPositions.temp[this.matchesIterator] = this.getNewTempPositionHoriz(h, v, wordSplit);
                                this.matchesIterator++;
                                console.log("matchesIterator = " + this.matchesIterator)
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
        }

        this.wordPositions.actual = this.wordPositions.temp[0]
      }, 
      getPositions: function (word, h, v, horizontal) {
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
      getNewTempPositionHoriz: function (h, v, wordSplit) {
        let newWordPositions = JSON.parse(JSON.stringify(this.wordPositions.actual))
        console.log(newWordPositions)

        for (let i = 0; i < wordSplit.length; i++) {
            newWordPositions[v][h + i] = wordSplit[i]
        }
        return newWordPositions
      },
      getNewTempPositionVert: function (h, v, wordSplit) {
        let newWordPositions = JSON.parse(JSON.stringify(this.wordPositions.actual))

        for (let i = 0; i < wordSplit.length; i++) {
            newWordPositions[v + i][h] = wordSplit[i]
        }

        return newWordPositions
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
            }
        }
        console.log(this.wordPositions.actual)
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
      logWordPositionActual: function () {
        console.log(this.wordPositions.actual)
        console.log(this.wordPositions.actual[0][0])
      }

    }
      
}   

</script>

<style>





</style>