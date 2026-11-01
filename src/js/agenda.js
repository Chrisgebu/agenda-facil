// Controlador da tela Agenda: consulta, filtra, ordena e cancela os atendimentos locais.
import { carregarDados, salvarDados } from "./modulos/armazenamento.js";
import { criarElemento, limparMensagem, mostrarMensagem } from "./modulos/interface.js";
import { converterMinutos, formatarData, formatarHorario } from "./modulos/formatadores.js";

const formularioAgenda = document.querySelector("#form-agenda");
let agenda = [];
let dataFiltro = "";

// Filtra o array, ordena por data e horário e reconstrói os cards da agenda.
function exibirAgenda() {
  const resultado = agenda
    .filter(item => dataFiltro === "" || item.data === dataFiltro)
    .sort((a, b) => `${a.data}T${a.horario}`.localeCompare(`${b.data}T${b.horario}`));
  const lista = document.querySelector("#lista-agendamentos");
  const periodo = dataFiltro ? `em ${formatarData(dataFiltro)}` : "em todas as datas";

  lista.replaceChildren();
  document.querySelector("#resumo-agenda").textContent =
    `${resultado.length} agendamento(s) exibido(s) ${periodo}.`;

  if (resultado.length === 0) {
    lista.appendChild(criarElemento("p", "Nenhum agendamento encontrado."));
    return;
  }

  resultado.forEach(item => {
    const card = document.createElement("article");
    const fim = formatarHorario(converterMinutos(item.horario) + item.duracao);

    card.classList.toggle("cancelado", item.status === "Cancelado");
    card.appendChild(criarElemento("h3", `${item.horario} - ${fim} | ${item.clienteNome}`));
    card.appendChild(criarElemento("p", `${formatarData(item.data)} | ${item.servico} | ${item.duracao} minutos`));
    card.appendChild(criarElemento("p", `Status: ${item.status}`));

    if (item.observacoes) {
      card.appendChild(criarElemento("p", `Observações: ${item.observacoes}`));
    }

    if (item.status !== "Cancelado") {
      const botao = criarElemento("button", "Cancelar agendamento");
      botao.type = "button";
      botao.addEventListener("click", () => cancelarAgendamento(item.id));
      card.appendChild(botao);
    }

    lista.appendChild(card);
  });
}

// Valida a data do filtro e atualiza a listagem com apenas aquele dia.
function filtrarAgenda(evento) {
  evento.preventDefault();
  const data = document.querySelector("#data-agenda").value;

  if (!data) {
    mostrarMensagem("Selecione uma data para consultar a agenda.", true);
    return;
  }

  dataFiltro = data;
  limparMensagem();
  exibirAgenda();
}

// Atualiza apenas o status do item e mantém o histórico salvo no localStorage.
function cancelarAgendamento(id) {
  try {
    const novaAgenda = agenda.map(item =>
      item.id === id ? { ...item, status: "Cancelado" } : item
    );

    salvarDados("agendaFacilAgendamentos", novaAgenda);
    agenda = novaAgenda;
    exibirAgenda();
    mostrarMensagem("Agendamento cancelado. O horário foi liberado e o registro foi mantido no histórico.");
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

// Ativa os eventos da página depois de validar o armazenamento local.
try {
  agenda = carregarDados("agendaFacilAgendamentos");
  formularioAgenda.addEventListener("submit", filtrarAgenda);
  document.querySelector("#mostrar-todos").addEventListener("click", () => {
    dataFiltro = "";
    formularioAgenda.reset();
    limparMensagem();
    exibirAgenda();
  });
  exibirAgenda();
} catch (erro) {
  formularioAgenda.querySelector('button[type="submit"]').disabled = true;
  document.querySelector("#mostrar-todos").disabled = true;
  mostrarMensagem(erro.message, true);
}
