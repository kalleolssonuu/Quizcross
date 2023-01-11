'use strict';

const languages = ["en", "se"];

// Store data in an object to keep the global namespace clean
function Data() {
  this.polls = {};

  this.crosswordPackages = {};       
  this.actualCrossword = null;
  this.nameTaken = false;
  

 /*  this.userCrosswordPackages = {};
 this.userCrossword = null; */

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

// Ursprung: precreate bekräfta namnval
Data.prototype.checkName = function(d) {
  //console.log("I checkName")

  let name = d;
  let nameToCheck = name.replace(/\s/g, '');

  if (this.crosswordPackages[nameToCheck] === undefined) {
    return this.nameTaken = false
  }
    else {
      return this.nameTaken = true
    }

};

Data.prototype.getCheckedName= function() {
  console.log("this.nametaken som skickas till client är:")
  console.log(this.nameTaken)
  return this.nameTaken
};




// Nedan har ursprung: klick confirmcreatecrossword i creataeview
Data.prototype.addPackage = function(d) {
 console.log("I addPckage")

 let crossword = d;
 let crosswordID = crossword.crosswordName.replace(/\s/g, ''); 
 
 this.crosswordPackages[crosswordID] = crossword; 
};

/* Data.prototype.addUserCrosswordPackage = function(d) {
  console.log("I addPckage")
 
  this.crossword = d;
  let crosswordID = this.userCrossword.crosswordName.replace(/\s/g, ''); 
  
  this.userCrosswordPackages[crosswordID] = this.crossword; 
 
  console.log("crosswordpackages uppdaterat till:")
  console.log(this.crosswordPackages)
 }; */

Data.prototype.getCrosswordNames = function () { 
  console.log("i data.getCrosswordNames")
  
  let crosswordNames = 
  Object.values(this.crosswordPackages).map(item => item.crosswordName);
  
  console.log("crosswordNames i getCrosswordnames uppdaterat till:")
  console.log(crosswordNames)

  return crosswordNames
};

//Nedan har ursprung: klick play i lobbyview       
Data.prototype.findMatchingGame = function(d) {
  console.log("I findMatchingGame")
  
  let chosenID = d;
  let IDToMatch = chosenID.replace(/\s/g, '');
 

  /* här landar hela paketet som en sträng med nyckel och värde */
  let matchingCrosswordArray = 
  Object.entries(this.crosswordPackages).find(([ID, pack]) => ID === IDToMatch)

  let matchingCrossword =
  Object.fromEntries([matchingCrosswordArray])

  this.actualCrossword = matchingCrossword[IDToMatch] /* skriver nyckeln --> får värdet */
  console.log(this.actualCrossword)

  };

Data.prototype.getMatchingGame = function(ID) {
  let chosenID = ID;
  let IDToMatch = chosenID.replace(/\s/g, '');
  console.log("ID från getMatchingGame")
  console.log("Paket från getMatchingGame: " + this.crosswordPackages[IDToMatch])
  return(this.crosswordPackages[IDToMatch])
};


module.exports = Data;




