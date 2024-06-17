const User = require('../models/user')
const userRouter = require('express').Router()
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response) => {
    const {username, name, password} = request.body

    if (password.length < 3) {
        return response.status(400).send({error: 'Password must be 3 or more characters'})
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
        username: username,
        name: name,
        passwordHash: hashedPassword
    })

    const newUserResponse = await  newUser.save(newUser)
    response.sendStatus(201),json(newUserResponse)
})


userRouter.get('/', async (request, response) => {
    const userResponse = await User.find({})
    response.status(200).json(userResponse)
})

module.exports = userRouter
