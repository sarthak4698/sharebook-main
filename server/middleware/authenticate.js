const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');

const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({_id: verifyToken._id});

        if(!rootUser) {
            res.status(400).send('User not found')
        }

        req.token = token;
        req.rootUser = rootUser;
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send('Unautherized User, no token provided')
    }
}

module.exports = Authenticate ;