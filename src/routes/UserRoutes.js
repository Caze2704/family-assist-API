const router = require('express').Router()
const UserController = require('../controllers/UserController')

// middlewares

const verifyToken = require('../middlewares/verifyToken')
const isAdmin = require('../middlewares/isAdmin')

router.post('/login', UserController.login)
router.post('/create', verifyToken, isAdmin, UserController.createMember)
router.get('/', verifyToken, UserController.listMembers)
router.patch('/update/:id', verifyToken, isAdmin, UserController.updateMember)
router.delete('/delete/:id', verifyToken, isAdmin, UserController.deleteMember)

module.exports = router