// Ponto de entrada da API. Carrega as configurações, verifica o banco e inicia o Express.
require("dotenv").config();

const app = require("./src/app");
const { pool } = require("./src/config/database");

const porta = Number(process.env.PORT) || 3000;

// Só abre a porta HTTP depois de confirmar que o PostgreSQL está acessível.
async function iniciarServidor() {
  try {
    await pool.query("SELECT NOW()");
    app.listen(porta, () => {
      console.log(`API AgendaFácil disponível em http://localhost:${porta}`);
      console.log("Banco de dados PostgreSQL conectado.");
    });
  } catch (erro) {
    console.error("Não foi possível conectar ao banco de dados:", erro.message);
    process.exit(1);
  }
}

iniciarServidor();
