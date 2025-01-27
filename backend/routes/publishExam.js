const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver');
const User = require('../models/User')
const Cohort = require('../models/Cohort')
const Exam = require('../models/Exam')
const evaluator = require('../utils/evaluator')

router.post('/', async (req, res) => {
    try{
        const {targetExamId, published} = req.body;
        if(!targetExamId || typeof published !== 'boolean'){
            return res.status(201).json({success: false, message: "Invalid Request"});
        }
        const exam = await Exam.findById(targetExamId).populate('cohort').exec();
        if(!exam){
            return res.status(201).json({success: false, message: "Wrong Exam ID"});
        }
        
        if(exam.cohort.faculty !== req.user.email){
            return res.status(201).json({success: false, message: "Unauthorized"});
        }
        
        exam.published = published;
        await exam.save();


        return res.status(201).json({success: true, message: `'${exam.title}' is ${published? "published" : "closed"}`});
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