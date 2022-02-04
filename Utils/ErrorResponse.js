class ErrorResponse extends Error {

    constructor(message,errorCode){
        super(message)
        this.statusCode = errorCode
    }
}

module.exports = ErrorResponse