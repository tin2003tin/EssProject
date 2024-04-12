import express from "express";

import * as healthCheck from "../controllers/healthCheck.js";

const router = express.Router();

//routing traffic
router.get("/", healthCheck.getStatus);

export default router;
