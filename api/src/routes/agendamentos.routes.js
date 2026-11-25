// Rotas do recurso relacionado Agendamento. Não há SQL nem regra de negócio neste arquivo.
const express = require("express");
const agendamentoRepository = require("../repositories/agendamentoRepository");
const clienteRepository = require("../repositories/clienteRepository");
const criarAgendamentoService = require("../services/agendamentoService");
const criarAgendamentoController = require("../controllers/agendamentoController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
const agendamentoService = criarAgendamentoService(agendamentoRepository, clienteRepository);
const controller = criarAgendamentoController(agendamentoService);

router.get("/", asyncHandler(controller.listar));
router.get("/:id", asyncHandler(controller.buscarPorId));
router.post("/", asyncHandler(controller.criar));
router.put("/:id", asyncHandler(controller.atualizarCompleto));
router.patch("/:id", asyncHandler(controller.atualizarParcial));
router.delete("/:id", asyncHandler(controller.remover));

module.exports = router;
