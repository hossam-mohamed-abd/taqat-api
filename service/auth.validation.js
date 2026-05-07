import joi from 'joi'

let createUserValidation = joi.object({
    username : joi.string().min(3).trim().max(30).required(),
    email : joi.string().email().min(3).trim().max(30).required(),
    password : joi.string().min(6).trim().max(30).required(),
    role : joi.string().valid('admin' , 'user').default('user')
})

let loginUserValidation = joi.object({
    username : joi.string().min(3).trim().max(30).required(),
    password : joi.string().min(6).trim().max(30).required(),
})

export { createUserValidation , loginUserValidation }