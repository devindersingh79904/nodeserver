const mongoose = require('mongoose')

const DBConnect = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to database successfully ${conn.connection.host}`.cyan.bold)
    } catch (error) {
        console.log(`${error.message}`.red.bold)
    }
}

module.exports = DBConnect