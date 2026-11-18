// API REST do AgendaFácil. O recurso principal desta etapa é Cliente.
const express = require("express");

const app = express();
const PORTA = process.env.PORT || 3000;

// O middleware interpreta um body JSON e disponibiliza seus campos em req.body.
app.use(express.json());

// Dados em memória para a etapa. Ao reiniciar o servidor, a lista volta aos exemplos abaixo.
let clientes = [
  { id: 1, nome: "Ana Exemplo", telefone: "(11) 99999-1111", email: "ana@example.com" },
  { id: 2, nome: "Bruno Exemplo", telefone: "(11) 98888-2222", email: "" }
];
let proximoId = 3;

// Devolve um JSON padronizado para respostas que deram certo.
function responderSucesso(resposta, status, dados) {
  return resposta.status(status).json({ sucesso: true, dados });
}

// Devolve um JSON padronizado para erros de validação, recurso ausente ou rota inexistente.
function responderErro(resposta, status, codigo, mensagem) {
  return resposta.status(status).json({
    sucesso: false,
    erro: { codigo, mensagem }
  });
}

// Converte o parâmetro da URL para número inteiro positivo e informa erro 400 quando necessário.
function obterIdValido(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    responderErro(res, 400, "ID_INVALIDO", "O id deve ser um número inteiro positivo.");
    return null;
  }

  return id;
}

// Mantém somente os dígitos do telefone para evitar duplicidade com formatações diferentes.
function normalizarTelefone(telefone) {
  return telefone.replace(/\D/g, "");
}

// Valida e normaliza os dados recebidos. PATCH permite campos parciais; POST e PUT exigem nome e telefone.
function validarDadosCliente(dados, parcial = false) {
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return { erro: "Envie um objeto JSON com os dados do cliente." };
  }

  const camposPermitidos = ["nome", "telefone", "email"];
  const camposRecebidos = Object.keys(dados);
  const possuiCampoDesconhecido = camposRecebidos.some(campo => !camposPermitidos.includes(campo));

  if (possuiCampoDesconhecido) {
    return { erro: "Os campos permitidos são nome, telefone e email." };
  }

  if (parcial && camposRecebidos.length === 0) {
    return { erro: "Envie ao menos um campo para atualizar." };
  }

  if (!parcial && (typeof dados.nome !== "string" || typeof dados.telefone !== "string")) {
    return { erro: "Nome e telefone são obrigatórios." };
  }

  const clienteNormalizado = {};

  if ("nome" in dados) {
    if (typeof dados.nome !== "string") {
      return { erro: "O nome deve ser um texto." };
    }

    const nome = dados.nome.trim();

    if (nome.length < 2 || nome.length > 80) {
      return { erro: "O nome deve ter entre 2 e 80 caracteres." };
    }

    clienteNormalizado.nome = nome;
  }

  if ("telefone" in dados) {
    if (typeof dados.telefone !== "string") {
      return { erro: "O telefone deve ser um texto." };
    }

    const telefone = dados.telefone.trim();
    const digitosTelefone = normalizarTelefone(telefone);

    if (!/^[\d\s()+-]+$/.test(telefone) || digitosTelefone.length < 10 || digitosTelefone.length > 11) {
      return { erro: "Informe um telefone com DDD e 10 ou 11 dígitos, sem letras." };
    }

    clienteNormalizado.telefone = telefone;
  }

  if ("email" in dados) {
    if (typeof dados.email !== "string") {
      return { erro: "O e-mail deve ser um texto." };
    }

    const email = dados.email.trim().toLowerCase();
    const emailValido = email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!emailValido || email.length > 120) {
      return { erro: "Informe um e-mail válido com no máximo 120 caracteres ou deixe-o vazio." };
    }

    clienteNormalizado.email = email;
  }

  return { dados: clienteNormalizado };
}

// GET /api/clientes: consulta todos os clientes cadastrados.
app.get("/api/clientes", (req, res) => {
  responderSucesso(res, 200, clientes);
});

// GET /api/clientes/:id: consulta um único cliente pelo identificador da URL.
app.get("/api/clientes/:id", (req, res) => {
  const id = obterIdValido(req, res);

  if (id === null) {
    return;
  }

  const cliente = clientes.find(item => item.id === id);

  if (!cliente) {
    return responderErro(res, 404, "CLIENTE_NAO_ENCONTRADO", "Cliente não encontrado.");
  }

  responderSucesso(res, 200, cliente);
});

