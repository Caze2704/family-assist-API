const app = require('./src/app')
const {sequelize} = require('./src/models')

const port = 3000

async function start() {
    try {
        await sequelize.authenticate()
        console.log("Banco conectado")

        sequelize.sync()
        console.log("tabelas conectadas")

        app.listen(port, () => console.log("Servidor on"))
    } catch (err) {
        console.error("ERRO:", err)
    }
}

start()