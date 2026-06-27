require('dotenv').config();

const bcrypt = require('bcryptjs');
const database = require('../config/database');

if (!process.env.DATABASE_URL) {
  console.error('Configure DATABASE_URL no arquivo .env antes de executar o seed.');
  process.exit(1);
}

const sampleItems = [
  {
    name: 'Convite de Casamento em Acetato',
    type: 'Produto',
    category: 'Convites',
    description: 'Convite elegante com sobreposição em acetato, papel especial e acabamento em dourado suave.',
    price: 32.9,
    image_url: '/images/products-real/convite-acetato.jpg',
    status: 'Ativo'
  },
  {
    name: 'Caixa para Padrinhos',
    type: 'Produto',
    category: 'Presentes',
    description: 'Caixa personalizada para convite de padrinhos com identidade visual do casamento.',
    price: 89.9,
    image_url: '/images/products-real/caixa-padrinhos.jpg',
    status: 'Ativo'
  },
  {
    name: 'Manual de Madrinhas',
    type: 'Produto',
    category: 'Casamento',
    description: 'Manual impresso com paleta, orientações e detalhes especiais para madrinhas.',
    price: 24.9,
    image_url: '/images/products-real/manual-madrinhas.jpg',
    status: 'Ativo'
  },
  {
    name: 'Lembrança Personalizada',
    type: 'Produto',
    category: 'Lembranças',
    description: 'Lembrança sob medida com tag, embalagem e acabamento alinhados ao evento.',
    price: 18.5,
    image_url: '/images/products-real/lembranca-personalizada.jpg',
    status: 'Ativo'
  },
  {
    name: 'Identidade Visual para Evento',
    type: 'Serviço',
    category: 'Design',
    description: 'Criação de monograma, paleta, aplicações e guia visual para eventos especiais.',
    price: 450,
    image_url: '/images/products-real/identidade-visual-evento.jpg',
    status: 'Ativo'
  },
  {
    name: 'Menu de Casamento',
    type: 'Produto',
    category: 'Mesa posta',
    description: 'Menu impresso em papel premium para compor a mesa dos convidados.',
    price: 14.9,
    image_url: '/images/products-real/menu-casamento.jpg',
    status: 'Ativo'
  },
  {
    name: 'Tags Personalizadas',
    type: 'Produto',
    category: 'Acabamentos',
    description: 'Tags para lembranças, caixas e embalagens com impressão de alta qualidade.',
    price: 3.5,
    image_url: '/images/products-real/tags-personalizadas.jpg',
    status: 'Ativo'
  },
  {
    name: 'Papelaria Premium para 15 anos',
    type: 'Serviço',
    category: '15 anos',
    description: 'Projeto completo de papelaria para festa de debutante, da identidade ao kit final.',
    price: 620,
    image_url: '/images/products-real/papelaria-15-anos.jpg',
    status: 'Ativo'
  }
];

async function seedAdmin() {
  const name = process.env.ADMIN_NAME || 'Administrador Manvielle';
  const email = (process.env.ADMIN_EMAIL || 'admin@manvielleelegance.com.br').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  await database.query(
    `
      insert into public.users (name, email, password_hash)
      values ($1, $2, $3)
      on conflict (email)
      do update set
        name = excluded.name,
        password_hash = excluded.password_hash
    `,
    [name, email, passwordHash]
  );

  console.log(`Administrador pronto: ${email}`);
}

async function seedItems() {
  let inserted = 0;
  let updated = 0;

  for (const item of sampleItems) {
    const existingResult = await database.query(
      'select id from public.items where name = $1 limit 1',
      [item.name]
    );

    if (existingResult.rows.length) {
      await database.query(
        `
          update public.items
          set
            type = $1,
            category = $2,
            description = $3,
            price = $4,
            image_url = $5,
            status = $6,
            updated_at = now()
          where id = $7
        `,
        [item.type, item.category, item.description, item.price, item.image_url, item.status, existingResult.rows[0].id]
      );
      updated += 1;
      continue;
    }

    await database.query(
      `
        insert into public.items (name, type, category, description, price, image_url, status)
        values ($1, $2, $3, $4, $5, $6, $7)
      `,
      [item.name, item.type, item.category, item.description, item.price, item.image_url, item.status]
    );
    inserted += 1;
  }

  console.log(`${inserted} itens cadastrados e ${updated} itens atualizados.`);
}

async function main() {
  try {
    await seedAdmin();
    await seedItems();
    console.log('Seed finalizado com sucesso.');
  } catch (error) {
    console.error('Erro ao executar seed:', error.message);
    process.exitCode = 1;
  } finally {
    await database.closePool();
  }
}

main();
