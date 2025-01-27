const express  = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifier = require('../utils/verifier')
const retriver = require('../utils/retriver')
const creator = require('../utils/creator')
const authentication = require('../authentication');
const updator = require('../utils/updator');

router.post('/', async (req, res) => {
    try {
      if(!verifier.veryfySignupInfo(req.body)){
        return res.status(401).json({ success: false,  message: 'Invalid singup informations'});
      }
      const { name, email, password, role } = req.body;
      const user = {
        name: name,
        email: email,
        password: await bcrypt.hash(password, 10),
        active: true,
        role: role 
      };

      const account = await retriver.retriveUserByEmail(email);
      let response = {
        success: false
      };

      if(!account.exists){
        const result = await creator.createNewUser(user);
        if(result.error){
          response.error = result.error;
          return res.status(500).json(result);
        }

        response.success = true;
        response.accessToken = authentication.generateAccessToken(user);

        return res.status(201).json(response);
      }

      if(account.user.active){
        return res.status(201).json({success:false, message:"Email already exists"});
      }
     
      const result = await updator.updateUserByEmail(email, user);
      if(result.error){
        response.error = result.error;
        response.success = true;
        response.accessToken = authentication.generateAccessToken(user);
        return res.status(500).json(response);
      }
      response.success = true;
      response.accessToken = authentication.generateAccessToken(user);
      return res.status(201).json(response);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  });
  
module.exports = router;