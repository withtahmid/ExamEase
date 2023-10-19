const User = require('../models/User');
const Cohort = require('../models/Cohort');
const Exam = require('../models/Exam');
const Question = require('../models/Question');

async function createInactiveStudent(email){
    let report = {};
    try{
        const newUser = new User({ 
            name: "fake",
            email: email,
            password: "fake",
            active: false,
            role: 'student'
          });
          const user = await newUser.save();
          return user;
    }
    catch(e){
        report.error = e;
        return report;
    }
} 


async function createNewUser(user){
    let report = {};
    try{
        const newUser = new User({ 
            name: user.name,
            email: user.email,
            password: user.password,
            active: user.active,
            role: user.role
          });
          await newUser.save();
          report.message = "Signup Successful";
          return report;
    }
    catch(e){
        report.error = e;
        return report;
    }
} 

async function createNewCohort(cohort){
    let report = {}
    try{
        const newCohort = new Cohort(cohort);
          const createdCohort = await newCohort.save();
          report.message = "Cohort Successfully Created";
          report.cohort = createdCohort;
          return report;
    }
    catch(e){
        report.error = e;
        return report;
    }
}

async function createNewExam(exam){
    let report = {};
    try{
        const newExam = new Exam(exam)
        const createdExam = await newExam.save();
        report.message = "Exam Successfully Created";
        report.exam = createdExam;
        return report;
    }
    catch(e){
        report.erroe = e;
        return report;
    }
}

async function createNewQuestion(question){
    let report = {};
    try{
        const newQuestion = new Question(question)
        const createdQuestion = await newQuestion.save();
        report.message = "Question Successfully added";
        report.question = createdQuestion;
        return report;
    }
    catch(e){
        report.erroe = e;
        return report;
    }
}


module.exports = {
    createNewUser,
    createNewCohort,
    createNewExam,
    createNewQuestion,
    createInactiveStudent
}