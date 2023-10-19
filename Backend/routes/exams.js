const express  = require('express');
const router = express.Router();
const verifier = require('../utils/verifier');
const time = require('../utils/time')
const StudentAnswer = require('../models/StudentAnswer')
const Cohort = require('../models/Cohort')
const Exam = require('../models/Exam');
const mongoose = require('mongoose');

router.get('/:examId', async (req, res) => { 
    try{
      const examId = req.params.examId;
      const exam = await Exam.findById(examId).populate('questions').exec();
      const cohort = await Cohort.findById(exam.cohort);
      const email = req.user.email;
      if(cohort.faculty !== email && !cohort.students.includes(email)){
        return res.status(500).json({success: false, message:"Unauthorized request"});
      }
      if(req.user.role === 'faculty'){
          return res.status(200).json(exam);
      }
      const examStatus  = verifier.verifyExamStatus(exam);
      console.log(examStatus)
   
      if(examStatus < 0){
        return res.status(201).json({success: false, status:examStatus, message: "Exam is not started yet"});
      }
      let studentPaper;
      if(examStatus == 0){
        console.log("here")
        let studentPaper = null;        
        exam.studentAnswers.forEach(answer =>{
          if(answer.student === req.user.email){
            studentPaper = answer;
          }
        });
        if(!studentPaper){
          console.log("nainai")
          const studentAnswers = {
            student: req.user.email,
            startTime: time.now(),
            exam: exam._id,
            submitted: false
          }

          let  newAnswer =  new StudentAnswer(studentAnswers);
          console.log(newAnswer);
          newAnswer = await newAnswer.save();
          studentPaper = newAnswer;
          exam.studentAnswers.push({
            student: req.user.email,
            answer: newAnswer._id,
            score: -1
          })
          await exam.save();
        }
      }
      else{
        exam.studentAnswers.forEach(ans => {
          if(ans.email === req.user.email){
            studentPaper = ans;
          }
        });
      }

      console.log(studentPaper);

      const questionsForStudent = {}
      exam.questions.forEach(q =>{
        questionsForStudent[q._id.toString()] = {
          _id: q.id,
          type: q.type,
          title: q.title,
          score: q.score,
          description: q.description,
          mcqOptions: q.mcqOptions,
          audio: q.audioQuestion
        }
      })

      let examForStudent = {
        _id: exam._id,
        cohort: exam.cohort,
        color: exam.color,
        title: exam.title,
        description: exam.description,
        startTime: exam.startTime,
        endTime: exam.endTime,
        duration: exam.duration,
        questions: questionsForStudent,
        studentPaper: studentPaper
      }
      return res.status(201).json({success: true, status:examStatus, exam: examForStudent});
    }
    catch(e){
        return res.status(500).json({success: false, message:"Server error"});
    }
});

module.exports = router;