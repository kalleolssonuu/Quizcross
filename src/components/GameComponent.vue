<template>
    <form name="gameList">
        <button onclick="selectAGame()">{{game.name}}</button>
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

</style>