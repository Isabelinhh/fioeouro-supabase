import { createClient } from '@supabase/supabase-js';

// Resgatando as variáveis injetadas em tempo de execução pelo Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase não configurado: crie o arquivo .env.local na raiz do projeto ' +
    '(veja .env.local.example) com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.'
  );
}

// Instanciando e exportando o cliente de dados
export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
