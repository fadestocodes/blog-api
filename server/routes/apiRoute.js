const {Router} = require('express');
const apiRouter = Router();

apiRouter.get('/', (req,res)=>{
    res.json({message : 'API Data Works!'});
});


apiRouter.get('/admin', passport.authenticate('jwt', {session:false}), (req,res)=>{
    console.log("Request Headers: ", req.headers);
    console.log('Authenticated User: ', req.user);
    if (!req.user){
        return res.status(401).json({message: 'Unauthrorized access. Please log in '});
    }
    res.json({message: 'Welcome Admin', user: req.user});
});


module.export = {apiRouter};