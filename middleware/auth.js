const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token)
            return res.status(401).json({ message: 'invalid token' });


        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!verify)
            return res.status(401).json({ message: 'token verification failed' });

        req.user = verify.id;

        next()
    }

    catch (err) {
        res.status(500).json({ err: err.message })
    }

}

module.exports = auth;