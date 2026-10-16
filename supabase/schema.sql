-- =====================================================================
-- Ouro & Fio — banco de dados + RLS (rode no SQL Editor do Supabase)
-- Pode ser executado mais de uma vez sem erro.
-- =====================================================================

-- ---------- 1) SERVIÇOS (catálogo) ----------
create table if not exists public.servicos (
  id text primary key,
  nome text not null,
  duracao text,
  preco numeric not null
);

alter table public.servicos enable row level security;

-- Troca a antiga leitura pública (anon) por leitura só para logados
drop policy if exists "Leitura pública de serviços" on public.servicos;
drop policy if exists "Serviços visíveis para logados" on public.servicos;
create policy "Serviços visíveis para logados"
  on public.servicos for select
  to authenticated
  using (true);
-- Sem policies de insert/update/delete: ninguém altera o catálogo pelo app.

insert into public.servicos (id, nome, duracao, preco) values
  ('corte-fem',  'Corte feminino',      '50 min', 120),
  ('corte-masc', 'Corte masculino',     '30 min', 70),
  ('escova',     'Escova modelada',     '45 min', 90),
  ('coloracao',  'Coloração global',    '2h',     220),
  ('balayage',   'Mechas / Balayage',   '3h',     380),
  ('hidratacao', 'Hidratação profunda', '40 min', 95),
  ('botox',      'Botox capilar',       '1h30',   160),
  ('barba',      'Barba',               '25 min', 55)
on conflict (id) do nothing;

-- ---------- 2) AGENDAMENTOS (dados de cada usuário) ----------
create table if not exists public.agendamentos (
  id bigint generated always as identity primary key,
  codigo bigint generated always as identity (start with 129),
  user_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  servico_id text not null references public.servicos(id),
  servico_nome text not null,
  profissional_id text not null,
  profissional_nome text not null,
  data date not null,
  hora text not null,
  nome_cliente text not null,
  telefone text not null,
  preco numeric not null,
  created_at timestamptz not null default now(),
  -- impede dois agendamentos no mesmo horário com o mesmo profissional
  unique (profissional_id, data, hora)
);

create index if not exists agendamentos_user_idx on public.agendamentos (user_id);

alter table public.agendamentos enable row level security;

drop policy if exists "Ver só os próprios agendamentos" on public.agendamentos;
create policy "Ver só os próprios agendamentos"
  on public.agendamentos for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Criar agendamento para si mesmo" on public.agendamentos;
create policy "Criar agendamento para si mesmo"
  on public.agendamentos for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Cancelar só os próprios agendamentos" on public.agendamentos;
create policy "Cancelar só os próprios agendamentos"
  on public.agendamentos for delete
  to authenticated
  using (auth.uid() = user_id);

-- Visitantes sem login (anon) não têm nenhuma policy => não leem nem gravam nada.
