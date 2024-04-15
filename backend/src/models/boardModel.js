import mongoose from "mongoose";
import { uuid } from "uuidv4" ;

const BoardSchema = new mongoose.Schema({
  boardId: {
    type: String,
    default: uuid,
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
