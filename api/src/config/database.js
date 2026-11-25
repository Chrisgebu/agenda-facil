// Cria um pool de conexões. O pool reaproveita conexões em vez de abrir uma para cada requisição.
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("Defina DATABASE_URL no arquivo api/.env antes de iniciar a API.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000
});

// Um erro do pool não deve encerrar a API sem deixar uma mensagem clara no terminal.
pool.on("error", erro => {
  console.error("Erro inesperado no pool PostgreSQL:", erro.message);
});

module.exports = { pool };
