// Rotas públicas do site para visitantes.
const express = require('express');
const publicController = require('../controllers/publicController');

const router = express.Router();

router.get('/', publicController.home); // Página inicial.
router.get('/sobre', publicController.about); // Página sobre a empresa.
router.get('/produtos-servicos', publicController.catalog); // Catálogo de produtos e serviços.
router.get('/contato', publicController.contact); // Formulário de contato.
router.post('/contato', publicController.sendContact); // Envio de mensagem de contato.

module.exports = router;