const {PrismaClient} = require('@prisma/client');
const prisma = require('./prisma');

async function addUser( firstName, lastName, username, email, password ){
    await prisma.user.create({
        data : {
            firstName,
            lastName,
            username,
            email,
            password
        }
    })
};

module.exports = {addUser};
