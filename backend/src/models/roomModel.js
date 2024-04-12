import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    default: uuidv4,
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
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
  gameState: {
    type: String,
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
  playerTurn: {
    type: String,
    required: true,
  },
});

const Room = mongoose.model("Room", RoomSchema);

export default Room;
