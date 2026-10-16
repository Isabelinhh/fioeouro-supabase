import { useAuth } from '../context/AuthContext';
import AuthScreen from './AuthScreen';

// Só renderiza o conteúdo interno se houver usuário logado.
// Sem sessão, mostra a tela de login/cadastro.
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-splash" role="status" aria-live="polite">
        <div className="logo">OURO <span>&amp;</span> FIO</div>
        <p>Verificando sessão…</p>
      </div>
    );
  }

  if (!user) return <AuthScreen />;
  return children;
}
