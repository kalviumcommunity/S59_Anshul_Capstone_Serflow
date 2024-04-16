require('dotenv').config();
const express = require('express');
const router = express.Router();
const Test = require('../Models/testSchema');
const {validatePost} = require('../Middleware/joi_schema');

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
        const error = validatePost(req.body);
        if (error.error) {
            return res.status(400).send(error.error.details[0].message);
        }
        const savedTest = await test.save();
        res.status(200).send(savedTest);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.put('/put/:id', async (req, res) => {

    try {
        const updatedTest = await Test.findByIdAndUpdate(req.params.id, req.body , {new : true});
        if(!updatedTest){
            res.status(404).send("Data not found");
        }
        res.status(200).send(updatedTest);
    } catch (err) {
        res.status(400).send(err);
    }
})


module.exports = router;