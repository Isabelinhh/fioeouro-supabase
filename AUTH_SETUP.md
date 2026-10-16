# Autenticação — Ouro & Fio (Supabase Auth + Google OAuth)

O que o código já faz (nada a programar):

| Item do roteiro | Onde está |
|---|---|
| Telas de cadastro, login e "Entrar com Google" (mobile-first) | `src/components/AuthScreen.jsx` |
| Contexto global de autenticação | `src/context/AuthContext.jsx` (`AuthProvider` / `useAuth`) |
| `signUp`, `signInWithPassword`, `signInWithOAuth`, `getSession`, `onAuthStateChange`, `signOut` | `src/context/AuthContext.jsx` |
| Proteção das páginas internas | `src/components/ProtectedRoute.jsx` (usado em `src/App.jsx`) |
| Perfil do usuário na interface + botão Sair | `src/components/UserMenu.jsx` (header e menu mobile) |
| RLS no banco | `supabase/schema.sql` |
| Retorno do Google no app Android (deep link) | `AndroidManifest.xml` + listener `appUrlOpen` no `AuthContext` |

## 1. Banco de dados e RLS

No Supabase: **SQL Editor > New query**, cole todo o conteúdo de `supabase/schema.sql` e rode.
Isso cria `servicos` e `agendamentos`, ativa RLS e define as policies:

- `servicos`: só usuários **logados** (`authenticated`) podem ler; ninguém altera pelo app.
- `agendamentos`: cada usuário só vê, cria e apaga **as próprias** linhas (`auth.uid() = user_id`). Visitantes (`anon`) não acessam nada.

## 2. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha com **Project URL** e **anon/publishable key**
(Project Settings > API). O `.env.local` já está no `.gitignore`.
Nunca use a `service_role` no frontend.

## 3. Configurar o Google OAuth

### 3.1 Google Cloud Console
1. https://console.cloud.google.com → crie/selecione um projeto.
2. **APIs e serviços > Tela de permissão OAuth**: tipo *Externo*, preencha nome do app e e-mail; em *Usuários de teste* adicione os e-mails que vão testar.
3. **APIs e serviços > Credenciais > Criar credenciais > ID do cliente OAuth** → tipo **Aplicativo da Web**.
4. Em **URIs de redirecionamento autorizados** adicione exatamente a *Callback URL* mostrada no Supabase (Authentication > Providers > Google), no formato:
   `https://SEU-PROJETO.supabase.co/auth/v1/callback`
5. Copie o **Client ID** e o **Client Secret**.

### 3.2 Supabase
1. **Authentication > Providers > Google**: ative, cole Client ID e Client Secret, salve.
2. **Authentication > URL Configuration**:
   - **Site URL**: `http://localhost:5173` (em produção, o domínio publicado).
   - **Redirect URLs** (adicione todas):
     - `http://localhost:5173`
     - `http://localhost:5173/**`
     - `com.fioeouro://login-callback`  ← necessário para o app Android
     - o domínio de produção, se houver

### 3.3 E-mail e senha
Em **Authentication > Providers > Email** o provedor já vem ativo. Se **Confirm email** estiver ligado,
o cadastro mostra a mensagem "confirme seu e-mail" e o usuário só entra depois de clicar no link.
Para testes rápidos você pode desligar essa opção.

## 4. Rodar

```bash
npm install
npm run dev          # navegador, http://localhost:5173
```

App Android:

```bash
npm run build
npx cap sync android
npx cap open android   # Android Studio
```

## 5. Checklist de evidências (prints para a entrega)

1. Tela de cadastro e tela de login (visão de celular: F12 > modo dispositivo).
2. Criar conta com e-mail/senha e entrar.
3. Entrar com Google.
4. Perfil (inicial/foto + nome + Sair) visível no topo do site; no celular, dentro do menu ☰.
5. Painel Supabase > **Authentication > Users** mostrando o(s) usuário(s) criado(s).
6. Painel Supabase > **Table Editor > agendamentos** com um agendamento e o `user_id` do usuário.
7. Ao clicar em **Sair**, a tela de login volta (rota protegida).
8. (Opcional) Policies RLS em **Authentication > Policies**.

## Observações

- `capacitor.config.json` agora aponta `webDir` para `dist` (saída do Vite). Antes apontava para `www`, que tinha o site antigo.
- Se usar GitHub Actions para gerar o APK, mantenha os Secrets `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
