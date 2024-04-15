import Room from "../models/roomModel.js" ;
import Board from "../models/boardModel.js" ;

export const getAllRoom = async(req, res) => {
    try {
        const rooms = await Room.find() ;

        // res.status(200).json({ message: "success" }) ;
        res.status(200).json(rooms) ;
    } catch (err) {
        res.status(500).json({ error: "error" }) ;
    }
};

/**
 * @params body { ownerId: String, ownerName: String } ;
 */
export const createRoom = async(req, res) => {
    try {
        const newBoard = new Board() ;

        const roomJSON = {
            ownerId: req.body.ownerId,
            ownerName: req.body.ownerName,
            boardId: newBoard._id,
        };

        const newRoom = new Room(roomJSON) ;

        await newRoom.save() ;
        await newBoard.save() ;

        res.status(200).json({ message: "success" }) ;
    } catch (err) {
        res.status(501).json({ error: "error" }) ;
    }
};

export const deleteRoom = async(req, res) => {
    try {
        await Room.findByIdAndRemove(req.params.roomid) ;

        res.status(200).json({ message: "delete success" }) ;
    } catch (err) {
        res.status(501).json({ error: "room not found!" }) ;
    }
};

/**
 * @params body { playerId: String, playerName: String } ;
 */
export const joinRoom = async(req, res) => {
    try {
        const room = await Room.findById(req.params.roomid) ;

        if (room.playerId != "NaN") 
            throw "room is full!" ;

        await Room.findByIdAndUpdate(req.params.roomid, req.body) ;

        res.status(200).json({ message: "joined successfully" }) ;
    } catch (err) {
        if (typeof err === "string")
            res.status(501).json({ error: err }) ;
        else 
            res.status(501).json({ error: "room not found!" }) ;
    }
};

/**
 * @params body { playerId: String, playerName: String } ;
 */
export const kickRoom = async(req, res) => {
    try {
        const room = await Room.findById(req.params.roomid) ;

        if (room.playerId == "NaN")
            throw "room is empty!" ;

        const clearPlayer = {
            playerId: "NaN",
            playerName: "null",
        }

        await Room.findByIdAndUpdate(req.params.roomid, clearPlayer) ;

        res.status(200).json({ message: "kicked successfully" }) ;
    } catch (err) {
        if (typeof err === "string")
            res.status(501).json({ error: err }) ;
        else 
            res.status(501).json({ error: "room not found!" }) ;
    }
};

/**
 * @params body { gameState: String } ;
 */
export const updateRoomState = async(req, res) => {
    try {
        await Room.findByIdAndUpdate(req.params.roomid, req.body) ;

        res.status(200).json({ message: "status updated!" }) ;
    } catch (err) {
        res.status(501).json({ error: "room not found!" }) ;
    }
}

export const getRoom = async(req, res) => {
    try {
        const a = req.params.roomid ;
        const b = req.query.userid ;

        res.status(200).json({ a, b }) ;
        // res.status(200).json({ message: "room found!" }) ;
    } catch (err) {
        res.status(501).json({ error: "room not found!" }) ;
    }
};