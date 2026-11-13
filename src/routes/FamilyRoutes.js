const router = require('express').Router()
const FamilyController = require('../controllers/FamilyController')

// middlewares

const verifyToken = require('../middlewares/verifyToken')

router.get('/', verifyToken, FamilyController.getMyFamily)
router.post('/', FamilyController.register)

module.exports = router