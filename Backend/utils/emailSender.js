const axios = require('axios');
const apiUrl = 'https://email-sender-sarwar76200.vercel.app/send';



const getTemplate = (cohortName, emailId) => {
  const template =
    `
    <!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      
      <body>
          <img src="https://i.ibb.co/CVv52Zg/free-vector-ee-train-clip-art-116884-Ee-Train-clip-art-hight.png"
              alt="ExamEase Logo" width="10%">
          <h3>Sign up to ExamEase</h3>
          <p>You have been added to ${cohortName} cohort of ExamEase. <br>
              Click <a href="http://localhost:5173/register?email=${emailId}">here</a> or paste the following link in your
              browser
              to register.<br>
              Link: http://localhost:5173/register?email=${emailId}
          </p>
      
          <br>
          <b>Regards, </b>
          <br />
          <i>The ExamEase Team</i>
      
      </body>
    
    </html>
        `;
  return template;

}


function generateInvitationEmail(emailId, cohortName) {
  const message = getTemplate(cohortName, emailId);
  const email = {
    recipients: [emailId],
    subject: `Invitation to join ${cohortName}`,
    message: message
  }
  return email;
}


async function sendEmail(email) {
  try {
    const response = await axios.post(apiUrl, email);
  }
  catch (e) {
    return;
  }
}

module.exports = {
  generateInvitationEmail,
  sendEmail
}