const router = require('express').Router()
const TaskController = require('../controllers/TaskController')

// middlewares

const verifyToken = require('../middlewares/verifyToken')
const notChild = require('../middlewares/notChild')

router.get('/', verifyToken, TaskController.list)
router.post('/', verifyToken, TaskController.create)
router.patch('/:id', verifyToken, TaskController.update)
router.delete('/:id', verifyToken, notChild, TaskController.delete)

module.exports = router