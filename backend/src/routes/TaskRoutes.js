const router = require('express').Router()
const TaskController = require('../controllers/TaskController')

// middlewares

const verifyToken = require('../middlewares/verifyToken')
const isAdmin = require('../middlewares/isAdmin')

router.get('/', verifyToken, TaskController.list)
router.post('/', verifyToken, TaskController.create)
router.patch('/:id', verifyToken, TaskController.update)
router.delete('/:id', verifyToken, TaskController.delete)

module.exports = router