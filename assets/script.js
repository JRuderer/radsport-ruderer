// Seamless, accessible carousel: autoplay, swipe, keys, infinite loop
(function () {
  const track    = document.getElementById('track');
  const viewport = document.getElementById('viewport');
  const prevBtn  = document.getElementById('prev');
  const nextBtn  = document.getElementById('next');
  const dotsWrap = document.getElementById('dots'); // may be absent if you hid dots
  if (!track || !viewport || !prevBtn || !nextBtn) return;

  // --- Setup with clones for seamless wrap ---
  const originalSlides = Array.from(track.children);
  const N = originalSlides.length;

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone  = originalSlides[N - 1].cloneNode(true);
  track.insertBefore(lastClone, originalSlides[0]);   // [lastClone, ...slides, firstClone]
  track.appendChild(firstClone);

  let index = 1;                 // start on the first REAL slide
  const AUTOPLAY_MS = 3500;
  const SWIPE_THRESHOLD = 40;    // px
  let playing = true, timer = null;

  function setTransition(on) {
    track.style.transition = on ? 'transform 500ms ease' : 'none';
  }

  function logicalIndex() {
    // Map [0..N+1] -> [0..N-1]
    return (index - 1 + N) % N;
  }

  function update() {
    // snap to current index
    track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
    if (dotsWrap) dotsWrap.querySelectorAll('button').forEach((b, i) =>
      b.setAttribute('aria-current', i === logicalIndex() ? 'true' : 'false')
    );
  }

  function goTo(i) { index = i; setTransition(true); update(); restartAutoplay(); }
  function next()  { goTo(index + 1); }
  function prev()  { goTo(index - 1); }

  // After each animated move, if we’re on a clone, jump instantly to the real one
  track.addEventListener('transitionend', () => {
    if (index === N + 1) {         // moved onto firstClone at the far right
      setTransition(false);
      index = 1; update();
      // force a reflow so the browser applies the non-animated jump
      track.getBoundingClientRect();
      setTransition(true);
    } else if (index === 0) {      // moved onto lastClone at the far left
      setTransition(false);
      index = N; update();
      track.getBoundingClientRect();
      setTransition(true);
    }
  });
// Minimal manual navigation: click anywhere (left half = prev, right half = next)
viewport.addEventListener('click', (e) => {
  if (dragging) return;                        // ignore if it was a drag
  const rect = viewport.getBoundingClientRect();
  const x = e.clientX - rect.left;
  x < rect.width / 2 ? prev() : next();
});

  // Dots (optional)
  function buildDots() {
    if (!dotsWrap) return;   // safe guard
    // dots disabled – leave empty OR delete the code below
    // dotsWrap.innerHTML = ''; ...
  }

  // Autoplay
  function startAutoplay() { clearInterval(timer); timer = setInterval(() => { if (playing) next(); }, AUTOPLAY_MS); }
  function stopAutoplay()  { playing = false; }
  function resumeAutoplay(){ playing = true; }
  function restartAutoplay(){ startAutoplay(); }

  // Controls
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Right click to advance (prevents context menu)
  viewport.addEventListener('contextmenu', (e) => { e.preventDefault(); next(); });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  // Hover/focus pause
  viewport.addEventListener('pointerenter', stopAutoplay);
  viewport.addEventListener('pointerleave', resumeAutoplay);
  viewport.addEventListener('focusin', stopAutoplay);
  viewport.addEventListener('focusout', resumeAutoplay);

  // Swipe (pointer + touch)
  let startX = 0, dragging = false;
  function onPointerDown(e) {
    dragging = true;
    startX = e.clientX || e.touches?.[0]?.clientX || 0;
    setTransition(false);
  }
  function onPointerMove(e) {
    if (!dragging) return;
    const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
    const delta = currentX - startX;
    const percent = (delta / viewport.clientWidth) * 100;
    const offset = -index * 100 + percent;
    track.style.transform = `translate3d(${offset}%, 0, 0)`;
  }
  function onPointerUp(e) {
    if (!dragging) return;
    dragging = false;
    const endX = e.clientX || e.changedTouches?.[0]?.clientX || 0;
    const delta = endX - startX;
    setTransition(true);
    if (Math.abs(delta) > SWIPE_THRESHOLD) { delta < 0 ? next() : prev(); }
    else { update(); }
  }
  viewport.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  viewport.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp,   { passive: true });

  // Init
  buildDots();
  setTransition(false);
  update();                  // position to index=1 (first real slide)
  // force layout then enable transition for subsequent moves
  track.getBoundingClientRect();
  setTransition(true);
  startAutoplay();

  // Footer year (Safari-safe)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
function toggleAbout() {
  const content = document.getElementById("about-content");
  const title = document.getElementById("about-title");

  if (content.style.display === "none") {
    content.style.display = "block";
    title.textContent = "▼ Über mich";  // Pfeil nach unten
  } else {
    content.style.display = "none";
    title.textContent = "▶ Über mich";  // Pfeil nach rechts
  }
}
