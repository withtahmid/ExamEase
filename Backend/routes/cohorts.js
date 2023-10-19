const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver');
const User = require('../models/User')
const Cohort = require('../models/Cohort')
const Exam = require('../models/Exam');
const mongoose = require('mongoose');
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

    let returnCohort = {
      _id: cohort._id,
      title: cohort.title,
      color: cohort.color,
      description: cohort.description,
      faculty: cohort.faculty 
    }
    let exams = {};
    cohort.exams.forEach(val => {
        exams[val._id.toString()] = {
          _id: val._id.toString(),
          title: val.title,
          description: val.description,
          color: val.color,
          startTime: val.startTime,
          endTime: val.endTime,
          duration: val.duration
        };
    });
    returnCohort.exams = exams;
    
    if(req.user.role === 'faculty'){
      returnCohort.students = cohort.students
    }

    return res.status(201).json(returnCohort);
});

module.exports = router;