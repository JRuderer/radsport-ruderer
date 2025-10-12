/* assets/app.js */

/* --- Jahr im Footer setzen --- */
document.querySelectorAll('#year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* --- Offcanvas-Menü --- */
const body = document.body;
const menuBtn = document.querySelector('.menu-button');
const scrim   = document.querySelector('.scrim');

menuBtn?.addEventListener('click', () => {
  body.classList.toggle('menu-open');
});
scrim?.addEventListener('click', () => {
  body.classList.remove('menu-open');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') body.classList.remove('menu-open');
});

// Kontaktformular (AJAX)
const form = document.getElementById('contact-form');
if (form){
  const statusEl = document.getElementById('form-status');
  const showStatus = (msg, ok = true) => {
    statusEl.hidden = false;
    statusEl.textContent = msg;
    statusEl.classList.toggle('ok', ok);
    statusEl.classList.toggle('err', !ok);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        showStatus('Danke für deine Nachricht – ich melde mich in Kürze.', true);
      } else {
        let msg = 'Leider gab es ein Problem beim Senden. Bitte versuche es später erneut oder schreib mir direkt an juliusruderer@gmail.com.';
        try {
          const json = await res.json();
          if (json && json.errors && json.errors[0]?.message) msg = json.errors[0].message;
        } catch {}
        showStatus(msg, false);
      }
    } catch {
      showStatus('Netzwerkfehler – bitte später erneut versuchen oder direkt mailen: juliusruderer@gmail.com.', false);
    }
  });
}

/* --- Minimal-Slider (Galerie) --- */
(function initCarousel(){
  const track = document.getElementById('track');
  if (!track) return; // Nur auf gallery.html

  // Slides klonen für nahtlosen Loop
  let slides = Array.from(track.children);
  const firstClone = slides[0].cloneNode(true);
  const lastClone  = slides[slides.length - 1].cloneNode(true);

  track.insertBefore(lastClone, slides[0]);
  track.appendChild(firstClone);

  // Nach dem Einfügen neu erfassen
  slides = Array.from(track.children);

  let index = 1; // Start auf dem ersten "echten" Slide
  const DURATION = 500;   // ms für Slide-Animation
  const INTERVAL = 4000;  // Auto-Advance

  const applyTransform = (i, animate = true) => {
    track.style.transition = animate ? `transform ${DURATION}ms ease` : 'none';
    track.style.transform  = `translate3d(${-i * 100}%, 0, 0)`;
  };

  // Initial positionieren ohne Animation
  applyTransform(index, false);

  const next = () => {
    index++;
    applyTransform(index, true);
  };
  const prev = () => {
    index--;
    applyTransform(index, true);
  };

  // Endlos-Loop (beim Übergang auf Clone sofort "unsichtbar" zurückspringen)
  track.addEventListener('transitionend', () => {
    if (index === slides.length - 1) {
      index = 1;
      applyTransform(index, false);
      // Transition sofort wieder an
      requestAnimationFrame(() => { track.style.transition = `transform ${DURATION}ms ease`; });
    } else if (index === 0) {
      index = slides.length - 2;
      applyTransform(index, false);
      requestAnimationFrame(() => { track.style.transition = `transform ${DURATION}ms ease`; });
    }
  });

  // Klickzonen (linke/rechte Hälfte)
  const tapLeft  = document.getElementById('tap-left');
  const tapRight = document.getElementById('tap-right');

  const resetTimer = () => {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  };

  tapLeft?.addEventListener('click', () => { prev(); resetTimer(); });
  tapRight?.addEventListener('click', () => { next(); resetTimer(); });

  // Tastatur (optional): Pfeiltasten
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { prev(); resetTimer(); }
    if (e.key === 'ArrowRight') { next(); resetTimer(); }
  });

  // Auto-Advance
  let timer = setInterval(next, INTERVAL);

  // Performance: pausieren, wenn Tab verborgen
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer);
    else resetTimer();
  });
})();
