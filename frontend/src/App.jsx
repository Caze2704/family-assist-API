import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages
import { Login } from './pages/Login/Login';
import { CadastroFamilia } from './pages/CadastroFamilia/CadastroFamilia';
import { Dashboard } from './pages/Dashboard/Dashboard';

// layouts
import { PrivateLayout } from './layouts/PrivateLayout';

function App(){

  return(
    <>
      <BrowserRouter>
        <Routes>
        {/* Rotas Públicas (Sem NavBar e Footer) */}
        <Route path="/" element={<Login />} />
        <Route path="/Cadastro" element={<CadastroFamilia />} />
        
        {/* Rotas Privadas (Com NavBar e Footer) */}
        <Route element={<PrivateLayout />}>
          {/* Todas as rotas colocadas aqui dentro vão herdar a NavBar e o Footer automaticamente */}
          <Route path="/Dashboard" element={<Dashboard />} />
          {/* <Route path="/membros" element={<MembersList />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )

}

export default App