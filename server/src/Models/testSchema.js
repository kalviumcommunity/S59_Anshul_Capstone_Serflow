const mongoose = require("mongoose")

const testSchema = new mongoose.Schema({
    name : {
        type : String,
        // required : true,
    },
})

const Test = mongoose.model("tests", testSchema)

module.exports = Test