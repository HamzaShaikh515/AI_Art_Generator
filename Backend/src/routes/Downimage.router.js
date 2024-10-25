import express from 'express';
import { downloadImage } from '../controllers/image.controller.js';


const router = express.Router();

// Route to download the image
router.get('/download', downloadImage);

export default router // Use module.exports to export the router
