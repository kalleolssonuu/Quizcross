function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    //console.log("pageLoaded parameter lang", lang);
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    //console.log("Vilket språk från switchlanguage:", lang);
    socket.emit('init', data.getUILabels(lang));
    socket.emit(lang);
  });

  socket.on('createPoll', function(d) {
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang));
    // create poll skapar ett tomt poll och skickar ut lista med det pollet i sig
    // dvs:  return this.polls[pollId];
  });

  socket.on('playCross', function(d) {
    socket.emit('crossCreated', data.playCross(d.playId, d.lang));
  });

  socket.on('addQuestion', function(d) {
    data.addQuestion(d.pollId, {q: d.q, a: d.a});
    socket.emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('editQuestion', function(d) {
    data.editQuestion(d.pollId, d.index, {q: d.q, a: d.a});
    socket.emit('questionEdited', data.getAllQuestions(d.pollId));
  });

  socket.on('joinPoll', function(pollId) {
    socket.join(pollId);
    socket.emit('newQuestion', data.getQuestion(pollId))
    socket.emit('dataUpdate', data.getAnswers(pollId));
  });

  socket.on('runQuestion', function(d) {
    io.to(d.pollId).emit('newQuestion', data.getQuestion(d.pollId, d.questionNumber));
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('submitAnswer', function(d) {
    data.submitAnswer(d.pollId, d.answer);
    io.to(d.pollId).emit('dataUpdate', data.getAnswers(d.pollId));
  });

  socket.on('resetAll', () => {
    data = new Data();
    data.initializeData();
  });
  
  
  // Nedan har ursprung: klick på knappen "confirmcreatecrossword" i createview
  socket.on('createdCrosswordPackage', function(d) {
      data.addPackage(d);
      io.emit('currentCrosswordNames', data.getCrosswordNames() );
    });

    /* socket.emit('currentCrosswordNames', data.getCrosswordNames() );  */


  // Nedan har ursprung: Klick på knappen play i lobbyview
  socket.on('chosenGame', function(d) {    
    console.log("I finsmatchinggame")

    data.findMatchingGame(d)
    io.emit('gameToBePlayed', data.getMatchingGame() ); //  visst ska denna också finnas? när en socket redan etablerats. tänker om man vill spela ett till spel typ
  });    
  
/*   socket.emit('gameToBePlayed', data.getMatchingGame() );  */

}

module.exports = sockets;