require('dotenv').config();
const express = require('express');
const router = express.Router();
const Test = require('../Models/testSchema');

router.get('/get', async (req, res) => {
    try {
        const data = await Test.find();
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/post', async (req, res) => {
    const test = new Test(req.body);
    try {
        const savedTest = await test.save();
        const data = await Test.find();
        res.status(200).send(data);
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;