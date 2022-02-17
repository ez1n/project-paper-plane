/**
 * 서버 기본 설정
 */
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`server is running on port:${PORT}`));

/**
 * 라우팅 설정
 */
const router = express.Router();
app.use(express.static(path.join(__dirname, "src")));

router.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/src/chat.html');
});

// router setting
app.use("/", router)

/**
 * 소켓 설정
 */
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("socket is successfully connected!");
  socket.on("chatting", (data) => {
    console.log(data)
    io.emit("chatting", "그래 반가워")
  })
})