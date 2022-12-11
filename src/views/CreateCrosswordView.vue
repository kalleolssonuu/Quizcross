<template>
    <div>
        <Crossword v-bind:wordObjects="this.wordObjects" 
                    v-bind:tempWordObjects="this.tempWordObjects"
                    v-bind:wordPositions="this.wordPositions" 
                    v-bind:matrixDims="this.matrixDims"
                    v-bind:word="this.word"
                    v-bind:desc="this.desc">
        
            test
        </Crossword>


        <div class="inputFieldWrapper">
          <div class="inputField"> <!-- måste emitta word så att vi kan använda -->
            <input type="text" v-model="word" required="required" placeholder="Word sv/en">
          </div>
          <div class="inputField" style="display: inline-block">
              <input type="text" v-model="desc" required="required" placeholder="Word desc sv/en">
          </div>
        </div>



    </div>
  </template>
  
  <script>
  import Crossword from '../components/Crossword.vue'
  import io from 'socket.io-client';
  const socket = io();
  
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
        iterator: 0,
        noMatches: false,
        matrixDims: {x: 13, y: 13},
        wordPositions: [], /* [[1, 2, 3], [2, 4, 6], [1, 3, 5]] */
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
                            2. Sätt nya nycklar i wordObjects (exempelvis ett index i) så att wordObjects[iterator].namn = "clown"
                                                                     wordObjects[iterator].beskrivning = "pajas"
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
        this.wordObjects = Object.assign(this.wordObjects, this.tempWordObjects[this.iterator]);
      },
      findPotentialMatches: function () {
        let word = this.word;                 /* för att spara plats längre ner */
        let wordSplit = word.split();
        const horiz = this.matrixDims.x; /* för att spara plats längre ner */
        const vert = this.matrixDims.y;    /* för att spara plats längre ner */

        for (let v = 0; v < vert; v++) {
        for (let h = 0; h < horiz; h++) {
            if (this.wordPositions[h][v] == wordSplit[0] || this.wordPositions[h][v] == null) {
                if (word.length() <= horiz - h) { /* FÅR PLATS HORISONTELLT? */
                    for (let i = 1; i < word.length(); i++) {
                        if (this.wordPositions[h + i][v] == wordSplit[i] || this.wordPositions[h + i][v] == null) { /* räcker med att spara första och sista positionen för ordet! */
                            if (i == word.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */
                                this.tempWordObjects = Object.assign(this.tempWordObjects, {
                                    word: {beskrivning: this.desc, horisontellt: true, pos: this.getPositions(word, h, v, true)}
                                })

                                this.updateWordPositionsHoriz(h, v, wordSplit)
                            }
                        } else {
                            break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                        }
                    }
                } else if (word.length() <= vert - v) { /* FÅR PLATS VERTIKALT? */
                    for (let i = 1; i < word.length(); i++) {
                        if (this.wordPositions[h][v + i] == wordSplit[i] || this.wordPositions[h][v + i] == null) { /* räcker med att spara första och sista positionen för ordet! */
                            if (i == word.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */
                                this.tempWordObjects = Object.assign(this.tempWordObjects, {
                                    word: {beskrivning: this.desc, horisontellt: false, pos: this.getPositions(word, h, v, false)}
                                })

                                this.updateWordPositionsVert(h, v, wordSplit)
                            }
                        } else {
                            break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                        }
                    }
                }
            } else {
                continue
            } /* borde gå att ta bort continue */
        }
        } 

        if (this.tempWordObjects.keys().length() == 0) {
            this.alertNoMatches();
        }
      }, 
      getPositions: function (word, h, v, horizontal) {
        let pos = {};

        if (horizontal) {
            for (let i = 0; i < word.length(); i++) {
                pos = Object.assign(pos, {i: {x: h + i, y: v}
              })   
            }
        } else {
            for (let i = 0; i < word.length(); i++) {
                pos = Object.assign(pos, {i: {x: h, y: v + i}
              })
            }
        }
        return pos;
      },
      updateWordPositionsHoriz: function (h, v, wordSplit) {
        for (let i = 1; i < this.word.length(); i++) {
          this.wordPositions[h + i][v] = wordSplit[i]
        }
      },
      updateWordPositionsVert: function (h, v, wordSplit) {
        for (let i = 1; i < this.word.length(); i++) {
          this.wordPositions[h][v + i] = wordSplit[i]
        }
      },
      alertNoMatches: function () {
        alert("no matches! Try another word.")
      },
      confirmNewWord: function () {
        socket.emit("updateGrid", this.tempWordObjects, this.iterator) /* Hur ska vi låta användaren iterera över alla möjliga positioner? */
      },
      fillPositionsNull: function () {
        for (let h = 0; h < this.matrixDims.x; h++) {
            this.wordPositions[h] = [];
            /* wordPositions = [[null, null, null, null]] */
            for (let v = 0; v < this.matrixDims.y; v++) {
            this.wordPositions[h][v] = "c";
            }
        }
        console.log(this.wordPositions)
      }

    }
      
}   

  </script>
  
  <style>





</style>