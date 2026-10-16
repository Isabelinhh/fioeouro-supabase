import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { supabase, isNative, NATIVE_REDIRECT_URL } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true); // true até saber se há sessão

  useEffect(() => {
    let ativo = true;

    // 1) Sessão já existente (login anterior guardado no aparelho/navegador)
    supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    // 2) Qualquer mudança: login, logout, refresh do token, retorno do OAuth
    const { data: listener } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSession(novaSessao ?? null);
      setLoading(false);
    });

    // 3) App Android: o Google devolve o usuário via deep link com ?code=...
    let removerListenerApp = null;
    if (isNative) {
      CapApp.addListener('appUrlOpen', async ({ url }) => {
        if (!url || !url.startsWith(NATIVE_REDIRECT_URL)) return;
        try {
          const code = new URL(url).searchParams.get('code');
          if (code) await supabase.auth.exchangeCodeForSession(code);
        } catch (err) {
          console.error('Falha ao concluir login com Google:', err.message);
        } finally {
          Browser.close().catch(() => {});
        }
      }).then((h) => { removerListenerApp = h; });
    }

    return () => {
      ativo = false;
      listener.subscription.unsubscribe();
      if (removerListenerApp) removerListenerApp.remove();
    };
  }, []);

  // Cadastro com e-mail e senha. Se a confirmação de e-mail estiver ligada no
  // Supabase, "data.session" vem null até o usuário clicar no link recebido.
  const signUp = useCallback(async ({ nome, email, senha }) => {
    return supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: { full_name: nome },
        emailRedirectTo: isNative ? NATIVE_REDIRECT_URL : window.location.origin,
      },
    });
  }, []);

  const signIn = useCallback(
    ({ email, senha }) => supabase.auth.signInWithPassword({ email, password: senha }),
    []
  );

  const signInWithGoogle = useCallback(async () => {
    if (!isNative) {
      return supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
    }
    // Android: abre o navegador do sistema (o Google bloqueia login em WebView)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: NATIVE_REDIRECT_URL, skipBrowserRedirect: true },
    });
    if (error) return { data, error };
    await Browser.open({ url: data.url });
    return { data, error: null };
  }, []);

  const signOut = useCallback(() => supabase.auth.signOut(), []);

  const user = session?.user ?? null;
  const perfil = useMemo(() => {
    if (!user) return null;
    const meta = user.user_metadata || {};
    const nome = meta.full_name || meta.name || user.email?.split('@')[0] || 'Cliente';
    return { nome, email: user.email, avatar: meta.avatar_url || meta.picture || null };
  }, [user]);

  const value = useMemo(
    () => ({ session, user, perfil, loading, signUp, signIn, signInWithGoogle, signOut }),
    [session, user, perfil, loading, signUp, signIn, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
