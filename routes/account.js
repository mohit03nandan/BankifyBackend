const express = require('express');
const {Account} = require('../models/Schema');
const {authMiddleware} = require('../middleware/authMiddleware');
const router = express.Router();


router.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance
    })
});

module.exports = router;