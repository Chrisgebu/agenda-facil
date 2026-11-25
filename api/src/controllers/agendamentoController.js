// Controller de Agendamento: mantém a camada HTTP pequena e delega regras ao service.
const { respostaSucesso } = require("../utils/resposta");

function criarAgendamentoController(agendamentoService) {
  return {
    async listar(req, res) {
      const agendamentos = await agendamentoService.listar();
      respostaSucesso(res, 200, agendamentos);
    },

    async buscarPorId(req, res) {
      const agendamento = await agendamentoService.buscarPorId(req.params.id);
      respostaSucesso(res, 200, agendamento);
    },

    async criar(req, res) {
      const agendamento = await agendamentoService.criar(req.body);
      respostaSucesso(res, 201, agendamento);
    },

    async atualizarCompleto(req, res) {
      const agendamento = await agendamentoService.atualizar(req.params.id, req.body);
      respostaSucesso(res, 200, agendamento);
    },

    async atualizarParcial(req, res) {
      const agendamento = await agendamentoService.atualizar(req.params.id, req.body, true);
      respostaSucesso(res, 200, agendamento);
    },

    async remover(req, res) {
      await agendamentoService.remover(req.params.id);
      res.status(204).send();
    }
  };
}

module.exports = criarAgendamentoController;
