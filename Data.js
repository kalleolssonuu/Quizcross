'use strict';

const languages = ["en", "se"];

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};

 this.crosswordPackages = {}; // 
 this.crossword = null;    // ersätts med nytt korsord varje gång
 this.matchingCrossword = null; // VARFÖR MÅSTE JAG LAGRA GLOBALT??? ALLTID "undefind" annars. se kommentarer i matchchosen
                      // SKoja tror det löste sig? Ta bort dessa variabler sen, alltså gör dem lokala

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
    this.polls[pollId] = poll;  // här lagras polls så som våra lagras, med pollid
    console.log("poll created", pollId, poll);
  }
  return this.polls[pollId];
}

// Data.prototype.getCrosswordFromID = function(userID, crosswordID) {
//   /* ta fram användarID på samma sätt som när ID:t skapas. Returnera korsord med crosswordID */
//   return this.crosses[crosswordID]
// }

// Data.prototype.playCross = function(playId, lang="en") {
//   if (typeof this.crosses[playId] === "undefined") {
//     let cross = {};
//     cross.lang = lang;  
//     cross.questions = [];
//     cross.answers = [];
//     cross.currentQuestion = 0;              
//     this.crosses[playId] = cross;
//     console.log("cross created", playId, cross);
//   }
//   return this.crosses[playId];
// }




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


// Data.prototype.createPoll = function(pollId, lang="en") {
//   if (typeof this.polls[pollId] === "undefined") {
//     let poll = {};
//     poll.lang = lang;  
//     poll.questions = [];
//     poll.answers = [];
//     poll.currentQuestion = 0;              
//     this.polls[pollId] = poll;  // här lagras polls så som våra lagras, med pollid
//     console.log("poll created", pollId, poll);
//   }
//   return this.polls[pollId];

// FUNKTIONER NÄR CONFIRMCREATE
Data.prototype.addPackage = function(d) {
 console.log("I addPckage")

 this.crossword = d;
 let crosswordID = this.crossword.crosswordName.replace(/\s/g, ''); 
 
 this.crosswordPackages[crosswordID] = this.crossword; 

 console.log("crosswordpackages uppdaterat till:")
 console.log(this.crosswordPackages)
};

Data.prototype.getCrosswordNames = function () { 
  console.log("i data.getCrosswordNames")
  
  let crosswordNames = 
  Object.values(this.crosswordPackages).map(item => item.crosswordName);
  
  console.log("crosswordNames i getCrosswordnames uppdaterat till:")
  console.log(crosswordNames)

  return crosswordNames
};

//FUNKTIONER NÄR KLICK PLAY I LOBBY
Data.prototype.findMatchingGame = function(d) {
  console.log("I findMatchingGame")
  
  let chosenID = d;
  let IDToMatch = chosenID.replace(/\s/g, '');
 
  let matchingCrosswordArray = 
  Object.entries(this.crosswordPackages).find(([ID, pack]) => ID === IDToMatch)
  // OBS SE TILL ATT ENBART FINNS ETT MATCHANDE KORSORD
  this.matchingCrossword =
  Object.fromEntries([matchingCrosswordArray]) // NÄR MAN SKICKAR OBJEKT MÅSTE VARA DEFINED???? TSK FRÅN LISTOR??
  };

Data.prototype.getMatchingGame = function() {
  console.log("matchingcrossword i getmatchingcrossword är:")
  console.log(this.matchingCrossword)
  return(this.matchingCrossword)
};


module.exports = Data;




