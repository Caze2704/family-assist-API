const router = require('express').Router()
const TaskController = require('../controllers/TaskController')

// middlewares

const verifyToken = require('../middlewares/verifyToken')
const isAdmin = require('../middlewares/isAdmin')

router.post('/', verifyToken, TaskController.create)

module.exports = router