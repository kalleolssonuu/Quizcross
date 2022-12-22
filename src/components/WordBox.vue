<!-- 
    - knappen ska bara vara tryckbar om man är i playvue
    - ockuperad om nån har tryckt på den
    - egenskap: "är första bokstav", "horosontell/vertikal", om första bokstav: siffra
    - pil
    - conditional style grej
    
 -->
 
 
 <template>
    <div class="letterbox" @click="testClick">
        {{ letter }}
    </div>


 </template>


 <script>

  export default {
    data: function() {
      return {
        name: 'WordBox'
      }
    },
    props: {
        xkey: Number,
        ykey: Number,
        letter: String,
        direction: String,
        isFirstLetter: Boolean,
        sourceName: String
    },
    computed: {

    },
    methods: {
      testClick: function() {
        if (this.sourceName == "CreateCrosswordView" && this.isFirstLetter == true) {
          alert("x coordinate: " + this.xkey + ", y coordinate: " + this.ykey)
        } else {
          alert("test noclick")
        }
      },
      occupyWordBox: function () {
        /* Den här positionen är kopplad till ett eller två ord. Utifrån angiven riktning vill vi börja skriva och matcha bokstav för bokstav
          med det ord som är 'osynligt' på de positionerna. Om vi matchar = visa ordet för användaren och ge poäng. 
          Sätt färg på rutan efter vilken användare det är, och markera den som ockuperad. */
      }
    }
}

</script>


<style>



/* .letterbox {
  background-color: rgb(250, 244, 192);
  height: 3rem;
  width: 3rem;
  font-family: "Comic Sans MS", "Comic Sans", cursive;
  font-weight: bold;
  font-size: 2rem;
  border: black 0.15rem solid;
} */


.letterbox:empty {
  background-color: white;
  /* background-color: #A7CAB1; */
}

.letterbox:hover {
  cursor: pointer;
}

</style>