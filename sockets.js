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
  
  
  // FUNKTIONER FÖR CROSSWORDPACKAGES:
  socket.on('createdCrosswordPackage', function(d) {
    data.addPackage(d); 

    socket.emit('currentCrosswordNames', data.getCrosswordNames() ); // ska inte data d skickas in som argument????
    io.emit('currentCrosswordNames', data.getCrosswordNames() ); // behöver väl ej skicka in något? anv bara info från this.crosspackages som redan är uppdaterad globalt
                                                                             //dvs REDAN LYSSNAR PÅ AKTUELLA MEDDELLANDET
  });
  


  // FUNKTIONER FÖR UPPDATERING AV POS NÄR KORSORD SPELAS
  socket.on('updatedOccupied', function(d) { 
    
      // måste ta emot
      //  - korsordsid pga måste veta vilket korsordpackage som ska uppdateras
      //  - position klient ockuperar
      //  - klients IP/alternativt något annat ID

    data.updateOccupied(d);
    // Vad som ska ske:
    // - positionen ska ändras i serverns data i det korsordet som har korsordsidet som skickas med "updateoccupied"
    
    io.emit('currentOccupied', data.getAllOccupied() );
    // denna ska ej finnas. eller ska ändras. 
    // Vad som ska ske:
    // - det uppdaterade korsordet ska emitas. Kanske inte gör något att skickar ut till ALLA connectade?
    // - eller går det att:

          // socket.on ("updatedOccupied", function( {nyPos, korsID, klientID} ) {

          //    data.uppdateraKorspaket(d)
          //     - uppdaterar korspaketet i this.crosswordpackages som har rätt ID
          //     - måste ju sen emitta ändring till ALLA som spelar korsordet med det ID:t, Hur ska det gå?????
          //     - kan man göra funktion på clientsida som typ aktiverer en socket.on('korsID') när man börjar spela korsord me visst ID?
          //       - Då kan det på serversida finnas:

          //   io.emit('currentOccupied', data.getUpdated???(korsID))
          //   socket.emit('currentOccupied', data.getUpdated???(korsID))
          //     - 1. ska alltså skicka ENBART DET UPPDATERADE PAKETET till DE SOM SPELAR DE UPPDATERADE PAKETET
          //     - 2. alt: skicka HELA this.crosswordPackages och rätt korsord plockas ut på klientsida

          //     ex. 1 på klientsida: 

          //           socket.on(currentOccupied, data) { tä tänker att data är ex ID:{...}
          //             if ID = IDjagspelar   (IDjagspelar sätts när playview skapas till det ID man valt i lobbyview)
          //                 --> uppdatera mitt korsord
          //           }

          // }
    }
  );

  socket.emit('currentOccupied', data.getAllOccupied() );

}

module.exports = sockets;