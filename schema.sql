-- ============================================================
--  Gremio de Cazadores - Estructura de la base de datos
--  Pega TODO este archivo en el SQL Editor de Supabase
--  y dale a "Run". Una sola vez.
-- ============================================================

create table cazadores (
    id            bigserial primary key,
    nombre        text not null,
    email         text not null unique,
    password_hash text not null,
    creado_en     timestamptz default now()
);

create table encargos (
    id          bigserial primary key,
    titulo      text not null,
    recompensa  integer not null default 0,
    completado  boolean not null default false,
    user_id     bigint not null references cazadores(id) on delete cascade,
    creado_en   timestamptz default now()
);

-- ── Datos de prueba ─────────────────────────────────────────
-- Dos cazadores ya registrados. Las contrasenas estan hasheadas
-- con bcrypt (asi se guardan siempre, nunca en texto plano).
--
--   kael@gremio.com  ->  cazador123
--   mira@gremio.com  ->  gremio456

insert into cazadores (nombre, email, password_hash) values
('Kael',  'kael@gremio.com',  '$2b$10$8dSqIsc9HuZhezEbJ4x1iOUl8tdKz9rkOxaMdIQSVFd7iYIzI/B8y'),
('Mira',  'mira@gremio.com',  '$2b$10$pCJjx7C3paApzG3yzhbqSe6yZnNwidKydGUNTVL76l19VdQZjVYFW');

-- Encargos de Kael (id = 1)
insert into encargos (titulo, recompensa, completado, user_id) values
('Cazar al lobo de las minas', 250, false, 1),
('Escoltar la caravana del norte', 400, true, 1);

-- Encargos de Mira (id = 2) - NO deberian aparecerle a Kael
insert into encargos (titulo, recompensa, completado, user_id) values
('Recuperar el amuleto robado', 600, false, 2),
('Limpiar el nido de arpias', 320, false, 2);
