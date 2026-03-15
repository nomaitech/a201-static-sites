/* AI201 Theme Switcher
   Themes: studio · vaporwave · cyberpunk · severance
   Persists selection in localStorage.
   Theme picker UI is injected into the page. */

(function () {
  const THEMES = [
    { id: 'studio',    label: 'Studio'    },
    { id: 'vaporwave', label: 'Vaporwave' },
    { id: 'cyberpunk', label: 'Cyberpunk' },
    { id: 'severance', label: 'Severance' },
  ];

  const STORAGE_KEY = 'ai201-theme';
  const DEFAULT     = 'studio';

  function currentTheme() {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT; }
    catch { return DEFAULT; }
  }

  function applyTheme(id) {
    document.documentElement.dataset.theme = id;
    try { localStorage.setItem(STORAGE_KEY, id); } catch {}
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.themeBtn === id);
      btn.setAttribute('aria-pressed', btn.dataset.themeBtn === id ? 'true' : 'false');
    });
  }

  function buildPicker() {
    if (document.querySelector('.theme-picker')) return;

    const picker = document.createElement('div');
    picker.className = 'theme-picker';
    picker.setAttribute('role', 'toolbar');
    picker.setAttribute('aria-label', 'Theme selector');

    const label = document.createElement('span');
    label.className = 'theme-picker-label';
    label.textContent = 'Theme';
    label.setAttribute('aria-hidden', 'true');
    picker.appendChild(label);

    THEMES.forEach(({ id, label: name }) => {
      const btn = document.createElement('button');
      btn.className = 'theme-btn';
      btn.dataset.themeBtn = id;
      btn.textContent = name;
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-pressed', id === currentTheme() ? 'true' : 'false');
      if (id === currentTheme()) btn.classList.add('active');
      btn.addEventListener('click', () => applyTheme(id));
      picker.appendChild(btn);
    });

    document.body.appendChild(picker);
  }

  // Apply immediately in case inline FOUC script wasn't present
  applyTheme(currentTheme());

  // Build picker after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPicker);
  } else {
    buildPicker();
  }
})();
