import express from "express" ;

import * as boardController from "../controllers/boardController.js" ;

const router = express.Router() ;

router.get("/:roomid", boardController.getBoard) ;

export default router ;