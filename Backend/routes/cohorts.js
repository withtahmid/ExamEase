const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver');
const User = require('../models/User')
const Cohort = require('../models/Cohort')
const Exam = require('../models/Exam');
const mongoose = require('mongoose');
const StudentAnswer = require('../models/StudentAnswer');
const ObjectId = mongoose.Types.ObjectId;

router.get('/', async (req, res) => {
    try{
        const result = await User.findOne({ email: req.user.email }).populate('cohorts').exec();
        if(!result){
          response = {
            success: false,
            message: "User not found by email"
          }
          return res.status(201).json(response);
        }
        let cohorts = {};
        result.cohorts.forEach(v => {
          cohorts[v._id.toString()] = {
            _id: v._id.toString(),
            title: v.title,
            description: v.description,
            color: v.color
          };
        });

        response = {
          success:true,
          cohorts: cohorts
        };
        return res.status(200).json(response);
      }
    catch(e){
        response = {
            success: false,
            error: e
        }
        return res.status(500).json(response);
    }
});

router.get('/:cohortId', async (req, res) => {
    const cohortId = req.params.cohortId;
    const thisUser = await User.findOne({email : req.user.email});

    if(!thisUser.cohorts.includes(new ObjectId(cohortId))){
        return res.status(300).json("Unauthorized");
    }

    const cohort = await Cohort.findById(cohortId).populate('exams').exec();
    const faculty = await User.findOne({email: cohort.faculty});
    if(!cohort || !faculty){
      return res.status(300).json({success: false, message:"Something went wrong"});
    }
    let returnCohort = {
      _id: cohort._id,
      title: cohort.title,
      color: cohort.color,
      description: cohort.description,
      faculty: cohort.faculty,
      faculty_name: faculty.name
    }
    let exams = {};
    for(let x in cohort.exams) {
  
      const val = cohort.exams[x];
      const key = val._id.toString();
        exams[key] = {
          _id: val._id.toString(),
          title: val.title,
          description: val.description,
          color: val.color,
          startTime: val.startTime,
          endTime: val.endTime,
          duration: val.duration,
          published: val.published,
          graded: val.graded,
          myAnswerPaper: null,
          totalScore: null
        }; 
        const ans = val.studentAnswers.filter(ans => ans.student == req.user.email);
        if(ans.length == 1){
          const paper = await StudentAnswer.findById(ans[0].answer);
          if(paper){
            exams[key].myAnswerPaper = {
              _id: paper._id,
              startTime: paper.startTime,
              submitted: paper.submitted,
            }
            if(paper.totalScore){
              exams[key].totalScore = paper.totalScore;
            }
          }
        }

    };

    returnCohort.exams = exams;
    returnCohort.students = cohort.students
  
    return res.status(201).json(returnCohort);
});

module.exports = router;