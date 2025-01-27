const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver')
const verifier = require('../utils/verifier')
const AI = require('../utils/AI')
const Cohort = require('../models/Cohort')
const User = require('../models/User')
const mongoose = require('mongoose');
const creator = require('../utils/creator');
const Exam = require('../models/Exam');
const { verify } = require('jsonwebtoken');
const { findByIdAndUpdate } = require('../models/StudentAnswer');
const Question = require('../models/Question');
const ObjectId = mongoose.Types.ObjectId;

router.post('/', async (req, res) => {
    let response = {}
    if(req.user.role !== 'faculty'){
      response = {
        success : false,
        message : "Unauthorised request"
      }
      return res.status(300).json(response);
    }

    const question = req.body.question;

    if(!verifier.verifyQuestionFormat(question)){
      return res.status(300).json({success: false, message: "Invalid Question format"});
    }

    const {targetExamId} = req.body;
    const exam = await Exam.findById(targetExamId).populate('cohort').exec();

    if(!exam){
        return res.status(300).json({success: false, message: "Wrong exam id"});
    }

    if(exam.cohort.faculty !== req.user.email){
          return res.status(300).json({success : false,message : "Unauthorised request"});
    }
    try{

        question.cohort = exam.cohort._id;
        question.exam = new ObjectId(targetExamId);

        try{
          if(question.type === 'viva'){
            const response = await AI.toText(question.audioAnswer.slice(35));
            if(response.data.ok){
              question.textAnswer = response.data.text;
            }
          }
        }
        catch(e){
          return res.status(500).json({success : false,message : "Failed to convert audio to text"});
        }

        const createdQuestion = await creator.createNewQuestion(question);
        exam.questions.push(createdQuestion.question._id);
        
        await exam.save();
        response = {
          success: true,
          question: createdQuestion.question
        };
        
        return res.status(200).json(response);
    }
    catch(e){
      response = {
        success : false,
        message : e
      }
      return res.status(200).json(response);
    }
  });


  router.post('/:questionId', async (req, res) => {
    const questionId = req.params.questionId;
    let response = {}
    if(req.user.role !== 'faculty'){
      response = {
        success : false,
        message : "Unauthorised request"
      }
      return res.status(300).json(response);
    }

    const question = req.body.question;

    if(!verifier.verifyQuestionFormat(question)){
      return res.status(300).json({success: false, message: "Invalid Question format"});
    }

    const {targetExamId} = req.body;
    const exam = await Exam.findById(targetExamId).populate('cohort').exec();

    if(!exam){
        return res.status(300).json({success: false, message: "Wrong exam id"});
    }

    if(exam.cohort.faculty !== req.user.email){
        response = {
            success : false,
            message : "Unauthorised request"
          }
          return res.status(300).json(response);
    }

    try{
        try{
          if(question.type === 'viva'){
            const response = await AI.toText(question.audioAnswer.slice(35));
            if(response.data.ok){
              question.textAnswer = response.data.text;
            }
          }
        }
        catch(e){
          return res.status(500).json({success : false,message : "Failed to convert audio to text"});
        }

        const updated_question = await Question.findByIdAndUpdate(questionId, question, { new: true })
        response = {
          success: true,
          question: updated_question
        };

        return res.status(200).json(response);
    }
    catch(e){
      response = {
        success : false,
        message : e
      }
      return res.status(200).json(response);
    }
  });
  
module.exports = router;