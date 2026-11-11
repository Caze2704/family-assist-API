import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css';

export function NavBar() {
  const navigate = useNavigate();

  function handleLogout() {
    // Futuramente, aqui você limpará o token/sessão do usuário
    navigate('/');
  }

  return (
    <header className={styles.header}>
      <Link to="/Dashboard" className={styles.brand}>
        family-assist
      </Link>
      
      <nav className={styles.navLinks}>
        <Link to="/Dashboard" className={styles.link}>Início</Link>
        <Link to="/membros" className={styles.link}>Família</Link>
        <Link to="/tarefas" className={styles.link}>Tarefas</Link>
        
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sair
        </button>
      </nav>
    </header>
  );
}