const joi = require("joi")

const postScheme = joi.object({
    name: joi.string().required(),
    email: joi.string().required(),
    phone: joi.string().required(),
})


const validatePost = (data) => {
    return postScheme.validate(data, { abortEarly: false })
}


// Define subtask schema
const subtaskSchema = joi.object({
  title: joi.string(),
  isCompleted: joi.boolean().default(false)
});

// Define task schema
const taskSchema = joi.object({
  title: joi.string(),
  description: joi.string().allow(''),
  status: joi.string().allow(''),
  subtasks: joi.array().items(subtaskSchema)
});

// Define column schema
const columnSchema = joi.object({
  name: joi.string().required(),
  id: joi.string().allow(''),
  tasks: joi.array().items(taskSchema)
});

// Define project schema
const projectSchemaJoi = joi.object({
  name: joi.string().required(),
  isActive: joi.boolean().default(false),
  columns: joi.array().items(columnSchema)
});

module.exports = {
  subtaskSchema,
  taskSchema,
  columnSchema,
  projectSchemaJoi,
  postScheme,
  validatePost,
};
