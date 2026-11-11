import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import styles from './Login.module.css';

export function Login() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  async function handleLogin(event) {
    event.preventDefault(); 
    setErro(''); 
    
    try {
      // Dentro da sua função handleLogin, quando a requisição dá certo:
      const resposta = await api.post('/user/login', { email, password });

      console.log("Dados da api: ", resposta.data)

      // Pega o token e os dados do usuário da resposta da sua API
      const token = resposta.data.token;
      const usuarioLogado = resposta.data.user; // ajuste para o nome da chave que seu backend retorna

      // Salva o token
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuarioLogado));

      navigate('/Dashboard');
      
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErro('E-mail e/ou senha incorretos.');
      } else {
        setErro('Erro ao tentar conectar com o servidor.');
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h1 className={styles.title}>Acesse o family-assist</h1>
        
        <form onSubmit={handleLogin} className={styles.form}>
          {erro && <p style={{ color: '#e53e3e', fontSize: '0.9rem' }}>{erro}</p>}

          <input 
            type="email" 
            placeholder="E-mail da conta" 
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          
          <input 
            type="password" 
            placeholder="Sua senha" 
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          
          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>

        <p className={styles.footerText}>
          Sua família ainda não usa o sistema? <br/>
          <Link to="/cadastro" className={styles.link}>
            Cadastre sua família aqui
          </Link>
        </p>
      </div>
    </div>
  );
}