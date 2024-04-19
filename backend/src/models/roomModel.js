import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  playerId: {
    type: String,
    default: "NaN",
    required: true,
  },
  playerName: {
    type: String,
    default: "null",
    required: true,
  },
  gameState: {
    type: String,
    default: "waiting",
    required: true,
  },
  board: {
    type: [[String]],
    default: [
      ["", "1", "", "1", "", "1", "", "1"],
      ["1", "", "1", "", "1", "", "1", ""],
      ["", "0", "", "0", "", "0", "", "0"],
      ["0", "", "0", "", "0", "", "0", ""],
      ["", "0", "", "0", "", "0", "", "0"],
      ["0", "", "0", "", "0", "", "0", ""],
      ["", "-1", "", "-1", "", "-1", "", "-1"],
      ["-1", "", "-1", "", "-1", "", "-1", ""],
    ],
  },
  playerTurn: {
    type: String,
    default: "owner",
    required: true,
  },
});

const Room = mongoose.model("Room", RoomSchema);

export default Room;
