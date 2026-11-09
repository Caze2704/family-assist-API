const router = require('express').Router()
const BillController = require('../controllers/BillController')

// middlewares

const isAdmin = require('../middlewares/isAdmin')
const verifyToken = require('../middlewares/verifyToken')
const notChild = require('../middlewares/notChild')

router.post('/', verifyToken, notChild, BillController.create)
router.get('/', verifyToken, BillController.list)
router.patch('/:id', verifyToken, notChild, BillController.update)
router.delete('/:id', verifyToken, notChild, BillController.delete)

module.exports = router