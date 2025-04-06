const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let userList = []; // Lista degli utenti

app.use(express.static('public')); // Per servire i file statici (HTML, CSS, JS)

io.on('connection', (socket) => {
  console.log('Un nuovo utente si è connesso');

  // Quando un utente invia il proprio nome
  socket.on('setName', (name) => {
    // Aggiungiamo l'utente alla lista
    userList.push({ socketId: socket.id, name: name });

    // Emitto la lista aggiornata a tutti gli utenti
    io.emit('list', userList);
  });

  // Quando un utente invia un messaggio
  socket.on('chatMessage', (message) => {
    const user = userList.find(user => user.socketId === socket.id);
    if (user) {
      // Emitto il messaggio a tutti gli utenti con il nome dell'utente
      io.emit('chatMessage', { name: user.name, message: message });
    }
  });

  // Quando un utente si disconnette
  socket.on('disconnect', () => {
    console.log('Un utente si è disconnesso');
    
    // Rimuovo l'utente dalla lista
    userList = userList.filter(user => user.socketId !== socket.id);
    
    // Emitto la lista aggiornata a tutti gli utenti
    io.emit('list', userList);
  });
});

server.listen(3000, () => {
  console.log('Server in ascolto su http://localhost:3000');
});
