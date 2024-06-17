const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
require('express-async-errors')
const app = express()
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())


app.use('/api/users', userRouter)
app.use('/api/blogs', blogRouter)

app.use(middleware.errorHandler)

module.exports = app