const express = require('express');
const { User } = require("../models/Schema");
const jwt = require("jsonwebtoken");
const signupBodySchema = require("../types/Usertypes");


const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.post("/signup", async (req, res) => {
    const { success } = signupBodySchema.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Incorrect inputs"
        });
    }

    try {
        const existingUser = await User.findOne({ username: req.body.username });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already taken"
            });
        }

        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({
            message: "User created successfully",
            token: token
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});



module.exports = router;