import { createClient } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';

// Variáveis injetadas pelo Vite (arquivo .env.local — nunca vai para o GitHub).
// Use SOMENTE a chave pública (anon / publishable). A service_role jamais
// deve aparecer no código do navegador/app.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase não configurado: crie o arquivo .env.local na raiz do projeto ' +
    '(veja .env.local.example) com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  );
}

export const isNative = Capacitor.isNativePlatform();

// Deep link usado para voltar ao app Android depois do login com Google.
export const NATIVE_REDIRECT_URL = 'com.fioeouro://login-callback';

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    // No navegador o SDK lê o ?code= da URL sozinho; no app nativo quem
    // trata o retorno é o listener appUrlOpen (AuthContext).
    detectSessionInUrl: !isNative,
  },
});
