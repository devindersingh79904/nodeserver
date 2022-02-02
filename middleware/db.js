const mongoose = require('mongoose')

const DBConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to database successfully'.green.bold)
    } catch (error) {
        console.log(`${error.message}`.red.bold)
    }
}

module.exports = DBConnect