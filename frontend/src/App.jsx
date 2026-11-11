import { useEffect, useState } from "react"
import api from "./services/api"

function App(){
  const [status, setStatus] = useState('Testando conexão...')

  useEffect(() => {
    api.get('/user')
    .then(() => setStatus('conectado!'))
    .catch((err) => {
      if(err.response){
        setStatus(`Api respondeu com status ${err.response.status}`)
      }else{
        setStatus("Sem resposta da API (servidor off ou cors)")
      }
    })
  }, [])

  return(
    <>
      <h1>{status}</h1>
    </>
  )

}

export default App