const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    var token;
    if ('authorization' in req.headers) //pick the jwt passed in headers from the frontend
        token = req.headers['authorization'].split(' ')[1]; // splitting to get the value of jwt from req header -> Authorization : Bearer [jwt]

    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });  //403 : Forbidden -> user is not authorised
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
                else {
                    req._id = decoded._id;
                    next();
                }
            }
        )
    }
}