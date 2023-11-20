const express  = require('express');
const router = express.Router();
const User = require('../models/User')
const mongoose = require('mongoose');

router.get('/:email', async (req, res) => {
    let response = {};
   try{
    const email = req.params.email;
    const user = await User.findOne({email : email});
    if(!user){
        response.success = true;
        response.exist = false;
        return res.status(200).json(response);
    }
    if(!user.active){
        response.success = true;
        response.exist = false;
        return res.status(200).json(response);
    }
    response.success = true;
    response.exist = true;
    return res.status(200).json(response);
   }
   catch(e){
    response.success = false;
    response.messege = "server error";
    return res.status(200).json(response);
   }
});
module.exports = router;