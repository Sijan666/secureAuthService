const jwt = require('jsonwebtoken');

function checkAccess(req, res, next) {
    try {
        let authHeader = req.headers.authorization;

        let token = authHeader.split(' ')[1];
        console.log(token);

        jwt.verify(token, process.env.JWT_SECRET_ACCESS, function(err, decoded) {
            if (decoded.role === "student") {
                res.status(403).send('You do not have access');
            } else {
                next();
            }
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = checkAccess;