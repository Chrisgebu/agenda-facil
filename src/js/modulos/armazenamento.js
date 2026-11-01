// Este módulo concentra a leitura e a escrita dos arrays no localStorage.
// As páginas importam estas funções em vez de repetir JSON.parse e JSON.stringify.

// Lê um array salvo com a chave informada e valida seu formato antes de devolvê-lo.
export function carregarDados(chave) {
  try {
    const textoSalvo = localStorage.getItem(chave);
    const dados = textoSalvo ? JSON.parse(textoSalvo) : [];

    if (!Array.isArray(dados)) {
      throw new Error("Os dados salvos não formam uma lista.");
    }

    return dados;
  } catch {
    throw new Error("Não foi possível ler os cadastros deste navegador.");
  }
}

// Converte o array em JSON e o grava; uma falha de armazenamento vira um erro tratável pela página.
export function salvarDados(chave, dados) {
  try {
    localStorage.setItem(chave, JSON.stringify(dados));
  } catch {
    throw new Error("Não foi possível salvar. Verifique se o navegador permite armazenamento local.");
  }
}
