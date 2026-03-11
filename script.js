(() => {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Navbar scroll state
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const expanded = navLinks.classList.contains('active');
      navToggle.setAttribute('aria-expanded', String(expanded));
    });
  }

  // Close mobile nav after click + smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (navLinks?.classList.contains('active')) navLinks.classList.remove('active');
    });
  });

  // Scroll reveal for cards
  const revealEls = document.querySelectorAll('.feature-card, .info-card');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('revealed'));
  }

  // Stats count-up
  const statEls = Array.from(document.querySelectorAll('.stat-number[data-target]'));
  const animateNumber = (el) => {
    const raw = el.getAttribute('data-target');
    if (!raw) return;
    const target = Number(raw);
    if (!Number.isFinite(target)) return;

    const isDecimal = !Number.isInteger(target);
    const durationMs = 1200;
    const start = performance.now();
    const from = 0;

    const tick = (t) => {
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = from + (target - from) * eased;
      el.textContent = isDecimal ? value.toFixed(1) : Math.round(value).toString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (statEls.length) {
    const run = () => statEls.forEach(animateNumber);
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            run();
            io.disconnect();
          }
        },
        { threshold: 0.2 }
      );
      io.observe(statEls[0]);
    } else {
      run();
    }
  }

  // Particles
  const particlesRoot = document.getElementById('particles');
  if (particlesRoot) {
    const count = 24;
    const colors = ['rgba(232, 67, 147, 0.9)', 'rgba(161, 140, 209, 0.85)', 'rgba(251, 194, 235, 0.85)'];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = 2 + Math.random() * 5;
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = 10 + Math.random() * 12;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${left}%`;
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.animationDuration = `${duration}s`;
      p.style.animationDelay = `${delay}s`;
      p.style.opacity = String(0.25 + Math.random() * 0.55);
      particlesRoot.appendChild(p);
    }
  }

  // Store button placeholders (keep clickable but non-breaking)
  const ios = document.getElementById('ios-download');
  const android = document.getElementById('android-download');
  if (ios && ios.getAttribute('href') === '#') ios.setAttribute('href', 'https://www.apple.com/app-store/');
  if (android && android.getAttribute('href') === '#') android.setAttribute('href', 'https://play.google.com/store');

  // Thumbnails: prefer JPG when available (SVG shows by default)
  document.querySelectorAll('.book-thumb[data-jpg]').forEach((img) => {
    const jpg = img.getAttribute('data-jpg');
    if (!jpg) return;
    const test = new Image();
    test.onload = () => { img.src = jpg; };
    test.onerror = () => {};
    test.src = jpg;
  });
})();

