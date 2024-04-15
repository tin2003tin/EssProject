import mongoose from "mongoose";
import { uuid } from "uuidv4" ;

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    default: uuid,
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
  boardId: {
    type: String,
    required: true,
  },
  playerTurn: {
    type: String,
    default: "owner",
    required: true,
  },
});

const Room = mongoose.model("Room", RoomSchema);

export default Room;
