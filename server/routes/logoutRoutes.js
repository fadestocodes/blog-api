const {Router} = require('express');
const logoutRouter = Router();

logoutRouter.get('/', (req,res)=>{
    req.logout((err)=>{
        if (err){
            console.error("Error Logging Out", err);
            res.status(500).send("Error Logging Out");
        }
        res.redirect('/');
    })
});

module.exports = {logoutRouter};