const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoute = require('./routes/users.route')
// Config dotenv
require('dotenv').config({
    path: './config/config.env'
})

const app = express()

// Connect to database
connectDB();

// body parser
app.use(bodyParser.json())

// 
app.use('/api', userRoute)

// Let's add Port Config

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("hey app is listening");
});