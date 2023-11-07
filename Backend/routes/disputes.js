const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver')
const time = require('../utils/time')
const verifier = require('../utils/verifier')
const creator = require('../utils/creator');
const StudentAnswer = require('../models/StudentAnswer');
const Exam = require('../models/Exam');
const Dispute = require('../models/Dispute');
const User = require('../models/User');
router.get('/', async (req, res) => {
  try{
    const user = await User.findOne({email: req.user.email}).populate('disputes').exec();
    if(!user){
      return res.status(400).json({success: false, message: "User not found"});
    }
    // console.log(user)
    return res.status(200).json({success: true, disputes: user.disputes});
  }
  catch(e){
    return res.status(500).json({success: false, message: "Server Error"});
  }
});

router.post('/create', async (req, res) => {
    if(req.user.role !== 'student'){
      response = {
        success : false,
        message : "Only a student can create a dispute"
      }
      return res.status(300).json(response);
    }
    
   try{
        const {targetExamId, studentComment, subject} = req.body;
        if(!targetExamId || !subject){
          return res.status(300).json({success: false, message: "Invalid request!"});
        }
        const exam = await Exam.findById(targetExamId).populate('cohort').exec();
        if(!exam){
          return res.status(200).json({success: false, message: "Wrong exam id"});
        }
        if(!exam.cohort.students.includes(req.user.email)){
          return res.status(300).json({success: false, message: "Unauthorized!"});
        }

        const user = await User.findOne({email: req.user.email});
        const faculty  = await User.findOne({email: exam.cohort.faculty});
        if(!user){
          res.status(400).json({success: false, message: "User not found"});
        }

        if(!faculty){
          res.status(400).json({success: false, message: "Faculty not found"});
        }


        let studentPaper = null;
        const tmp = exam.studentAnswers.filter( v => v.student === req.user.email);
        if(tmp.length == 1){
          studentPaper = tmp[0].answer;
        }

        const dispute = new Dispute({
          student: req.user.email,
          studentName: user.name,
          exam: targetExamId,
          subject: subject,
          cohort: exam.cohort._id,
          resolved: false,
          studentComment: studentComment,
          studentName: user.name,
          examTitle: exam.title,
          cohortTitle: exam.cohort.title,
          studentPaper:studentPaper,
          createdAt: time.now()
        });
        const newDispute = await dispute.save();
        exam.disputes.push(newDispute._id);
        user.disputes.push(newDispute._id);
        faculty.disputes.push(newDispute._id);

        await Promise.all([await exam.save(), await user.save(), await faculty.save()]);
        return res.status(300).json({success: true, message: "Dispute created", dispute: newDispute});
    }
    catch(e){
      res.status(500).json({success: false, message: "Server Error"});
    }
  });
  
  router.post('/resolve', async (req, res) => {
    if(req.user.role !== 'faculty'){
      response = {
        success : false,
        message : "Only a faculty can resolve a dispute"
      }
      return res.status(500).json(response);
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
      return res.status(500).json({success: false, message: "Server Error"});
    }
  });

module.exports = router;