const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver');
const User = require('../models/User')
const Cohort = require('../models/Cohort')
const Exam = require('../models/Exam')
const evaluator = require('../utils/evaluator')

router.post('/', async (req, res) => {
    try{
        const {targetExamId} = req.body;
        if(!targetExamId){
            return res.status(201).json({success: false, message: "Undefined id"});
        }
        const exam = await Exam.findById(targetExamId).populate('cohort').populate('studentAnswers.answer').exec();
        if(!exam){
            return res.status(201).json({success: false, message: "Wrong Exam ID"});
        }
        if(exam.cohort.faculty !== req.user.email){
            return res.status(201).json({success: false, message: "Unauthorized"});
        }
        for (const studentAnswer of exam.studentAnswers) {
            await evaluator.autoEvaluate(studentAnswer);
        }
        exam.graded = true;
        exam.save();
        return res.status(201).json({success: true, message: "Grading successfull"});
      }
    catch(e){
        response = {
            success: false,
            error: e,
            message: "Server Error"
        }
        return res.status(500).json(response);
    }
});

module.exports = router;