// module import  ---------------------------------------
const express = require("express");
const router = express.Router();
const { auth, isAuth, exam } = require("../middleware/auth");

// constroller required .........................................................
const userController = require("../controller/userController");
const adminController = require("../controller/adminController");

// user controller --------------------------------------------------------------
router.get("/", userController.home);
router.get("/index", exam, userController.index);
router.get("/registration", exam, userController.userRegistration);
router.post("/validateEmail", userController.userEmailValidate);
router.post("/validateUserName", userController.userNameValidate);
router.post("/registration", userController.userRegistrationData);
router.get("/login", exam, userController.userLogin);
router.post("/login", userController.userLoginData);
router.get("/dashboard", isAuth, exam, userController.userDashboard);
router.get("/signOut", isAuth, userController.userSignOut);
router.get("/appearExam", isAuth, userController.userTest);
router.get("/questions", userController.questionPaper);
router.post("/saveAnswer", userController.saveAnswer);
router.get("/getColor", userController.getColor);
router.get("/examSubmit", userController.examSubmit);
router.get("/getAnswers", userController.answers);
router.get("/timer", userController.timer);

// admin Controller  ----------------------------------------------------------
router.get("/admin", adminController.adminLogin);
router.post("/adminLogin", adminController.adminLoginData);
router.get("/adminSignOut", adminController.adminSignOut)
router.get("/adminHome", auth, adminController.adminHome);
router.get("/addExam", auth, adminController.addExam);
router.post("/addExam", auth, adminController.addExamData);
router.get("/viewExam", auth, adminController.viewExam);
router.post("/viewExamData", adminController.viewExamData);
router.get("/addQuestion", auth, adminController.addQuestion);
router.post("/addQuestion", auth, adminController.addQuestionData);
router.get("/viewQuestion", auth, adminController.viewQuestion);

// module exports .............................................................
module.exports = router;