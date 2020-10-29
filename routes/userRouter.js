const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const auth = require('../middleware/auth')


router.post('/register', async (req, res) => {
    const { email, password, username, confirmPassword } = req.body

    try {
        if (!email || !password || !username || !confirmPassword)
            return res.status(400)
                .json({ message: "All the fields are required" });

        if (password != confirmPassword)
            return res.status(400).json({ message: 'The passwords must match' });

        const existingUser = await User.findOne({ email: email })

        if (existingUser)
            return res.status(400).json({ message: 'the user already exists' });


        const salt = await bcrypt.genSalt()

        const hashPassword = await bcrypt.hash(password, salt)



        const newUser = new User({
            email,
            password: hashPassword,
            username
        })

        const saveUser = await newUser.save()
        res.json(saveUser)

    }
    catch (err) {
        res.json(err)
    }
})


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ message: 'please input the required fields' });


        const user = await User.findOne({ email: email })
        if (!user)
            return res.status(400).json({ message: `sorry couldn't find the user` });


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'invalid login data' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY)
        res.json({
            token,
            user: {
                email: user.email,
                username: user.username
            }
        })

    }
    catch (err) {
        res.json({ err: err.message })
    }
})


router.delete('/delete', auth, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.json(deletedUser)

    }
    catch (err) {
        res.json({ err: err.message })
    }
})

router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token')
        if (!token)
            return res.json(false);


        const verified = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!verified)
            return res.json(false);

        const user = await User.findById(verified.id)
        if (!user) return res.json(false);

        return res.json(true)

    }
    catch (err) {
        res.json({ err: err.message })
    }
})

router.get('/' , auth, async(req,res) =>{
    const user = await User.findById(req.user)
    res.json({
        user: user.username,
        id:user._id
    })
})

module.exports = router