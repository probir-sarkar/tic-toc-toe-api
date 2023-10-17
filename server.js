const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const Redis = require("ioredis");
const crypto = require("crypto");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");

const redis = new Redis(
  "redis://default:dec3ce3af6424e0d8a24464d4bc71644@us1-decent-marlin-41102.upstash.io:41102"
);

app.use(cors());
app.get("/create-game", async (req, res) => {
  try {
    const gameId = await generateUniqueId();
    const data = {
      player1: req.query.player || "",
      player2: "",
      board: JSON.stringify([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]),
    };
    const createGameTable = await redis
      .pipeline()
      .hmset(`room/${gameId}`, data)
      .expire(`room/${gameId}`, 86400)
      .exec();

    if (createGameTable) {
      res.send({ gameId });
    } else {
      res.status(500).send({ error: "Failed to create game." });
    }
  } catch (err) {
    res.status(500).send({ error: "Failed to create game.", err });
  }
});
app.get("*", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  socket.on("join-game", (data) => {
    const gameId = data.gameId;
    socket.join(gameId);
  });

  socket.on("make-move", (data) => {
    // Handle game moves and broadcast updated board to players
    // ...
    // You'll need to implement the logic for handling moves here
    // ...
    // After updating the board, broadcast the updated board to all players
    io.to(data.gameId).emit("update-board", data);
  });
});

async function generateUniqueId() {
  const randomBytes = crypto.randomBytes(3);
  const gameId = randomBytes.toString("hex").toUpperCase();
  const isExist = await redis.get(`room/${gameId}`);
  if (isExist) {
    return generateUniqueId();
  }
  return gameId;
}
// async function generateUniqueId() {
//   return "123456";
// }

const PORT = process.env.PORT || 8002;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
