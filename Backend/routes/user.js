const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver');
const formator = require('../utils/formator')
const User = require('../models/User')
const Cohort = require('../models/Cohort')

router.get('/', async (req, res) => {
  let response = {}

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
        color: v.color,
        faculty: v.faculty,
        num_students: v.students.length
      };
    });

    const user = {
      name: result.name,
      email: result.email,
      role: result.role,
      cohorts: cohorts
    };
    if(result.dp){
      user.dp = result.dp;
    }

    response = {
      success:true,
      user: user
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

router.post('/', async (req, res) => {
  
  const {user} = req.body;
  if(!user){
    return res.status(301).json({success: false, message: "user is required"});
  }
  
  const update = await formator.formatUserEditInfo(user);
  if(!update.ok){
    return res.status(301).json({success: false, message: update.message});
  }
  
  try{
    const result = await User.findOneAndUpdate({ email: req.user.email },  update.user, { new: true });
    if(!result){
      response = {
        success: false,
        message: "User not found"
      }
      return res.status(201).json(response);
    }
    return res.status(201).json({success: true, message: "User info updated"})
  }
  catch(e){
    return res.status(500).json({
      success: false,
      error: e
    });
  }
});

module.exports = router;