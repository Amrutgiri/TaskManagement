import asynxHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js";

export const createTask = asynxHandler(async (req, res) => {
  try {
    const {title, description,dueDate,priority,status} = req.body;
    if(!title || title.trim()===""){
      res.status(400).json({message:"Title is required"});
    }
    if(!description || description.trim()===""){
      res.status(400).json({message:"Description is required"});
    }
    const task = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      status,
      user:req.user._id
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({message:error.message});
  }
});

export const getTasks = asynxHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    if(!userId)
    {
      res.status(400).json({message:"User not found"});
    }
    const tasks = await TaskModel.find({user:userId});
    
    res.status(200).json({
      length:tasks.length,
      tasks,
    });
  } catch (error) {
    res.status(500).json({message:error.message});
  }
});

export const getTask = asynxHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const {id} = req.params;
    if(!id){
      res.status(400).json({message:"Task id is required"});
    }
    if(!userId)
    {
      res.status(400).json({message:"User not found"});
    }
    const task = await TaskModel.findById(id);
    if(!task)
    {
      res.status(400).json({message:"Task not found"});
    }
    if(!task.user.equals(userId)){
      res.status(403).json({message:"You are not authorized to view this task"});
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({message:error.message});

  }
});

export const updateTask = asynxHandler(async (req, res) => {
  try {
      const userId = req.user._id;
      const {id} = req.params;
      const {title, description,dueDate,priority,status,completed} = req.body;
      if(!id){
        res.status(400).json({message:"Task id is required"});
      }
      if(!userId){
        res.status(400).json({message:"User not found"});
      }
      const task = await TaskModel.findById(id);
      if(!task)
      {
        res.status(400).json({message:"Task not found"});
      }
      if(!task.user.equals(userId)){
        res.status(403).json({message:"You are not authorized to update this task"});
      }
      task.title = title || task.title;
      task.description = description || task.description;
      task.dueDate = dueDate || task.dueDate;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.completed = completed || task.completed;
      await task.save();
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({message:error.message});
      
    }
})

export const deleteTask = asynxHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const {id} = req.params;
    if(!id){
      res.status(400).json({message:"Task id is required"});
    }
    if(!userId){
      res.status(400).json({message:"User not found"});
    }
    const task = await TaskModel.findById(id);
    if(!task)
    {
      res.status(400).json({message:"Task not found"});
    }
    if(!task.user.equals(userId)){
      res.status(403).json({message:"You are not authorized to delete this task"});
    }
    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({message:"Task deleted successfully"});

    }
    catch (error) {
      res.status(500).json({message:error.message});
    }
})