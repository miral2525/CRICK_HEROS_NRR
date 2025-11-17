import express from "express";
import { addMatch, getMatches } from "./matchcontrollers.js";

const router = express.Router();

router.post("/add", addMatch);
router.get("/all", getMatches);

export default router;
