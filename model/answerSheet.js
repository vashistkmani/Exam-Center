const mongoose = require('mongoose');

let answerSheetSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    examId :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'exam'
    },
    answerSheet:{
        type:Array,
    },
});

const answerSheet = mongoose.model("answersheet", answerSheetSchema);
module.exports = answerSheet;