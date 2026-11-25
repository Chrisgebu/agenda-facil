// Repositório de Cliente: este é o único arquivo que contém SQL sobre a tabela clientes.
const { pool } = require("../config/database");

function findAll() {
  return pool.query("SELECT id, nome, telefone, email, criado_em, atualizado_em FROM clientes ORDER BY nome");
}

function findById(id) {
  return pool.query(
    "SELECT id, nome, telefone, email, criado_em, atualizado_em FROM clientes WHERE id = $1",
    [id]
  );
}

function findByTelefone(telefoneNormalizado, ignoredId = null) {
  const sql = ignoredId === null
    ? "SELECT id FROM clientes WHERE regexp_replace(telefone, '[^0-9]', '', 'g') = $1"
    : "SELECT id FROM clientes WHERE regexp_replace(telefone, '[^0-9]', '', 'g') = $1 AND id <> $2";
  const valores = ignoredId === null ? [telefoneNormalizado] : [telefoneNormalizado, ignoredId];
  return pool.query(sql, valores);
}

function create(dados) {
  return pool.query(
    `INSERT INTO clientes (nome, telefone, email)
     VALUES ($1, $2, $3)
     RETURNING id, nome, telefone, email, criado_em, atualizado_em`,
    [dados.nome, dados.telefone, dados.email]
  );
}

function update(id, dados) {
  return pool.query(
    `UPDATE clientes
     SET nome = $1, telefone = $2, email = $3, atualizado_em = CURRENT_TIMESTAMP
     WHERE id = $4
     RETURNING id, nome, telefone, email, criado_em, atualizado_em`,
    [dados.nome, dados.telefone, dados.email, id]
  );
}

function remove(id) {
  return pool.query("DELETE FROM clientes WHERE id = $1 RETURNING id", [id]);
}

module.exports = { findAll, findById, findByTelefone, create, update, remove };
