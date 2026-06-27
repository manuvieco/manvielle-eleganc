// Configurações de contato e identidade da loja usadas em toda a aplicação.
const whatsappNumber = process.env.STORE_WHATSAPP_NUMBER || '5561995478540';

const storeInfo = {
  name: 'Manvielle Elegance', // Nome da loja.
  phone: '(61) 98162-4432', // Telefone de contato.
  whatsappNumber, // Número do WhatsApp usado em links de contato.
  whatsapp: `https://wa.me/${whatsappNumber}`, // URL pública do WhatsApp.
  email: 'atendimento@manvielleelegance.com.br', // Email de contato.
  address: 'Cidade Ocidental-GO', // Endereço da loja.
  instagram: 'https://instagram.com/manvielleelegance' // Perfil do Instagram.
};

module.exports = storeInfo;