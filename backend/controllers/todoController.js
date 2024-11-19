const Todo = require('../models/todoModel')
const mongoose = require('mongoose')

// get all todo
const getTodos = async (req, res) => {
  const user_id = req.user._id

  const todos = await Todo.find({user_id}).sort({createdAt: -1})

  res.status(200).json(todos)
}

// get a single todo
const getTodo = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such todo'})
  }

  const todo = await Todo.findById(id)

  if (!todo) {
    return res.status(404).json({error: 'No such Todo'})
  }
  
  res.status(200).json(todo)
}


// create new todo
const createTodo = async (req, res) => {
  const {title, load, reps} = req.body

  let emptyFields = []

  if(!title) {
    emptyFields.push('title')
  }

  if(emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields })
  }

  // add doc to db
  try {
    const user_id = req.user._id
    const todo = await Todo.create({title, user_id})
    res.status(200).json(todo)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// delete a todo
const deleteTodo = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such todo'})
  }

  const todo = await Todo.findOneAndDelete({_id: id})

  if (!todo) {
    return res.status(400).json({error: 'No such todo'})
  }

  res.status(200).json(todo)
}

// update a todo
const updateTodo = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such Todo'})
  }

  const todo = await Todo.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!todo) {
    return res.status(400).json({error: 'No such todo'})
  }

  res.status(200).json(todo)
}


module.exports = {
  getTodos,
  getTodo,
  createTodo,
  deleteTodo,
  updateTodo
}