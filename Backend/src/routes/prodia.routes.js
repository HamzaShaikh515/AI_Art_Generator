import express from "express";
import { imageGenerator } from "../controllers/prodia.controllers.js";


const router = express.Router();


router.post('/generate-image', imageGenerator);

export default router;