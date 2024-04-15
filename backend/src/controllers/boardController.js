import Room from "../models/roomModel.js";
import Board from "../models/boardModel.js" ;

export const getBoard = async(req, res) => {
    try {
        const room = await Room.findById(req.params.roomid) ;
        const board = await Board.findById(room.boardId) ;

        res.status(200).json({board}) ;
    } catch (err) {
        res.status(501).json({ error: "board not found!" }) ;
    }
};

/**
 * @params body { ? } ;
 */
export const updateBoard = (req, res) => {
    try {


        res.status(200).json({ message: "OK" }) ;
    } catch (err) {
        res.status(501).json({ error: "board not found!" }) ;
    }
};