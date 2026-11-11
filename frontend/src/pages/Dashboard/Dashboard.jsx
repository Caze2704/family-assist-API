import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import styles from './Dashboard.module.css';

export function Dashboard() {
  const [usuario] = useState(() => {
    const userSalvo = localStorage.getItem('usuario');
    return (userSalvo && userSalvo !== 'undefined') ? JSON.parse(userSalvo) : null;
  });

  const [membros, setMembros] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarMembros() {
      try {
        const resposta = await api.get('/user');
        // Pega a lista de membros vinda do backend Node
        setMembros(resposta.data.members || []);
      } catch (error) {
        console.error("Erro ao carregar membros", error);
      } finally {
        setCarregando(false);
      }
    }

    buscarMembros();
  }, []);

  async function removerMembro(idDoMembro) {
    if (!window.confirm("Tem certeza que deseja remover este membro?")) return;

    try {
      await api.delete(`/user/delete/${idDoMembro}`);
      setMembros(membros.filter((membro) => membro.id !== idDoMembro));
    } catch (error) {
      alert('Erro ao tentar remover o membro.');
    }
  }

  if (carregando) return <p style={{ padding: '2rem', textAlign: 'center' }}>Carregando painel...</p>;
  if (!usuario) return <p style={{ padding: '2rem', textAlign: 'center' }}>Sessão inválida. Faça login novamente.</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Olá, {usuario.nome || usuario.name}!</h1>
        <p>Cargo atual: <strong>{usuario.cargo}</strong></p>
      </header>

      <section>
        <h2 className={styles.sectionTitle}>Membros da Família</h2>
        
        <div className={styles.listaMembros}>
          {membros.length === 0 ? (
            <p>Nenhum membro encontrado na família.</p>
          ) : (
            membros.map((membro) => (
              <div key={membro.id} className={styles.cardMembro}>
                <h3>{membro.name}</h3>
                <p>Cargo: {membro.memberStatus}</p>
                
                {/* O botão de remover só aparece se o utilizador logado for admin */}
                {usuario.cargo === 'admin' && (
                  <button 
                    onClick={() => removerMembro(membro.id)} 
                    className={styles.deleteBtn}
                  >
                    Remover
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}