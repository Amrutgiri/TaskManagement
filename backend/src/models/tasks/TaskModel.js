import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    unique: true,
  },
  description: {
    type: String,
    default: "No description provided",
  },
  dueDate: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    required: true,
    enum: ["active", "inactive"],
    default: "active",
  },
  completed:{
    type: Boolean,
    default: false,
  },
  priority: {
    type: String,
    required: true,
    enum: ["high", "medium", "low"],
    default: "low",
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  updatedDate: {
    type: Date,
    default: Date.now(),
  }, 
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
},
  {timestamps: true},
);

const TaskModel = mongoose.model("Task", TaskSchema);

export default TaskModel;