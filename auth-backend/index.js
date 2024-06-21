import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import connectToMongoDB from "./db/mongoDBconnection.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// cors
app.use(cors());

app.use(express.json());
app.use("/auth", authRouter)

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.listen(port, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${port}`);
});