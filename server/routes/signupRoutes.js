const {Router} = require('express');
const signupRouter = Router();
const {addUser} = require('../prisma/prismaQueries');
const bcrypt = require('bcryptjs');

signupRouter.get('/',(req,res)=>{
    res.render('signup');
});

signupRouter.post('/', async (req,res)=>{
    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    
    try {
        await addUser(firstName, lastName, username, email, hashedPassword);
        console.log("Success adding user to DB");
        res.redirect('/');
    } catch (err){
        console.error("Error Adding User To DB", err);
        res.status(500).send("Error Adding User To DB");
    }
});

module.exports = {signupRouter};