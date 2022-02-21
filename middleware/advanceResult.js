const asyncHandler = require("./asyncHandler");

const advancedResult = (model,populate) =>async (req,res,next) => {
    //declare empty query
    let query;
    //create a copy of query
    const reqQuery = {...req.query}
    
    //fields to exclude
    const removeFields = ['select','sort','limit','page']
    console.log(reqQuery)
    removeFields.forEach( param => delete reqQuery[param])
    console.log(reqQuery)
    //append $ sign front of operator(gt,lt,gte,lte,in)
    
    const queryStr= JSON.stringify(reqQuery).replace(/\b(gt|lt|lte|gte|in)\b/g, match => `$${match}`);
    query =  model.find(JSON.parse(queryStr))
    
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }
    else{
        const sortBy = '-createdAt'
        query = query.sort(sortBy)
    }




    //pagination
    const page = parseInt(req.query.page,10) || 1
    const limit = parseInt(req.query.limit,10) || 25
    const startIndex = (page - 1) * limit;
    const endIndex = page  * limit
    const total =  await model.countDocuments()

    query = query.skip(startIndex).limit(limit)



    //pagination result

    const pagination = {}

    if(endIndex < total){
        pagination.next = {
            page : page + 1,
            limit
        }
    }

    if(startIndex > 0){
        pagination.pre = {
            page : page - 1,
            limit
        }
    }

    if(populate){
        query = query.populate(populate)
    }

    const results = await query;

    res.advancedResult = {
        success:true,
        count:results.length, 
        pagination,
        data:results
    }

    next()
}

module.exports = advancedResult;