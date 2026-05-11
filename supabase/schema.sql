create table if not exists public.prc_records (
  id uuid primary key,
  pr_number text,
  status text not null default 'draft',
  excel_file_name text not null,
  reference_file_name text,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prc_records_pr_number_idx on public.prc_records (pr_number);
create index if not exists prc_records_updated_at_idx on public.prc_records (updated_at desc);

alter table public.prc_records enable row level security;

create policy "Authenticated users can read PRC records"
  on public.prc_records for select
  to authenticated
  using (true);

create policy "Service role can manage PRC records"
  on public.prc_records for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
