function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
    //console.log("pageLoaded parameter lang", lang);
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    console.log("Vilket språk från switchlanguage:", lang);
    socket.emit('init', data.getUILabels(lang));
    socket.emit(lang);
  });

  socket.on('createPoll', function(d) {
    socket.emit('pollCreated', data.createPoll(d.pollId, d.lang));
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


  
  // FUNKTIONER FÖR CROSSWORDPACKAGES:
  socket.on('emittedCrosswordPackage', function(pack) {
    data.addPackage(pack); // lägger till paket i this.crosswordPackages med ID som key
    console.log("i socket.on");

    io.emit('currentCrosswordPackages', data.getAllCrosswordPackages() );      //"send updated info to all connected clients"
    io.emit('currentPackageInfoForLobby', data.getAllPackageInfoForLobby() );  // Tror alltså den skickar info till ALLA clients som REDAN ÄR CONNECTADE
                                                                               // dvs REDAN LYSSNAR PÅ AKTUELLA MEDDELLANDET
  });

  // OBS: I SKELETTKOD ÄR ALLA SOCKET.EMIT INOM BRACKETS I SOCKET.ON ME SAMMA MEDDELLANDE, MEN EJ I BURGER
  socket.emit('currentCrosswordPackages', data.getAllCrosswordPackages() );    // skickar aktuella info when a client connects, dvs till playview och lobbyview   
  socket.emit('currentPackageInfoForLobby', data.getAllPackageInfoForLobby() ); 

}

module.exports = sockets;