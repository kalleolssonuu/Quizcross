<template>
    <div>
        <button id="help" v-on:click=help type="button">?</button>

    </div>

</template>

<script>
export default {
    name:'WrapperComponent',

}

</script>

<style>

#help {
    height: 3rem;
    width: 3rem;
    background-color: #FFFDD0;
    font-family: "Comic Sans MS", "Comic Sans";
    font-size: 30px;
    text-align: center;
    cursor:pointer;
    border-radius: 50%;
    border-color: black;
    position: absolute;
    top: 0;
    right:0;
    margin: 0.5rem;

  }
</style>