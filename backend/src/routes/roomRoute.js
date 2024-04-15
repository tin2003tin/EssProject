import express from "express" ;

import * as roomController from "../controllers/roomController.js" ;

const router = express.Router() ;

router.get("/", roomController.getAllRoom) ;
router.post("/", roomController.createRoom) ;
router.delete("/:roomid", roomController.deleteRoom) ;
router.post("/join/:roomid", roomController.joinRoom) ;
router.post("/kick/:roomid", roomController.kickRoom) ;

router.post("/:roomid", roomController.updateRoomState) ;

router.get("/:roomid", roomController.getRoom) ;

export default router ;