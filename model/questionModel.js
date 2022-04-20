const mongoose = require("mongoose");

let questionSchema = mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'exam',
    },
    question: {
        type: String,
    },
    option: {
        type: Array,
    },
    answer: {
        type: String,
    },
});

let question = mongoose.model("question", questionSchema);
module.exports = question;