const {Router} = require('express');
const protectedRouter = Router();
const passport = require('passport');

// protectedRouter.get('/', (req,res)=>{
//     res.render('admin');
// });

protectedRouter.get('/', passport.authenticate('jwt', {session:false}), (req,res)=>{
    console.log("Request Headers: ", req.headers);
    console.log('Authenticated User: ', req.user);
    if (!req.user){
        return res.status(401).json({message: 'Unauthrorized access. Please log in '});
    }
    res.json({message: 'Welcome Admin', user: req.user});
});



module.exports = {protectedRouter}