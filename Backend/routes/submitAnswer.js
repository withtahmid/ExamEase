const express  = require('express');
const router = express.Router();
const verifier = require('../utils/verifier');
const AI = require('../utils/AI');
const time = require('../utils/time');
const StudentAnswer = require('../models/StudentAnswer')
const Cohort = require('../models/Cohort')
const Exam = require('../models/Exam');
const Question = require('../models/Question');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.post('/', async (req, res) => { 
    try{
        const {targetAnswerId, answers, submit} = req.body;
        if(!targetAnswerId || !answers){
            return res.status(201).json({success: false, message: "Invalid request"});
        }
        const studentAnswer = await StudentAnswer.findById(targetAnswerId);
        if(!studentAnswer){
            return res.status(201).json({success: false, message: "Invalid answer id"});
        }

        if(studentAnswer.student !== req.user.email){

            return res.status(201).json({success: false, message: "Unauthorized"});
        }
        if(studentAnswer.submitted){

            return res.status(201).json({success: false, message: "This exam is already submitted"});
        }

        const exam = await Exam.findById(studentAnswer.exam);
        if(!exam){
            return res.status(201).json({success: false, message: "Something went wrong"});
        }


       

        // restrictions -----------------------------------------

        // if(exam.published){
        //     return res.status(201).json({success: false, message: "This exam is published"});
        // }
        // const diff = (time.now() - (new Date(studentAnswer.startTime))) / 60000;
        // if(diff > exam.duration){
        //     return res.status(201).json({success: false, message: `Exam duration ${exam.duration} is over. cannot submit`});
        // }

        // restrictions -----------------------------------------

        for(let question in answers){
            if(!exam.questions.includes(new ObjectId(question))){
                return res.status(300).json({success: false, message: `something wrong with question id "${question}"`});
            }
        }

        for(let question in answers){
            
            const existing = studentAnswer.allAnswer.find(item =>{
                return item.question.toString() === question
            });

            const qu = await Question.findById(question);
            
            if(qu.type === 'viva'){
                try{
                    const audioToText = await AI.toText(answers[question].slice(35));
                    console.log(audioToText.data)
                    if(!audioToText.data.ok){
                        return res.status(500).json({success : false,message : audioToText.data});
                    }
                    if(existing){
                        existing.answer = audioToText.data.text;
                        existing.audio = answers[question];
                    }
                    else{
                        studentAnswer.allAnswer.push({
                            question: new ObjectId(question),
                            audio: answers[question],
                            answer: audioToText.data.text
                        });
                    }
                }
                catch(e){
                    console.log(e)
                    return res.status(500).json({success: false, message: "Failed to convert audio to text"});
                }
                
            }
            else{
                if(existing){
                    existing.answer = answers[question];
                }
                else{
                    studentAnswer.allAnswer.push({
                        question: new ObjectId(question),
                        answer: answers[question]
                    });
                }
            }            
        }

        if(submit){
            studentAnswer.submitted = true;
            studentAnswer.submitTime = time.now();
        }
        
        const result = await studentAnswer.save();

        let myAnswer = {};
        result.allAnswer.forEach(ans =>{
            myAnswer[ans.question.toString()] = ans.answer
        })

        const returnable = {
            _id: result._id,
            startTime: result.startTime,
            submitted: result.submitted,
            answers: myAnswer
        };

        return res.status(201).json({success: true, myAnswer: returnable});
    }
    catch(e){
        return res.status(500).json({success: false, message: "Server Error!"});
    }
});

module.exports = router;