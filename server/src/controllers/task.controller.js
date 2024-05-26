import asyncHandler from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { Task } from '../models/task.model.js'
import { ApiError } from '../utils/ApiError.js'

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  console.log("createTask API Called");
  if ([title, description, status, dueDate].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required!!");
  }
  const createdTask = await Task.create({ title, description, status, dueDate });
  return res.status(200).json(
    new ApiResponse(
      200,
      "Task added successfully!!",
      createdTask
    )
  )
})

const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, dueDate } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(taskId, { title, description, status, dueDate }, { new: true });
  if (!updatedTask) {
    throw new ApiError(400, 'Not able to update task!!');
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      "Task updated successfully!!",
      updatedTask
    )
  )
})

const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const deletedTask = await Task.findByIdAndDelete(taskId);
  if (!deleteTask) {
    throw new ApiError(400, 'Not able to delete task!!');
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      "Task deleted successfully!!"
    )
  )
})

const retreiveAllTasks = asyncHandler(async (req, res) => {
  const allTasks = await Task.find();
  return res.status(200).json(
    new ApiResponse(
      200,
      "All tasks fetched successfully!!",
      allTasks
    ))
})

const retreiveSingleTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const singleTask = await Task.findById(taskId);
  if (!singleTask) {
    throw new ApiError(400, 'Task not found!!');
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      "Single task fetched successfully!!",
      singleTask
    )
  )
})

export { createTask, updateTask, deleteTask, retreiveAllTasks, retreiveSingleTask };