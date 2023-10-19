const axios = require('axios');
const apiUrl = 'https://email-sender-sarwar76200.vercel.app/send';

function generateInvitationEmail(emailId, cohortName){
    const message = `You have been added to ${cohortName} cohort of ExamEase.\nClick this url to register - <a href='http://localhost:5173/register?email=${emailId}'> Sign up </a>`;
    const email = {
        recipients: [emailId],
        subject: `Invitation to join ${cohortName}`,
        message: message
    }
    return email;
}

async function sendEmail(email){
    try{
        const response = await axios.post(apiUrl, email);
        console.log(response);
    }
    catch(e){
        return;
    }
}

module.exports = {
    generateInvitationEmail,
    sendEmail
}