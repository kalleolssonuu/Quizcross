'use strict';

const languages = ["en", "se"];

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};
  this.crosses = {};
  
  this.crosswordPackages= {}; // här lagras varje korsordspaket med ID som key
}

/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

Data.prototype.getUILabels = function (lang = "en") {
  const ui = require("./data/labels-" + lang + ".json");
  return ui;
}

Data.prototype.createPoll = function(pollId, lang="en") {
  if (typeof this.polls[pollId] === "undefined") {
    let poll = {};
    poll.lang = lang;  
    poll.questions = [];
    poll.answers = [];
    poll.currentQuestion = 0;              
    this.polls[pollId] = poll;
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}
Data.prototype.playCross = function(playId, lang="en") {
  if (typeof this.crosses[playId] === "undefined") {
    let cross = {};
    cross.lang = lang;  
    cross.questions = [];
    cross.answers = [];
    cross.currentQuestion = 0;              
    this.crosses[playId] = cross;
    console.log("cross created", playId, cross);
  }
  return this.crosses[playId];
}

Data.prototype.addQuestion = function(pollId, q) {
  const poll = this.polls[pollId];
  console.log("question added to", pollId, q);
  if (typeof poll !== 'undefined') {
    poll.questions.push(q);
  }
}

Data.prototype.editQuestion = function(pollId, index, newQuestion) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    poll.questions[index] = newQuestion;
  }
}

Data.prototype.getQuestion = function(pollId, qId=null) {
  const poll = this.polls[pollId];
  console.log("question requested for ", pollId, qId);
  if (typeof poll !== 'undefined') {
    if (qId !== null) {
      poll.currentQuestion = qId;
    }
    return poll.questions[poll.currentQuestion];
  }
  return []
}

Data.prototype.submitAnswer = function(pollId, answer) {
  const poll = this.polls[pollId];
  console.log("answer submitted for ", pollId, answer);
  if (typeof poll !== 'undefined') {
    let answers = poll.answers[poll.currentQuestion];
    if (typeof answers !== 'object') {
      answers = {};
      answers[answer] = 1;
      poll.answers.push(answers);
    }
    else if (typeof answers[answer] === 'undefined')
      answers[answer] = 1;
    else
      answers[answer] += 1
    console.log("answers looks like ", answers, typeof answers);
  }
}

Data.prototype.getAnswers = function(pollId) {
  const poll = this.polls[pollId];
  if (typeof poll !== 'undefined') {
    const answers = poll.answers[poll.currentQuestion];
    if (typeof poll.questions[poll.currentQuestion] !== 'undefined') {
      return {q: poll.questions[poll.currentQuestion].q, a: answers};
    }
  }
  return {}
};


// FUNKTIONER FÖR CROSSWORDPACKAGES:
Data.prototype.addPackage = function(pack) {
      //lagrar varje mottaget paket i en array med ID som key
      //  - skapa ID kopplat till IP i annan  funk???
  
  let ID = Math.floor(Math.random() * 9000) + 1000;

  this.crosswordPackages[ID] = pack; 

  console.log("i data.addPackage")
};

Data.prototype.getAllCrosswordPackages = function () { // returnerar info för actualplayview
  console.log("i data.getAlllCrosswordPackages")
  return this.crosswordPackages;
  };

Data.prototype.getAllPackageInfoForLobby = function () { // returerar info för lobbyview
    // NÅNSTANS MÅSTE GAMENAME SKRIVAS IN!! NU BARA ID
  console.log("i data.getAllPackageInfoForLobby")
  return Object.keys(this.crosswordPackages)

}


module.exports = Data;



