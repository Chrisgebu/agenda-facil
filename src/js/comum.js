// Recupera os cadastros do navegador e verifica se os dados formam um array.
function carregarDados(chave) {
  try {
    const dados = JSON.parse(localStorage.getItem(chave) || "[]");
    if (!Array.isArray(dados)) {
      throw new Error("Formato inválido");
    }
    return dados;
  } catch {
    mostrarMensagem("Não foi possível ler os cadastros deste navegador.", true);
    return null;
  }
}

// Salva o array como JSON e informa se o armazenamento funcionou.
function salvarDados(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
    return true;
  } catch {
    mostrarMensagem("Não foi possível salvar. Verifique se o navegador permite armazenamento local.", true);
    return false;
  }
}

// Exibe a mensagem e destaca os erros com a classe definida no CSS.
function mostrarMensagem(texto, erro = false) {
  const mensagem = document.querySelector("#mensagem");
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
  mensagem.hidden = false;
  mensagem.scrollIntoView({ block: "nearest" });
}

function limparMensagem() {
  document.querySelector("#mensagem").hidden = true;
}

// textContent exibe os dados como texto, sem interpretar nomes como HTML.
function criarElemento(tag, texto) {
  const elemento = document.createElement(tag);
  elemento.textContent = texto;
  return elemento;
}

// Converte a data do formulário (AAAA-MM-DD) para DD/MM/AAAA.
function formatarData(data) {
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Transforma HH:MM em minutos para calcular a duração e comparar períodos.
function converterMinutos(horario) {
  const partes = horario.split(":");
  return Number(partes[0]) * 60 + Number(partes[1]);
}

// Converte o total de minutos de volta para HH:MM.
function formatarHorario(minutos) {
  const horas = String(Math.floor(minutos / 60)).padStart(2, "0");
  const resto = String(minutos % 60).padStart(2, "0");
  return `${horas}:${resto}`;
}
