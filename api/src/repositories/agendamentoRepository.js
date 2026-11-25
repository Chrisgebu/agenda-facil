// Repositório de Agendamento: concentra todas as queries SQL desta entidade relacionada.
const { pool } = require("../config/database");

const colunasRetorno = `
  a.id, a.cliente_id, c.nome AS cliente_nome, a.servico, a.duracao,
  a.data, a.horario, a.observacoes, a.status, a.criado_em, a.atualizado_em`;
const joinCliente = " FROM agendamentos a INNER JOIN clientes c ON c.id = a.cliente_id ";

function findAll() {
  return pool.query(`SELECT ${colunasRetorno}${joinCliente}ORDER BY a.data, a.horario`);
}

function findById(id) {
  return pool.query(`SELECT ${colunasRetorno}${joinCliente}WHERE a.id = $1`, [id]);
}

function countByClienteId(clienteId) {
  return pool.query("SELECT COUNT(*)::int AS total FROM agendamentos WHERE cliente_id = $1", [clienteId]);
}

function findConflict(dados, ignoredId = null) {
  const sql = ignoredId === null
    ? `SELECT id FROM agendamentos
       WHERE data = $1 AND status <> 'Cancelado'
       AND $2::time < horario + (duracao * INTERVAL '1 minute')
       AND $2::time + ($3 * INTERVAL '1 minute') > horario
       LIMIT 1`
    : `SELECT id FROM agendamentos
       WHERE data = $1 AND status <> 'Cancelado' AND id <> $4
       AND $2::time < horario + (duracao * INTERVAL '1 minute')
       AND $2::time + ($3 * INTERVAL '1 minute') > horario
       LIMIT 1`;
  const valores = ignoredId === null
    ? [dados.data, dados.horario, dados.duracao]
    : [dados.data, dados.horario, dados.duracao, ignoredId];
  return pool.query(sql, valores);
}

function create(dados) {
  return pool.query(
    `INSERT INTO agendamentos (cliente_id, servico, duracao, data, horario, observacoes, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, cliente_id, servico, duracao, data, horario, observacoes, status, criado_em, atualizado_em`,
    [dados.clienteId, dados.servico, dados.duracao, dados.data, dados.horario, dados.observacoes, dados.status]
  );
}

function update(id, dados) {
  return pool.query(
    `UPDATE agendamentos
     SET cliente_id = $1, servico = $2, duracao = $3, data = $4, horario = $5,
         observacoes = $6, status = $7, atualizado_em = CURRENT_TIMESTAMP
     WHERE id = $8
     RETURNING id, cliente_id, servico, duracao, data, horario, observacoes, status, criado_em, atualizado_em`,
    [dados.clienteId, dados.servico, dados.duracao, dados.data, dados.horario, dados.observacoes, dados.status, id]
  );
}

function remove(id) {
  return pool.query("DELETE FROM agendamentos WHERE id = $1 RETURNING id", [id]);
}

module.exports = { findAll, findById, countByClienteId, findConflict, create, update, remove };
