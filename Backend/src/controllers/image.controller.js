import path from 'path';
import fs from 'fs';

// Controller function to handle image download
const downloadImage = (req, res) => {
  const { filename } = req.query; // Get the filename from query params

  // Construct the full path to the image
  const imagePath = path.join(__dirname, '../../public/tem', filename); // Ensure this path is correct

  // Check if the file exists
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Image not found: ${imagePath}`); // Log the error
      return res.status(404).send('Image not found'); // Send 404 if the image doesn't exist
    }

    // Set Content-Type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let mimeType;

    switch (ext) {
      case '.png':
        mimeType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
        break;
      case '.gif':
        mimeType = 'image/gif';
        break;
      case '.svg':
        mimeType = 'image/svg+xml';
        break;
      default:
        mimeType = 'application/octet-stream'; // Fallback type
    }

    // Set headers and download the image
    res.setHeader('Content-Type', mimeType); // Set the MIME type
    res.download(imagePath, (err) => {
      if (err) {
        console.error(`Download error: ${err}`); // Log the download error
        return res.status(500).send('Could not download the image'); // Handle download error
      }
    });
  });
};

export { downloadImage };
