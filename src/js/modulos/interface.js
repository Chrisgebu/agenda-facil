// Funções reutilizadas pelas páginas para manipular elementos e mensagens da interface.

// Cria um elemento e usa textContent para nunca interpretar dados digitados como HTML.
export function criarElemento(tag, texto) {
  const elemento = document.createElement(tag);
  elemento.textContent = texto;
  return elemento;
}

// Exibe uma mensagem de sucesso ou de erro na região aria-live de cada página.
export function mostrarMensagem(texto, erro = false) {
  const mensagem = document.querySelector("#mensagem");
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
  mensagem.hidden = false;
  mensagem.scrollIntoView({ block: "nearest" });
}

// Oculta a mensagem antiga antes de uma nova ação do usuário.
export function limparMensagem() {
  const mensagem = document.querySelector("#mensagem");
  mensagem.hidden = true;
  mensagem.classList.remove("erro");
}

// Mostra ou esconde o estado visual usado enquanto uma requisição assíncrona está pendente.
export function mostrarCarregamento(ativo, texto = "Carregando dados...") {
  const carregamento = document.querySelector("#carregamento");

  if (!carregamento) {
    return;
  }

  carregamento.textContent = texto;
  carregamento.hidden = !ativo;
  document.querySelector("main").setAttribute("aria-busy", String(ativo));
}
