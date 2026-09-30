export const create = async ({ model , data , options ={} }= {}) => {
    return await model.create([data],options)
}

export const findOne = async ({ model , filter , options ={} }= {}) => {
    return await model.findOne(filter,options)
}

export const findById = async ({ model , id , options ={} }= {}) => {
    return await model.findbyid(id,options)
}

export const findbyIdAndUpdate= async ({ model , id ,update , options ={} }= {}) => {
    return await model.findOne(id,update,{new:true , runValidators:true ,...options})
}