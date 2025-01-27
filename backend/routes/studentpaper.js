const express  = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const StudentAnswer = require('../models/StudentAnswer');



router.get('/:targetAnswerId', async (req, res) => {
    try{

      const targetAnswerId = req.params.targetAnswerId;

      let studentAnswer;
      try{
        studentAnswer = await StudentAnswer.findById(targetAnswerId);
        if(!studentAnswer){
          return res.status(300).json({success: false, message: "student papeer not found"});
        }
      }
      catch(e){
        return res.status(500).json({success: false, message: "Failed to retrive student paper"});
      }
      let exam;
      try{
        exam = await Exam.findById(studentAnswer.exam).populate('cohort').populate('questions').exec();
        if(req.user.email !== exam.cohort.faculty){
          return res.status(300).json({success: false, message: "Unauthorized Request!!"});
        }
      }catch(e){
        return res.status(500).json({success: false, message: "Failed to fetch exam"});
      }

    const studentPaperToShow = {};
      exam.questions.forEach(q =>{
        const key = q._id.toString();
        studentPaperToShow[key] = {
          _id: q.id,
          type: q.type,
          title: q.title,
          score: q.score,
          description: q.description,
          mcqOptions: q.mcqOptions,
          audio: q.audioQuestion,
          studentAnswer: null,
          obtainedScore: 0,
          correctAnswer: null
        }
        if(q.type === 'mcq'){
            studentPaperToShow[key].correctAnswer = q.mcqAnswer;
        }
        else if(q.type == 'written'){
        studentPaperToShow[key].correctAnswer = q.textAnswer;
        }
        else if(q.type == 'viva'){
        studentPaperToShow[key].correctAnswer = q.textAnswer;
        }

        studentAnswer.allAnswer.forEach(ans => {
          if(ans.question.toString() === key){
            studentPaperToShow[key].studentAnswer = ans.answer;
            studentPaperToShow[key].obtainedScore = ans.obtainedScore;
            if(q.type === 'viva'){
              studentPaperToShow[key].studentAudioAnswer = ans.audio;
            }
          }
        });

      });
      // -------------------------------


      const ret = {
        _id: studentAnswer._id,
        student: studentAnswer.student,
        totalScore: studentAnswer.totalScore,
        submitted: studentAnswer.submitTime,
        startTime: studentAnswer.startTime,
        submitTime: studentAnswer.submitTime,
        examTitle: exam.title,
        answerPaper: studentPaperToShow
      }
      return res.status(200).json(ret)
    }
    catch(e){
      return res.status(500).json({success: false, message: "Server Error"});
    }
  });

router.post('/grade', async (req, res) => {
    try{
      const {targetAnswerId,  grades} = req.body;
      if(!targetAnswerId ){
          return res.status(201).json({success: false, message: "targetAnswerId required"});
      }
      let studentAnswer;
      try{
        studentAnswer = await StudentAnswer.findById(targetAnswerId);
        if(!studentAnswer){
          return res.status(300).json({success: false, message: "student papeer not found"});
        }
      }
      catch(e){
        return res.status(500).json({success: false, message: "Failed to retrive student paper"});
      }
      let exam;
      try{
        exam = await Exam.findById(studentAnswer.exam).populate('cohort').exec();
        if(req.user.email !== exam.cohort.faculty){
          return res.status(300).json({success: false, message: "Unauthorized Request!!"});
        }
      }catch(e){
        return res.status(500).json({success: false, message: "Failed to fetch exam"});
      }


      for(let g in grades){
        studentAnswer.allAnswer.forEach(ans => {
          if(g === ans.question.toString()){
            ans.obtainedScore = grades[g];
          }
        })
      }
      let total = 0;
      studentAnswer.allAnswer.forEach(x => {
        if(x.obtainedScore){
          total += x.obtainedScore
        }
      });
      studentAnswer.totalScore = total;

      for(let i = 0; i < exam.studentAnswers.length; ++i){
        if(exam.studentAnswers[i].student === studentAnswer.student){
          exam.studentAnswers[i].score = total;
          break;
        }
      }
      await Promise.all([await exam.save(), await  studentAnswer.save()]);
      return res.status(201).json({success: true, message:`Total mark after manual grading : ${total}`});
    }
    catch(e){
      return res.status(500).json({success: false, message: "Server Error"});
    }
  });
  
module.exports = router;