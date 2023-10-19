const express  = require('express');
const router = express.Router();
const creator = require('../utils/creator');
const verifier = require('../utils/verifier');
const Cohort = require('../models/Cohort');
const Exam = require('../models/Exam');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.post('/', async (req, res) => {
    if(req.user.role !== 'faculty'){
      response = {
        success : false,
        message : "Only a faculy can create a exam"
      }
      return res.status(300).json(response);
    }
   
    const {
        title,
        description,
        targetCohortId,
        startTime,
        endTime,
        duration,
        color
    } = req.body;

    const exam = { 
        title: title,
        color: color,
        description: description,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        published: false
    }

    if(!verifier.verifyExamCreationInfo(exam) || !targetCohortId){
        response = {
            success : false,
            message : "Invalid request"
        }
        return res.status(300).json(response);
    }

    exam.cohort = new ObjectId(targetCohortId);
    const cohort = await Cohort.findById(targetCohortId).populate('exams').exec();

    if(!cohort){
        return res.status(301);
    }
    if(cohort.faculty !== req.user.email){
        response = {
            success : false,
            message : "Unauthorized request"
        }
        return res.status(300).json(response);
    }

   if(verifier.timeClashesWithOtherExam(exam, cohort)){
    response = {
        success : false,
        message : "Time clashes with other exams"
    }
    return res.status(300).json(response);
   }

    try{
        let newExam = await creator.createNewExam(exam);
        newExam = newExam.exam;
        cohort.exams.push(newExam._id);
        await cohort.save();
        return res.status(201).json({
            success:true,
            conflict: false,
            examId: newExam._id.toString(),
            exam: newExam
        });
    }
    catch(e){
        res.status(500).json(e);
    }
  });


  router.post('/:examId', async (req, res) => {
    if(req.user.role !== 'faculty'){
      response = {
        success : false,
        message : "Only a faculy can update a exam"
      }
      return res.status(300).json(response);
    }
    const examId = req.params.examId;
    const {
        title,
        targetCohortId,
        startTime,
        endTime,
        duration,
        published
    } = req.body;

    const exam = { 
        title: title,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        published: published
    }

    if(!verifier.verifyExamCreationInfo(exam) || !targetCohortId){
        response = {
            success : false,
            message : "Invalid request"
        }
        return res.status(300).json(response);
    }
    
    const cohort = await Cohort.findById(targetCohortId).populate('exams').exec();

    if(!cohort){
        return res.status(301).json({success: false, message:"Invalid cohort"});
    }
    if(cohort.faculty !== req.user.email){
        response = {
            success : false,
            message : "Unauthorized request"
        }
        return res.status(300).json(response);
    }

    const targetExam = await Exam.findById(examId);

    if(!targetExam){
        response = {
            success : false,
            message : "Invalid exam id"
        }
        return res.status(300).json(response);
    }

   if(verifier.timeClashesWithOtherExam(exam, cohort, targetExam._id)){
    response = {
        success : false,
        conflict: true,
        message : "Time clashes with other exams"
    }
    return res.status(300).json(response);
   }

    try{

        targetExam.title = exam.title;
        targetExam.startTime = exam.startTime;
        targetExam.endTime = exam.endTime;
        targetExam.duration = exam.duration;
        if(exam.published){
            targetExam.published = true;
        }
               
        await targetExam.save();
        return res.status(201).json({
            success:true,
            conflict: false,
            message: "Update successfull",
            exam: targetExam
        });
    }
    catch(e){
        res.status(500).json(e);
    }
  });
  
module.exports = router;
