// Rotas de autenticação da aplicação.
const express = require('express');
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/login', redirectIfAuthenticated, authController.showLogin); // Exibe tela de login.
router.post('/login', redirectIfAuthenticated, authController.login); // Autentica usuário.
router.post('/logout', authController.logout); // Encerra sessão via POST.
router.get('/logout', authController.logout); // Encerra sessão via GET para compatibilidade.

module.exports = router;