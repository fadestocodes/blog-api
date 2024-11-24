const {Router} = require('express');
const loginRouter = Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
require('dotenv').config();


loginRouter.get('/',(req,res)=>{
    res.render('login');

});

loginRouter.post('/', (req,res,next)=>{
    passport.authenticate('local', (err, user, info) => {
    if (err){
        return next(err);
    }
    if (!user){
        console.log('Error with logging in');
        console.log('User: ', user);
        return res.status(401).json({error : "Invalid username of password"});
    }

    const token = jwt.sign(
        {id : user.id, username :  user.username},
        process.env.JWT_KEY,
        {expiresIn : '1h'}
    );
    console.log("Your JWT: ", token);
    req.login(user, (err)=>{
        if (err) {return next(err)};
        return res.json({token});

    })
})(req,res,next);
});



module.exports = {loginRouter};