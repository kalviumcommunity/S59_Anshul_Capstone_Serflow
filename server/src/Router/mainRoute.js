require('dotenv').config();
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Get Request Recieved!✅✅✅✅✅✅✅✅✅✅ ');
})

module.exports = router;