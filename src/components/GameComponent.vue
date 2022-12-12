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
            this.$emit('selectedGame', {name: this.name, id: this.id})
        }
    }
}

</script>


<style>

</style>