require('dotenv').config();
const express = require('express');
const router = express.Router();
// const Test = require('../Models/testSchema');
const {validatePost} = require('../Middleware/joi_schema');
const {Project} = require('../Models/projectSchema');
const {projectSchemaJoi} = require('../Middleware/joi_schema');
const jwt = require('jsonwebtoken');
const User  = require('./../Models/userSchema');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1] || req.cookies.token;
    // console.log(token)
    // console.log(token, req.cookies)
    if(token == null){
      return res.status(401).json({ error: "Unauthorized Access", message: "You are not authorized to access this resource." });
    }
    jwt.verify(token, process.env.SECRET, (err, userId) => {
      if(err){
        return res.status(403).json({ error: "Forbidden", message: "Access forbidden. Please login again." });
      }
      req.body.createdBy = userId.userId;
      next();
    });
  }


// Get PROJECTS
router.get('/projects', authenticateToken, async (req, res) => {
    try {
        
        const projects = await Project.find({createdBy: req.body.createdBy});
    
        res.status(200).send(projects);
    } catch (err) {
       
        res.status(400).send(err.message);
    }
});

// ADD PROJECT 
router.post('/project',authenticateToken, async (req, res) => {
    try {
        const { error, value } = projectSchemaJoi.validate(req.body);
        if (error) {
            return res.status(400).send(error);
        }
        const project = new Project(value);
        const savedProject = await project.save();

        const user = await User.findById(req.body.createdBy);

        user.userProjects.push(savedProject._id);
        await user.save();
    
        res.status(200).send(savedProject);
    } catch (err) {
       
        res.status(400).send(err.message);
    }
});
// EDIT PROJECT
router.put('/project/:id', async (req, res) => {
    const _id = req.params.id;
    // console.log(req.body)
    try {
        const updatedProject = await Project.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updatedProject) {
            return res.status(404).send("Data not found");
        }
        // console.log("updatedProject")
        res.status(200).send(updatedProject);
    } catch (err) {
        // console.log("Failed")
        res.status(400).send(err);
    }
});
// // DELETE PROJECT
router.delete('/project/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const deletedProject = await Project.findByIdAndDelete(_id);
        if (!deletedProject) {
            return res.status(404).send("Data not found");
        }
        // console.log("deletedProject")
        res.status(200).send(deletedProject);
    } catch (err) {
        res.status(400).send(err);
    }
});
// // SET PROJECT ACTIVE
router.put('/project/active/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const projects = await Project.find();
        projects.forEach((project, i) => {
            project.isActive = project._id == _id ? true : false;
            project.save();
        });
        res.status(200).send(projects);
    } catch (err) {
        res.status(400).send(err);
    }
});
// ADD TASK 
router.put('/project/task/:id', async (req, res) => {
    const _id = req.params.id;
    const { title, description, status, newColIndex, Subtasks } = req.body;
    try {
        const project = await Project.findById(_id);
        const newTask = {
            title,
            description,
            status,
            Subtasks
        }
        project.columns[newColIndex].tasks.push(newTask);
        project.save();
        res.status(200).send(project);
    }catch{
        res.status(400).send(err);
    }
})


module.exports = router;
