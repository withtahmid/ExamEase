const express  = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const verifier = require('../utils/verifier')
const authentication = require('../authentication');

router.post('/', async (req, res) => {
  let response = {success:false}
    try {
      if(!verifier.veryLoginInfo(req.body)){
        response.message = 'Invalid login field inputs';
        return res.status(401).json(response);
      }
      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
  
      if (!user) {
        response.message = 'Invalid credintials';
        return res.status(401).json(response);
      }
      else if(!user.active){
        response.message = 'Invalid credintials';
        return res.status(401).json(response);
      }  

      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        response.message = 'Invalid credintials';
        return res.status(401).json(response);
      }
      const accessToken = authentication.generateAccessToken(user);

      response = {
        success: true,
        accessToken: accessToken,
        user: {
          name: user.name,
          email: user.email,
          role: user.role
        },
        message: 'User found successfull'
      }
      return res.json(response);
    } 
    catch (error) {
      console.error(error);
      response = {
        message: 'Server Error'
      }
      return res.status(500).json(response);
    }
  });
  
module.exports = router;