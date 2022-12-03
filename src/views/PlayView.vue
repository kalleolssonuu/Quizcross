<template>
    <header>
    <div class="logo"><img src="/img/logo.png">Quizcross</div>
  </header>
    <div>
      Play link: 
      <input type="text" v-model="playId">
      <button v-on:click="playCross">
        Create cross
      </button>
    </div>

    <button @click="$router.push('/')">{{'Homepage'}}</button>
  </template>
  
  <script>
  /*import io from 'socket.io-client'; 
  const socket = io();*/
  
  </script>

  <style>
 header {
    background-color: #A7CAB1;
    width: 100%;
    height: 33%;
  }

  .logo {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 2.5rem;
    color: white;
    padding-top:0.2em;
    text-align: center;
  }
  .logo img {
    height:2.5rem;
    vertical-align: bottom;
    margin-right: 0.5rem; 
  }
</style>