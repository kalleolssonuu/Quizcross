<template>
    <form name="gameList">
        <input type="radio" id={{game.id}} v-model="games" required="required">
        <label for={{game.id}}> {{game.name}}</label>
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
            selected: {},
        }
    },
    methods:{
        selectAGame: function(){
            if('document.gameList')
            var checked = document.querySelector().value;
            this.$emit('selectedGame', {name: this.game.name, id: this.game.id})
        }
    }
}

</script>


<style>

</style>