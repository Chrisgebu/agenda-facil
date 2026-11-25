// Service de Cliente: concentra validações e regras de negócio sem conhecer Express ou SQL.
const AppError = require("../utils/AppError");

function normalizarTelefone(telefone) {
  return telefone.replace(/\D/g, "");
}

function validarId(id) {
  const numero = Number(id);

  if (!Number.isInteger(numero) || numero <= 0) {
    throw new AppError(400, "ID_INVALIDO", "O id deve ser um número inteiro positivo.");
  }

  return numero;
}

function normalizarDados(dados, parcial = false) {
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    throw new AppError(422, "DADOS_INVALIDOS", "Envie um objeto JSON com os dados do cliente.");
  }

  const camposPermitidos = ["nome", "telefone", "email"];
  const campos = Object.keys(dados);

  if (campos.some(campo => !camposPermitidos.includes(campo))) {
    throw new AppError(422, "DADOS_INVALIDOS", "Os campos permitidos são nome, telefone e email.");
  }

  if (parcial && campos.length === 0) {
    throw new AppError(422, "DADOS_INVALIDOS", "Envie ao menos um campo para atualizar.");
  }

  if (!parcial && (typeof dados.nome !== "string" || typeof dados.telefone !== "string")) {
    throw new AppError(422, "DADOS_INVALIDOS", "Nome e telefone são obrigatórios.");
  }

  const resultado = {};

  if ("nome" in dados) {
    const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";
    if (nome.length < 2 || nome.length > 80) {
      throw new AppError(422, "DADOS_INVALIDOS", "O nome deve ter entre 2 e 80 caracteres.");
    }
    resultado.nome = nome;
  }

  if ("telefone" in dados) {
    const telefone = typeof dados.telefone === "string" ? dados.telefone.trim() : "";
    const digitos = normalizarTelefone(telefone);
    if (!/^[\d\s()+-]+$/.test(telefone) || digitos.length < 10 || digitos.length > 11) {
      throw new AppError(422, "DADOS_INVALIDOS", "Informe um telefone com DDD e 10 ou 11 dígitos, sem letras.");
    }
    resultado.telefone = telefone;
  }

  if ("email" in dados) {
    const email = typeof dados.email === "string" ? dados.email.trim().toLowerCase() : null;
    const emailValido = email !== null && (email === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    if (!emailValido || email.length > 120) {
      throw new AppError(422, "DADOS_INVALIDOS", "Informe um e-mail válido com no máximo 120 caracteres ou deixe-o vazio.");
    }
    resultado.email = email;
  }

  // No PUT, e-mail continua opcional: ausência do campo representa e-mail vazio no recurso completo.
  if (!parcial && !("email" in dados)) {
    resultado.email = "";
  }

  return resultado;
}

// A fábrica recebe o repositório por injeção de dependência e evita acoplamento com PostgreSQL.
function criarClienteService(clienteRepository, agendamentoRepository) {
  async function buscarPorId(id) {
    const idValido = validarId(id);
    const resultado = await clienteRepository.findById(idValido);

    if (resultado.rows.length === 0) {
      throw new AppError(404, "CLIENTE_NAO_ENCONTRADO", "Cliente não encontrado.");
    }

    return resultado.rows[0];
  }

  async function verificarTelefone(telefone, ignoredId = null) {
    const resultado = await clienteRepository.findByTelefone(normalizarTelefone(telefone), ignoredId);
    if (resultado.rows.length > 0) {
      throw new AppError(409, "TELEFONE_DUPLICADO", "Já existe um cliente com esse telefone.");
    }
  }

  return {
    async listar() {
      const resultado = await clienteRepository.findAll();
      return resultado.rows;
    },

    buscarPorId,

    async criar(dados) {
      const cliente = normalizarDados(dados);
      await verificarTelefone(cliente.telefone);
      const resultado = await clienteRepository.create({ ...cliente, email: cliente.email || "" });
      return resultado.rows[0];
    },

    async atualizar(id, dados, parcial = false) {
      const clienteExistente = await buscarPorId(id);
      const camposAtualizados = normalizarDados(dados, parcial);
      const clienteFinal = { ...clienteExistente, ...camposAtualizados };

      // Após combinar PATCH com o registro atual, valida o objeto completo antes de persistir.
      const dadosValidos = normalizarDados(clienteFinal);
      await verificarTelefone(dadosValidos.telefone, clienteExistente.id);
      const resultado = await clienteRepository.update(clienteExistente.id, { ...dadosValidos, email: dadosValidos.email || "" });
      return resultado.rows[0];
    },

    async remover(id) {
      const cliente = await buscarPorId(id);
      const relacao = await agendamentoRepository.countByClienteId(cliente.id);

      if (relacao.rows[0].total > 0) {
        throw new AppError(409, "CLIENTE_COM_AGENDAMENTOS", "Não é possível excluir um cliente que possui agendamentos.");
      }

      await clienteRepository.remove(cliente.id);
    }
  };
}

module.exports = criarClienteService;
