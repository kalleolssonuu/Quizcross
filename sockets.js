function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());

  socket.on('pageLoaded', function (lang) {
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function (lang) {
    socket.emit('init', data.getUILabels(lang));
    socket.emit(lang);
  });


  /* vår socket join */
  socket.on('joinPoll', function (gameID) {
    socket.join(gameID);
    socket.emit('gameToBePlayed', data.getMatchingGame(gameID));
  });

  // Ursprung: försöker välja spelnamn i preCreate
  socket.emit("nameChecked", data.getCheckedName())

  socket.on("nameToCheck", function (d) {
    data.checkName(d)

    io.to(socket.id).emit("nameChecked", data.getCheckedName()) //tydligen har varje connection ett socket.id? borde bli samma om man bara tar to(d)???
  });


  // Nedan har ursprung: klick på knappen "confirmcreatecrossword" i createview
  socket.on('createdCrosswordPackage', function (d) {
    data.addPackage(d);
    io.emit('currentCrosswordNames', data.getCrosswordNames());
  });
  socket.emit('currentCrosswordNames', data.getCrosswordNames());


  // Nedan har ursprung: Klick på knappen play i lobbyview
  socket.on('chosenGame', function (ID) {
    /* data.findMatchingGame(d) */
    io.emit('gameToBePlayed', data.getMatchingGame(ID));
  });


  // Ursprung: knapptryck eller val av bokstav i playview
  socket.on('updatedUserCrossword', (d) => {
    io.to(d.gameID).emit('sendUpdatedUserCross', d) // ändra d till d.crossword?
  })



}

module.exports = sockets;