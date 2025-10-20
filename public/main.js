const socket = io();
let username = '';
let userList = [];

const loginPage = document.getElementById('login-page');
const chatPage = document.getElementById('chat-page');

const loginInput = document.getElementById('username');
const messageInput = document.getElementById('message');

loginPage.style.display = 'flex';
chatPage.style.display = 'none';

loginInput.focus();

loginInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
   const name = loginInput.value.trim();

   if (name != "") {
    username = name;
    document.title = `Chat - (${username})`;

    socket.emit('join-room-request', username);

  }
}
});

function renderUserList() {
  const userListElement = document.querySelector('.user-list');
  userListElement.innerHTML = '';

  userList.forEach(user => {
    userListElement.innerHTML += `<li>${user}</li>`;
  });
}

function addMessage(type, user, message) {
  let chatListElement = document.querySelector('.chat-list');

  switch (type) {
    case 'status':
      chatListElement.innerHTML += `<li class="message-status">${message}</li>`;
      break;
    case 'message':
      chatListElement.innerHTML += `<li class="message"><span class="me">${user}:</span> ${message}</li>`;
      break;
  }
}

socket.on('join-room-response', (data) => {
  if (data.success) {
    userList = data.users;
    console.log('Usuários conectados: ', userList);

    loginPage.style.display = 'none';
    chatPage.style.display = 'flex';
    messageInput.focus();

    addMessage('status', null, `Conectado!`);

    renderUserList();
  }
});

socket.on('list-update', (data) => {
  if (data.joined) {
    addMessage('status', null, `${data.joined} entrou na sala`);
  }

  if (data.left) {
    addMessage('status', null, `${data.left} saiu da sala`);
  }
  userList = data.list;
  renderUserList();  
});