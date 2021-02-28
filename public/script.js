let socket = io();

var messages = document.getElementById('messages');

let form = document.getElementById('form');
let input = document.getElementById('input');

window.addEventListener('load', () => {
  setupEventListeners();
});

function setupEventListeners() {
  // To Lobby on submit
  const createUsername = document.querySelector('form.username');
  createUsername.addEventListener('submit', createUsernameFunc);

  const createRoom = document.querySelector('form.create-room');
  createRoom.addEventListener('submit', createRoomFunc);

  // // Send messages on submit
  // const messageChat = document.querySelector('.chat form');
  // messageChat.addEventListener('submit', onSendMessage);

  // // Leave chat on submit
  // const leaveChat = document.querySelector('.chat-leave');
  // leaveChat.addEventListener('submit', onLeaveRoom);

  // Socket io events
  socket.on('join success', loadChat);
  // socket.on('new_message', onReceivedMessage);
  socket.on('rooms', getRooms);
  socket.on('create room', createRoomFunc);

  // socket.on('password', joinChatRoom);
  // socket.on('wrong password', () => alert('Fel lösenord'));
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});
socket.on('chat message', function (msg) {
  var item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

function getRooms(rooms) {
  const open = document.querySelector('.open-rooms ul');
  open.innerText = '';
  const locked = document.querySelector('.locked-rooms ul');
  locked.innerText = '';

  rooms.forEach((room) => {
    if (room.password) {
      const li = document.createElement('li');
      li.innerText = room.id;
      locked.append(li);
      console.log(rooms);
    } else {
      const li = document.createElement('li');
      li.innerText = room.id;
      open.append(li);
      console.log(rooms);
    }
  });
  return;
}

function createUsernameFunc(e) {
  e.preventDefault();
  const [nameInput] = document.querySelector('form.username');
  const message = document.querySelector('.welcome-create-room');
  const name = nameInput.value;
  const welcome = 'Welcome to create a room and join';
  const h2 = document.createElement('h2');

  document.querySelector('.welcome-screen').classList.add('hidden');
  document.querySelector('.join-room').classList.remove('hidden');

  h2.innerText = `${welcome} ${name}!`;
  message.appendChild(h2);

  socket.emit('rooms', { name });
}

function createRoomFunc(event) {
  event.preventDefault();
  //   document.querySelector('.join-room').classList.add('hidden');
  const [roomInput] = document.querySelectorAll('.join-room input');
  const [passwordInput] = document.querySelectorAll('.password');

  const room = roomInput.value;
  const password = passwordInput.value;

  socket.emit('create room', { room, password });
  roomInput.value = '';
  passwordInput.value = '';

  socket.emit('join', room);
}

function usePassword() {
  let checkBox = document.querySelector('#checkbox');
  let input = document.querySelector('#password');
  if (checkBox.checked == true) {
    input.classList.remove('hidden');
  } else {
    input.classList.add('hidden');
  }
}

function loadChat(data) {
  console.log(data);
  document.querySelector('.join-room').classList.add('hidden');
  document.querySelector('.chat-room').classList.remove('hidden');
}
