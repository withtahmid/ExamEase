const time = require('../utils/time')

function verifyNameFormat(name){
    const nameRegex = /^[A-Za-z. ]{2,50}$/;
    return (
        typeof name == 'string' && 
        nameRegex.test(name)
        );
}

function veryfyEmailFormat(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
        typeof email == 'string' && 
        emailRegex.test(email)
    );
}

function verifyPasswordFormat(password){
    // const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{5,15}$/;
    return (
        typeof password == 'string' && 
        password.length > 7 && password.length < 50
    );
}

function verifyRole(role){
    const roles = ['student', 'faculty', , 'none', 'admin'];
    return (
        typeof role == 'string' &&
        roles.includes(role)
    );
}

function veryfySignupInfo(info){
    return (
        info.name &&
        info.email && 
        info.password &&
        info.role && 
        verifyNameFormat(info.name) &&
        veryfyEmailFormat(info.email) &&
        verifyPasswordFormat(info.password) &&
        verifyRole(info.role)
    );
}

function veryLoginInfo(info){
    return (
        info.email && 
        info.password &&
        info.email.length > 4 && info.email.length < 50 
    );
}

function isValidDateFormat(dateString) {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return dateFormatRegex.test(dateString);
  }



function verifyExamCreationInfo(exam){
    console.log(exam)
    if( !exam.title || 
        !exam.startTime ||
        !exam.endTime ||
        !exam.duration ||
        !exam.description
        ){
            console.log("here")
            return false;
        }
        if(
            exam.title.length < 5 || exam.title.length > 30 || exam.description.length > 200 ||
            !isValidDateFormat(exam.startTime) || !isValidDateFormat(exam.endTime) || exam.duration < 10 || exam.duration > 180
        ){
            
            return false;
        }
        const startTime = new Date(exam.startTime);
        const endTime = new Date(exam.endTime);
        const now = time.now();
        if((now > startTime || startTime > endTime)){
            
            return false;
        }

        const ms = endTime - startTime;
        const minuteDiff = ms / (1000 * 60);

        if(minuteDiff < exam.duration || minuteDiff > 10080){
            return false;
        }
        return true;
}

function verifyQuestionFormat(question){
    if(!question){
        return false;
    }
    if(!question.type || !question.score || !question.title){
        return false;
    }
    if(question.type === 'mcq'){
        if((!question.mcqOptions || !question.mcqAnswer)){
            return false;
        }else if((question.mcqOptions.length < 2 && question.mcqOptions.length > 6) || question.mcqOptions.length !== question.mcqAnswer.length){
            return false;
        }

        let flag = true;
        question.mcqOptions.forEach(option => {
            if(option.length == 0 || option.length > 50 ){
                flag = false;
            }
        })
        
        if(!flag){
            return false;
        }
        return true;
    }

    if(question.type === 'written'){
        if(!question.textAnswer || !question.title){
            return false;
        }
        if(question.textAnswer.length < 1 || question.textAnswer.length > 200){
            return false;
        }
        return true;
    }

    if(question.type === 'viva'){
        if(!question.textAnswer || !question.title){
            return false;
        }
        if(question.textAnswer.length < 1 || question.textAnswer.length > 200){
            return false;
        }
        return true;
    }
    return false;
}

function verifyExamStatus(exam){
    const startTime = new Date(exam.startTime);
    const endTime = new Date(exam.endTime);
    const now = time.now();

    if (now < startTime) {
        return -1;
      } else if (now > endTime) {
        return 1;
      } 
      return 0;

}

function timeIsBetween(time, startTime, endTime){
    return time >= startTime && time <= endTime
}

function timeClashesWithOtherExam(targetExam, cohort, targetId = null){
    const targetS = new Date(targetExam.startTime);
    const targetE = new Date(targetExam.endTime);
    let hasTimeClash = false;
    cohort.exams.forEach(exam =>{
        const startTime = new Date(exam.startTime);
        const endTime = new Date(exam.endTime);
        if(timeIsBetween(targetS, startTime, endTime) || timeIsBetween(targetE, startTime, endTime)
        || timeIsBetween(startTime, targetS, targetE) ||  timeIsBetween(endTime, targetS, targetE)
        ){
            if(targetId){
                if(targetId.toString() !== exam._id.toString()){
                    hasTimeClash =  true;
                }
            }
            else{
                hasTimeClash =  true;
            }
        }
    });
    return hasTimeClash;
}

function verifyCohortCreateInfo(cohort){
    if(!cohort.title || !cohort.description || !cohort.color){
        return false;
    }
    if(cohort.title.length < 3 || cohort.title.length > 20 || cohort.description.length > 30){
        return false;
    }
    return true;
}

module.exports = {
    veryfySignupInfo,
    veryfyEmailFormat,
    veryLoginInfo,
    verifyExamCreationInfo,
    verifyQuestionFormat,
    verifyExamStatus,
    timeClashesWithOtherExam,
    verifyCohortCreateInfo
};