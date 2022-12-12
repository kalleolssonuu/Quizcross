<template>
    <form name="gameList">
        <button id="selectGameButtonStyle" onclick="selectAGame()">{{game.name}}</button>
    </form>

</template>


<script>

export default{
    name: 'GameComponent',
    props: {
        game: Object
    },
    data: function(){
        return{

        }
    },
    methods:{
        selectAGame: function(){
            this.$emit('selectedGame', {name: this.game.name, id: this.game.id})
        }
    }
}

</script>


<style>
#selectGameButtonStyle {
 background-color:#43918a;
 text-align: center;
 width: 90%;
 height: 2rem;
 cursor: pointer;
 border-width: 0ch;
 color:white;
 margin-left: 5%;
 margin-right: 5%;
 margin-top: 5%;
 font-family: "Comic Sans MS", "Comic Sans", cursive;
 font-size: medium;
 border-radius: 0.25rem;
}
#selectGameButtonStyle:hover{
    opacity: 75%;
    
  }
</style>