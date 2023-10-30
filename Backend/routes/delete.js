const express  = require('express');
const router = express.Router();
const User = require('../models/User');
const Cohort = require('../models/Cohort');
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const mongoose = require('mongoose');

router.delete('/cohort/:id', async (req, res) => {
   const id = req.params.id;
   try{
    const cohort = await Cohort.findById(id);
    if(!cohort){
        return res.status(200).json({success: false, message: "Cohort not found!"});
    }
    if(cohort.faculty !== req.user.email){
        return res.status(200).json({success: false, message: "Unauthorized"});
    }
    await Cohort.findByIdAndDelete(id);
    return res.status(200).json({success: true, message: "Successfully deleted"});
   }
   catch(e){
    return res.status(500).json({success: false, message: "Server Error!"});
   }
});

router.delete('/exam/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const exam = await Exam.findById(id).populate('cohort').exec();
        if(!exam){
            return res.status(200).json({success: false, message: "Exam not found!"});
        }
        if(exam.cohort.faculty !== req.user.email){
            return res.status(200).json({success: false, message: "Unauthorized"});
        }
        await Exam.findByIdAndDelete(id);
        return res.status(200).json({success: true, message: "Successfully deleted"});
    }
    catch(e){
     return res.status(500).json({success: false, message: "Server Error!"});
    }
 });

 router.delete('/question/:id', async (req, res) => {
    const id = req.params.id;
    try{
        const question = await Question.findById(id).populate('cohort').exec();
        if(!question){
            return res.status(200).json({success: false, message: "Question not found!"});
        }
        if(question.cohort.faculty !== req.user.email){
            return res.status(200).json({success: false, message: "Unauthorized"});
        }
        await Question.findByIdAndDelete(id);
        return res.status(200).json({success: true, message: "Successfully deleted"});
    }
    catch(e){
     return res.status(500).json({success: false, message: "Server Error!"});
    }
 });

module.exports = router;