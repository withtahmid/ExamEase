const express  = require('express');
const router = express.Router();
const verifier = require('../utils/verifier');

const User = require('../models/User')
const Cohort = require('../models/Cohort')
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const mongoose = require('mongoose');

router.post('/', async (req, res) => { 
    try{
        
        const { targetExamId, answer } = req.body;
        const exam = await Exam.findById(targetExamId).populate('cohort').exec();
        
        if(!exam){
            return res.status(300).json({success: false, message: "Incorrect id"});
        }
        if(!exam.cohort.students.includes(req.user.email)){
            return res.status(300).json({success: false, message: "Unauthorized request"});
        }
        
        console.log(answer)

        return res.status(200).json({success: true, message: "hello hello"});
    }
    catch(e){
        return res.status(500).json({success: false, message: "Server Error!"});
    }
});


module.exports = router;