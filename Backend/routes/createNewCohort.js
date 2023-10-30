const express  = require('express');
const router = express.Router();
const retriver = require('../utils/retriver')
const verifier = require('../utils/verifier')
const creator = require('../utils/creator');
const Cohort = require('../models/Cohort');

router.post('/', async (req, res) => {
    if(req.user.role !== 'faculty'){
      response = {
        success : false,
        message : "Only a faculy can create a cohort"
      }
      return res.status(300).json(response);
    }
    const cohort = {
      title: req.body.cohortName,
      description: req.body.description,
      color: req.body.color,
      faculty: req.user.email
    }
    
    if(!verifier.verifyCohortCreateInfo(cohort)){
      response = {
        success : false,
        message : "Invalid fields"
      }
      return res.status(300).json(response);
    }

    try{
      const result = await creator.createNewCohort(cohort);
      let faculty = await retriver.retriveUserByEmail(req.user.email);
      faculty = faculty.user;
      faculty.cohorts.push(result.cohort._id);
      await faculty.save();
      res.status(201).json({
        success: true,
        message: "Cohort Successfully Created",
        cohort: result.cohort
      });
    }
    catch(e){
      res.status(500).json({error: e});
    }
  });
  
  router.post('/:cohortId', async (req, res) => {
    const cohortId = req.params.cohortId;
    if(req.user.role !== 'faculty'){
      response = {
        success : false,
        message : "Only a faculy can create a cohort"
      }
      return res.status(300).json(response);
    }
    const cohort = {
      title: req.body.cohortName,
      description: req.body.description,
      color: req.body.color,
      faculty: req.user.email
    }
    
    if(!verifier.verifyCohortCreateInfo(cohort)){
      response = {
        success : false,
        message : "Invalid fields"
      }
      return res.status(300).json(response);
    }

    try{
      const updated_cohort = await Cohort.findByIdAndUpdate(cohortId, cohort, { new: true });
      res.status(201).json({
        success: true,
        message: "Cohort Successfully Created",
        cohort: updated_cohort
      });
    }
    catch(e){
      res.status(500).json({error: e});
    }
  });

module.exports = router;