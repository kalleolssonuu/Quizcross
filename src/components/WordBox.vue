<!-- 
    - knappen ska bara vara tryckbar om man är i playvue
    - ockuperad om nån har tryckt på den
    - egenskap: "är första bokstav", "horosontell/vertikal", om första bokstav: siffra
    - pil
    - conditional style grej
    
 -->
 
 
 <template>
    <div class="letterbox">
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
        letter: String
    },
    mounted() {
      console.log("letter test: " + this.letter);
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

</style>