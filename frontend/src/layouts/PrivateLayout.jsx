import { Navigate, Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar/NavBar';
import { Footer } from '../components/Footer/Footer';

export function PrivateLayout() {

  const token = localStorage.getItem('token')

  if(!token){
    return <Navigate to='/' replace />
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      
      <main style={{ padding: '2rem', flex: 1 }}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}