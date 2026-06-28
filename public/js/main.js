document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const themeToggles = document.querySelectorAll('[data-theme-toggle]');
  const themeLabels = document.querySelectorAll('[data-theme-label]');

  function setTheme(theme) {
    const isDark = theme === 'dark';

    root.classList.toggle('theme-dark', isDark);
    themeToggles.forEach((toggle) => {
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.setAttribute('aria-label', isDark ? 'Alternar modo claro' : 'Alternar modo escuro');
    });
    themeLabels.forEach((label) => {
      label.textContent = isDark ? 'Claro' : 'Escuro';
    });

    try {
      localStorage.setItem('manvielleTheme', theme);
    } catch (error) {}
  }

  function getCurrentTheme() {
    return root.classList.contains('theme-dark') ? 'dark' : 'light';
  }

  setTheme(getCurrentTheme());

  themeToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      setTheme(getCurrentTheme() === 'dark' ? 'light' : 'dark');
    });
  });

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

  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');
  const navBackdrop = document.querySelector('[data-nav-backdrop]');

  function closeNavMenu() {
    if (!navToggle || !navMenu) return;

    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const shouldOpen = !navMenu.classList.contains('is-open');

      navToggle.classList.toggle('is-open', shouldOpen);
      navToggle.setAttribute('aria-expanded', String(shouldOpen));
      navMenu.classList.toggle('is-open', shouldOpen);
      document.body.classList.toggle('menu-open', shouldOpen);
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeNavMenu);
  }
});
