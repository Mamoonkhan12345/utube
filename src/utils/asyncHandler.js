

const asyncHandler=(requuestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requuestHandler(req,res,next)).catch((err)=>next(err))
    }

}

export {asyncHandler}