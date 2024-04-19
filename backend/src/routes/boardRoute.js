import express from "express";

import * as boardController from "../controllers/boardController.js";

const router = express.Router();

router.get("/:roomid", boardController.getBoard);
router.post("/:roomid", boardController.updateBoard);

export default router;
