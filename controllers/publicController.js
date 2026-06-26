// Controller das páginas públicas do site: home, catálogo, contato e sobre.
const ProductModel = require('../models/ProductModel');
const storeInfo = require('../config/store');

function getDatabaseNotice(error) {
  if (!error) return null;
  return 'Banco de dados ainda não configurado ou indisponível. Siga o README para criar as tabelas e executar o seed.';
}

// Valida os campos do formulário de contato.
function validateContact(fields) {
  const errors = {};

  if (!fields.name || fields.name.trim().length < 3) {
    errors.name = 'Informe um nome com pelo menos 3 caracteres.';
  }

  if (!fields.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Informe um email válido.';
  }

  if (!fields.phone || fields.phone.trim().length < 8) {
    errors.phone = 'Informe um telefone para contato.';
  }

  if (!fields.message || fields.message.trim().length < 10) {
    errors.message = 'Escreva uma mensagem com pelo menos 10 caracteres.';
  }

  return errors;
}

async function home(req, res) {
  let featuredItems = [];
  let dbNotice = null;

  try {
    featuredItems = await ProductModel.findAll({ status: 'Ativo', limit: 4 });
  } catch (error) {
    dbNotice = getDatabaseNotice(error);
  }

  res.render('public/home', {
    pageTitle: 'Início',
    featuredItems,
    dbNotice,
    contactInfo: storeInfo
  });
}

function about(req, res) {
  // Renderiza a página institucional Sobre.
  res.render('public/about', {
    pageTitle: 'Sobre'
  });
}

async function catalog(req, res) {
  const filters = {
    search: req.query.search || '',
    type: req.query.type || ''
  };
  let items = [];
  let dbNotice = null;

  try {
    items = await ProductModel.findAll(filters);
  } catch (error) {
    dbNotice = getDatabaseNotice(error);
  }

  res.render('public/catalog', {
    pageTitle: 'Produtos e Serviços',
    items,
    filters,
    dbNotice
  });
}

function contact(req, res) {
  res.render('public/contact', {
    pageTitle: 'Contato',
    contactInfo: storeInfo,
    formData: {},
    errors: {}
  });
}

function sendContact(req, res) {
  const formData = {
    name: req.body.name || '',
    email: req.body.email || '',
    phone: req.body.phone || '',
    message: req.body.message || ''
  };
  const errors = validateContact(formData);

  if (Object.keys(errors).length > 0) {
    return res.status(422).render('public/contact', {
      pageTitle: 'Contato',
      contactInfo: storeInfo,
      formData,
      errors
    });
  }

  // Simula envio de mensagem e retorna feedback ao usuário.
  req.flash('success', 'Mensagem recebida com sucesso. Em breve entraremos em contato.');
  return res.redirect('/contato');
}

module.exports = {
  home,
  about,
  catalog,
  contact,
  sendContact
};