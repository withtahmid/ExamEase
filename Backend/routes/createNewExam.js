const express = require('express');
const router = express.Router();
const creator = require('../utils/creator');
const verifier = require('../utils/verifier');
const Cohort = require('../models/Cohort');
const Exam = require('../models/Exam');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.post('/', async (req, res) => {
    if (req.user.role !== 'faculty') {
        response = {
            success: false,
            message: "Only a faculy can create a exam"
        }
        return res.status(300).json(response);
    }

    const {
        title,
        description,
        targetCohortId,
        startTime,
        endTime,
        duration,
        color
    } = req.body;

    const exam = {
        title: title,
        color: color,
        description: description,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        published: false,
        graded: false
    }
    const verifyStatus = verifier.verifyExamCreationInfo(exam);
    if (!verifyStatus.status || !targetCohortId) {
        response = {
            success: false,
            message: !targetCohortId ? "Invalid request" : verifyStatus.message
        }
        return res.status(300).json(response);
    }

    exam.cohort = new ObjectId(targetCohortId);
    const cohort = await Cohort.findById(targetCohortId).populate('exams').exec();

    if (!cohort) {
        return res.status(301);
    }
    if (cohort.faculty !== req.user.email) {
        response = {
            success: false,
            message: "Unauthorized request"
        }
        return res.status(300).json(response);
    }

    if (verifier.timeClashesWithOtherExam(exam, cohort)) {
        response = {
            success: false,
            message: "Time clashes with other exams"
        }
        return res.status(300).json(response);
    }

    try {
        let newExam = await creator.createNewExam(exam);
        newExam = newExam.exam;
        cohort.exams.push(newExam._id);
        await cohort.save();
        return res.status(201).json({
            success: true,
            conflict: false,
            examId: newExam._id.toString(),
            exam: newExam
        });
    }
    catch (e) {
        res.status(500).json({ success: false, message: "server error" });
    }
});


router.post('/:examId', async (req, res) => {
    const examId = req.params.examId;
    if (req.user.role !== 'faculty') {
        response = {
            success: false,
            message: "Only a faculy can create a exam"
        }
        return res.status(300).json(response);
    }

    const {
        title,
        description,
        targetCohortId,
        startTime,
        endTime,
        duration,
        color
    } = req.body;

    const exam = {
        title: title,
        color: color,
        description: description,
        startTime: startTime,
        endTime: endTime,
        duration: duration,
        graded: false
    }
    const verifyStatus = verifier.verifyExamCreationInfo(exam);
    if (!verifyStatus.status) {
        response = {
            success: false,
            message: verifyStatus.message
        }
        return res.status(300).json(response);
    }
    const cohort = await Cohort.findById(targetCohortId).populate('exams').exec();

    if (!cohort) {
        return res.status(301);
    }
    if (cohort.faculty !== req.user.email) {
        response = {
            success: false,
            message: "Unauthorized request"
        }
        return res.status(300).json(response);
    }

    if (verifier.timeClashesWithOtherExam(exam, cohort, examId)) {
        response = {
            success: false,
            message: "Time clashes with other exams"
        }
        return res.status(300).json(response);
    }

    try {
        const newExam = await Exam.findByIdAndUpdate(examId, exam, { new: true });
        return res.status(201).json({
            success: true,
            conflict: false,
            examId: newExam._id.toString(),
            exam: newExam
        });
    }
    catch (e) {

        res.status(500).json(e);
    }
});

module.exports = router;
