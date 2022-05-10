const userInfo = require("../model/userModel");
const examModel = require("../model/examModel");
const question = require("../model/questionModel");
const bcrypt = require("bcrypt");
const examData = require("../model/examModel");
const answerSheetModel = require("../model/answerSheet");

class userController {
    constructor() {
        return {
            home: this.home.bind(this),
            index: this.index.bind(this),
            userRegistration: this.userRegistration.bind(this),
            userEmailValidate: this.userEmailValidate.bind(this),
            userNameValidate: this.userNameValidate.bind(this),
            userRegistrationData: this.userRegistrationData.bind(this),
            userLogin: this.userLogin.bind(this),
            userLoginData: this.userLoginData.bind(this),
            userSignOut: this.userSignOut.bind(this),
            userDashboard: this.userDashboard.bind(this),
            userTest: this.userTest.bind(this),
            questionPaper: this.questionPaper.bind(this),
            saveAnswer: this.saveAnswer.bind(this),
            getColor: this.getColor.bind(this),
            examSubmit: this.examSubmit.bind(this),
            answers: this.answers.bind(this),
            timer: this.timer.bind(this),
        };
    };

    async home(req, res, next) {
        try {
            res.redirect('/index');
        } catch (error) {
            throw error
        }
    };

    async index(req, res, next) {
        try {
            res.render("user/index", { response: undefined });
        } catch (error) {
            throw error;
        };
    };

    async userRegistration(req, res, next) {
        try {
            res.render("user/register", { response: undefined });
        } catch (error) {
            throw error;
        }
    };

    async userRegistrationData(req, res, next) {
        try {
            console.log(req.body);
            let { name, email, username, password } = req.body;
            let passHash = await bcrypt.hash(password, 12);
            let user = new userInfo({ name, email, username, password: passHash });
            await user.save();
            console.log("user signup successfully");
            res.redirect('/index');
        } catch (error) {
            throw error;
        }
    };

    async userEmailValidate(req, res, next) {
        try {
            let result = await userInfo.findOne({ email: req.body.email });
            console
            if (result) {
                res.send({ success: true });
            } else {
                res.send({ success: false });
            }
        } catch (error) {
            throw error;
        }
    };

    async userNameValidate(req, res, next) {
        try {
            let result = await userInfo.findOne({ username: req.body.userName });
            if (result) {
                res.send({ success: true });
            } else {
                res.send({ success: false });
            }
        } catch (error) {
            console.log("Error while email validation ", error);
        };
    };

    async userLogin(req, res, next) {
        try {
            res.render("user/login", { response: undefined });
        } catch (error) {
            throw error;
        };
    };

    async userLoginData(req, res, next) {
        try {
            let { username, password } = req.body;
            let data = await userInfo.findOne({ username });
            if (data) {
                let isMatch = await bcrypt.compare(password, data.password,);
                if (isMatch) {
                    console.log("login Success");
                    req.session.auth = true;
                    req.session.userDetails = data;
                    res.redirect("/dashboard");
                }
                else {
                    res.render("user/login", { response: "** User Id or Password invalid" })
                }
            } else {
                console.log("user not found");
                res.render("user/login", { response: "** User Id or Password invalid" })
            }
        } catch (error) {
            throw error;
        }
    };

    async userSignOut(req, res, next) {
        try {
            req.session.destroy();
            res.redirect("/");
        } catch (error) {
            throw error;
        }
    };

    async userDashboard(req, res, next) {
        try {
            let exams = await examModel.find();
            res.render("user/dashboard", { exams, response: undefined });
        } catch (error) {
            throw error;
        }
    };

    async userTest(req, res, next) {
        try {
            let exams = await examModel.find();
            let examId = req.query.exam;
            let result = await answerSheetModel.find({ examId });
            if (result) {
                const found = result.find(i => String(i.user) == String(req.session.userDetails._id));
                if (found) {
                    res.render("user/dashboard", { exams, response: "Already appeared to this exam." });
                } else {
                    req.session.appearExam = true;
                    let questions = await question.find({ examId });
                    if (questions.length>0) {
                        let examDetails = await examData.findOne({ _id: examId });
                        req.session.examId = examId;
                        req.session.questions = questions;
                        req.session.duration = examDetails.duration;
                        res.render("user/test", { questions, examDetails });
                    } else {
                        res.render("user/dashboard", { exams, response: "No question found" });
                    }
                };
            } else {
                req.session.appearExam = true;
                let questions = await question.find({ examId });
                let examDetails = await examData.findOne({ _id: examId });
                req.session.examId = examId;
                req.session.questions = questions;
                req.session.duration = examDetails.duration;
                res.render("user/test", { questions, examDetails, });
            };
        } catch (error) {
            throw error;
        }
    };

    async questionPaper(req, res, next) {
        try {
            let questions = req.session.questions;
            let duration = req.session.duration
            if (req.session.compareDate) {
                var compareDate = req.session.compareDate
            } else {
                var compareDate = new Date();
                compareDate.setHours(compareDate.getHours() + Number(req.session.duration));
            };
            req.session.compareDate = compareDate;
            res.send({ questions, duration });
        } catch (error) {
            throw error;
        };
    };

    async saveAnswer(req, res, next) {
        try {
            var answer = []
            if (req.session.answer) {
                answer = req.session.answer;
            };
            let found = answer.find(i => i.questionId == req.body.questionId);
            if (found) {
                let index = answer.findIndex(i => i.questionId == req.body.questionId);
                answer[index] = req.body;
            }
            else {
                answer.push(req.body);
            }
            req.session.answer = answer;
            res.send();
        } catch (error) {
            throw error;
        }
    };

    async getColor(req, res, next) {
        try {
            res.send(req.session.answer);
        } catch (error) {
            throw error;
        };
    };

    async examSubmit(req, res, next) {
        try {
            let user = req.session.userDetails._id;
            let examId = req.session.examId;
            let answerSheet = req.session.answer;
            let data = answerSheetModel({ user, examId, answerSheet });
            await data.save();
            console.log("answer save Successfully ");
            ['answer', 'questions', 'examDetails', 'examDuration', 'duration', 'examId', 'compareDate', 'appearExam'].forEach(e => delete req.session[e]);
            let exams = await examModel.find();
            res.render("user/dashboard", { exams, response: "Answer Sheet Submitted." });
        } catch (error) {
            throw error;
        }
    };

    async answers(req, res, next) {
        try {
            let answers = req.session.answer;
            res.send(answers);
        } catch (error) {
            throw error;
        }
    };

    async timer(req, res, next) {
        try {
            let compareDate = req.session.compareDate;
            var now = new Date();
            var difference = compareDate.getTime() - now.getTime();
            if (difference <= 0) {
                res.redirect('/examSubmit');
            } else {
                var seconds = Math.floor(difference / 1000);
                var minutes = Math.floor(seconds / 60);
                var hours = Math.floor(minutes / 60);
                hours %= 60
                minutes %= 60;
                seconds %= 60;
                res.send({ hours, minutes, seconds, });
            }
        } catch (error) {
            throw error;
        };
    };
};

module.exports = new userController();