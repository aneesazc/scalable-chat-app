import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const foundUser = await User.findOne({ username });
        if (foundUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);
        return res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        console.log("Error signing up user", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await User.findOne({ username });
        if (!foundUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        generateTokenAndSetCookie(foundUser._id, res);
        return res.status(200).json({
            id: foundUser._id,
            username: foundUser.username
        }
        );
    } catch (error) {
        console.log("Error logging in user", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}