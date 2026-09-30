/* ═══════════════════════════════════════════
   BEAT — interactions
   ═══════════════════════════════════════════ */
(() => {
  'use strict';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lerp = (a, b, n) => a + (b - a) * n;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ── custom cursor ─────────────── */
  const cursor = document.getElementById('cursor');
  const label = cursor?.querySelector('.cursor__label');

  if (cursor && matchMedia('(hover:hover)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;

    addEventListener('pointermove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    (function loop() {
      cx = lerp(cx, tx, 0.22);
      cy = lerp(cy, ty, 0.22);
      cursor.style.transform = `translate3d(${cx - 8}px,${cy - 8}px,0)`;
      requestAnimationFrame(loop);
    })();

    const hoverables = 'a, button, [data-tilt], .card, input, .lab__cell';
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest?.(hoverables);
      if (!t) return;
      const text = t.dataset.cursor;
      cursor.classList.toggle('is-label', !!text);
      cursor.classList.toggle('is-hover', !text);
      if (text && label) label.textContent = text;
    });
    document.addEventListener('pointerout', (e) => {
      if (!e.target.closest?.(hoverables)) return;
      cursor.classList.remove('is-hover', 'is-label');
    });
  }

  /* ── nav stuck state ─────────────── */
  const nav = document.getElementById('nav');
  const onScroll = () => nav?.classList.toggle('is-stuck', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── magnetic buttons ─────────────── */
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.32;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(e.clientX - (r.left + r.width / 2)) * strength}px`);
      el.style.setProperty('--my', `${(e.clientY - (r.top + r.height / 2)) * strength}px`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--mx', '0px');
      el.style.setProperty('--my', '0px');
    });
  });

  /* ── scroll reveal ─────────────── */
  const revealables = document.querySelectorAll('.reveal');
  revealables.forEach((el) => el.style.setProperty('--rd', el.dataset.d || 0));

  if (reduced) {
    revealables.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach((el) => io.observe(el));
  }

  /* ── hero title lines always visible on load ─────────────── */
  requestAnimationFrame(() => {
    document.querySelectorAll('.hero__title .reveal').forEach((el) => el.classList.add('in'));
  });

  /* ── word rotator ─────────────── */
  const words = ['people.', 'breathing.', 'a heartbeat.', 'something real.'];
  const slot = document.getElementById('cycle');
  if (slot) {
    let i = 0;
    const tick = () => {
      slot.style.transition = 'opacity .3s ease, transform .4s cubic-bezier(.16,1,.3,1)';
      slot.style.opacity = '0';
      slot.style.transform = 'translateY(-.35em)';
      setTimeout(() => {
        i = (i + 1) % words.length;
        slot.textContent = words[i];
        slot.style.opacity = '1';
        slot.style.transform = 'none';
      }, 320);
    };
    if (!reduced) setInterval(tick, 2800);
  }

  /* ── counters ─────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const dur = 1500;
      const t0 = performance.now();
      const step = (now) => {
        const p = clamp((now - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => cio.observe(el));

  /* ── parallax blobs ─────────────── */
  const blobs = document.querySelectorAll('[data-parallax]');
  if (!reduced && blobs.length) {
    let mx = 0, my = 0;
    addEventListener('pointermove', (e) => {
      mx = (e.clientX / innerWidth - 0.5) * 2;
      my = (e.clientY / innerHeight - 0.5) * 2;
    }, { passive: true });
    (function loop() {
      blobs.forEach((b) => {
        const d = +b.dataset.parallax;
        b.style.marginLeft = `${mx * d * -160}px`;
        b.style.marginTop = `${my * d * -110}px`;
      });
      requestAnimationFrame(loop);
    })();
  }

  /* ── card tilt ─────────────── */
  if (!reduced && matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          `perspective(900px) rotateY(${px * 9}deg) rotateX(${-py * 9}deg) translateY(-6px) scale(1.012)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── lab: switch ─────────────── */
  const sw = document.getElementById('switch');
  sw?.addEventListener('click', () => {
    sw.setAttribute('aria-pressed', sw.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  });

  /* ── lab: drag + fling ─────────────── */
  const box = document.getElementById('dragbox');
  if (box) {
    let dragging = false, vx = 0, vy = 0, px = 0, py = 0, raf = null;
    const x = () => parseFloat(box.dataset.x || 0);
    const y = () => parseFloat(box.dataset.y || 0);
    const set = (a, b) => {
      box.dataset.x = a;
      box.dataset.y = b;
      box.style.transform = `translate(${a}px,${b}px)`;
    };

    box.addEventListener('pointerdown', (e) => {
      dragging = true;
      cancelAnimationFrame(raf);
      px = e.clientX; py = e.clientY;
      vx = vy = 0;
      box.setPointerCapture(e.pointerId);
    });

    box.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const nx = x() + (e.clientX - px);
      const ny = y() + (e.clientY - py);
      vx = e.clientX - px;
      vy = e.clientY - py;
      px = e.clientX; py = e.clientY;
      set(nx, ny);
    });

    const release = () => {
      if (!dragging) return;
      dragging = false;
      (function fling() {
        vx *= 0.94;
        vy *= 0.94;
        const lim = 260;
        const nx = clamp(x() + vx, -lim, lim);
        const ny = clamp(y() + vy, -lim, lim);
        set(nx, ny);
        if (Math.abs(vx) > 0.4 || Math.abs(vy) > 0.4) raf = requestAnimationFrame(fling);
        else {
          const home = () => {
            const a = x() * 0.86, b = y() * 0.86;
            set(a, b);
            if (Math.abs(a) > 0.5 || Math.abs(b) > 0.5) requestAnimationFrame(home);
            else set(0, 0);
          };
          home();
        }
      })();
    };
    box.addEventListener('pointerup', release);
    box.addEventListener('pointercancel', release);
  }

  /* ── lab: magnifier ─────────────── */
  const mag = document.getElementById('magnify');
  const lens = mag?.querySelector('.magnify__lens');
  if (mag && lens) {
    mag.addEventListener('pointermove', (e) => {
      const r = mag.getBoundingClientRect();
      lens.style.left = `${e.clientX - r.left - 31}px`;
      lens.style.top = `${e.clientY - r.top - 31}px`;
      lens.style.backgroundPosition = `${31 - (e.clientX - r.left)}px ${31 - (e.clientY - r.top)}px`;
    });
    mag.addEventListener('pointerleave', () => {
      lens.style.transform = 'translate(-999px,-999px) scale(0)';
    });
    mag.addEventListener('pointerenter', () => {
      lens.style.transform = 'scale(1)';
    });
  }

  /* ── lab: ripple ─────────────── */
  const ripple = document.getElementById('ripple');
  ripple?.addEventListener('click', (e) => {
    const r = ripple.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.4;
    const d = document.createElement('span');
    d.className = 'r';
    d.style.width = d.style.height = `${size}px`;
    d.style.left = `${e.clientX - r.left}px`;
    d.style.top = `${e.clientY - r.top}px`;
    ripple.appendChild(d);
    setTimeout(() => d.remove(), 900);
  });

  /* ── lab: easing track ─────────────── */
  const track = document.getElementById('track');
  const ball = document.getElementById('ball');
  const btns = document.querySelectorAll('.ease-buttons button');
  let currentEase = 'cubic-bezier(.16,1,.3,1)';

  function run(ease) {
    if (!ball || !track) return;
    const w = track.clientWidth - 34;
    if (reduced) {
      ball.style.transition = 'none';
      ball.style.left = `${w + 17}px`;
      return;
    }
    ball.style.transition = `left 900ms ${ease}`;
    ball.style.left = `${w + 17}px`;
  }

  btns.forEach((b) => {
    b.addEventListener('click', () => {
      btns.forEach((o) => o.classList.remove('is-on'));
      b.classList.add('is-on');
      currentEase = b.dataset.ease;
      ball.style.transition = 'none';
      ball.style.left = '17px';
      void ball.offsetWidth;
      run(currentEase);
    });
  });
  document.querySelector('.ease-buttons button[data-ease="cubic-bezier(.16,1,.3,1)"]')
    ?.classList.add('is-on');

  track?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    const r = track.getBoundingClientRect();
    ball.style.transition = reduced ? 'none' : 'left .5s cubic-bezier(.16,1,.3,1)';
    ball.style.left = `${clamp(e.clientX - r.left, 17, r.width - 17)}px`;
  });

  // demo loop
  if (ball && track && !reduced) {
    const bounce = () => {
      ball.style.transition = 'none';
      ball.style.left = '17px';
      void ball.offsetWidth;
      run(currentEase);
      setTimeout(bounce, 2400);
    };
    setTimeout(bounce, 800);
  }

  /* ── smooth anchor scroll (offset for fixed nav) ─────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      scrollTo({ top: t.getBoundingClientRect().top + scrollY - 72, behavior: 'smooth' });
    });
  });

})();
