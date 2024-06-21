import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username');
        return res.status(200).json(users);
    } catch (error) {
        console.log("Error getting users", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}