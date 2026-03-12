/**
 * dialogue-wordmark / wordmark.js
 *
 * Usage — auto-init (zero JS):
 *   <div data-wordmark data-text="Dialogue" data-preset="uv" data-panel="true"></div>
 *
 * Usage — explicit JS:
 *   WordmarkInit({
 *     el:       '#my-wordmark',   // selector or element (required)
 *     text:     'Dialogue',       // initial text
 *     preset:   'uv',             // preset key from WORDMARK_PRESETS
 *     fontSize: '13vw',
 *     panel:    true,             // show control panel
 *     editable: true,             // allow click-to-edit
 *     config:   { ... },          // partial CONFIG overrides
 *   });
 *
 * Depends on: presets.js (must be loaded first), wordmark.css
 */

(function (global) {
  'use strict';

  /* ── Falloffs ── */
  const FALLOFFS = {
    cosine:   t => (1 + Math.cos(Math.PI * t)) / 2,
    gaussian: t => Math.exp(-4 * t * t),
    linear:   t => Math.max(0, 1 - t),
  };

  /* ── Colour helpers ── */
  function rgbToHex([r, g, b]) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const lerpColor = (a, b, t) => a.map((v, j) => Math.round(v + (b[j] - v) * t));

  /* ── Magnetic snap ── */
  function magnetize(slider, snapFraction = 0.03) {
    const min = +slider.min, max = +slider.max, span = max - min;
    const anchors = [0, 0.25, 0.5, 0.75, 1].map(f => min + f * span);
    const zone = span * snapFraction;
    const raw = +slider.value;
    for (const anchor of anchors) {
      if (Math.abs(raw - anchor) <= zone) { slider.value = anchor; break; }
    }
    return +slider.value;
  }

  /* ── Spark path ── */
  const STAR_PATH = 'M0,-6 L1.2,-1.2 L6,0 L1.2,1.2 L0,6 L-1.2,1.2 L-6,0 L-1.2,-1.2 Z';

  const SPARKS_CONFIG = {
    spawnRate: 0.06, maxParticles: 10, lifetime: 500,
    speed: 0.025, gravity: 0.00010, drag: 0.995,
    sizeMin: 6, sizeMax: 10,
  };

  /* ════════════════════════════════════════
     WordmarkInit
  ════════════════════════════════════════ */
  function WordmarkInit(options = {}) {
    /* ── Resolve element ── */
    const el = typeof options.el === 'string'
      ? document.querySelector(options.el)
      : options.el;
    if (!el) { console.warn('[wordmark] element not found:', options.el); return; }

    /* ── Resolve preset ── */
    const presets = global.WORDMARK_PRESETS || {};
    const presetKey = options.preset || el.dataset.preset || 'uv';
    const preset = presets[presetKey] || {};

    /* ── Build CONFIG ── */
    const CONFIG = Object.assign({
      text:            'Dialogue',
      fontSize:        '13vw',
      letterSpacingEm: -0.04,
      baseWeight:      200,
      peakWeight:      700,
      waveRadius:      1.6,
      colorRadius:     2.2,
      loopDuration:    2400,
      tailFraction:    0.35,
      easing:          'gaussian',
      baseColor:       [100, 60, 255],
      peakColor:       [160, 80, 255],
      peakPeakColor:   [235, 180, 255],
      valleyColor:     [30, 10, 80],
      sparkColor:      '#c8b4ff',
      sparkBlendMode:  'screen',
      starsEnabled:    true,
      glowIntensity:   0.30,
      motion:          'wave',   // 'wave' | 'sparkling'
      sparkRate:       1.2,      // Hz — base flicker rate (sparkling mode)
      sparkSharpness:  2.5,      // power curve — higher = more contrast dark/bright
      invertWeight:    false,    // true = heavy at rest, thins as color brightens
    }, preset, options.config || {});

    /* text from data-attr or option */
    if (options.text)            CONFIG.text = options.text;
    if (el.dataset.text)         CONFIG.text = el.dataset.text;
    if (options.fontSize)        CONFIG.fontSize = options.fontSize;
    if (el.dataset.fontSize)     CONFIG.fontSize = el.dataset.fontSize;

    const showPanel  = options.panel    != null ? options.panel    : el.dataset.panel    === 'true';
    const isEditable = options.editable != null ? options.editable : el.dataset.editable !== 'false';

    /* ── Setup container ── */
    el.setAttribute('data-wordmark', '');
    if (isEditable) {
      el.setAttribute('contenteditable', 'plaintext-only');
      el.setAttribute('spellcheck', 'false');
      el.style.cursor = 'text';
      el.style.outline = 'none';
    }

    /* ── Overlays ── */
    const sparksEl = document.createElement('div');
    sparksEl.className = 'wm-sparks';
    sparksEl.style.mixBlendMode = CONFIG.sparkBlendMode;
    document.body.appendChild(sparksEl);

    const glowCanvas = document.createElement('canvas');
    glowCanvas.className = 'wm-glow-canvas';
    document.body.appendChild(glowCanvas);

    /* Shared SVG filter for sparks */
    const sharedSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    sharedSvg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
    sharedSvg.innerHTML = `<defs>
      <filter id="wm-spark-glow" x="-300%" y="-300%" width="700%" height="700%">
        <feGaussianBlur stdDeviation="3"/>
      </filter>
    </defs>`;
    document.body.appendChild(sharedSvg);

    /* ── Probe ── */
    function probe(char, weight) {
      const s = document.createElement('span');
      s.style.cssText = `font-family:'Space Grotesk',sans-serif;font-size:${CONFIG.fontSize};font-variation-settings:'wght' ${weight};position:absolute;visibility:hidden;white-space:nowrap;line-height:1`;
      s.textContent = char;
      document.body.appendChild(s);
      const r = s.getBoundingClientRect();
      document.body.removeChild(s);
      return r;
    }

    /* ── Spans ── */
    let spans = [];
    let sparkPhases    = []; // per-letter random phases for sparkling motion
    let smoothedWeights = []; // per-letter weight with asymmetric rise/fall smoothing

    function relayout() {
      const emPx  = probe('M', CONFIG.baseWeight).height;
      const gapPx = CONFIG.letterSpacingEm * emPx;
      spans.forEach((span, i) => {
        span.style.width       = `${probe(span.textContent, CONFIG.baseWeight).width}px`;
        span.style.marginRight = i < spans.length - 1 ? `${gapPx}px` : '0';
      });
    }

    function rebuild(text) {
      CONFIG.text = text || ' ';
      el.innerHTML = '';
      spans = [];
      [...CONFIG.text].forEach(char => {
        const span = document.createElement('span');
        span.textContent = char;
        span.setAttribute('aria-hidden', 'true');
        span.style.fontFamily            = "'Space Grotesk', sans-serif";
        span.style.fontSize              = CONFIG.fontSize;
        span.style.fontVariationSettings = `'wght' ${CONFIG.baseWeight}`;
        span.style.color                 = `rgb(${CONFIG.valleyColor.join(',')})`;
        el.appendChild(span);
        spans.push(span);
      });
      // Randomise per-letter phases for sparkling mode
      sparkPhases    = spans.map(() => Math.random() * Math.PI * 2);
      // Initialise smoothed weights to resting value
      const restW    = CONFIG.invertWeight ? CONFIG.peakWeight : CONFIG.baseWeight;
      smoothedWeights = spans.map(() => restW);
      relayout();
    }

    rebuild(CONFIG.text);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(relayout);

    /* ── Editable ── */
    if (isEditable) {
      function caretToEnd() {
        const range = document.createRange();
        const sel   = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      el.addEventListener('input', () => {
        let text = '';
        el.childNodes.forEach(node => { text += node.textContent || ''; });
        text = text.replace(/\n/g, '').replace(/\u00a0/g, ' ') || ' ';
        rebuild(text);
        caretToEnd();
      });
      el.addEventListener('keydown', e => { if (e.key === 'Enter') e.preventDefault(); });
    }

    /* ── Sparks ── */
    const particles = [];
    let spawnAccum = 0;

    function spawnSpark(x, y, allDirections) {
      const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgEl.setAttribute('width', '48');
      svgEl.setAttribute('height', '48');
      svgEl.setAttribute('viewBox', '-24 -24 48 48');
      svgEl.style.cssText = 'position:absolute;overflow:visible;pointer-events:none;mix-blend-mode:screen;transform:translate(-50%,-50%) scale(0);';

      const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      glow.setAttribute('r', '5'); glow.setAttribute('cx', '0'); glow.setAttribute('cy', '0');
      glow.setAttribute('fill', CONFIG.sparkColor);
      glow.setAttribute('filter', 'url(#wm-spark-glow)');
      glow.setAttribute('opacity', '0.6');
      svgEl.appendChild(glow);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', STAR_PATH);
      path.setAttribute('fill', CONFIG.sparkColor);
      path.setAttribute('stroke', 'none');
      svgEl.appendChild(path);
      sparksEl.appendChild(svgEl);

      const angle = allDirections
        ? Math.random() * Math.PI * 2
        : -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.7;
      const speed = SPARKS_CONFIG.speed * (0.5 + Math.random() * 0.5);
      const sMin  = CONFIG.sparkSizeMin != null ? CONFIG.sparkSizeMin : SPARKS_CONFIG.sizeMin;
      const sMax  = CONFIG.sparkSizeMax != null ? CONFIG.sparkSizeMax : SPARKS_CONFIG.sizeMax;
      const size  = sMin + Math.random() * (sMax - sMin);
      particles.push({
        el: svgEl, x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - speed * 0.4,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.003,
        size,
        born: performance.now(),
        lifetime: SPARKS_CONFIG.lifetime * (0.6 + Math.random() * 0.4),
      });
    }

    function updateSparks(now, dt, cx, cy, halfW, halfH, envelope, allDirections) {
      if (envelope > 0.05) {
        spawnAccum += SPARKS_CONFIG.spawnRate * dt * envelope;
        const maxP = CONFIG.sparkMaxParticles != null ? CONFIG.sparkMaxParticles : SPARKS_CONFIG.maxParticles;
        while (spawnAccum >= 1 && particles.length < maxP) {
          spawnAccum -= 1;
          spawnSpark(
            cx + (Math.random() - 0.5) * 2 * halfW,
            cy + (Math.random() - 0.5) * 2 * halfH,
            allDirections
          );
        }
        if (spawnAccum >= 1) spawnAccum = 0;
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.born;
        if (age >= p.lifetime) { p.el.remove(); particles.splice(i, 1); continue; }
        p.vy += SPARKS_CONFIG.gravity * dt;
        p.vx *= SPARKS_CONFIG.drag; p.vy *= SPARKS_CONFIG.drag;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.rot += p.spin * dt;
        const scale = (1 - (age / p.lifetime) ** 1.2) * (p.size / 8);
        p.el.style.left = `${p.x}px`; p.el.style.top = `${p.y}px`;
        p.el.style.transform = `translate(-50%,-50%) rotate(${p.rot.toFixed(3)}rad) scale(${Math.max(0, scale).toFixed(3)})`;
      }
    }

    /* ── Animation tick ── */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      let t0 = null;
      function tick(now) {
        if (!t0) t0 = now;
        const dt = now - (tick._last || now);
        tick._last = now;

        const n = spans.length;
        if (n === 0) { requestAnimationFrame(tick); return; }

        /* ── Sparkling motion ── */
        if (CONFIG.motion === 'sparkling') {
          const tSec = (now - t0) / 1000;
          let maxIntensity = 0, brightX = 0, brightY = 0;

          // Per-letter intensity: two overlapping sines with independent phase offsets
          const intensities = spans.map((_, i) => {
            const ph  = sparkPhases[i] || 0;
            const raw = Math.sin(tSec * CONFIG.sparkRate * Math.PI * 2 + ph) * 0.65
                      + Math.sin(tSec * CONFIG.sparkRate * 0.47 * Math.PI * 2 + ph * 1.6) * 0.35;
            return Math.pow(Math.max(0, raw * 0.5 + 0.5), CONFIG.sparkSharpness);
          });

          for (let i = 0; i < n; i++) {
            const intensity = intensities[i];
            const w        = CONFIG.invertWeight
              ? CONFIG.peakWeight - (CONFIG.peakWeight - CONFIG.baseWeight) * intensity
              : CONFIG.baseWeight + (CONFIG.peakWeight - CONFIG.baseWeight) * intensity;
            const valleyT  = Math.max(0, 1 - intensity * 3);
            const baseRgb  = lerpColor(CONFIG.valleyColor, CONFIG.baseColor, 1 - valleyT);
            const midRgb   = lerpColor(baseRgb, CONFIG.peakColor, intensity);
            const rgb      = lerpColor(midRgb, CONFIG.peakPeakColor, Math.pow(intensity, 1.5));

            const sw    = smoothedWeights[i];
            const alpha = 1 - Math.exp(-dt / (w > sw ? 80 : 160)); // rise 2× faster than fall
            smoothedWeights[i] = sw + (w - sw) * alpha;
            spans[i].style.fontVariationSettings = `'wght' ${smoothedWeights[i].toFixed(1)}`;
            spans[i].style.color = `rgb(${rgb.join(',')})`;
            spans[i].style.textShadow = '';

            if (intensity > maxIntensity) {
              maxIntensity = intensity;
              const r = spans[i].getBoundingClientRect();
              brightX = r.left + r.width * 0.5;
              brightY = r.top  + r.height * 0.4;
            }
          }

          // Glow canvas — per-letter radial glow proportional to intensity
          if (glowCanvas.width !== window.innerWidth || glowCanvas.height !== window.innerHeight) {
            glowCanvas.width = window.innerWidth; glowCanvas.height = window.innerHeight;
          }
          const gCtx = glowCanvas.getContext('2d');
          gCtx.clearRect(0, 0, glowCanvas.width, glowCanvas.height);

          for (let i = 0; i < n; i++) {
            const iv = intensities[i];
            if (iv < 0.04) continue;
            const rect = spans[i].getBoundingClientRect();
            const cx   = rect.left + rect.width * 0.5;
            const cy   = rect.top  + rect.height * 0.5;
            const gc   = lerpColor(CONFIG.peakColor, CONFIG.peakPeakColor, iv);
            const gcs  = `${gc[0]},${gc[1]},${gc[2]}`;

            const r1 = rect.height * (0.3 + iv * 0.5);
            const g1 = gCtx.createRadialGradient(cx, cy, 0, cx, cy, r1);
            g1.addColorStop(0, `rgba(${gcs},${(iv * 0.28 * CONFIG.glowIntensity).toFixed(3)})`);
            g1.addColorStop(1, `rgba(${gcs},0)`);
            gCtx.fillStyle = g1;
            gCtx.fillRect(cx - r1, cy - r1, r1 * 2, r1 * 2);

            const r2 = rect.height * (0.9 + iv * 1.4);
            const g2 = gCtx.createRadialGradient(cx, cy, 0, cx, cy, r2);
            g2.addColorStop(0, `rgba(${gcs},${(iv * 0.1 * CONFIG.glowIntensity).toFixed(3)})`);
            g2.addColorStop(1, `rgba(${gcs},0)`);
            gCtx.fillStyle = g2;
            gCtx.fillRect(cx - r2, cy - r2, r2 * 2, r2 * 2);
          }

          if (CONFIG.starsEnabled) {
            // Pick a spawn letter weighted by intensity so sparks spread across all bright letters
            const totalIv = intensities.reduce((s, v) => s + v, 0);
            if (totalIv > 0.01) {
              let pick = Math.random() * totalIv, spawnIdx = n - 1;
              for (let i = 0; i < n; i++) { pick -= intensities[i]; if (pick <= 0) { spawnIdx = i; break; } }
              const sr = spans[spawnIdx].getBoundingClientRect();
              // Spawn across full letter area, all directions
              updateSparks(now, dt, sr.left + sr.width * 0.5, sr.top + sr.height * 0.5, sr.width * 0.5, sr.height * 0.5, maxIntensity, true);
            }
          }
          requestAnimationFrame(tick);
          return;
        }
        /* ── End sparkling ── */

        const falloff = FALLOFFS[CONFIG.easing] || FALLOFFS.gaussian;
        const t      = ((now - t0) % CONFIG.loopDuration) / CONFIG.loopDuration;
        const cr     = CONFIG.colorRadius;
        const travelT = CONFIG.tailFraction < 1 ? Math.min(t / (1 - CONFIG.tailFraction), 1) : 0;
        const pos    = -cr + travelT * (n - 1 + 2 * cr);

        const enterDist  = pos - (-cr);
        const exitDist   = (n - 1 + cr) - pos;
        const globalFade = Math.max(0, Math.min(Math.min(enterDist, exitDist) / (cr * 0.8), 1));

        const centerIdx  = Math.round(Math.max(0, Math.min(n - 1, pos)));
        const centerSpan = spans[centerIdx];
        let sparkX = 0, sparkY = 0, sparkHalfW = 15, sparkHalfH = 10;
        if (centerSpan) {
          const rect = centerSpan.getBoundingClientRect();
          sparkX     = rect.left + rect.width  * 0.5;
          sparkY     = rect.top  + rect.height * 0.5;
          sparkHalfW = rect.width  * 0.5;
          sparkHalfH = rect.height * 0.5;
        }

        for (let i = 0; i < n; i++) {
          const dist      = Math.abs(i - pos);
          const weightInf = dist / CONFIG.waveRadius  <= 1 ? falloff(dist / CONFIG.waveRadius)  : 0;
          const colorInf  = dist / CONFIG.colorRadius <= 1 ? falloff(dist / CONFIG.colorRadius) : 0;
          const w = CONFIG.invertWeight
            ? CONFIG.peakWeight - (CONFIG.peakWeight - CONFIG.baseWeight) * weightInf
            : CONFIG.baseWeight + (CONFIG.peakWeight - CONFIG.baseWeight) * weightInf;

          const valleyT = Math.max(0, 1 - colorInf * 3);
          const baseRgb = lerpColor(CONFIG.valleyColor, CONFIG.baseColor, 1 - valleyT);
          const midRgb  = lerpColor(baseRgb, CONFIG.peakColor, colorInf * globalFade);
          const rgb     = lerpColor(midRgb, CONFIG.peakPeakColor, weightInf * globalFade);

          const sw_w    = smoothedWeights[i];
          const alpha_w = 1 - Math.exp(-dt / (w > sw_w ? 80 : 160)); // rise 2× faster than fall
          smoothedWeights[i] = sw_w + (w - sw_w) * alpha_w;
          spans[i].style.fontVariationSettings = `'wght' ${smoothedWeights[i].toFixed(1)}`;
          spans[i].style.color = `rgb(${rgb.join(',')})`;
          spans[i].style.textShadow = '';
        }

        /* Glow canvas */
        if (glowCanvas.width !== window.innerWidth || glowCanvas.height !== window.innerHeight) {
          glowCanvas.width = window.innerWidth; glowCanvas.height = window.innerHeight;
        }
        const ctx = glowCanvas.getContext('2d');
        ctx.clearRect(0, 0, glowCanvas.width, glowCanvas.height);

        for (let i = 0; i < n; i++) {
          const dist      = Math.abs(i - pos);
          const weightInf = dist / CONFIG.waveRadius  <= 1 ? falloff(dist / CONFIG.waveRadius)  : 0;
          const glowA     = weightInf * globalFade;
          if (glowA < 0.01) continue;

          const rect = spans[i].getBoundingClientRect();
          const cx2 = rect.left + rect.width * 0.5;
          const cy2 = rect.top  + rect.height * 0.5;
          const gc  = lerpColor(CONFIG.peakColor, CONFIG.peakPeakColor, weightInf);
          const gcStr = `${gc[0]},${gc[1]},${gc[2]}`;

          const r1 = rect.height * (0.4 + weightInf * 0.3);
          const g1 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r1);
          g1.addColorStop(0, `rgba(${gcStr},${(glowA * 0.18 * CONFIG.glowIntensity).toFixed(3)})`);
          g1.addColorStop(1, `rgba(${gcStr},0)`);
          ctx.fillStyle = g1;
          ctx.fillRect(cx2 - r1, cy2 - r1, r1 * 2, r1 * 2);

          const r2 = rect.height * (1.2 + weightInf * 1.0);
          const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2);
          g2.addColorStop(0, `rgba(${gcStr},${(glowA * 0.08 * CONFIG.glowIntensity).toFixed(3)})`);
          g2.addColorStop(1, `rgba(${gcStr},0)`);
          ctx.fillStyle = g2;
          ctx.fillRect(cx2 - r2, cy2 - r2, r2 * 2, r2 * 2);
        }

        if (CONFIG.starsEnabled) updateSparks(now, dt, sparkX, sparkY, sparkHalfW, sparkHalfH, globalFade, false);
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    /* ── Control panel ── */
    if (showPanel) buildPanel(CONFIG, presets, spans, relayout, rebuild, particles, sparksEl);

    return { CONFIG, rebuild, relayout };
  }

  /* ════════════════════════════════════════
     buildPanel
  ════════════════════════════════════════ */
  function buildPanel(CONFIG, presets, spans, relayout, rebuild, particles, sparksEl) {
    const panel = document.createElement('div');
    panel.className = 'wm-panel';

    /* ── Preset tabs + sliders group ── */
    const slidersGroup = document.createElement('div');
    slidersGroup.className = 'wm-sliders-group';

    const presetTabs = document.createElement('div');
    presetTabs.className = 'wm-preset-tabs';

    Object.entries(presets).forEach(([key, p]) => {
      const btn = document.createElement('button');
      btn.className = 'wm-preset-btn';
      btn.id = `wm-preset-${key}`;
      btn.textContent = p.label || key;
      presetTabs.appendChild(btn);
    });
    slidersGroup.appendChild(presetTabs);

    /* ── Sliders row ── */
    const slidersRow = document.createElement('div');
    slidersRow.className = 'wm-sliders-row';

    function mkSlider(id, label, min, max, step, value) {
      const ctrl = document.createElement('div');
      ctrl.className = 'wm-ctrl';
      ctrl.innerHTML = `
        <span class="wm-val" id="wm-v-${id}"></span>
        <div class="wm-slider-wrap">
          <div class="wm-tick" data-p="25"></div>
          <div class="wm-tick" data-p="50"></div>
          <div class="wm-tick" data-p="75"></div>
          <input type="range" id="wm-s-${id}" min="${min}" max="${max}" step="${step}" value="${value}">
        </div>
        <label>${label}</label>`;
      slidersRow.appendChild(ctrl);
      return ctrl;
    }

    mkSlider('speed',   'Speed',   400,   4000, 100,   4000 - (CONFIG.loopDuration - 400));
    mkSlider('tail',    'Tail',    0,     0.7,  0.05,  CONFIG.tailFraction);
    mkSlider('wave',    'Wave',    0.3,   3,    0.1,   CONFIG.waveRadius);
    mkSlider('glow',    'Glow',    0.3,   4,    0.1,   CONFIG.colorRadius);
    mkSlider('spacing', 'Spacing', -0.12, 0.08, 0.005, CONFIG.letterSpacingEm);
    mkSlider('thin',    'Thin',    100,   500,  10,    CONFIG.baseWeight);
    mkSlider('bold',    'Bold',    300,   700,  10,    CONFIG.peakWeight);

    slidersGroup.appendChild(slidersRow);
    panel.appendChild(slidersGroup);

    /* Divider */
    const div = document.createElement('div');
    div.className = 'wm-divider';
    panel.appendChild(div);

    /* ── Color column ── */
    const colorCol = document.createElement('div');
    colorCol.className = 'wm-color-col';

    /* Glow intensity row */
    colorCol.innerHTML = `
      <div class="wm-color-row">
        <label>Glow</label>
        <input type="range" id="wm-s-glow-int" class="wm-h-slider" min="0" max="3" step="0.05" value="${CONFIG.glowIntensity}">
        <span class="wm-hex-val" id="wm-v-glow-int">${CONFIG.glowIntensity.toFixed(2)}</span>
      </div>`;

    /* Motion select row */
    const motionRow = document.createElement('div');
    motionRow.className = 'wm-color-row';
    motionRow.innerHTML = `
      <label>Motion</label>
      <select id="wm-sel-motion" class="wm-blend-sel" style="flex:1;">
        <option value="wave"${CONFIG.motion==='wave'?' selected':''}>Wave</option>
        <option value="sparkling"${CONFIG.motion==='sparkling'?' selected':''}>Sparkling</option>
      </select>`;
    colorCol.appendChild(motionRow);

    const BLEND_MODES = ['normal','multiply','screen','overlay','darken','lighten',
      'color-dodge','color-burn','hard-light','soft-light','difference','exclusion',
      'hue','saturation','color','luminosity'];

    function mkColorRow(label, idSuffix, configKey, blendKey) {
      const row = document.createElement('div');
      row.className = 'wm-color-row';
      const hex = rgbToHex(CONFIG[configKey]);
      const blendOpts = BLEND_MODES.map(m => `<option value="${m}">${m}</option>`).join('');
      row.innerHTML = `
        <label>${label}</label>
        <div class="wm-swatch-wrap" id="wm-wrap-${idSuffix}">
          <div class="wm-swatch-bg" id="wm-bg-${idSuffix}" style="background:${hex}"></div>
          <input type="color" id="wm-c-${idSuffix}" value="${hex}">
        </div>
        <select class="wm-blend-sel" id="wm-blend-${idSuffix}">${blendOpts}</select>`;
      colorCol.appendChild(row);
    }

    mkColorRow('Valley', 'valley',   'valleyColor',   'valley');
    mkColorRow('Rest',   'base',     'baseColor',     'base');
    mkColorRow('Peak',   'peak',     'peakColor',     'peak');
    mkColorRow('Center', 'peakpeak', 'peakPeakColor', 'peakpeak');

    /* Stars row */
    const starsRow = document.createElement('div');
    starsRow.className = 'wm-color-row';
    const sparkHex = CONFIG.sparkColor;
    starsRow.innerHTML = `
      <label>Stars</label>
      <div class="wm-swatch-wrap">
        <div class="wm-swatch-bg" id="wm-bg-spark" style="background:${sparkHex}"></div>
        <input type="color" id="wm-c-spark" value="${sparkHex}">
      </div>
      <select class="wm-blend-sel" id="wm-blend-spark">
        ${BLEND_MODES.map(m => `<option value="${m}"${m===CONFIG.sparkBlendMode?' selected':''}>${m}</option>`).join('')}
      </select>
      <label class="wm-toggle-wrap">
        <input type="checkbox" id="wm-toggle-stars" ${CONFIG.starsEnabled ? 'checked' : ''}>
        <span class="wm-toggle-box"></span>
      </label>`;
    colorCol.appendChild(starsRow);
    panel.appendChild(colorCol);
    document.body.appendChild(panel);

    /* ── Wire sliders ── */
    const speedLabel = ms => Math.round((1 - (ms - 400) / 3600) * 100) + '%';
    const tailLabel  = f  => Math.round(f * 100) + '%';
    const sSpeed = document.getElementById('wm-s-speed');
    const vSpeed = document.getElementById('wm-v-speed');
    vSpeed.textContent = speedLabel(CONFIG.loopDuration);
    sSpeed.addEventListener('input', () => {
      magnetize(sSpeed);
      CONFIG.loopDuration = 4000 - (+sSpeed.value - 400);
      vSpeed.textContent = speedLabel(CONFIG.loopDuration);
    });

    const sTail = document.getElementById('wm-s-tail');
    const vTail = document.getElementById('wm-v-tail');
    vTail.textContent = tailLabel(CONFIG.tailFraction);
    sTail.addEventListener('input', () => {
      magnetize(sTail);
      CONFIG.tailFraction = +sTail.value;
      vTail.textContent = tailLabel(CONFIG.tailFraction);
    });

    [['wave','waveRadius',v=>v.toFixed(1)],
     ['glow','colorRadius',v=>v.toFixed(1)],
     ['spacing','letterSpacingEm',v=>v.toFixed(3)],
    ].forEach(([id, key, fmt]) => {
      const s = document.getElementById(`wm-s-${id}`);
      const v = document.getElementById(`wm-v-${id}`);
      v.textContent = fmt(CONFIG[key]);
      s.addEventListener('input', () => {
        magnetize(s);
        CONFIG[key] = +s.value;
        v.textContent = fmt(CONFIG[key]);
        if (id === 'spacing') relayout();
      });
    });

    const sThin = document.getElementById('wm-s-thin');
    const vThin = document.getElementById('wm-v-thin');
    const sBold = document.getElementById('wm-s-bold');
    const vBold = document.getElementById('wm-v-bold');
    vThin.textContent = CONFIG.baseWeight;
    vBold.textContent = CONFIG.peakWeight;
    sThin.addEventListener('input', () => {
      magnetize(sThin);
      CONFIG.baseWeight = +sThin.value;
      if (CONFIG.peakWeight < CONFIG.baseWeight) {
        CONFIG.peakWeight = CONFIG.baseWeight;
        sBold.value = CONFIG.peakWeight;
        vBold.textContent = CONFIG.peakWeight;
      }
      vThin.textContent = CONFIG.baseWeight;
      relayout();
    });
    sBold.addEventListener('input', () => {
      magnetize(sBold);
      CONFIG.peakWeight = Math.max(+sBold.value, CONFIG.baseWeight);
      sBold.value = CONFIG.peakWeight;
      vBold.textContent = CONFIG.peakWeight;
    });

    /* Glow intensity */
    const sGI = document.getElementById('wm-s-glow-int');
    const vGI = document.getElementById('wm-v-glow-int');
    sGI.addEventListener('input', () => {
      magnetize(sGI);
      CONFIG.glowIntensity = +sGI.value;
      vGI.textContent = CONFIG.glowIntensity.toFixed(2);
    });

    /* Color pickers */
    [['valley','valleyColor'],['base','baseColor'],['peak','peakColor'],['peakpeak','peakPeakColor']].forEach(([id, key]) => {
      const inp = document.getElementById(`wm-c-${id}`);
      const bg  = document.getElementById(`wm-bg-${id}`);
      inp.addEventListener('input', () => {
        CONFIG[key] = hexToRgb(inp.value);
        bg.style.background = inp.value;
      });
    });

    /* Motion select */
    document.getElementById('wm-sel-motion').addEventListener('change', e => {
      CONFIG.motion = e.target.value;
    });

    /* Blend selects — center drives letters */
    document.getElementById('wm-blend-peakpeak').addEventListener('change', e => {
      spans.forEach(s => s.style.mixBlendMode = e.target.value);
    });
    document.getElementById('wm-blend-spark').addEventListener('change', e => {
      sparksEl.style.mixBlendMode = e.target.value;
    });

    /* Stars color */
    const cSpark = document.getElementById('wm-c-spark');
    const bgSpark = document.getElementById('wm-bg-spark');
    cSpark.addEventListener('input', () => {
      CONFIG.sparkColor = cSpark.value;
      bgSpark.style.background = cSpark.value;
    });

    /* Stars toggle */
    document.getElementById('wm-toggle-stars').addEventListener('change', e => {
      CONFIG.starsEnabled = e.target.checked;
      if (!CONFIG.starsEnabled) { particles.forEach(p => p.el.remove()); particles.length = 0; }
    });

    /* Preset buttons */
    Object.entries(window.WORDMARK_PRESETS || {}).forEach(([key, p]) => {
      const btn = document.getElementById(`wm-preset-${key}`);
      if (!btn) return;
      btn.addEventListener('click', () => {
        Object.assign(CONFIG, p);
        /* sync all controls */
        sSpeed.value = 4000 - (CONFIG.loopDuration - 400);
        vSpeed.textContent = speedLabel(CONFIG.loopDuration);
        sTail.value = CONFIG.tailFraction; vTail.textContent = tailLabel(CONFIG.tailFraction);
        document.getElementById('wm-s-wave').value    = CONFIG.waveRadius;
        document.getElementById('wm-v-wave').textContent = CONFIG.waveRadius.toFixed(1);
        document.getElementById('wm-s-glow').value    = CONFIG.colorRadius;
        document.getElementById('wm-v-glow').textContent = CONFIG.colorRadius.toFixed(1);
        document.getElementById('wm-s-spacing').value = CONFIG.letterSpacingEm;
        document.getElementById('wm-v-spacing').textContent = CONFIG.letterSpacingEm.toFixed(3);
        sThin.value = CONFIG.baseWeight; vThin.textContent = CONFIG.baseWeight;
        sBold.value = CONFIG.peakWeight; vBold.textContent = CONFIG.peakWeight;
        sGI.value = CONFIG.glowIntensity; vGI.textContent = CONFIG.glowIntensity.toFixed(2);
        ['valley','base','peak','peakpeak'].forEach((id, idx) => {
          const ck = ['valleyColor','baseColor','peakColor','peakPeakColor'][idx];
          const hex = rgbToHex(CONFIG[ck]);
          document.getElementById(`wm-c-${id}`).value = hex;
          document.getElementById(`wm-bg-${id}`).style.background = hex;
        });
        cSpark.value = CONFIG.sparkColor; bgSpark.style.background = CONFIG.sparkColor;
        const blendSel = document.getElementById('wm-blend-spark');
        blendSel.value = CONFIG.sparkBlendMode || 'screen';
        sparksEl.style.mixBlendMode = blendSel.value;
        document.getElementById('wm-sel-motion').value = CONFIG.motion || 'wave';
        document.getElementById('wm-toggle-stars').checked = CONFIG.starsEnabled;
        if (!CONFIG.starsEnabled) { particles.forEach(pt => pt.el.remove()); particles.length = 0; }
        relayout();
        panel.querySelectorAll('.wm-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    /* Mark first preset active */
    const firstKey = Object.keys(window.WORDMARK_PRESETS || {})[0];
    if (firstKey) {
      const firstBtn = document.getElementById(`wm-preset-${firstKey}`);
      if (firstBtn) firstBtn.classList.add('active');
    }
  }

  /* ── Auto-init ── */
  function autoInit() {
    document.querySelectorAll('[data-wordmark]').forEach(el => {
      if (el.dataset.wmInit) return; // skip if already initialized by explicit call
      el.dataset.wmInit = '1';
      var wm = WordmarkInit({ el });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { wm.relayout(); el.dispatchEvent(new CustomEvent('wordmark:ready')); });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  global.WordmarkInit = WordmarkInit;

})(window);
