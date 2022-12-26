function sockets(io, socket, data) {
  socket.emit('init', data.getUILabels());
  
  socket.on('pageLoaded', function (lang) {
   // console.log("pageLoaded parameter lang", lang);//
    socket.emit('init', data.getUILabels(lang));
  });

  socket.on('switchLanguage', function(lang) {
    //console.log("Vilket språk från switchlanguage:", lang);//
    socket.emit('init', data.getUILabels(lang));
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


  // Funktioner för korsordsinfo:

  socket.on('emittedCrosswordInfo', function(info) {  // lyssnar efter medellanden från clients som heter emittedCrosswordInfo
    data.storeInfo(info);  // lägger till mottagna infon i egna datan (nödvändigt???? känns som ett steg för mycket)

    io.emit('currentCrosswordInfo', data.getAllCrosswordInfo() ) // "send updated info to all connected clients, note the use of io instead of socket" Fattar dock inte hur detta kan skickas till clients? tnkte att det inte hände förrän nästa steg
                                    // OBS: I burgare:  io.emit('currentQueue', { orders: data.getAllOrders() }); , 
                                    // men var väl det som gjorde att det blev dubbla keys  "orders"????

  });

  socket.emit('currentCrosswordInfo', data.getAllCrosswordInfo() ); // Send Info when a client connects
 
}

module.exports = sockets;