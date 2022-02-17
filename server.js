const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser')

dotenv.config({ path: './config/config.env'});
//Route files

const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const DBConnect = require('./middleware/db');
const errorHandler = require('./middleware/errorhandler');


DBConnect()

const app = express();

app.use(express.json())

// File uploading
app.use(fileupload());
//cookieParser
app.use(cookieParser())

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}




app.use(express.static(path.join(__dirname,'public')))

app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)
app.use(errorHandler)

const PORT = process.env.PORT || 8000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT} .`.yellow.bold))