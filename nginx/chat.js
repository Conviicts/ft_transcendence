let socket;

const message = document.getElementById('message');
const channelName = document.getElementById('channelName');
const messages = document.getElementById('messages');
const channels = document.getElementById('channels');

let uid = null;

const joinChannel = () => {

}

const connect = () => {
  socket = io("http://localhost:3000/tchat", {
    withCredentials: true,
  })
  socket.on('message', (data) => {
    handleNewMessage(data);
  })

  socket.on('channel', (data) => {
    channels.innerHTML = '';
    data.forEach(x => {
      handleChannel(x.name);
    });
  })

  socket.on('userConnected', (data) => {
    uid = data[0];
    console.log(uid);
  })
}


const disconnect = () => {
  socket.disconnect();
}


const handleSubmitNewMessage = () => {
  socket.emit('message', { data: message.value })
}

const createNewChannel = () => {
  socket.emit('createChannel', { name: channelName.value, isPublic: true })
}

const handleChannel = (channel) => {
  channels.appendChild(buildNewMessage(channel));
}

const handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message));
}

const buildNewMessage = (message) => {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(message))
  return li;
}