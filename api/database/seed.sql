-- Dados fictícios para iniciar testes no Postman.
INSERT INTO clientes (nome, telefone, email) VALUES
  ('Ana Exemplo', '(11) 99999-1111', 'ana@example.com'),
  ('Bruno Exemplo', '(11) 98888-2222', '');

INSERT INTO agendamentos (cliente_id, servico, duracao, data, horario, observacoes, status) VALUES
  (1, 'Corte', 30, '2026-12-10', '09:00', 'Dados fictícios para demonstrar o relacionamento.', 'Confirmado'),
  (2, 'Barba', 30, '2026-12-10', '10:00', '', 'Confirmado');
