const socket = io();

// Mostra la modale per inserire il nome quando l'utente entra nella chat
window.onload = () => {
    const modal = document.getElementById('nameModal');
    const submitNameButton = document.getElementById('submitName');
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const sendMessageButton = document.getElementById('sendMessage');
    const messagesList = document.getElementById('messagesList');

    // Quando l'utente invia il nome
    submitNameButton.addEventListener('click', () => {
        const username = document.getElementById('username').value;
        if (username.trim()) {
            // Invia il nome al server
            socket.emit('setName', username);

            // Nascondi la modale e mostra la chat
            modal.style.display = 'none';
            chatContainer.style.display = 'block';
        }
    });

    // Mostra la lista degli utenti
    socket.on('list', (userList) => {
        const userListElement = document.getElementById('userList');
        userListElement.innerHTML = ''; // Pulisci la lista esistente

        // Aggiungi gli utenti alla lista
        userList.forEach(user => {
            const li = document.createElement('li');
            li.textContent = user.name; // Mostra solo il nome, non il socketId
            userListElement.appendChild(li);
        });
    });

    // Gestione del messaggio in arrivo
    socket.on('chatMessage', (data) => {
        const li = document.createElement('li');
        li.textContent = `${data.name}: ${data.message}`; // Mostra il nome dell'utente e il messaggio
        messagesList.appendChild(li);
    });

    // Invia il messaggio
    sendMessageButton.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            // Invia il messaggio al server
            socket.emit('chatMessage', message);

            // Pulisce il campo di input
            chatInput.value = '';
        }
    });

    // Invia il messaggio anche con "Enter"
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageButton.click();
        }
    });
};
