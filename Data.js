'use strict';

const languages = ["en", "se"];

// Store data in an object to keep the global namespace clean
function Data() {
  this.crosswordPackages = {};
  this.actualCrossword = null;
  this.nameTaken = false;

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

// Ursprung: precreate bekräfta namnval
Data.prototype.checkName = function (d) {

  let name = d;
  let nameToCheck = name.replace(/\s/g, '');

  if (this.crosswordPackages[nameToCheck] === undefined) {
    return this.nameTaken = false
  }
  else {
    return this.nameTaken = true
  }

};

Data.prototype.getCheckedName = function () {
  return this.nameTaken
};

// Nedan har ursprung: klick confirmcreatecrossword i creataeview
Data.prototype.addPackage = function (d) {
  let crossword = d;
  let crosswordID = crossword.crosswordName.replace(/\s/g, '');

  this.crosswordPackages[crosswordID] = crossword;
};

Data.prototype.getCrosswordNames = function () {
  let crosswordNames =
    Object.values(this.crosswordPackages).map(item => item.crosswordName);

  return crosswordNames
};

//Nedan har ursprung: klick play i lobbyview       
Data.prototype.findMatchingGame = function (d) {
  /* här landar hela paketet som en sträng med nyckel och värde */

  let chosenID = d;
  let IDToMatch = chosenID.replace(/\s/g, '');

  let matchingCrosswordArray =
    Object.entries(this.crosswordPackages).find(([ID, pack]) => ID === IDToMatch)

  let matchingCrossword =
    Object.fromEntries([matchingCrosswordArray])

  this.actualCrossword = matchingCrossword[IDToMatch] /* skriver nyckeln --> får värdet */

};

Data.prototype.getMatchingGame = function (ID) {
  let chosenID = ID;
  let IDToMatch = chosenID.replace(/\s/g, '');

  return (this.crosswordPackages[IDToMatch])
};


module.exports = Data;




