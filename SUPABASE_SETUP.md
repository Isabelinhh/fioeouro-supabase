# Configurando o Supabase — Ouro & Fio (React + Vite + Capacitor)

## 1. Criar as tabelas e as políticas de segurança (RLS)

No **SQL Editor** do Supabase, cole e rode todo o conteúdo de
`supabase/schema.sql`. Ele cria `servicos` (com os 8 serviços do salão) e
`agendamentos`, ativa o RLS e define as policies: só usuários logados leem os
serviços e cada usuário acessa apenas os próprios agendamentos.

> A leitura pública (anon) que existia antes foi removida: agora o app inteiro
> exige login. Veja `AUTH_SETUP.md` para configurar o login e o Google.

## 2. Instalar dependências

```bash
npm install
```

Isso instala `react`, `react-dom`, `vite`, `@vitejs/plugin-react` e
`@supabase/supabase-js` (já listados no `package.json`).

## 3. Criar o cofre de credenciais (`.env.local`)

1. Copie `.env.local.example` para `.env.local` (na raiz do projeto).
2. Vá em **Project Settings > API** no painel do Supabase e copie a **Project URL** e a **anon public key**.
3. Preencha:

```
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

O `.env.local` já está no `.gitignore` — não sobe para o GitHub. As variáveis
precisam começar com `VITE_`, senão o Vite não as expõe para o código.

## 4. Rodar em desenvolvimento

```bash
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`),
vá até a seção **Agendar** e abra o **DevTools (F12) > Console/Network** para
ver a requisição ao Supabase e o array de serviços chegando da nuvem.

## 5. Gerar o build e sincronizar com o Android (Capacitor)

```bash
npm run build
npx cap sync android
```

O `capacitor.config.json` já aponta `webDir` para `dist` (pasta gerada pelo
Vite), então o app Android passa a carregar o HTML/JS/CSS buildados pelo Vite.

## 6. Se usar o CI do GitHub Actions (gerar o APK automaticamente)

O workflow `.github/workflows/build-apk.yml` agora roda `npm run build` antes
de sincronizar com o Android. Como o `.env.local` não vai para o Git, cadastre
as mesmas variáveis como **Secrets** do repositório (Settings > Secrets and
variables > Actions):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Onde cada peça do roteiro está no projeto

| Peça do roteiro | Arquivo neste projeto |
|---|---|
| `.env.local` | `.env.local` (a partir de `.env.local.example`) |
| SDK do Supabase | `@supabase/supabase-js` no `package.json` |
| `supabaseClient.js` | `src/services/supabaseClient.js` |
| Componente com `useState`/`useEffect` | `src/App.jsx` (busca a tabela `servicos`) |
| Tabela remota (`produtos` no roteiro) | tabelas `servicos` e `agendamentos` no Supabase |
| Autenticação | `src/context/AuthContext.jsx`, `src/components/AuthScreen.jsx`, `ProtectedRoute.jsx` |

O restante da interatividade original do site (menu mobile, assistente de
agendamento, câmera, carrossel de depoimentos) foi migrado para dentro de um
`useEffect` em `src/App.jsx` — o foco da migração foi a integração com o
Supabase pedida no roteiro, mantendo o restante do comportamento idêntico ao
site original.
