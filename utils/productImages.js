const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const productImageCandidates = {
  'Convite de Casamento em Acetato': [
    '/images/products-real/convite-acetato.jpg',
    '/images/products-real/convite-acetato.png',
    '/images/products-real/convite-acetato.webp'
  ],
  'Caixa para Padrinhos': [
    '/images/products-real/caixa-padrinhos.jpg',
    '/images/products-real/caixa-padrinhos.png',
    '/images/products-real/caixa-padrinhos.webp'
  ],
  'Manual de Madrinhas': [
    '/images/products-real/manual-madrinhas.jpg',
    '/images/products-real/manual-madrinhas.png',
    '/images/products-real/manual-madrinhas.webp'
  ],
  'Lembrança Personalizada': [
    '/images/products-real/lembranca-personalizada.jpg',
    '/images/products-real/lembranca-personalizada.png',
    '/images/products-real/lembranca-personalizada.webp'
  ],
  'Identidade Visual para Evento': [
    '/images/products-real/identidade-visual-evento.jpg',
    '/images/products-real/identidade-visual-evento.png',
    '/images/products-real/identidade-visual-evento.webp'
  ],
  'Menu de Casamento': [
    '/images/products-real/menu-casamento.jpg',
    '/images/products-real/menu-casamento.png',
    '/images/products-real/menu-casamento.webp'
  ],
  'Tags Personalizadas': [
    '/images/products-real/tags-personalizadas.jpg',
    '/images/products-real/tags-personalizadas.png',
    '/images/products-real/tags-personalizadas.webp'
  ],
  'Papelaria Premium para 15 anos': [
    '/images/products-real/papelaria-15-anos.jpg',
    '/images/products-real/papelaria-15-anos.png',
    '/images/products-real/papelaria-15-anos.webp'
  ]
};

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url || '');
}

function publicFileExists(url) {
  if (!url || isExternalUrl(url)) {
    return false;
  }

  const cleanUrl = url.split('?')[0].replace(/^\/+/, '');
  return fs.existsSync(path.join(publicDir, cleanUrl));
}

function resolveProductImageUrl(item = {}) {
  const candidates = [
    ...(productImageCandidates[item.name] || []),
    item.image_url
  ].filter(Boolean);

  const localMatch = candidates.find(publicFileExists);

  if (localMatch) {
    return localMatch;
  }

  if (item.image_url && isExternalUrl(item.image_url)) {
    return item.image_url;
  }

  return '/images/products-real/papelaria-15-anos.jpg';
}

module.exports = {
  resolveProductImageUrl,
  productImageCandidates
};
