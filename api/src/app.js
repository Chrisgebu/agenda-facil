// Configura o Express e registra as rotas. Este arquivo não contém regra de negócio nem SQL.
const express = require("express");
const clientesRoutes = require("./routes/clientes.routes");
const agendamentosRoutes = require("./routes/agendamentos.routes");
const AppError = require("./utils/AppError");
const { respostaErro } = require("./utils/resposta");

const app = express();

// Traduz corpos JSON para req.body antes dos controllers receberem a requisição.
app.use(express.json());

// Cada arquivo de rotas representa um recurso principal da API.
app.use("/api/clientes", clientesRoutes);
app.use("/api/agendamentos", agendamentosRoutes);

// Captura JSON malformado enviado pelo Postman ou outro cliente HTTP.
app.use((erro, req, res, next) => {
  if (erro instanceof SyntaxError && "body" in erro) {
    return respostaErro(res, 400, "JSON_INVALIDO", "Envie um JSON válido no corpo da requisição.");
  }

  next(erro);
});

// Trata URLs que não foram mapeadas por nenhuma rota.
app.use((req, res) => {
  respostaErro(res, 404, "ROTA_NAO_ENCONTRADA", "A rota solicitada não existe.");
});

// Último middleware: converte erros conhecidos e falhas de persistência em JSON consistente.
app.use((erro, req, res, next) => {
  if (erro instanceof AppError) {
    return respostaErro(res, erro.status, erro.codigo, erro.message);
  }

  if (erro.code === "23505") {
    return respostaErro(res, 409, "DADO_DUPLICADO", "Já existe um registro com este valor único.");
  }

  if (erro.code === "23503") {
    return respostaErro(res, 409, "RELACIONAMENTO_INVALIDO", "A operação viola um relacionamento existente.");
  }

  console.error("Erro interno da API:", erro);
  respostaErro(res, 500, "ERRO_PERSISTENCIA", "Não foi possível concluir a operação no banco de dados.");
});

module.exports = app;
