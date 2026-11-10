const router = require('express').Router()
const MonthClosingController = require('../controllers/MonthClosingController')

// middlewares

const verifyToken = require('../middlewares/verifyToken')
const isAdmin = require('../middlewares/isAdmin')
const notChild = require('../middlewares/notChild')

router.post('/', verifyToken, notChild, isAdmin, MonthClosingController.closeMonth)
router.get('/', verifyToken, notChild, isAdmin, MonthClosingController.list)
router.delete('/:id', verifyToken, notChild, isAdmin, MonthClosingController.delete)

module.exports = router