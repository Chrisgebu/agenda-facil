// Service de Agendamento: aplica as regras de cliente relacionado, horários e conflitos.
const AppError = require("../utils/AppError");

const STATUS_VALIDOS = ["Confirmado", "Concluido", "Cancelado"];

function validarId(id) {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new AppError(400, "ID_INVALIDO", "O id deve ser um número inteiro positivo.");
  }
  return numero;
}

function dataValida(data) {
  const formato = /^\d{4}-\d{2}-\d{2}$/.test(data);
  const objeto = new Date(`${data}T00:00:00Z`);
  return formato && !Number.isNaN(objeto.getTime()) && objeto.toISOString().startsWith(data);
}

function normalizarDados(dados, parcial = false) {
  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    throw new AppError(422, "DADOS_INVALIDOS", "Envie um objeto JSON com os dados do agendamento.");
  }

  const camposPermitidos = ["clienteId", "servico", "duracao", "data", "horario", "observacoes", "status"];
  const campos = Object.keys(dados);

  if (campos.some(campo => !camposPermitidos.includes(campo))) {
    throw new AppError(422, "DADOS_INVALIDOS", "Há campos não permitidos no agendamento.");
  }

  if (parcial && campos.length === 0) {
    throw new AppError(422, "DADOS_INVALIDOS", "Envie ao menos um campo para atualizar.");
  }

  if (!parcial && ["clienteId", "servico", "duracao", "data", "horario"].some(campo => !(campo in dados))) {
    throw new AppError(422, "DADOS_INVALIDOS", "Cliente, serviço, duração, data e horário são obrigatórios.");
  }

  const resultado = {};

  if ("clienteId" in dados) {
    const clienteId = Number(dados.clienteId);
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      throw new AppError(422, "DADOS_INVALIDOS", "clienteId deve ser um número inteiro positivo.");
    }
    resultado.clienteId = clienteId;
  }

  if ("servico" in dados) {
    const servico = typeof dados.servico === "string" ? dados.servico.trim() : "";
    if (servico.length < 2 || servico.length > 80) {
      throw new AppError(422, "DADOS_INVALIDOS", "O serviço deve ter entre 2 e 80 caracteres.");
    }
    resultado.servico = servico;
  }

  if ("duracao" in dados) {
    const duracao = Number(dados.duracao);
    if (!Number.isInteger(duracao) || duracao < 15 || duracao > 480 || duracao % 15 !== 0) {
      throw new AppError(422, "DADOS_INVALIDOS", "A duração deve ser de 15 a 480 minutos, em intervalos de 15.");
    }
    resultado.duracao = duracao;
  }

  if ("data" in dados) {
    if (typeof dados.data !== "string" || !dataValida(dados.data)) {
      throw new AppError(422, "DADOS_INVALIDOS", "Informe uma data válida no formato AAAA-MM-DD.");
    }
    resultado.data = dados.data;
  }

  if ("horario" in dados) {
    if (typeof dados.horario !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(dados.horario)) {
      throw new AppError(422, "DADOS_INVALIDOS", "Informe um horário válido no formato HH:MM.");
    }
    resultado.horario = dados.horario;
  }

  if ("observacoes" in dados) {
    const observacoes = typeof dados.observacoes === "string" ? dados.observacoes.trim() : "";
    if (observacoes.length > 300) {
      throw new AppError(422, "DADOS_INVALIDOS", "As observações devem ter no máximo 300 caracteres.");
    }
    resultado.observacoes = observacoes;
  }

  if ("status" in dados) {
    if (!STATUS_VALIDOS.includes(dados.status)) {
      throw new AppError(422, "DADOS_INVALIDOS", "O status deve ser Confirmado, Concluido ou Cancelado.");
    }
    resultado.status = dados.status;
  }

  return resultado;
}

function criarAgendamentoService(agendamentoRepository, clienteRepository) {
  async function buscarPorId(id) {
    const idValido = validarId(id);
    const resultado = await agendamentoRepository.findById(idValido);
    if (resultado.rows.length === 0) {
      throw new AppError(404, "AGENDAMENTO_NAO_ENCONTRADO", "Agendamento não encontrado.");
    }
    return resultado.rows[0];
  }

  async function validarRelacionamentoEConflito(dados, ignoredId = null) {
    const cliente = await clienteRepository.findById(dados.clienteId);
    if (cliente.rows.length === 0) {
      throw new AppError(422, "CLIENTE_NAO_ENCONTRADO", "O cliente informado não existe.");
    }

    if (dados.status !== "Cancelado") {
      const conflito = await agendamentoRepository.findConflict(dados, ignoredId);
      if (conflito.rows.length > 0) {
        throw new AppError(409, "HORARIO_OCUPADO", "Já existe um agendamento ativo nesse período.");
      }
    }
  }

  return {
    async listar() {
      const resultado = await agendamentoRepository.findAll();
      return resultado.rows;
    },

    buscarPorId,

    async criar(dados) {
      const agendamento = normalizarDados(dados);
      const dadosComPadrao = { ...agendamento, observacoes: agendamento.observacoes || "", status: agendamento.status || "Confirmado" };
      await validarRelacionamentoEConflito(dadosComPadrao);
      const resultado = await agendamentoRepository.create(dadosComPadrao);
      return resultado.rows[0];
    },

    async atualizar(id, dados, parcial = false) {
      const existente = await buscarPorId(id);
      const camposAtualizados = normalizarDados(dados, parcial);
      const combinado = {
        clienteId: existente.cliente_id,
        servico: existente.servico,
        duracao: existente.duracao,
        data: existente.data instanceof Date ? existente.data.toISOString().slice(0, 10) : String(existente.data).slice(0, 10),
        horario: String(existente.horario).slice(0, 5),
        observacoes: existente.observacoes,
        status: existente.status,
        ...camposAtualizados
      };
      const dadosValidos = normalizarDados(combinado);
      const dadosComPadrao = { ...dadosValidos, observacoes: dadosValidos.observacoes || "", status: dadosValidos.status || "Confirmado" };
      await validarRelacionamentoEConflito(dadosComPadrao, existente.id);
      const resultado = await agendamentoRepository.update(existente.id, dadosComPadrao);
      return resultado.rows[0];
    },

    async remover(id) {
      const agendamento = await buscarPorId(id);
      await agendamentoRepository.remove(agendamento.id);
    }
  };
}

module.exports = criarAgendamentoService;
