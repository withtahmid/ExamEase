const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next){
    let token;
    try{
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1]
    }
    catch(e){
        return res.json(e);
    }
    
    if(token == null){
        return res.status(201).json({
            success: false,
            error: 'token not found'
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
        if(err){
            return res.status(201).json({
                success: false,
                error: 'Invalid token'
            });
        }
        req.user = user;
        next();
    });
}

function generateAccessToken(user){
    const tokenInfo = {
        email: user.email,
        role: user.role
    };
    return jwt.sign(tokenInfo, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
}

module.exports = {
    verifyToken,
    generateAccessToken
}