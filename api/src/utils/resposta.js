// A camada View da API REST: mantém o formato JSON igual em todos os endpoints.
function respostaSucesso(resposta, status, dados) {
  return resposta.status(status).json({ sucesso: true, dados });
}

function respostaErro(resposta, status, codigo, mensagem) {
  return resposta.status(status).json({
    sucesso: false,
    erro: { codigo, mensagem }
  });
}

module.exports = { respostaSucesso, respostaErro };
