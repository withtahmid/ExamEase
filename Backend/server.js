const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config');
require('dotenv').config()
const {verifyToken} =  require('./authentication')


const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

mongoose.connect(config.mongoURI2, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(bodyParser.json());
// Protected routes

// GET
app.use('/user', verifyToken,  require('./routes/user'));
app.use('/cohorts', verifyToken,  require('./routes/cohorts'));

// POST
app.use('/createnewcohort', verifyToken, require('./routes/createNewCohort'))
app.use('/addstudenttocohort', verifyToken, require('./routes/addToCohort'))
app.use('/createexam', verifyToken, require('./routes/createNewExam'))
app.use('/addquestion', verifyToken, require('./routes/addQuestionToExam'))
app.use('/submitanswer', verifyToken, require('./routes/submitAnswer'))

// public routes

// GET
app.use('/exist', require('./routes/exist'));

app.use('/exams', verifyToken, require('./routes/exams'))


app.use('/signup', require('./routes/signup'));
app.use('/login', require('./routes/login'));
// app.use('/test', require('./test'));
app.get('/', (req, res)=>{
  return res.json("Hello");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