// POST /api/clientes: cria um novo cliente após validar todos os campos obrigatórios.
app.post("/api/clientes", (req, res) => {
  const validacao = validarDadosCliente(req.body);

  if (validacao.erro) {
    return responderErro(res, 422, "DADOS_INVALIDOS", validacao.erro);
  }

  const telefoneDuplicado = clientes.some(item =>
    normalizarTelefone(item.telefone) === normalizarTelefone(validacao.dados.telefone)
  );

  if (telefoneDuplicado) {
    return responderErro(res, 422, "TELEFONE_DUPLICADO", "Já existe um cliente com esse telefone.");
  }

  const novoCliente = { id: proximoId, ...validacao.dados, email: validacao.dados.email || "" };
  proximoId += 1;
  clientes.push(novoCliente);
  responderSucesso(res, 201, novoCliente);
});

// PUT /api/clientes/:id: substitui os dados editáveis de um cliente existente.
app.put("/api/clientes/:id", (req, res) => {
  const id = obterIdValido(req, res);

  if (id === null) {
    return;
  }

  const indice = clientes.findIndex(item => item.id === id);

  if (indice === -1) {
    return responderErro(res, 404, "CLIENTE_NAO_ENCONTRADO", "Cliente não encontrado.");
  }

  const validacao = validarDadosCliente(req.body);

  if (validacao.erro) {
    return responderErro(res, 422, "DADOS_INVALIDOS", validacao.erro);
  }

  const telefoneDuplicado = clientes.some(item =>
    item.id !== id && normalizarTelefone(item.telefone) === normalizarTelefone(validacao.dados.telefone)
  );

  if (telefoneDuplicado) {
    return responderErro(res, 422, "TELEFONE_DUPLICADO", "Já existe outro cliente com esse telefone.");
  }

  const clienteAtualizado = { id, ...validacao.dados, email: validacao.dados.email || "" };
  clientes[indice] = clienteAtualizado;
  responderSucesso(res, 200, clienteAtualizado);
});

// PATCH /api/clientes/:id: altera somente os campos enviados pelo cliente HTTP.
app.patch("/api/clientes/:id", (req, res) => {
  const id = obterIdValido(req, res);

  if (id === null) {
    return;
  }

  const indice = clientes.findIndex(item => item.id === id);

  if (indice === -1) {
    return responderErro(res, 404, "CLIENTE_NAO_ENCONTRADO", "Cliente não encontrado.");
  }

  const validacao = validarDadosCliente(req.body, true);

  if (validacao.erro) {
    return responderErro(res, 422, "DADOS_INVALIDOS", validacao.erro);
  }

  if (validacao.dados.telefone) {
    const telefoneDuplicado = clientes.some(item =>
      item.id !== id && normalizarTelefone(item.telefone) === normalizarTelefone(validacao.dados.telefone)
    );

    if (telefoneDuplicado) {
      return responderErro(res, 422, "TELEFONE_DUPLICADO", "Já existe outro cliente com esse telefone.");
    }
  }

  const clienteAtualizado = { ...clientes[indice], ...validacao.dados };
  clientes[indice] = clienteAtualizado;
  responderSucesso(res, 200, clienteAtualizado);
});

// DELETE /api/clientes/:id: remove o cliente e devolve 204, que não possui corpo de resposta.
app.delete("/api/clientes/:id", (req, res) => {
  const id = obterIdValido(req, res);

  if (id === null) {
    return;
  }

  const indice = clientes.findIndex(item => item.id === id);

  if (indice === -1) {
    return responderErro(res, 404, "CLIENTE_NAO_ENCONTRADO", "Cliente não encontrado.");
  }

  clientes.splice(indice, 1);
  res.status(204).send();
});

// Responde JSON consistente quando o cliente envia um body que não é JSON válido.
app.use((erro, req, res, next) => {
  if (erro instanceof SyntaxError && "body" in erro) {
    return responderErro(res, 400, "JSON_INVALIDO", "Envie um JSON válido no corpo da requisição.");
  }

  next(erro);
});

// Trata URLs inexistentes depois que todas as rotas válidas já foram verificadas.
app.use((req, res) => {
  responderErro(res, 404, "ROTA_NAO_ENCONTRADA", "A rota solicitada não existe.");
});

// Inicia o servidor apenas quando este arquivo é executado diretamente pelo Node.
app.listen(PORTA, () => {
  console.log(`API AgendaFácil disponível em http://localhost:${PORTA}`);
});
