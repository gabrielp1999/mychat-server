const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 3001;
app.use(cors());

const server = http.createServer(app);

app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE'],
  },
});


app.get("/", (req, res) => {
    res.send({
        message: 'api ok'
    })
})

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


server.listen(PORT, () => {
  console.log("SERVER RUNNING", PORT);
});