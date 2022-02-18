const fs = require('fs')
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({path:'./config/config.env'})

const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course');
const Review = require('./models/Review')
const User = require('./models/User');

const DBConnect = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to database successfully ${conn.connection.host}`.cyan.bold)
    } catch (error) {
        console.log(`${error.message}`.red.bold)
    }
}

DBConnect();

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'))
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'))
const importData = async ()=>
{
    try{

        await User.create(users)
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        await Review.create(reviews)

        console.log(`Data imported....`.green.inverse)
        process.exit();
    }
    catch(err){
        console.log(`Error ${err}`.green.inverse)
        
    }
}


const deleteData = async ()=>
{
    try{
        await Review.deleteMany()
        await Course.deleteMany();
        await Bootcamp.deleteMany();
        await User.deleteMany();
        console.log(`Data deleted....`.red.inverse)
        process.exit();
    }
    catch(err){
        console.log(`Error ${err}`.red.inverse)
        
    }
}

console.log(process.argv[2]);

if(process.argv[2] === '-i'){
    importData()
}
else if(process.argv[2] === '-d'){
    deleteData()
}