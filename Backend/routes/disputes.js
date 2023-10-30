const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver')
const verifier = require('../utils/verifier')
const creator = require('../utils/creator');
const Cohort = require('../models/Cohort');
const Exam = require('../models/Exam');
const Dispute = require('../models/Dispute');

router.post('/create', async (req, res) => {
    if(req.user.role !== 'student'){
      response = {
        success : false,
        message : "Only a student can create a dispute"
      }
      return res.status(300).json(response);
    }
    
   try{
        const {targetExamId, studentComment} = req.body;
        const exam = await Exam.findById(targetExamId).populate('cohort').exec();
        if(!exam){
          return res.status(200).json({success: false, message: "Wrong exam id"});
        }
        if(!exam.cohort.students.includes(req.user.email)){
          return res.status(200).json({success: false, message: "Unauthorized!"});
        }
        const dispute = new Dispute({
          student: req.user.email,
          exam: targetExamId,
          cohort: exam.cohort._id,
          resolved: false,
          studentComment: studentComment
        });

        const newDispute = await dispute.save();
        exam.disputes.push(newDispute._id);
        await exam.save();
        return res.status(300).json({success: true, message: "Dispute created", dispute: newDispute});
    }
    catch(e){
      res.status(500).json({error: e});
    }
  });
  
  router.post('/resolve', async (req, res) => {
    if(req.user.role !== 'faculty'){
      response = {
        success : false,
        message : "Only a faculty can resolve a dispute"
      }
      return res.status(300).json(response);
    }
    
   try{
        const {disputeId, facultyComment} = req.body;

        const dispute = await Dispute.findById(disputeId).populate('cohort').exec();
        if(!dispute){
          return res.status(200).json({success: false, message: "Wrong  id"});
        }
        if(!dispute.cohort.faculty === req.user.email){
          return res.status(200).json({success: false, message: "Unauthorized"});
        }
        if(dispute.resolved){
          return res.status(200).json({success: false, message: "Already resolved"});
        }

        dispute.facultyComment = facultyComment;
        dispute.resolved = true;
        await dispute.save();
        dispute.cohort = dispute.cohort._id
        return res.status(300).json({success: true, message: "Dispute resolved", dispute: dispute});
    }
    catch(e){
      return res.status(300).json({success: false, message: "Server Error"});
    }
  });

module.exports = router;