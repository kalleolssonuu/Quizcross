<template>
    <div>
        <WordBox v-for="box in boxes" v-bind:box="box" v-bind:key="box.id">


        </WordBox>






    </div>
  </template>
  
  <script>
  import io from 'socket.io-client';
  const socket = io();
  
  const wordFromInput = function(inputWord, inputDesc) {
    this.word = inputWord; /* Första steget kör split på ordet och leta igenom matrisen. Resultat ["c", "l", "o", "w", "n"] */
    this.desc = inputDesc;
}

  export default {
    name: 'CreateView',
    data: function () {
      return {
        boxes: [],
        iterator: 0,
        noMatches: false,
        matrix: {horizontal: 20, vertical: 20},
        wordPositions: [[]],
        wordObjects: {}, /* {clown: {beskrivning: "pajas", horisontellt: true, pos: {bokstavIOrdningen[0]: [1, 1],
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
        wordFromInput: "",
        descFromInput: ""
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
      )
    },
    methods: {
      testAddWordObject: function (wordObject) {
        this.words.push(wordObject) /* dessa 'word' är alltså objekt */
      },
      testAddWord: function (wrd, description) {
        this.word.key = wrd; 
        this.word.description = description;
        wordFromInput = new wordFromInput("","");
      }, 
      pickWord: function () {
        this.wordObjects = Object.assign(wordObjects, tempWordObjects[this.iterator]);
      },
      findPotentialMatches: function () {
        let word = this.word;                 /* för att spara plats längre ner */
        let wordSplit = word.split();
        const horiz = this.matrix.horizontal; /* för att spara plats längre ner */
        const vert = this.matrix.vertical;    /* för att spara plats längre ner */

        for (let v = 0; v < vert; v++) {
        for (let h = 0; h < horiz; h++) {
            if (this.wordPositions[h][v] == wordSplit[0] || this.wordPositions[h][v] == null) {
                if (word.length() <= horiz - h) { /* FÅR PLATS HORISONTELLT? */
                    for (let i = 1; i < word.length(); i++) {
                        if (this.wordPositions[h + i][v] == wordSplit[i] || this.wordPositions[h + i][v] == null) { /* räcker med att spara första och sista positionen för ordet! */
                            if (i == word.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */
                                this.tempWordObjects = Object.assign(potentialMatches, {
                                    word: {beskrivning: this.desc, horisontellt: true, pos: getPositions(word, h, v, true)}
                                })
                                /* BEHÖVER LÄGGA TILL NYA ORDET I MATRISEN! Dvs. i this.wordPositions */
                            }
                        } else {
                            break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                        }
                    }
                } else if (word.length() <= vert - v) { /* FÅR PLATS VERTIKALT? */
                    for (let i = 1; i < word.length(); i++) {
                        if (this.wordPositions[h][v + i] == wordSplit[i] || this.wordPositions[h][v + i] == null) { /* räcker med att spara första och sista positionen för ordet! */
                            if (i == word.length - 1) { /* vi har tagit oss till slutet av ordet och allt har funkat */
                                this.tempWordObjects = Object.assign(potentialMatches, {
                                    word: {beskrivning: this.desc, horisontellt: false, pos: getPositions(word, h, v, false)}
                                })
                                /* BEHÖVER LÄGGA TILL NYA ORDET I MATRISEN! Dvs. i this.wordPositions */
                            }
                        } else {
                            break /* vi vill fortsätta vandringen över matrisen om någon bokstav inte uppfyller villkoret */
                        }
                    }
                }
            } else {
                continue
            }
        }
        } 

        if (this.tempWordObjects.keys().length() == 0) {
            alertNoMatches();
        }
      }, 
      getPositions: function (word, h, v, horizontal) {
        let pos = {};

        if (horizontal) {
            for (let i = 0; i < word.length(); i++) {
                pos = Object.assign(pos, {i: [h + i, v]})   
            }
        } else {
            for (let i = 0; i < word.length(); i++) {
                pos = Object.assign(pos, {i: [h, v + i]})
            }
        }
        return pos;
      },
      alertNoMatches: function () {
        alert("no matches! Try another word.")
      },
      confirmNewWord: function () {
        socket.emit("updateGrid", this.tempWordObjects, this.iterator) /* Hur ska vi låta användaren iterera över alla möjliga positioner? */
      }

    }
      
}   

  </script>
  