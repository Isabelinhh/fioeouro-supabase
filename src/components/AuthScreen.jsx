import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function traduzirErro(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar (veja a caixa de entrada).';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Este e-mail já está cadastrado. Tente entrar.';
  if (m.includes('password should be at least')) return 'A senha precisa ter pelo menos 6 caracteres.';
  if (m.includes('valid email') || m.includes('invalid email')) return 'Informe um e-mail válido.';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns minutos.';
  if (m.includes('provider is not enabled')) return 'Login com Google ainda não foi habilitado no Supabase.';
  if (m.includes('failed to fetch') || m.includes('network')) return 'Sem conexão com o servidor. Verifique sua internet.';
  return msg || 'Algo deu errado. Tente novamente.';
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.6 10.8l7.9-6.1z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
}

export default function AuthScreen() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [modo, setModo] = useState('entrar'); // 'entrar' | 'cadastrar'
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');

  const cadastro = modo === 'cadastrar';

  function trocarModo(novo) {
    setModo(novo);
    setErro('');
    setAviso('');
  }

  async function enviar(e) {
    e.preventDefault();
    setErro('');
    setAviso('');

    if (cadastro) {
      if (nome.trim().length < 2) return setErro('Informe seu nome.');
      if (senha.length < 6) return setErro('A senha precisa ter pelo menos 6 caracteres.');
      if (senha !== confirma) return setErro('As senhas não conferem.');
    }

    setEnviando(true);
    try {
      if (cadastro) {
        const { data, error } = await signUp({ nome: nome.trim(), email: email.trim(), senha });
        if (error) throw error;
        // Com confirmação de e-mail ligada não há sessão imediata.
        if (!data.session) {
          setAviso('Conta criada! Enviamos um link de confirmação para o seu e-mail. Depois de confirmar, é só entrar.');
          setModo('entrar');
          setSenha('');
          setConfirma('');
        }
        // Com sessão imediata, o ProtectedRoute libera o app sozinho.
      } else {
        const { error } = await signIn({ email: email.trim(), senha });
        if (error) throw error;
      }
    } catch (err) {
      setErro(traduzirErro(err.message));
    } finally {
      setEnviando(false);
    }
  }

  async function entrarComGoogle() {
    setErro('');
    setAviso('');
    setEnviando(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // No navegador a página redireciona para o Google; no app abre o navegador do sistema.
    } catch (err) {
      setErro(traduzirErro(err.message));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="logo auth-logo">OURO <span>&amp;</span> FIO</div>
        <span className="eyebrow">Studio de cabelo</span>
        <h1 className="auth-title">{cadastro ? 'Crie sua conta' : 'Bem-vindo de volta'}</h1>
        <p className="auth-sub">
          {cadastro
            ? 'Cadastre-se para agendar seus horários.'
            : 'Entre para agendar e acompanhar seus horários.'}
        </p>

        <div className="auth-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={!cadastro}
            className={!cadastro ? 'active' : ''} onClick={() => trocarModo('entrar')}>Entrar</button>
          <button type="button" role="tab" aria-selected={cadastro}
            className={cadastro ? 'active' : ''} onClick={() => trocarModo('cadastrar')}>Cadastrar</button>
        </div>

        <button type="button" className="btn-google" onClick={entrarComGoogle} disabled={enviando}>
          <GoogleIcon /> Entrar com Google
        </button>

        <div className="auth-divider"><span>ou com e-mail</span></div>

        <form onSubmit={enviar} noValidate>
          {cadastro && (
            <div className="field">
              <label htmlFor="authNome">Nome completo</label>
              <input id="authNome" type="text" autoComplete="name" placeholder="Seu nome"
                value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
          )}
          <div className="field">
            <label htmlFor="authEmail">E-mail</label>
            <input id="authEmail" type="email" inputMode="email" autoComplete="email"
              placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="authSenha">Senha</label>
            <input id="authSenha" type="password" autoComplete={cadastro ? 'new-password' : 'current-password'}
              placeholder="Mínimo 6 caracteres" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          {cadastro && (
            <div className="field">
              <label htmlFor="authConfirma">Confirmar senha</label>
              <input id="authConfirma" type="password" autoComplete="new-password"
                placeholder="Repita a senha" value={confirma} onChange={(e) => setConfirma(e.target.value)} required />
            </div>
          )}

          {erro && <p className="auth-msg auth-erro" role="alert">{erro}</p>}
          {aviso && <p className="auth-msg auth-ok" role="status">{aviso}</p>}

          <button type="submit" className="btn-gold auth-submit" disabled={enviando}>
            {enviando ? 'Aguarde…' : cadastro ? 'Criar conta' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          {cadastro ? 'Já tem conta?' : 'Ainda não tem conta?'}{' '}
          <button type="button" onClick={() => trocarModo(cadastro ? 'entrar' : 'cadastrar')}>
            {cadastro ? 'Entrar' : 'Cadastre-se'}
          </button>
        </p>
      </div>
    </main>
  );
}
