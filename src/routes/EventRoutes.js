const router = require('express').Router()
const EventController = require('../controllers/EventController')

// middlewares

const notChild = require('../middlewares/notChild')
const verifyToken = require('../middlewares/verifyToken')

router.get('/', verifyToken, EventController.list)
router.post('/', verifyToken, notChild, EventController.create)
router.patch('/:id',verifyToken, notChild, EventController.update)
router.delete('/:id',verifyToken, notChild, EventController.delete)

module.exports = router