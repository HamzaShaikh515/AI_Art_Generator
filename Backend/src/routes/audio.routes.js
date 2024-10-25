import express from 'express';
import { upload, processAudioAndGenerateImage } from '../controllers/audioimagegen.js'; // Adjust path accordingly

const router = express.Router();

// Route to handle audio upload, transcription, and image generation
router.post('/audio-image-gen', upload.single('audio'), async (req, res) => {
    console.log("File Uploaded:",req.file);
  try {
    // Call the processAudioAndGenerateImage function to handle transcription and image generation
    await processAudioAndGenerateImage(req, res);
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Failed to process audio and generate image' });
  }
});

export default router;