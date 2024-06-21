import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next) {
    // Get the token from the cookie
    const token = req.cookies.jwt;
    // Check if the token is present
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log('Error verifying token', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}