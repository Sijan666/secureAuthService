// require('node:dns').setServers(['1.1.1.1','8.8.8.8'])
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const mongoDb = require('./config/mongoDb')
const authRoute = require('./routes/authRoute')
const { apiLimiter } = require("./utils/rateLimiter");
const app = express()

// database connection
mongoDb()

// middlewares
app.use(cors())
app.use(express.json())

// limiter
app.use(apiLimiter);

// routes
app.use('/api/v1/auth', authRoute)

app.listen(5000, () => {
    console.log("server is running")
})