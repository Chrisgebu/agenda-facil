// Erro de domínio com código HTTP e identificador estável para a resposta JSON.
class AppError extends Error {
  constructor(status, codigo, mensagem) {
    super(mensagem);
    this.status = status;
    this.codigo = codigo;
  }
}

module.exports = AppError;
