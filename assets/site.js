(function(){
  const root=document.documentElement;
  const saved=localStorage.getItem('site-theme');
  const initialTheme=saved || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  root.dataset.theme=initialTheme;

  const updateToggleButtons=theme=>{
    document.querySelectorAll('[data-theme-toggle]').forEach(t=>{
      const isMobile = window.innerWidth <= 900 && t.closest('.nav-links');
      t.setAttribute('aria-label',theme==='dark'?'Switch to light theme':'Switch to dark theme');
      if (isMobile) {
        t.textContent = theme === 'dark' ? '☼ Light Mode' : '◐ Dark Mode';
      } else {
        t.textContent = theme === 'dark' ? '☼' : '◐';
      }
    });
  };

  window.addEventListener('resize', ()=>updateToggleButtons(root.dataset.theme));

  updateToggleButtons(initialTheme);

  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-theme-toggle]');
    if(t){
      const next=root.dataset.theme==='dark'?'light':'dark';
      root.dataset.theme=next;
      localStorage.setItem('site-theme',next);
      updateToggleButtons(next);
    }
    const m=e.target.closest('[data-menu]');
    if(m) document.querySelector('.nav-links')?.classList.toggle('open');
  });

  const page=document.body.dataset.page;
  const currentPath=location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach(a=>{
    const linkPath=a.getAttribute('href')?.split('/').pop();
    if((page && a.dataset.page===page) || (linkPath && (linkPath===currentPath || (currentPath==='' && linkPath==='index.html')))){
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
