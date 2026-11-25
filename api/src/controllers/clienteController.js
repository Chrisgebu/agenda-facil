// Controller de Cliente: recebe HTTP, delega ao service e usa a View de resposta JSON.
const { respostaSucesso } = require("../utils/resposta");

function criarClienteController(clienteService) {
  return {
    async listar(req, res) {
      const clientes = await clienteService.listar();
      respostaSucesso(res, 200, clientes);
    },

    async buscarPorId(req, res) {
      const cliente = await clienteService.buscarPorId(req.params.id);
      respostaSucesso(res, 200, cliente);
    },

    async criar(req, res) {
      const cliente = await clienteService.criar(req.body);
      respostaSucesso(res, 201, cliente);
    },

    async atualizarCompleto(req, res) {
      const cliente = await clienteService.atualizar(req.params.id, req.body);
      respostaSucesso(res, 200, cliente);
    },

    async atualizarParcial(req, res) {
      const cliente = await clienteService.atualizar(req.params.id, req.body, true);
      respostaSucesso(res, 200, cliente);
    },

    async remover(req, res) {
      await clienteService.remover(req.params.id);
      res.status(204).send();
    }
  };
}

module.exports = criarClienteController;
