const notChild = (req, res, next) => {
    if(req.user.memberStatus === 'child'){
        return res.status(403).json({message: "Você não pode executar essa ação!"})
    }
    next()
}

module.exports = notChild