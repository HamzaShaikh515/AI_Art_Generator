// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import bodyParser from 'body-parser';
// import userRouter from './src/routes/user.routes.js'; 
// import uploadRouter from './src/routes/upload.routes.js'; 
// import communityRouter from './src/routes/community.routes.js'; 
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// import prodiarouter from './src/routes/prodia.routes.js';
// import imageRoutes from './src/routes/Downimage.router.js'; // Adjust import paths as necessary

// // Create an express app
// const app = express();

// // Get the current file path and directory
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Load environment variables
// dotenv.config();

// // CORS setup (adjust CORS_ORIGIN in your .env file)
// app.use(cors({
//     origin:'http://localhost:5173' ,  
//     credentials: true, 
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
// }));

// // Middleware setup
// app.use(express.json({ limit: "10mb", extended: true })); // JSON body parsing with size limit
// app.use(cookieParser()); // To parse cookies
// app.use(bodyParser.json({ limit: '10mb' })); // Adjust size limit as needed
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Support for URL-encoded data

// // Static file serving (for images, frontend files, etc.)
// app.use('/tem', express.static(path.join(__dirname, 'Art_generator/Backend/public/tem'))); // Serve temporary images
// app.use(express.static(path.join(__dirname, 'dist'))); // Serve React frontend build from dist folder

// // Routes declaration
// app.use("/api/v1/users", userRouter);              // User-related routes (login, signup, etc.)
// app.use("/api/v1/uploads", uploadRouter);          // Upload-related routes for handling image uploads
// app.use("/api/v1/community", communityRouter);          // Community posts routes
// app.use("/api/v1/prodia", prodiarouter);           // Routes for Prodia API integration
// app.use('/api/v1/images', imageRoutes);            // Routes for image download options

// // Error handling middleware (catches unhandled errors)
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send({
//         message: 'Something went wrong!',
//         error: err.message
//     });
// });

// // Start the server
// const PORT =  8080;
// app.listen( PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

// export default app;



import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser'; // Make sure to import body-parser if using it
import userRouter from './src/routes/user.routes.js'; 
import uploadRouter from './src/routes/upload.routes.js'; // Import upload router for uploads
import communityRouter from './src/routes/community.routes.js'; // Import post router for post actions
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import prodiarouter from './src/routes/prodia.routes.js';
import imageRoutes from './src/routes/Downimage.router.js';
import audioRoutes from './src/routes/audio.routes.js';
const app = express();

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Important for requests with credentials (like cookies)
}));

// Middleware setup
app.use(express.json({ limit: "10mb", extended:'true' }));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust the size as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));;
app.use('/tem', express.static(path.join(__dirname, 'Art_generator/Backend/public/tem'))) // Static files serving
app.use(express.static(path.join(__dirname, 'dist')));



// Routes declaration
app.use("/api/v1/users", userRouter);              // User-related routes
app.use("/api/v1/uploads", uploadRouter);          // Upload-related routes (use for handling file uploads)
app.use("/api/v1/community", communityRouter);          // Post-related routes for the community
app.use("/api/v1/prodia", prodiarouter);
app.use('/api/v1/images', imageRoutes);               // Use the image routes
app.use('/api/v1/upload-audio', audioRoutes); // Prefix routes with '/api'

app.get('/', (req, res) => {
    res.send('Welcome to the AI Art Generator API!');
});



const PORT =  8080;
app.listen( PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;