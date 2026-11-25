// Rotas finas: apenas associam método e URL ao controller correspondente.
const express = require("express");
const clienteRepository = require("../repositories/clienteRepository");
const agendamentoRepository = require("../repositories/agendamentoRepository");
const criarClienteService = require("../services/clienteService");
const criarClienteController = require("../controllers/clienteController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();
const clienteService = criarClienteService(clienteRepository, agendamentoRepository);
const controller = criarClienteController(clienteService);

router.get("/", asyncHandler(controller.listar));
router.get("/:id", asyncHandler(controller.buscarPorId));
router.post("/", asyncHandler(controller.criar));
router.put("/:id", asyncHandler(controller.atualizarCompleto));
router.patch("/:id", asyncHandler(controller.atualizarParcial));
router.delete("/:id", asyncHandler(controller.remover));

module.exports = router;
