const verifier = require('./verifier');
const bcrypt = require('bcrypt');
const time = require('../utils/time')
const AI = require('./AI');
async function formatUserEditInfo(user){
    const updateUser = {};
    if(!user){
        return {ok: false, message:"User is undefined"};
    }
    if(user.name){
        if(verifier.verifyNameFormat(user.name)){
            updateUser.name = user.name;
        }
        else{
            return {ok: false, message:"Wrong name format"};
        }
    }
    if(user.password){
        if(verifier.verifyPasswordFormat(user.password)){
            updateUser.password = await bcrypt.hash(user.password, 10);
        }
        else{
            return {ok: false, message:"Wrong password format"};
        }
    }
    if(user.dp){
        const response = await AI.validDp(user.dp);
        if(response.data.ok){
            updateUser.dp = user.dp;
        } 
        else{
            return {ok: false, message:response.data.error};
        }
        
    }
    return {ok: true, user: updateUser};
}

function formatActivityResult(res){
    // if(result.faces == 1 && result.matches == true){
    //     console.log(result);
    //     return {ok: true, message: "reported"};
    // }
    
    // let report;
    // if(result.matches === false){
    //     report = 'Student is not present.'
    // }
    // else{
    //     report = 'Student is present.'
    // }

    // if(result.faces > 0){
    //     report = `${report} ${result.faces} people in front of camera.`
    // }

    // console.log(report)
    // const activity = {
    //     student: req.user.email,
    //     time: time.now(),
    //     report: report
    // }
    // return  activity;
}

module.exports ={
    formatUserEditInfo,
    formatActivityResult
} 