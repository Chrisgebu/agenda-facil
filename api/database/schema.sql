-- Banco relacional do AgendaFácil - Etapa 07.
-- A ordem importa: clientes é criado antes de agendamentos porque é referenciado por uma chave estrangeira.

CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  telefone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL DEFAULT '',
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agendamentos (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  servico VARCHAR(80) NOT NULL,
  duracao INTEGER NOT NULL CHECK (duracao >= 15 AND duracao <= 480 AND duracao % 15 = 0),
  data DATE NOT NULL,
  horario TIME NOT NULL,
  observacoes VARCHAR(300) NOT NULL DEFAULT '',
  status VARCHAR(20) NOT NULL DEFAULT 'Confirmado' CHECK (status IN ('Confirmado', 'Concluido', 'Cancelado')),
  criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- A consulta de agenda filtra e ordena frequentemente por data e horário.
CREATE INDEX idx_agendamentos_data_horario ON agendamentos (data, horario);

-- Este índice torna rápida a verificação de agendamentos vinculados a um cliente.
CREATE INDEX idx_agendamentos_cliente_id ON agendamentos (cliente_id);
