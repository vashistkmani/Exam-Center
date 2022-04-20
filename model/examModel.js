const mongoose = require("mongoose");

const examSchema = mongoose.Schema({
    examinationName: {
        type: String,
    },
    date: {
        type: String,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    duration: {
        type: String,
    },
    announced: {
        type: String,
    },
});

const examData = mongoose.model("exam", examSchema);
module.exports = examData;