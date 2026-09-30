let agenda = carregarDados("agendaFacilAgendamentos");
let dataFiltro = "";
const formularioAgenda = document.querySelector("#form-agenda");

// Filtra o array, ordena os horários e cria os cards da agenda no DOM.
function exibirAgenda() {
  const resultado = agenda
    .filter(item => dataFiltro === "" || item.data === dataFiltro)
    .sort((a, b) => `${a.data}T${a.horario}`.localeCompare(`${b.data}T${b.horario}`));
  const lista = document.querySelector("#lista-agendamentos");
  lista.replaceChildren();
  const periodo = dataFiltro ? `em ${formatarData(dataFiltro)}` : "em todas as datas";
  document.querySelector("#resumo-agenda").textContent =
    `${resultado.length} agendamento(s) exibido(s) ${periodo}.`;

  if (resultado.length === 0) {
    lista.appendChild(criarElemento("p", "Nenhum agendamento encontrado."));
  }

  resultado.forEach(item => {
    const card = document.createElement("article");
    card.classList.toggle("cancelado", item.status === "Cancelado");
    const fim = formatarHorario(converterMinutos(item.horario) + item.duracao);
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

// Valida a data escolhida e atualiza a lista usando esse filtro.
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

// Altera o status sem excluir o histórico do atendimento.
function cancelarAgendamento(id) {
  const novaAgenda = agenda.map(item => item.id === id ? { ...item, status: "Cancelado" } : item);
  if (!salvarDados("agendaFacilAgendamentos", novaAgenda)) {
    return;
  }
  agenda = novaAgenda;
  exibirAgenda();
  mostrarMensagem("Agendamento cancelado. O horário foi liberado e o registro foi mantido no histórico.");
}

if (agenda !== null) {
  formularioAgenda.addEventListener("submit", filtrarAgenda);
  document.querySelector("#mostrar-todos").addEventListener("click", () => {
    dataFiltro = "";
    formularioAgenda.reset();
    limparMensagem();
    exibirAgenda();
  });
  exibirAgenda();
} else {
  formularioAgenda.querySelector('button[type="submit"]').disabled = true;
  document.querySelector("#mostrar-todos").disabled = true;
}
