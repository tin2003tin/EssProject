import Room from "../models/roomModel.js";
import activeRoom from "../activeRoom.js";

export const getAllRoom = async (req, res) => {
  try {
    const rooms = await Room.find();

    // res.status(200).json({ message: "success" }) ;
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: "error" });
  }
};

/**
 * @params body { ownerId: String, ownerName: String } ;
 */
export const createRoom = async (req, res) => {
  try {
    const roomJSON = {
      name: req.body.name,
      ownerId: req.body.ownerId,
      ownerName: req.body.ownerName,
    };

    const newRoom = new Room(roomJSON);

    const data = await newRoom.save();

    res.status(200).json(data);
  } catch (err) {
    res.status(501).json({ error: "error" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const roomid = req.params.roomid;
    const existingRoomIndex = activeRoom.findIndex(
      (room) => room.roomid === roomid
    );
    if (existingRoomIndex !== -1) {
      activeRoom.splice(existingRoomIndex, 1);
    }

    await Room.findByIdAndRemove(roomid);

    res.status(200).json({ message: "delete success" });
  } catch (err) {
    res.status(501).json({ error: "room not found!" });
  }
};

/**
 * @params body { playerId: String, playerName: String } ;
 */
export const joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomid);
    const player = req.body;

    if (room.ownerId === player.playerId) {
      res.status(200).json({ message: "owner joined successfully" });
    }
    if (room.playerId != "NaN") throw "room is full!";

    await Room.findByIdAndUpdate(req.params.roomid, req.body);

    res.status(200).json({ message: "joined successfully" });
  } catch (err) {
    if (typeof err === "string") res.status(501).json({ error: err });
    else res.status(501).json({ error: "room not found!" });
  }
};

/**
 * @params body { playerId: String, playerName: String } ;
 */
export const kickRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomid);

    if (room.playerId == "NaN") throw "room is empty!";

    const existingRoomIndex = activeRoom.findIndex(
      (r) => r.roomid === req.params.roomid
    );

    console.log(existingRoomIndex);

    if (existingRoomIndex !== -1) {
      activeRoom[existingRoomIndex].player_last_fetch = NaN;
    }

    const clearPlayer = {
      playerId: "NaN",
      playerName: "null",
      gameState: "waiting",
    };

    await Room.findByIdAndUpdate(req.params.roomid, clearPlayer);

    res.status(200).json({ message: "kicked successfully" });
  } catch (err) {
    if (typeof err === "string") res.status(501).json({ error: err });
    else res.status(501).json({ error: "room not found!" });
  }
};

/**
 * @params body { gameState: String } ;
 */
export const updateRoomState = async (req, res) => {
  try {
    await Room.findByIdAndUpdate(req.params.roomid, req.body);

    const existingRoomIndex = activeRoom.findIndex(
      (r) => r.roomid === req.params.roomid
    );

    console.log(existingRoomIndex);

    if (existingRoomIndex !== -1) {
      activeRoom[existingRoomIndex].gameState = req.body.gameState;
    }

    res.status(200).json({ message: "status updated!" });
  } catch (err) {
    res.status(501).json({ error: "room not found!" });
  }
};

export const getRoom = async (req, res) => {
  try {
    const roomid = req.params.roomid;
    const userid = req.query.userid;
    const room = await Room.findById(roomid);

    if (room.ownerId !== userid && room.playerId !== userid) {
      return res
        .status(403)
        .json({ error: "User is not allowed in this room!" });
    }

    const existingRoomIndex = activeRoom.findIndex(
      (room) => room.roomid === roomid
    );

    if (existingRoomIndex !== -1) {
      activeRoom[existingRoomIndex].gameState = room.gameState;

      if (room.ownerId === userid) {
        activeRoom[existingRoomIndex].owner_last_fetch = Date.now();
      } else if (room.playerId === userid) {
        activeRoom[existingRoomIndex].player_last_fetch = Date.now();
      }
    } else {
      activeRoom.push({
        gameState: room.gameState,
        roomid,
        owner_last_fetch: room.ownerId === userid ? Date.now() : NaN,
        player_last_fetch: room.playerId === userid ? Date.now() : NaN,
      });
    }

    res.status(200).json(room);
  } catch (err) {
    res.status(404).json({ error: "Room not found!" });
  }
};
