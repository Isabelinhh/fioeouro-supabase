import { useAuth } from '../context/AuthContext';

// Perfil do usuário logado (foto/inicial + nome) e botão Sair.
export default function UserMenu({ compact = false }) {
  const { perfil, signOut } = useAuth();
  if (!perfil) return null;
  const inicial = perfil.nome.charAt(0).toUpperCase();

  return (
    <div className={'user-menu' + (compact ? ' compact' : '')}>
      {perfil.avatar
        ? <img className="user-avatar" src={perfil.avatar} alt="" referrerPolicy="no-referrer" />
        : <span className="user-avatar user-initial" aria-hidden="true">{inicial}</span>}
      <span className="user-info">
        <span className="user-name">{perfil.nome.split(' ')[0]}</span>
        {compact && <span className="user-email">{perfil.email}</span>}
      </span>
      <button type="button" className="user-logout" onClick={signOut}>Sair</button>
    </div>
  );
}
