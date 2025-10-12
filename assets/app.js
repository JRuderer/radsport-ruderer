// Jahr im Footer
document.addEventListener('DOMContentLoaded', () => {
  const y = document.querySelector('#year');
  if (y) y.textContent = new Date().getFullYear();
});

// Offcanvas Navigation
(() => {
  const btn = document.querySelector('.menu-button');
  const scrim = document.querySelector('.scrim');
  const links = document.querySelectorAll('.drawer-nav a');

  const close = () => document.body.classList.remove('menu-open');
  const open  = () => document.body.classList.add('menu-open');

  if (btn){
    btn.addEventListener('click', () => {
      document.body.classList.toggle('menu-open');
    });
  }
  if (scrim){ scrim.addEventListener('click', close); }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  links.forEach(a => a.addEventListener('click', close));
})();

// Galerie-Slider (nur auf gallery.html aktiv)
(() => {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.slide'));
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const dotsWrap = document.getElementById('dots');

  let i = 0;

  const go = (idx) => {
    i = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${i * 100}%)`;
    [...dotsWrap.children].forEach((b, n) => b.setAttribute('aria-current', n===i ? 'true' : 'false'));
  };

  // Dots bauen
  slides.forEach((_, n) => {
    const b = document.createElement('button');
    b.type = 'button'; b.ariaLabel = `Bild ${n+1}`;
    b.addEventListener('click', () => go(n));
    dotsWrap.appendChild(b);
  });

  prev?.addEventListener('click', () => go(i-1));
  next?.addEventListener('click', () => go(i+1));
  track.closest('.carousel-viewport')?.addEventListener('click', () => go(i+1));

  go(0);
})();

// Kontaktformular: öffnet Mail an juliusruderer@gmail.com
(() => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const msg = form.querySelector('[name="message"]').value.trim();

    const subject = encodeURIComponent('Kontakt – Radsport Ruderer');
    const body = encodeURIComponent(
      `Nachricht:\n${msg}\n\n—\nName: ${name}\nE-Mail: ${email}`
    );
    window.location.href = `mailto:juliusruderer@gmail.com?subject=${subject}&body=${body}`;
  });
})();
