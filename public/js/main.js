document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form[data-confirm]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const message = form.dataset.confirm || 'Confirmar esta acao?';

      if (!window.confirm(message)) {
        event.preventDefault();
      }
    });
  });

  const adminToggle = document.querySelector('[data-admin-toggle]');
  const adminSidebar = document.querySelector('[data-admin-sidebar]');

  if (adminToggle && adminSidebar) {
    adminToggle.addEventListener('click', () => {
      adminSidebar.classList.toggle('is-open');
    });
  }
});
