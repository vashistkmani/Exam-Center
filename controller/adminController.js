const moment = require("moment");
const examData = require("../model/examModel");
const question = require("../model/questionModel")
const mongoose = require('mongoose')

class adminController {
    constructor() {
        return {
            adminLogin: this.adminLogin.bind(this),
            adminLoginData: this.adminLoginData.bind(this),
            adminSignOut: this.adminSignOut.bind(this),
            adminHome: this.adminHome.bind(this),
            addExam: this.addExam.bind(this),
            addExamData: this.addExamData.bind(this),
            viewExam: this.viewExam.bind(this),
            viewExamData: this.viewExamData.bind(this),
            cancelExam:this.cancelExam.bind(this),
            addQuestion: this.addQuestion.bind(this),
            addQuestionData: this.addQuestionData.bind(this),
            viewQuestion: this.viewQuestion.bind(this),
        };
    };
    async adminLogin(req, res, next) {
        try {
            if (req.session.auth) {
                res.redirect("/adminHome");
            } else {
                res.render("admin/login", { response: undefined });
            }
        } catch (error) {
            throw error;
        }
    };

    async adminLoginData(req, res, next) {
        try {
            let { username, password } = req.body;
            if (username == "admin" && password == "12345") {
                console.log("login Success");
                req.session.auth = true;
                res.redirect("/adminHome");
            } else {
                res.render("admin/login", { response: "** User Id or Password invalid" })
            }
        } catch (error) {
            throw error;
        }
    };

    async adminSignOut(req, res, next) {
        try {
            req.session.destroy();
            res.redirect("/admin");
        } catch (error) {
            throw error;
        }
    }

    async adminHome(req, res, next) {
        try {
            res.render("admin/home", { response: undefined });
        } catch (error) {
            throw error;
        };
    };

    async addExam(req, res, next) {
        try {
            res.render("admin/addExam", { response: undefined });
        } catch (error) {
            throw error;
        };
    };

    async addExamData(req, res, next) {
        try {
            let { examinationName, date, startTime, endTime, duration } = req.body;
            let announced = moment().format('MMMM Do YYYY, h:mm:ss a');
            let exam = new examData({ examinationName, date, startTime, endTime, duration, announced });
            exam.save();
            res.redirect("/adminHome");
        } catch (error) {
            throw error;
        }
    };

    async viewExam(req, res, next) {
        try {
            res.render("admin/viewExam", { response: undefined });
        } catch (error) {
            throw error;
        };
    };

    async viewExamData(req, res, next) {
        try {
            let start = req.query.start;
            let len = req.query.length;
            let condition = {};
            let count = 1;
            examData.countDocuments(condition).exec((err, rows) => {
                let totalFiltered = rows
                let data = [];
                examData.find(condition)
                    .skip(Number(start))
                    .limit(Number(len))
                    .exec((err, row) => {
                        row.forEach((index) => {
                            data.push({
                                serial: count,
                                examinationName: index.examinationName,
                                date: index.date,
                                startTime: index.startTime,
                                endTime: index.endTime,
                                duration: `${index.duration} hr`,
                                announced: index.announced,
                                action: `<a href="/cancelExam?id=${index._id}" class="btn btn-danger btn-sm">Cancel</a>`,
                            })
                            count++;
                            if (count > row.length) {
                                let json_data = JSON.stringify({ data })
                                res.send(json_data);
                            };
                        })
                    })
            })
        }
        catch (err) {
            console.log("error in datatable", err);
        }
    };

    async cancelExam(req,res,next){
        try {
            let result = await examData.deleteOne({_id:req.query.id});
            if(result.deletedCount == 1){
                let questionResult = await question.deleteMany({examId:req.query.id});
                if(questionResult){
                    console.log("deletion Successfull.")
                }    
            }
            res.redirect('/viewExam');
        } catch (error) {
            console.log(error);            
        }
    };

    async addQuestion(req, res, next) {
        try {
            let response = await examData.find();
            res.render("admin/addQuestion", { response });
        } catch (error) {
            throw error;
        }
    };

    async addQuestionData(req, res, next) {
        try {
            let newQuestion = question(req.body);
            await newQuestion.save();
            res.send();
        } catch (error) {
            throw error;
        }
    };

    async viewQuestion(req, res, next) {
        try {

            let condition1 = [];
            condition1.push({
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'examId',
                    as: 'questions'
                }
            })

            let condition2 = [];
            condition2.push({
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'examId',
                    as: 'questions'
                }
            })

            if (req.query.exam) {
                condition2.push({
                    $match: {
                        _id: mongoose.Types.ObjectId(req.query.exam)
                    }
                })
            }

            let exams1 = await examData.aggregate(condition1);
            let exams2 = await examData.aggregate(condition2);
            // console.log(exams);
            res.render('admin/viewQuestion', {
                exams1,
                exams2,
                examId: req.query.exam
            })

        } catch (error) {
            throw error;
        }
    };

};

module.exports = new adminController;