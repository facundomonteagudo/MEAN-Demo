import express from "express";
import postsRoutes from "./routes/posts";
import { json } from "body-parser";
import  mongoose  from "mongoose";
import path from "path";
import  authRoutes  from "./routes/auth";
const app = express();

//DB Connection
mongoose.connect(`mongodb+srv://Admin:${process.env.MONGO_PW}@cluster0.qeuqr.mongodb.net/Mean?retryWrites=true&w=majority`)
.then(() =>{
    console.log("Connected to database");
})
.catch(()=>{
    console.log("Could not connect to database");
});

app.use(json()); //body parser JSON

app.use(express.static(path.join(__dirname, "..", "public"))); //adding public directory so requests can fetch files inside that folder


app.use((req, res, next) =>{  //CORS STUFF
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Token"); //added token for API auth
    res.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, PUT, OPTIONS");
    next();
});


app.use("/api", postsRoutes);
app.use("/api", authRoutes);

export default app;