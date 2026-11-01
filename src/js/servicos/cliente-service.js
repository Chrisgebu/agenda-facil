// Serviço simulado de clientes. Ele reúne a comunicação assíncrona e a persistência.
import { carregarDados, salvarDados } from "../modulos/armazenamento.js";

const CHAVE_CLIENTES = "agendaFacilClientes";
const CHAVE_AGENDAMENTOS = "agendaFacilAgendamentos";
const CHAVE_CLIENTES_INICIALIZADOS = "agendaFacilClientesInicializados";
const URL_CLIENTES_INICIAIS = new URL("../../data/clientes-iniciais.json", import.meta.url);
const URL_INDISPONIVEL = new URL("../../data/servico-indisponivel.json", import.meta.url);
const TEMPO_RESPOSTA_SIMULADA = 1500;

// Mantém a resposta visível tempo suficiente para demonstrar o estado de carregamento.
function aguardarResposta() {
  return new Promise(resolve => window.setTimeout(resolve, TEMPO_RESPOSTA_SIMULADA));
}

// Faz a consulta externa via Fetch API e transforma respostas HTTP inválidas em erro de comunicação.
async function buscarDadosIniciais(url) {
  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error("Não foi possível consultar o serviço de clientes.");
  }

  const dados = await resposta.json();

  if (!Array.isArray(dados)) {
    throw new Error("O serviço retornou dados em formato inválido.");
  }

  return dados;
}

// Consulta o serviço e devolve os clientes mantidos no navegador.
// Na primeira consulta, os dados recebidos do arquivo JSON criam a lista inicial.
export async function consultarClientes({ simularErro = false } = {}) {
  await aguardarResposta();
  const dadosExternos = await buscarDadosIniciais(simularErro ? URL_INDISPONIVEL : URL_CLIENTES_INICIAIS);
  const clientesSalvos = carregarDados(CHAVE_CLIENTES);

  const dadosJaForamInicializados = localStorage.getItem(CHAVE_CLIENTES_INICIALIZADOS) === "true";

  if (!dadosJaForamInicializados && clientesSalvos.length === 0) {
    salvarDados(CHAVE_CLIENTES, dadosExternos);
    localStorage.setItem(CHAVE_CLIENTES_INICIALIZADOS, "true");
    return dadosExternos;
  }

  localStorage.setItem(CHAVE_CLIENTES_INICIALIZADOS, "true");
  return clientesSalvos;
}

// Simula um POST: valida duplicidade no serviço e persiste o novo objeto de forma assíncrona.
export async function criarCliente(dadosDoCliente) {
  await aguardarResposta();
  const clientes = carregarDados(CHAVE_CLIENTES);
  const telefoneJaUsado = clientes.some(cliente => normalizarTelefone(cliente.telefone) === normalizarTelefone(dadosDoCliente.telefone));

  if (telefoneJaUsado) {
    throw new Error("Já existe um cliente com esse telefone.");
  }

  const novoCliente = { id: Date.now(), ...dadosDoCliente };
  salvarDados(CHAVE_CLIENTES, [...clientes, novoCliente]);
  return novoCliente;
}

// Simula um PUT: atualiza o cliente e mantém o nome sincronizado nos agendamentos existentes.
export async function atualizarCliente(id, dadosDoCliente) {
  await aguardarResposta();
  const clientes = carregarDados(CHAVE_CLIENTES);
  const telefoneJaUsado = clientes.some(cliente =>
    cliente.id !== id && normalizarTelefone(cliente.telefone) === normalizarTelefone(dadosDoCliente.telefone)
  );

  if (telefoneJaUsado) {
    throw new Error("Já existe outro cliente com esse telefone.");
  }

  const clienteExiste = clientes.some(cliente => cliente.id === id);

  if (!clienteExiste) {
    throw new Error("O cliente que você tentou editar não foi encontrado.");
  }

  const clientesAtualizados = clientes.map(cliente =>
    cliente.id === id ? { ...cliente, ...dadosDoCliente } : cliente
  );
  const agendamentos = carregarDados(CHAVE_AGENDAMENTOS);
  const agendamentosAtualizados = agendamentos.map(agendamento =>
    agendamento.clienteId === id ? { ...agendamento, clienteNome: dadosDoCliente.nome } : agendamento
  );

  salvarDados(CHAVE_CLIENTES, clientesAtualizados);
  salvarDados(CHAVE_AGENDAMENTOS, agendamentosAtualizados);
  return clientesAtualizados.find(cliente => cliente.id === id);
}

// Simula um DELETE e preserva a integridade: clientes com histórico de agenda não podem ser removidos.
export async function excluirCliente(id) {
  await aguardarResposta();
  const clientes = carregarDados(CHAVE_CLIENTES);
  const agendamentos = carregarDados(CHAVE_AGENDAMENTOS);
  const possuiAgendamento = agendamentos.some(agendamento => agendamento.clienteId === id);

  if (possuiAgendamento) {
    throw new Error("Não é possível excluir este cliente porque ele possui agendamentos no histórico.");
  }

  const clientesAtualizados = clientes.filter(cliente => cliente.id !== id);

  if (clientesAtualizados.length === clientes.length) {
    throw new Error("O cliente que você tentou excluir não foi encontrado.");
  }

  salvarDados(CHAVE_CLIENTES, clientesAtualizados);
}

// Remove símbolos de telefones para comparar apenas os dígitos.
function normalizarTelefone(telefone) {
  return telefone.replace(/\D/g, "");
}
