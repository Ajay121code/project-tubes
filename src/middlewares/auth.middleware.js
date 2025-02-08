import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

/**
 * Middleware to protect routes (requires valid access token)
 */
export const auth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized! No access token provided." });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                // If the access token is expired, attempt to refresh it
                if (err.name === "TokenExpiredError") {
                    return refreshAccessToken(req, res, next);
                }
                return res.status(401).json({ message: "Unauthorized! Invalid token." });
            }

            req.user = {
                _id: decoded._id,
                email: decoded.email,
                username: decoded.username,
                fullName: decoded.fullName
            };

            next(); // Proceed to the next middleware or route handler
        });
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};

/**
 * 🔄 Middleware to refresh access token using refresh token
 */
const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.headers["x-refresh-token"]; // Refresh token sent in headers

        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized! No refresh token provided." });
        }
        
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized! Invalid refresh token." });
            }

            const user = await User.findById(decoded._id);
            if (!user) {
                return res.status(401).json({ message: "Unauthorized! User not found." });
            }

            const newAccessToken = user.generateAccessToken();

            res.setHeader("x-access-token", newAccessToken);
            req.user = {
                _id: user._id,
                email: user.email,
                username: user.username,
                fullName: user.fullName
            };

            next(); // Continue processing the request
        });
    } catch (error) {
        console.error("Refresh Token Error:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
};
