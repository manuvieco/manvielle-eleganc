// Configura sessão do Express para autenticação e flash messages.
const session = require('express-session');

module.exports = session({
  name: 'manvielle.sid', // Nome do cookie de sessão.
  secret: process.env.SESSION_SECRET || 'troque-este-segredo-em-producao', // Segredo usado para assinar o cookie.
  resave: false, // Não salva sessão se não houver modificação.
  saveUninitialized: false, // Não cria sessão para visitantes anônimos automaticamente.
  cookie: {
    httpOnly: true, // Cookie não acessível via JavaScript no navegador.
    sameSite: 'lax', // Mitiga CSRF em navegadores.
    secure: process.env.NODE_ENV === 'production', // Usa cookie seguro apenas em produção.
    maxAge: 1000 * 60 * 60 * 2 // Expira em 2 horas.
  }
});