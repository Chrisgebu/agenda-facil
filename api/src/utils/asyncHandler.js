// Encaminha exceções de controllers assíncronos para o middleware central de erros.
function asyncHandler(funcao) {
  return (req, res, next) => Promise.resolve(funcao(req, res, next)).catch(next);
}

module.exports = asyncHandler;
