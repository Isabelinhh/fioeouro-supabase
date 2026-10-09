# Configurando o Supabase — Ouro & Fio (React + Vite + Capacitor)

## 1. Criar a tabela `servicos`

No SQL Editor do seu projeto Supabase, rode:

```sql
create table servicos (
  id text primary key,
  nome text not null,
  duracao text,
  preco numeric not null
);

-- Habilita Row Level Security
alter table servicos enable row level security;

-- Permite leitura pública (o app só faz SELECT, então é seguro)
create policy "Leitura pública de serviços"
on servicos for select
to anon
using (true);
```

Popule com os serviços do salão:

```sql
insert into servicos (id, nome, duracao, preco) values
  ('corte-fem', 'Corte feminino', '50 min', 120),
  ('corte-masc', 'Corte masculino', '30 min', 70),
  ('escova', 'Escova modelada', '45 min', 90),
  ('coloracao', 'Coloração global', '2h', 220),
  ('balayage', 'Mechas / Balayage', '3h', 380),
  ('hidratacao', 'Hidratação profunda', '40 min', 95),
  ('botox', 'Botox capilar', '1h30', 160),
  ('barba', 'Barba', '25 min', 55);
```

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
| Tabela remota (`produtos` no roteiro) | tabela `servicos` no Supabase |

O restante da interatividade original do site (menu mobile, assistente de
agendamento, câmera, carrossel de depoimentos) foi migrado para dentro de um
`useEffect` em `src/App.jsx` — o foco da migração foi a integração com o
Supabase pedida no roteiro, mantendo o restante do comportamento idêntico ao
site original.
