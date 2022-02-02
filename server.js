const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

//Route files
const bootcamps = require('./routes/bootcamps');
const DBConnect = require('./middleware/db');

dotenv.config({ path: './config/config.env'});
DBConnect()

const app = express();

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


app.use('/api/v1/bootcamps',bootcamps)


const PORT = process.env.PORT || 8000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT} .`.green.bold))