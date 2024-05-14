
const mongoose = require('mongoose');

// Define subtask schema
const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});

// Define task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  status: String, 
  subtasks: [subtaskSchema]
});

// Define column schema
const columnSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id : {
    type : String,
  },
  tasks: [taskSchema]
});

// Define project schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  columns: [columnSchema]
});

// Compile models from schemas
const Project = mongoose.model('Projects', projectSchema);
const Column = mongoose.model('Column', columnSchema);
const Task = mongoose.model('Task', taskSchema);
const Subtask = mongoose.model('Subtask', subtaskSchema);

module.exports = { Project, Column, Task, Subtask };
