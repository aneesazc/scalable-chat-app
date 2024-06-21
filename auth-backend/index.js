import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/users.route.js";
import connectToMongoDB from "./db/mongoDBconnection.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// cors
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use(cookieParser());


app.use(express.json());
app.use("/auth", authRouter)
app.use("/users", userRouter)

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.listen(port, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${port}`);
});