const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver');
const User = require('../models/User')
const Cohort = require('../models/Cohort')

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
          cohorts[v._id.toString()] = v.title;
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

module.exports = router;