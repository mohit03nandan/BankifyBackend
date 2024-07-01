const express = require('express');
const { User,Account } = require('../models/Schema');
const {authMiddleware} = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const signupBodyTypes = require('../types/SignupBody');
const signinBodyTypes = require('../types/SigninBody');
const UpdateBody = require('../types/UpdateBody');
const {JWT_SECRET} = require("../config/token")
const router = express.Router();


console.log("JWT_SECRET", JWT_SECRET); 

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

router.post('/signup', async (req, res) => {
    const { success } = signupBodyTypes.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: 'Incorrect inputs',
        });
    }

    try {
        const existingUser = await User.findOne({ username: req.body.username });

        if (existingUser) {
            return res.status(409).json({
                message: 'Email already taken',
            });
        }

        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });


       
        /// ----- Create new account ------
        const userId = user._id;

        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })


        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        res.json({
            message: 'User created successfully',
            token: token,
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
});

router.post('/signin', async (req, res) => {
    const { success } = signinBodyTypes.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: 'Incorrect inputs',
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password,
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET);

        res.json({
            token: token,
        });
        return;
    }

    res.status(411).json({
        message: 'Error while logging in',
    });
});


router.put("/", authMiddleware, async (req, res) => {
    const { success } = UpdateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

		await User.updateOne({ _id: req.userId }, req.body);
	
    res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
