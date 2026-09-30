const clientesAgendamento = carregarDados("agendaFacilClientes");
let agendamentos = carregarDados("agendaFacilAgendamentos");
const formularioAgendamento = document.querySelector("#form-agendamento");
const selecaoCliente = document.querySelector("#cliente");

// Adiciona os clientes cadastrados às opções do formulário de agendamento.
function preencherClientes() {
  clientesAgendamento.forEach(cliente => {
    const opcao = criarElemento("option", cliente.nome);
    opcao.value = cliente.id;
    selecaoCliente.appendChild(opcao);
  });
  document.querySelector("#aviso-clientes").hidden = clientesAgendamento.length > 0;
}

// Confere os dados e impede que dois atendimentos ocupem o mesmo período.
function cadastrarAgendamento(evento) {
  evento.preventDefault();
  const cliente = clientesAgendamento.find(item => item.id === Number(selecaoCliente.value));
  const servico = document.querySelector("#servico").value.trim();
  const duracao = Number(document.querySelector("#duracao").value);
  const data = document.querySelector("#data").value;
  const horario = document.querySelector("#horario").value;
  const observacoes = document.querySelector("#observacoes").value.trim();

  if (!cliente) {
    mostrarMensagem("Selecione um cliente cadastrado antes de agendar.", true);
    return;
  }
  if (servico.length < 2 || servico.length > 80) {
    mostrarMensagem("Informe um serviço com 2 a 80 caracteres.", true);
    return;
  }
  if (!Number.isInteger(duracao) || duracao < 15 || duracao > 480 || duracao % 15 !== 0) {
    mostrarMensagem("A duração deve ser de 15 a 480 minutos, em intervalos de 15 minutos.", true);
    return;
  }
  if (!data || !horario) {
    mostrarMensagem("Informe a data e o horário do atendimento.", true);
    return;
  }
  const inicioAtendimento = new Date(`${data}T${horario}`);
  if (Number.isNaN(inicioAtendimento.getTime()) || inicioAtendimento <= new Date()) {
    mostrarMensagem("Escolha uma data e um horário futuros.", true);
    return;
  }
  const inicio = converterMinutos(horario);
  const fim = inicio + duracao;
  if (fim > 24 * 60) {
    mostrarMensagem("O atendimento deve terminar até o fim do dia.", true);
    return;
  }
  if (observacoes.length > 300) {
    mostrarMensagem("As observações devem ter no máximo 300 caracteres.", true);
    return;
  }
  // Verifica sobreposição de horários na mesma data, ignorando os cancelados.
  const conflito = agendamentos.some(item => {
    const inicioExistente = converterMinutos(item.horario);
    const fimExistente = inicioExistente + item.duracao;
    return item.status !== "Cancelado" && item.data === data &&
      inicio < fimExistente && fim > inicioExistente;
  });
  if (conflito) {
    mostrarMensagem("Esse período já está ocupado. Escolha outro horário.", true);
    return;
  }

  const novoAgendamento = {
    id: Date.now(), clienteId: cliente.id, clienteNome: cliente.nome,
    servico, duracao, data, horario, observacoes, status: "Confirmado"
  };
  const novosAgendamentos = [...agendamentos, novoAgendamento];
  if (!salvarDados("agendaFacilAgendamentos", novosAgendamentos)) {
    return;
  }
  agendamentos = novosAgendamentos;
  formularioAgendamento.reset();
  mostrarMensagem(`Agendamento de ${cliente.nome} salvo para ${formatarData(data)}, às ${horario}. Consulte a agenda.`);
}

if (clientesAgendamento !== null && agendamentos !== null) {
  preencherClientes();
  formularioAgendamento.addEventListener("submit", cadastrarAgendamento);
  formularioAgendamento.addEventListener("reset", limparMensagem);
} else {
  formularioAgendamento.querySelector('button[type="submit"]').disabled = true;
}
