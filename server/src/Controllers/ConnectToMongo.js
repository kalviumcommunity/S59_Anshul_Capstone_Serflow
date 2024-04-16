require('dotenv').config();
const mongoose = require("mongoose");

const connectToMongo = async () => {
    const { default: chalk } = await import("chalk");
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(chalk.bgGreen("Connected to MongoDB!"));
    }
    catch (err) {
        console.error(chalk.bgRed(err));
    }
}

module.exports = connectToMongo;
