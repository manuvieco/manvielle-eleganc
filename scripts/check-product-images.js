const fs = require('fs');
const path = require('path');
const { productImageCandidates } = require('../utils/productImages');

const publicDir = path.join(__dirname, '..', 'public');
let missing = 0;

Object.entries(productImageCandidates).forEach(([productName, candidates]) => {
  const realCandidates = candidates.filter((candidate) => candidate.includes('/products-real/'));
  const hasRealImage = realCandidates.some((candidate) => {
    const relativePath = candidate.replace(/^\/+/, '');
    return fs.existsSync(path.join(publicDir, relativePath));
  });

  if (hasRealImage) {
    console.log(`OK  ${productName}`);
    return;
  }

  missing += 1;
  console.log(`FALTA  ${productName}`);
});

if (missing > 0) {
  console.log(`\n${missing} foto(s) real(is) ainda não foram encontradas em public/images/products-real.`);
  process.exitCode = 1;
} else {
  console.log('\nTodas as fotos reais foram encontradas.');
}
