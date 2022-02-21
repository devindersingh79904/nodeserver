const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser')
const sanatize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimter = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
dotenv.config({ path: './config/config.env'});
//Route files

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const user = require('./routes/user');
const review = require('./routes/reviews');
const DBConnect = require('./middleware/db');
const errorHandler = require('./middleware/errorhandler');


DBConnect()

const app = express();

app.use(express.json())

// File uploading
app.use(fileupload());
//cookieParser
app.use(cookieParser())

//prevent sql injection
app.use(sanatize())

//add header
app.use(helmet())

//prevent html tag in data
app.use(xss())

//prevent send array in http polution
app.use(hpp())


// //add limter to route
// const limiter = rateLimter({
//     windowMS:10 * 60 * 1000,
//     max : 100
// })

// app.use(limiter)


//allow cors
app.use(cors())
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}




app.use(express.static(path.join(__dirname,'public')))

app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)
app.use('/api/v1/users',user)
app.use('/api/v1/reviews',review)
app.use(errorHandler)

const PORT = process.env.PORT || 8000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT} .`.yellow.bold))