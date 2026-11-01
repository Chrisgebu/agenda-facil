// Conversões de data e horário usadas em agendamentos e na listagem da agenda.

// Converte a data do input, no formato AAAA-MM-DD, para a forma brasileira DD/MM/AAAA.
export function formatarData(data) {
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Converte HH:MM em minutos para permitir cálculos de duração e sobreposição.
export function converterMinutos(horario) {
  const partes = horario.split(":");
  return Number(partes[0]) * 60 + Number(partes[1]);
}

// Converte um total de minutos para HH:MM, usado para mostrar o fim do atendimento.
export function formatarHorario(minutos) {
  const horas = String(Math.floor(minutos / 60)).padStart(2, "0");
  const resto = String(minutos % 60).padStart(2, "0");
  return `${horas}:${resto}`;
}
