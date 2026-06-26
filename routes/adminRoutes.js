// Rotas administrativas do painel principal.
const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/', adminController.dashboard); // Dashboard principal.
router.get('/dashboard', adminController.dashboard); // Alias da rota do dashboard.

module.exports = router;