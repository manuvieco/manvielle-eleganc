// Controller responsável por exibir a tela de login e autenticar usuários.
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');

function showLogin(req, res) {
  // Renderiza a página de login com layout específico.
  res.render('auth/login', {
    pageTitle: 'Login administrativo',
    layout: 'layouts/auth',
    formData: {},
    errorMessage: null
  });
}

async function login(req, res) {
  const email = req.body.email || '';
  const password = req.body.password || '';

  if (!email || !password) {
    // Validação básica de campos obrigatórios.
    return res.status(422).render('auth/login', {
      pageTitle: 'Login administrativo',
      layout: 'layouts/auth',
      formData: { email },
      errorMessage: 'Informe email e senha para continuar.'
    });
  }

  try {
    // Busca o usuário no banco pelo email.
    const user = await UserModel.findByEmail(email);
    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password_hash)
      : false;

    if (!user || !isPasswordValid) {
      // Credenciais inválidas.
      return res.status(401).render('auth/login', {
        pageTitle: 'Login administrativo',
        layout: 'layouts/auth',
        formData: { email },
        errorMessage: 'Email ou senha inválidos.'
      });
    }

    // Salva os dados do usuário na sessão.
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    return req.session.save(() => {
      req.flash('success', `Bem-vindo(a), ${user.name}.`);
      res.redirect('/admin');
    });
  } catch (error) {
    // Caso ocorram erros de banco de dados, mostra mensagem genérica.
    return res.status(500).render('auth/login', {
      pageTitle: 'Login administrativo',
      layout: 'layouts/auth',
      formData: { email },
      errorMessage: 'Não foi possível autenticar agora. Confira a configuração do Neon PostgreSQL.'
    });
  }
}

function logout(req, res) {
  // Destroi a sessão atual e limpa o cookie.
  req.session.destroy(() => {
    res.clearCookie('manvielle.sid');
    res.redirect('/login');
  });
}

module.exports = {
  showLogin,
  login,
  logout
};