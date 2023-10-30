const Question = require('../models/Question');
const StudentAnswer = require('../models/StudentAnswer');
const AI = require('../utils/AI')
const Math = require('../utils/math')
async function autoEvaluateMCQ(answer){
    let correct = 0;
    const n = answer.question.mcqAnswer.length;
    if(n !== answer.answer.length){
        return null;
    }
    for(let i = 0; i < n; ++i){
        if(answer.question.mcqAnswer[i] === answer.answer[i]){
            correct += 1;
        }
    }
    return Math.gradeMCQ(correct, n,  answer.question.score);  
};

async function autoEvaluateWritten(answer){
    const response = await AI.matchText(answer.question.textAnswer, answer.answer);
    if(response.data.ok){
        return Math.gradeText(response.data.result[0], answer.question.score);
    }
    return 0;
};

async function autoEvaluateViva(answer){
    const response = await AI.matchText(answer.question.textAnswer, answer.answer);
    if(response.data.ok){
        return Math.gradeViva(response.data.result[0],  answer.question.score);
    }
    return 0;
};

const evaluateEach = {
    mcq: autoEvaluateMCQ,
    written: autoEvaluateWritten,
    viva: autoEvaluateViva
}

async function autoEvaluate(answerPaper){
    const evaluatedAnswers = await Promise.all(answerPaper.answer.allAnswer.map(async (answer) => {
        answer.question = await Question.findById(answer.question);
        answer.obtainedScore = await evaluateEach[answer.question.type](answer);
        return answer;
      }));
  
      
      let total = 0;
      evaluatedAnswers.forEach(v => {
        total += v.obtainedScore;
      })

      answerPaper.answer.allAnswer = evaluatedAnswers;
      answerPaper.answer.totalScore = total;
      answerPaper.score = total;
      await answerPaper.answer.save();
}

module.exports = {
    autoEvaluate
}