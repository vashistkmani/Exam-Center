
let auth = async (req, res, next) => {
    if (req.session.auth) {
        next();
    } else {
        res.redirect("/admin");
    };
};
let isAuth = async (req, res, next) => {
    if (req.session.auth) {
        next();
    } else {
        res.redirect("/login");
    };
}

let exam = async (req, res, next) => {
    if (req.session.appearExam) {
        let id = req.session.examId;
        return res.redirect(`/appearExam?exam=${id}`);
    } else {
        next();
    }
};

module.exports = { auth, isAuth, exam };