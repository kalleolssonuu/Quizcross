<template>
    <header>
    <div class="logo"><img src="/img/HeaderLogo.png">Quizcross</div>
  </header>

    <div class="gameWrapper">
      <div id="userGames">
          User created games
          <div id="gameList">
            <div class="scroll">
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>

          
        </div>
          </div>
      </div>

      <div id="myGames">
          My games
        <div class="scroll">
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>
          -Hugo <br>

          
        </div>
        <button id="create" @click="$router.push('/create/en')">{{'Create'}}</button>
      </div>
    </div>
    <div>
      Play link: 
      <input type="text" v-model="playId">
      <button v-on:click="playCross">
        Play cross
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
  .gameWrapper{
    display: flex;
    justify-content: center;
    
  }

  #userGames {
    width: 18rem;
    height: 30rem;
    border-radius: 5px;
    border-color: #5da455;
    margin: 2.5rem;
    color: white;
    background-color: #5da455;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 20px;
    position: relative;
  }
  #myGames {
    width: 18rem;
    height: 30rem;
    border-radius: 5px;
    border-color: #5da455;
    margin: 2.5rem;
    color: white;
    background-color: #5da455;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 20px;
    position: relative;
  }
  div.scroll {
                margin:4px;
                background-color: #fffecb;
                width: 17.5rem;
                height: 24rem;
                overflow-x: hidden;
                overflow-y: auto;
                text-align:justify;
                color:black;
            }

    #create {
    width: 6rem;
    height: 2rem;
    border-radius: 15px;
    border-color: #ba0c00;
    margin: 1rem;
    color: white;
    background-color: #FE5F55;
    font-family: "Comic Sans MS", "Comic Sans", cursive;
    font-size: 15px;
    cursor:pointer;
    
  }
</style>