import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import app from './app.js'


dotenv.config({
    path: './.env'
})

connectDB() // Initiate the database connection
.then( () => {
   app.listen(process.env.PORT || 8000, ()=> {   //take port from env file or if not found then default port 8000
    console.log(`Server is running at port ${process.env.PORT}`)
   })
})
.catch((error) =>{
  console.log("Mongodb connection Failed !!!", error);
})




