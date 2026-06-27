// Middleware que protege rotas administrativas.
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }

  req.flash('error', 'Faça login para acessar a área administrativa.');
  return res.redirect('/login');
}

// Middleware que redireciona usuários autenticados para o painel admin.
function redirectIfAuthenticated(req, res, next) {
  if (req.session.user) {
    return res.redirect('/admin');
  }

  return next();
}

module.exports = {
  ensureAuthenticated,
  redirectIfAuthenticated
};
