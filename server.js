/**
 * 서버 기본 설정
 */
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const PORT = process.env.PORT || 5000;
const cookieParser = require("cookie-parser");
server.listen(PORT, () => console.log(`server is running on port:${PORT}`));
app.use(cookieParser());


/**
 * 라우팅 설정
 */
const router = express.Router();
app.use(express.static(path.join(__dirname, "src")));

router.get('/chat', (req, res) => {
  const userName = req.query.name;
  if (typeof(userName) === 'undefined') {
    res.redirect('/');
  }
  res.cookie("userName", userName);
  res.sendFile(__dirname + '/src/chat.html');
});


// router setting
app.use("/", router);

/**
 * 소켓 설정
 */
const io = require("socket.io")(server);
const moment = require("moment");

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.name = data.name; // 소켓에 유저 이름 저장
    console.log(`${data.name} is entered chatting`);
    io.emit("join", {name:data.name});
  });

  socket.on("chatting", (data) => {
    const { name, photo, msg } = data;
    io.emit("chatting", {
      name,
      photo,
      msg,
      time: moment(new Date()).format("h:ss A")
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.name} is exited chatting`);
    io.emit("exit", {name:socket.name})
  });
});




