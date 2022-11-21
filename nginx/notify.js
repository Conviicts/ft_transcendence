let socket;

const state = document.getElementById('state');

const connectnotify = () => {
  socket = io("http://localhost:3000/notify", {
    withCredentials: true,
  })
  socket.on('status', (data) => {
    console.log(data)
    state.innerText = data.status;
  })
}


const disconnectnotify = () => {
  socket.disconnect();
}