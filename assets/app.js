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
  // --- Swipe (Pointer Events: touch + mouse) ---
  const viewport = document.getElementById('viewport');
  let startX = 0;
  let deltaX = 0;
  let dragging = false;
  const SWIPE_THRESHOLD_PX = 40;

  const baseTranslateFor = (i) => -i * 100; // in %

  const onPointerDown = (e) => {
    dragging = true;
    // Autoplay pausieren beim Drag
    clearInterval(timer);

    startX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
    deltaX = 0;

    // Während Drag: keine Transition, nur Verschiebung
    track.style.transition = 'none';

    // Pointer Capture (sauber bei Mouse + Touch)
    if (viewport.setPointerCapture && e.pointerId !== undefined) {
      try { viewport.setPointerCapture(e.pointerId); } catch {}
    }
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    const x = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? startX;
    deltaX = x - startX;

    // Horizontalen Drag live darstellen (in % der Viewportbreite)
    const dxPercent = (deltaX / viewport.clientWidth) * 100;
    track.style.transform = `translate3d(${baseTranslateFor(index) + dxPercent}%, 0, 0)`;

    // Sobald klar horizontal: Scrollen unterbinden
    if (Math.abs(deltaX) > 10) {
      if (e.cancelable) e.preventDefault();
    }
  };

  const onPointerUp = () => {
    if (!dragging) return;
    dragging = false;

    // Entscheidung: weiter, zurück, oder zurückschnappen
    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      if (deltaX < 0) {
        // nach links gewischt -> nächstes Bild
        index++;
      } else {
        // nach rechts gewischt -> vorheriges Bild
        index--;
      }
    }
    // sanft zur Zielposition animieren
    track.style.transition = `transform ${DURATION}ms ease`;
    track.style.transform  = `translate3d(${baseTranslateFor(index)}%, 0, 0)`;

    // Autoplay neu starten
    resetTimer();
  };

  // Pointer Events bevorzugen (fällt bei alten Browsern auf Touch/Mouse zurück)
  if (window.PointerEvent) {
    viewport.addEventListener('pointerdown', onPointerDown, { passive: true });
    viewport.addEventListener('pointermove', onPointerMove, { passive: false });
    viewport.addEventListener('pointerup', onPointerUp, { passive: true });
    viewport.addEventListener('pointercancel', onPointerUp, { passive: true });
    viewport.addEventListener('pointerleave', onPointerUp, { passive: true });
  } else {
    // Fallback: Touch + Mouse
    viewport.addEventListener('touchstart', onPointerDown, { passive: true });
    viewport.addEventListener('touchmove', onPointerMove, { passive: false });
    viewport.addEventListener('touchend', onPointerUp, { passive: true });
    viewport.addEventListener('mousedown', (e) => { onPointerDown(e); });
    window.addEventListener('mousemove', onPointerMove, { passive: false });
    window.addEventListener('mouseup', onPointerUp, { passive: true });
  }

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
