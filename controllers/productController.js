// Controller que gerencia as ações de listagem, criação, edição e exclusão de itens.
const ProductModel = require('../models/ProductModel');

const VALID_TYPES = ['Produto', 'Serviço']; // Tipos válidos de item.
const VALID_STATUS = ['Ativo', 'Inativo']; // Status válidos para exibir ou ocultar um item.

// Constrói o objeto item a partir do corpo da requisição.
function buildItemFromRequest(body) {
  return {
    name: (body.name || '').trim(),
    type: body.type,
    category: (body.category || '').trim(),
    description: (body.description || '').trim(),
    price: body.price === '' || body.price === undefined ? null : Number(body.price),
    image_url: (body.image_url || '').trim() || null,
    status: body.status
  };
}

// Valida os dados enviados pelo formulário de item.
function validateItem(item) {
  const errors = {};

  if (!item.name || item.name.length < 3) {
    errors.name = 'Informe um nome com pelo menos 3 caracteres.';
  }

  if (!VALID_TYPES.includes(item.type)) {
    errors.type = 'Escolha Produto ou Serviço.';
  }

  if (!item.category || item.category.length < 2) {
    errors.category = 'Informe uma categoria.';
  }

  if (!item.description || item.description.length < 10) {
    errors.description = 'Descreva o item com pelo menos 10 caracteres.';
  }

  if (item.price === null || Number.isNaN(item.price) || item.price < 0) {
    errors.price = 'Informe um preço válido igual ou maior que zero.';
  }

  if (!VALID_STATUS.includes(item.status)) {
    errors.status = 'Escolha Ativo ou Inativo.';
  }

  if (item.image_url) {
    try {
      if (!item.image_url.startsWith('/')) {
        new URL(item.image_url); // Verifica se é uma URL externa válida.
      }
    } catch (error) {
      errors.image_url = 'Informe uma URL válida ou um caminho local iniciado com /.';
    }
  }

  return errors;
}

async function index(req, res) {
  const filters = {
    search: req.query.search || '',
    type: req.query.type || ''
  };

  try {
    const items = await ProductModel.findAll(filters);

    return res.render('admin/items', {
      pageTitle: 'Produtos e Serviços',
      layout: 'layouts/admin',
      items,
      filters,
      dbError: null
    });
  } catch (error) {
    return res.render('admin/items', {
      pageTitle: 'Produtos e Serviços',
      layout: 'layouts/admin',
      items: [],
      filters,
      dbError: 'Não foi possível listar os itens. Confira a configuração do Neon PostgreSQL.'
    });
  }
}

function createForm(req, res) {
  // Exibe o formulário para criar um novo item.
  res.render('admin/item-form', {
    pageTitle: 'Novo item',
    layout: 'layouts/admin',
    mode: 'create',
    item: {},
    errors: {}
  });
}

async function store(req, res) {
  const item = buildItemFromRequest(req.body);
  const errors = validateItem(item);

  if (Object.keys(errors).length > 0) {
    return res.status(422).render('admin/item-form', {
      pageTitle: 'Novo item',
      layout: 'layouts/admin',
      mode: 'create',
      item,
      errors
    });
  }

  try {
    // Insere o item no banco.
    await ProductModel.create(item);
    req.flash('success', 'Item cadastrado com sucesso.');
    return res.redirect('/admin/items');
  } catch (error) {
    errors.general = 'Não foi possível cadastrar o item. Confira a conexão com o Neon PostgreSQL.';
    return res.status(500).render('admin/item-form', {
      pageTitle: 'Novo item',
      layout: 'layouts/admin',
      mode: 'create',
      item,
      errors
    });
  }
}

async function editForm(req, res) {
  try {
    const item = await ProductModel.findById(req.params.id);

    if (!item) {
      req.flash('error', 'Item não encontrado.');
      return res.redirect('/admin/items');
    }

    return res.render('admin/item-form', {
      pageTitle: 'Editar item',
      layout: 'layouts/admin',
      mode: 'edit',
      item,
      errors: {}
    });
  } catch (error) {
    req.flash('error', 'Não foi possível carregar o item.');
    return res.redirect('/admin/items');
  }
}

async function update(req, res) {
  const item = buildItemFromRequest(req.body);
  const errors = validateItem(item);

  if (Object.keys(errors).length > 0) {
    return res.status(422).render('admin/item-form', {
      pageTitle: 'Editar item',
      layout: 'layouts/admin',
      mode: 'edit',
      item: {
        ...item,
        id: req.params.id
      },
      errors
    });
  }

  try {
    // Atualiza item existente no banco.
    await ProductModel.update(req.params.id, item);
    req.flash('success', 'Item atualizado com sucesso.');
    return res.redirect('/admin/items');
  } catch (error) {
    errors.general = 'Não foi possível atualizar o item.';
    return res.status(500).render('admin/item-form', {
      pageTitle: 'Editar item',
      layout: 'layouts/admin',
      mode: 'edit',
      item: {
        ...item,
        id: req.params.id
      },
      errors
    });
  }
}

async function remove(req, res) {
  try {
    await ProductModel.delete(req.params.id);
    req.flash('success', 'Item excluído com sucesso.');
  } catch (error) {
    req.flash('error', 'Não foi possível excluir o item.');
  }

  return res.redirect('/admin/items');
}

module.exports = {
  index,
  createForm,
  store,
  editForm,
  update,
  remove
};