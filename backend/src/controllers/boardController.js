import Room from "../models/roomModel.js";

export const getBoard = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomid);

    res.status(200).json({ board: room.board });
  } catch (err) {
    res.status(501).json({ error: "board not found!" });
  }
};

/**
 * @params body { ? } ;
 */
export const updateBoard = async (req, res) => {
  //   { from: [ 1, 6 ], to: [ 2, 5 ], isforce: false, isking: false }
  // dJ5aBrfAM2JXR7RB
  console.log(req.body);
  console.log(req.query.userid);
  let room = await Room.findById(req.body.roomId);
  room.board[req.body.from[1]][req.body.from[0]] = 0;
  let playerTurn;
  if (req.query.userid == room.ownerId) {
    room.board[req.body.to[1]][req.body.to[0]] = req.body.isking ? -2 : -1;
    playerTurn =
      req.body.isforce && req.body.cupture.length > 0 ? "owner" : "player";
  } else if (req.query.userid == room.playerId) {
    room.board[req.body.to[1]][req.body.to[0]] = req.body.isking ? 2 : 1;
    playerTurn =
      req.body.isforce && req.body.cupture.length > 0 ? "player" : "owner";
  }
  console.log(req.body.cupture);
  if (req.body.cupture.length > 0) {
    room.board[req.body.cupture[1]][req.body.cupture[0]] = 0;
  }
  console.log("==============================");
  await Room.findByIdAndUpdate(req.body.roomId, {
    board: room.board,
    playerTurn: playerTurn,
  });
  try {
    res.status(200).json({ message: "OK" });
  } catch (err) {
    res.status(501).json({ error: "board not found!" });
  }
};
