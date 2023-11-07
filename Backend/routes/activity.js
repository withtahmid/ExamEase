const express  = require('express');
const router = express.Router();
const verifier = require('../utils/verifier');
const retriver = require('../utils/retriver');
const formator = require('../utils/formator');
const AI = require('../utils/AI');
const time = require('../utils/time');
const StudentAnswer = require('../models/StudentAnswer')
const Cohort = require('../models/Cohort')
const Exam = require('../models/Exam');
const User = require('../models/User');
const Question = require('../models/Question');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.post('/', async (req, res) => { 
    try{
        const {targetExamId, image} = req.body;
        
        if(!targetExamId || !image){
            return res.status(300).json({success: false, message: "exam id and image required"});
        }
        const exam = await Exam.findById(targetExamId).populate('cohort').exec();
        if(!exam){
            return res.status(300).json({success: false, message: "exam not found by id"});
        }
        if(!exam.cohort.students.includes(req.user.email)){
            return res.status(300).json({success: false, message: "Unauthorized!!"});
        }
        const account = await retriver.retriveUserByEmail(req.user.email);
        if(!account.exists){
            return res.status(300).json({success: false, message: "Accound not found!!!"});
        }

        const dp = account.user.dp;
        let result;
        try{
            const temp  = await AI.faceMatch(dp, image);
            const response = temp.data;
            if(!response.ok){
                return res.status(500).json({success: false, message: "Image related error", response});
            }
            result  = response.results[0];
        }
        catch(e){
            return res.status(500).json({success: false, message: "failed to match face!"});
        }

        if(result.faces == 1 && result.matches == true){
            console.log(result);
            return res.status(200).json({success: true, message: "reported"});
        }
        
        let report;
        if(result.matches === false){
            report = 'Student is not present.'
        }
        else{
            report = 'Student is present.'
        }

        if(result.faces > 0){
            report = `${report} ${result.faces} people in front of camera.`
        }

        console.log(report)
        const activity = {
            student: req.user.email,
            time: time.now(),
            report: report
        }
        // activity.image = image;
        exam.studentActivities.push(activity);
        await exam.save();

        return res.status(200).json({success: true, message: "reported"});
    }
    catch(e){
        return res.status(500).json({success: false, message: "Server Error!"});
    }
});

module.exports = router;