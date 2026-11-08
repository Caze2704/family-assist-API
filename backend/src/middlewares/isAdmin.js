const { User } = require("../models")

const isAdmin = async (req, res, next) => {

    if(req.user.memberStatus !== 'admin'){
        return res.status(422).json({message: "Apenas administradores podem realizar esta ação!"})
    }

    const user = await User.findByPk(req.user.id)

    if(!user){
        return res.status(404).json({message: "Usuário não encontrado."})
    }

    next()

}

module.exports = isAdmin