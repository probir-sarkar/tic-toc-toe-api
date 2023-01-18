const express = require("express");
const app = express();
const _ = require("lodash");
const getAIMove = require("./utils.js");
const cors = require("cors");

// Enable CORS for all routes
app.use(cors());

const getDifferent = (Array1, Array2) => {
  for (let i = 0; i < Array1.length; i++) {
    if (Array1[i] !== Array2[i]) {
      return i;
    }
  }
};

app.get("/", (req, res) => {
  const reqBoard = _.split(req.query.board, "");
  if (reqBoard.length !== 9) {
    res.status(400).send("Invalid board");
    return;
  }

  const board = _.chunk(reqBoard, 3);
  let AIMove = getAIMove(board);
  AIMove = _.join(_.flatten(AIMove), "");

  const data = {
    recommendation: getDifferent(reqBoard, AIMove),
  };

  res.status(200).send(data);
});

app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
});
