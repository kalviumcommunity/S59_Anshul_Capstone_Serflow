const joi = require("joi")

const postScheme = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
})


const validatePost = (data) => {
    return postScheme.validate(data, { abortEarly: false })
}


module.exports = {
    postScheme,
    validatePost,
}