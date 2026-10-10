(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('site-theme');
  const initialTheme=saved || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  root.dataset.theme=initialTheme;

  const savedDir=localStorage.getItem('site-dir') || 'ltr';
  root.setAttribute('dir', savedDir);

  const updateToggleButtons=theme=>{
    document.querySelectorAll('[data-theme-toggle]').forEach(t=>{
      const isMobile = window.innerWidth <= 1100 && t.closest('.nav-links');
      t.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');
      if (isMobile) {
        t.textContent = theme === 'dark' ? '☼ Light Mode' : '◐ Dark Mode';
      } else {
        t.textContent = theme === 'dark' ? '☼' : '◐';
      }
    });
  };

  const updateDirButtons=dir=>{
    document.querySelectorAll('[data-dir-toggle]').forEach(t=>{
      const isMobile = window.innerWidth <= 1100 && t.closest('.nav-links');
      t.setAttribute('aria-label',dir==='rtl'?'Switch to LTR text direction':'Switch to RTL text direction');
      if (isMobile) {
        t.textContent = dir === 'rtl' ? 'LTR Mode' : 'RTL Mode';
      } else {
        t.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  };

  const closeMenu = () => {
    const navLinks = document.querySelector('.nav-links');
    const menuBtn = document.querySelector('[data-menu]');
    if (navLinks) navLinks.classList.remove('open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      menuBtn.textContent = '☰';
    }
  };

  window.addEventListener('resize', ()=>{
    updateToggleButtons(root.dataset.theme);
    updateDirButtons(root.getAttribute('dir') || 'ltr');
    if (window.innerWidth > 1100) {
      closeMenu();
    }
  });

  updateToggleButtons(initialTheme);
  updateDirButtons(savedDir);

  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-theme-toggle]');
    if(t){
      const next=root.dataset.theme==='dark'?'light':'dark';
      root.dataset.theme=next;
      localStorage.setItem('site-theme',next);
      updateToggleButtons(next);
    }
    const d=e.target.closest('[data-dir-toggle]');
    if(d){
      const currentDir=root.getAttribute('dir') || 'ltr';
      const nextDir=currentDir==='rtl'?'ltr':'rtl';
      root.setAttribute('dir',nextDir);
      localStorage.setItem('site-dir',nextDir);
      updateDirButtons(nextDir);
    }
    const m=e.target.closest('[data-menu]');
    if(m) {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks) {
        const isOpen = navLinks.classList.toggle('open');
        m.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        m.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
        m.textContent = isOpen ? '✕' : '☰';
      }
    } else {
      const navLinks = document.querySelector('.nav-links');
      if (navLinks && navLinks.classList.contains('open')) {
        const isClickInsideNav = e.target.closest('.site-header');
        const isNavLinkClick = e.target.closest('.nav-links a');
        if (!isClickInsideNav || isNavLinkClick) {
          closeMenu();
        }
      }
    }

    const locBtn = e.target.closest('[data-map-loc]');
    if (locBtn) {
      const targetLoc = locBtn.dataset.mapLoc;
      document.querySelectorAll('[data-map-loc]').forEach(b => {
        b.classList.remove('primary');
        b.classList.add('secondary');
      });
      locBtn.classList.remove('secondary');
      locBtn.classList.add('primary');

      const mumbaiInfo = document.getElementById('mumbaiLocInfo');
      const londonInfo = document.getElementById('londonLocInfo');
      const mapIframe = document.getElementById('hubMapIframe');
      const openMapBtn = document.getElementById('openMapBtn');

      if (targetLoc === 'mumbai') {
        if (mumbaiInfo) mumbaiInfo.style.display = 'block';
        if (londonInfo) londonInfo.style.display = 'none';
        if (mapIframe) mapIframe.src = 'https://maps.google.com/maps?q=Bandra+Kurla+Complex,+Mumbai&t=&z=14&ie=UTF8&iwloc=&output=embed';
        if (openMapBtn) openMapBtn.href = 'https://maps.google.com/?q=Bandra+Kurla+Complex,+Mumbai';
      } else if (targetLoc === 'london') {
        if (mumbaiInfo) mumbaiInfo.style.display = 'none';
        if (londonInfo) londonInfo.style.display = 'block';
        if (mapIframe) mapIframe.src = 'https://maps.google.com/maps?q=15+Stratton+Street,+Mayfair,+London&t=&z=15&ie=UTF8&iwloc=&output=embed';
        if (openMapBtn) openMapBtn.href = 'https://maps.google.com/?q=15+Stratton+Street,+Mayfair,+London';
      }
    }

    // Resource tabs switching
    const tabBtn = e.target.closest('[data-resource-tab]');
    if (tabBtn) {
      const targetCategory = tabBtn.dataset.resourceTab;
      document.querySelectorAll('[data-resource-tab]').forEach(b => b.classList.remove('active'));
      tabBtn.classList.add('active');

      document.querySelectorAll('[data-resource-category]').forEach(card => {
        if (targetCategory === 'all' || card.dataset.resourceCategory === targetCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    }
  });

  const page=document.body.dataset.page;
  const currentPath=location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach(a=>{
    const linkPath=a.getAttribute('href')?.split('/').pop();
    if((page && a.dataset.page===page) || 
       (linkPath && (linkPath===currentPath || (currentPath==='' && linkPath==='index.html')))){
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });

  document.querySelectorAll('[data-year]').forEach(x=>x.textContent=new Date().getFullYear());

  // Back to Top button handler
  let btt = document.getElementById('backToTop');
  if (!btt) {
    btt = document.createElement('button');
    btt.id = 'backToTop';
    btt.className = 'back-to-top';
    btt.setAttribute('aria-label', 'Back to Top');
    btt.innerHTML = '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(btt);
  }
  const toggleBtt = () => {
    if (window.scrollY > 280) {
      btt.classList.add('visible');
    } else {
      btt.classList.remove('visible');
    }
  };
  window.addEventListener('scroll', toggleBtt, { passive: true });
  toggleBtt();
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
