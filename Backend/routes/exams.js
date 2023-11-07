const express  = require('express');
const router = express.Router();
const verifier = require('../utils/verifier');
const time = require('../utils/time')
const StudentAnswer = require('../models/StudentAnswer')
const Cohort = require('../models/Cohort')
const Exam = require('../models/Exam');
const mongoose = require('mongoose');
const Question = require('../models/Question');

router.get('/:examId', async (req, res) => { 
    try{
      const examId = req.params.examId;
      const exam = await Exam.findById(examId).populate('questions').populate('cohort').populate('disputes').exec();
      if(!exam){
        return res.status(200).json({success: false, message:"Exam not found"});
      }
      const cohort = exam.cohort;
      const email = req.user.email;
      if(cohort.faculty !== email && !cohort.students.includes(email)){
        return res.status(200).json({success: false, message:"Unauthorized request"});
      }

      if(req.user.role === 'faculty'){
        return res.status(200).json(exam);
      }
      
      const examStatus  = verifier.verifyExamStatus(exam);

      if(examStatus < 0){
        return res.status(201).json({success: false, status:examStatus, message: "Exam is not started yet"});
      }
      let studentPaper = null;        
      exam.studentAnswers.forEach(answer =>{
        if(answer.student === req.user.email){
          studentPaper = answer;
        }
      });
      if(!studentPaper){ 
        const studentAnswers = {
          student: req.user.email,
          startTime: time.now(),
          exam: exam._id,
          submitted: false
        }

        if(examStatus == 0){
          studentAnswers.attended = false;
        }
        else{
          studentAnswers.attended = true;
        }
        const  newAnswer =  new StudentAnswer(studentAnswers);
        studentPaper = await newAnswer.save();

        const newAnswerOfTheExam = {
          student: req.user.email,
          answer: studentPaper._id,
          score: -1
        };

        exam.studentAnswers.push(newAnswerOfTheExam);
        await exam.save();
      }
      else{
        studentPaper = await StudentAnswer.findById(studentPaper.answer);
      }
      const questionsForStudent = {}
      exam.questions.forEach(q =>{
        const key = q._id.toString();
        questionsForStudent[key] = {
          _id: q.id,
          type: q.type,
          title: q.title,
          score: q.score,
          description: q.description,
          mcqOptions: q.mcqOptions,
          audioQuestion: q.audioQuestion,
          myAnswer: null,
          myAudio: null,
          obtainedScore: null,
          correctAnswer: null
        }
        
        if(exam.published){
          if(q.type === 'mcq'){
            questionsForStudent[key].correctAnswer = q.mcqAnswer;
          }
          else if(q.type == 'written'){
            questionsForStudent[key].correctAnswer = q.textAnswer;
          }
          else if(q.type == 'viva'){
            questionsForStudent[key].correctAnswer = q.textAnswer;
            questionsForStudent[key].audioAnswer = q.audioAnswer;
          }
        }

        studentPaper.allAnswer.forEach(ans =>{
          if(ans.question.toString() === key){
            questionsForStudent[key].myAnswer = ans.answer;
            if(exam.published){
              if(ans.obtainedScore >= 0){
                questionsForStudent[key].obtainedScore = ans.obtainedScore;
              }
            }
            if(q.type == 'viva'){
              questionsForStudent[key].myAudio = ans.audio;
            }
          }
        });

        
      });

      const myAnswerPaper = {
        _id: studentPaper._id,
        startTime: studentPaper.startTime,
        submitted: studentPaper.submitted,
        totalScore: null
      };

      if(exam.published){
        myAnswerPaper.totalScore = studentPaper.totalScore
      }
      
      const disputeForStudent = exam.disputes.filter(dispute => {
        return dispute.student === req.user.email;
      })

      let examForStudent = {
        _id: exam._id,
        color: exam.color,
        title: exam.title,
        description: exam.description,
        startTime: exam.startTime,
        endTime: exam.endTime,
        duration: exam.duration,
        published: exam.published,
        graded: exam.graded,
        questions: questionsForStudent,
        disputes: disputeForStudent,

       
      }
      return res.status(201).json({success: true, status:examStatus, myAnswerPaper: myAnswerPaper, exam: examForStudent});
    }
    catch(e){
      console.log(e)
      return res.status(500).json({success: false, message:"Server error"});
    }
});

module.exports = router;