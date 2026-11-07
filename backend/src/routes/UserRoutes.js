const router = require('express').Router()
const UserController = require('../controllers/UserController')

// middlewares

const verifyToken = require('../middlewares/verfiyToken')

router.post('/login', UserController.login)

module.exports = router