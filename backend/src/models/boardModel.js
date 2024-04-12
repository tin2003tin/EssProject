import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  boardId: {
    type: String,
     default: uuidv4,
    required: true,
  },
  table: {
    type: [[String]],
    default: [
      ["", "red", "", "red", "", "red", "", "red"],
      ["red", "", "red", "", "red", "", "red", ""],
      ["", "red", "", "red", "", "red", "", "red"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["black", "", "black", "", "black", "", "black", ""],
      ["", "black", "", "black", "", "black", "", "black"],
      ["black", "", "black", "", "black", "", "black", ""],
    ],
  },
});

const Board = mongoose.model("Board", BoardSchema);

export default Board;
