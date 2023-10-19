const express  = require('express');
const router = express.Router();
const creator = require('../utils/creator')
const Cohort = require('../models/Cohort')
const User = require('../models/User')
const mongoose = require('mongoose');

const ES = require('../utils/emailSender');

const ObjectId = mongoose.Types.ObjectId;

router.post('/', async (req, res) => {
    let response = {};
    if(req.user.role !== 'faculty'){
      response = {
        success : false,
        message : "Only a faculy can add students"
      }
      return res.status(300).json(response);
    }
    const {targetCohortId, students} = req.body;
    if(!targetCohortId || !students){
        response = {
            success : false,
            message : "Invalid request"
          }
          return res.status(300).json(response);
    }

    const cohort =  await Cohort.findById(targetCohortId);
    if(!cohort){
        response = {
            success : false,
            message : "Invalid Cohort Id"
        }
        return res.status(300).json(response);
    }
    if(cohort.faculty !== req.user.email){
        response = {
            success : false,
            message : "Unauthorized request"
        }
        return res.status(300).json(response);
    }

    try{
        let  response = {}
        let added =  0;
        let invited=  0
        const promises = students.map(async (email) => {
            if (!cohort.students.includes(email)) {
                
                cohort.students.push(email);
                await cohort.save();

                const student = await User.findOne({ email: email });
                
                if (!student) {
                    const studentEmail = email;
                    const cohortName = cohort.title;

                    const newStudent = await creator.createInactiveStudent(email);
                    ES.sendEmail(ES.generateInvitationEmail(studentEmail, cohortName));
                    invited += 1;
                    newStudent.cohorts.push(new ObjectId(targetCohortId));
                    await newStudent.save();
                }
                else if(!student.active){
                    const studentEmail = email;
                    const cohortName = cohort.title;
                    ES.sendEmail(ES.generateInvitationEmail(studentEmail, cohortName));
                    invited += 1;
                    student.cohorts.push(new ObjectId(targetCohortId));
                    await student.save();
                }
                else if(student.role !== 'faculty'){
                    student.cohorts.push(new ObjectId(targetCohortId));
                    await student.save();
                    added += 1;
                }
            }
          });
          
          await Promise.all(promises);

        response = {
            success: true,
            added: added,
            invited: invited
        }

        return res.status(201).json(response);
    }
    catch(e){
        return res.status(500).json(e);
    }

  });
  
module.exports = router;