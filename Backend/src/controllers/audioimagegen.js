import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { imageGenerator } from './prodia.controllers.js'; // Adjust path if needed

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer configuration to store audio files temporarily
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Function to convert audio to text using AssemblyAI
const convertAudioToText = async (audioFilePath) => {
  try {
    console.log('Uploading audio to AssemblyAI...'); // Log for debugging
    const audio = fs.createReadStream(audioFilePath);

    // Upload the audio file to AssemblyAI
    const response = await axios.post('https://api.assemblyai.com/v2/upload', audio, {
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        'Transfer-Encoding': 'chunked',
      }
    });

    const audioUrl = response.data.upload_url;
    console.log('Audio uploaded successfully:', audioUrl); // Log for debugging

    // Submit audio for transcription
    const transcriptResponse = await axios.post('https://api.assemblyai.com/v2/transcript', { audio_url: audioUrl }, {
      headers: { authorization: process.env.ASSEMBLYAI_API_KEY }
    });

    const transcriptId = transcriptResponse.data.id;
    console.log('Transcript ID:', transcriptId); // Log transcript ID

    // Polling for transcription completion
    let status = transcriptResponse.data.status;
    while (status !== 'completed' && status !== 'failed') {
      console.log(`Transcription status: ${status}...`); // Log status
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds

      // Check the status of transcription
      const statusResponse = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { authorization: process.env.ASSEMBLYAI_API_KEY }
      });

      status = statusResponse.data.status;
    }

    if (status === 'completed') {
      const finalTranscript = await axios.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { authorization: process.env.ASSEMBLYAI_API_KEY }
      });
      console.log('Transcription successful. Text:', finalTranscript.data.text); // Log transcription text
      return finalTranscript.data.text; // Return the transcribed text
    } else {
      throw new Error('Transcription failed.');
    }

  } catch (err) {
    console.error('Error during audio transcription:', err);
    throw new Error('Transcription failed');
  } finally {
    // Cleanup: Delete the temporary audio file
    fs.unlinkSync(audioFilePath);
  }
};

// Route to handle audio upload, transcription, and image generation
const processAudioAndGenerateImage = async (req, res) => {
  try {
    const audioFilePath = req.file.path;

    // Get transcribed text
    const transcribedText = await convertAudioToText(audioFilePath);
    if (!transcribedText) {
      return res.status(400).json({ error: 'Transcription returned empty text.' });
    }

    console.log('Transcribed Text:', transcribedText);

    // Respond with transcribed text to the front-end
    res.json({ transcript: transcribedText });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: error.message });
  }
};

export { upload, processAudioAndGenerateImage };
