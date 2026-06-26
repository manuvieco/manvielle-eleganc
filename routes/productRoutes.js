// Rotas de gerenciamento de produtos e serviços no admin.
const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.index); // Lista de itens.
router.get('/new', productController.createForm); // Formulário de novo item.
router.post('/', productController.store); // Cria item.
router.get('/:id/edit', productController.editForm); // Formulário de edição.
router.post('/:id', productController.update); // Atualiza item.
router.post('/:id/delete', productController.remove); // Exclui item.

module.exports = router;