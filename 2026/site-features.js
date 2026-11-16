/* ISP 2026 site features — audio, UI themes, recent-activity, silh-title, knock/stamp */
(function () {
function __pretextOnReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};
  if (!document.getElementById('pretext-site-features-css')) {
    var st = document.createElement('style');
    st.id = 'pretext-site-features-css';
    st.textContent = "/* Shared tokens — panel bars + recent activity hover/cards */\n:root {\n  --ui-bar: #888888;\n  --ui-bar-hover: #666666;\n  --ui-bar-text: #ffffff;\n  --ui-bar-border: #888888;\n  --ui-activity-hover: #fff200;\n  --ui-activity-text: #212122;\n  --ui-card-bg: #ffffff;\n  --ui-card-border: #000000;\n  --ui-card-text: #212122;\n}\n\n.nav-input-container {\n  background-color: var(--ui-bar) !important;\n  border-top-color: var(--ui-bar-border) !important;\n}\n.nav-input-container:hover {\n  background-color: var(--ui-bar-hover) !important;\n  border-top-color: var(--ui-bar-hover) !important;\n}\n.nav-input-container.cap {\n  border-bottom-color: var(--ui-bar-border) !important;\n}\n.nav-input-container .caption-text-a,\n.nav-input-container.top-banner .caption-text-a {\n  color: var(--ui-bar-text) !important;\n}\n.nav-input-container .nav-spacer img {\n  filter: var(--ui-bar-icon-filter, none);\n}\n\n.update-indiv:hover,\n.update-indiv.pretext-sand-hover,\n.update-indiv.pretext-activity-open {\n  background-color: var(--ui-activity-hover) !important;\n  color: var(--ui-activity-text);\n}\n.update-indiv:hover .t-body-1,\n.update-indiv.pretext-sand-hover .t-body-1,\n.update-indiv.pretext-activity-open .t-body-1 {\n  color: var(--ui-activity-text);\n}\n\n.recent-cards {\n  background-color: var(--ui-card-bg) !important;\n  border-color: var(--ui-card-border) !important;\n  color: var(--ui-card-text);\n  contain: layout style paint;\n  /* Hidden from first paint so they never flash before the hover script\n     runs; the hover handler sets inline display:block to reveal on hover. */\n  display: none;\n}\n/* In brush mode the paint host sits under these cards (z-index). Unpinned\n   hover previews must not steal pointer events or you can't start a stroke\n   while a row is hovered. Keep them under the brush host so the router always\n   wins hit-testing; pin stays on the row tap; pinned cards keep auto + above. */\nbody:has(.pretext-sand-screen-brush-host:not(.pretext-sand-screen-brush-host--disabled))\n  .recent-cards:not(.recent-card-pinned) {\n  pointer-events: none !important;\n  z-index: 100000001 !important;\n}\n/* Descendants can still be hit-test targets if they set pointer-events:auto;\n   force them off too so a hovered preview never steals a brush drag. */\nbody:has(.pretext-sand-screen-brush-host:not(.pretext-sand-screen-brush-host--disabled))\n  .recent-cards:not(.recent-card-pinned) * {\n  pointer-events: none !important;\n}\n/* Pinned cards keep their normal chrome (border, text, label) and can be\n   dragged around the canvas. Cursor (grab / grabbing) is driven inline by the\n   drag handlers, so don't force one here. */\n.recent-card-pinned {\n  -webkit-user-select: none;\n  user-select: none;\n}\n\n/* Featured hover-scrub slides: Webflow only sets height (540/400/240).\n   Width comes from each image's own aspect-ratio (set as soon as the\n   thumb probe knows square / landscape / portrait) so captionelly\n   does not jump and landscape shots are not letterboxed into a square. */\n.projects-section .carouselly .cara-img {\n  width: auto;\n  object-fit: contain;\n}\n\n/* ============ INDEX / FEATURED STRIP (side-scroll only) ============ */\n/* Webflow ships .preview-span / .featured-preview-span with overflow:scroll,\n   which lets a vertical wheel/gesture scroll the strip box too. Constrain them\n   to horizontal-only so vertical intent falls through to the page instead.\n   Horizontal track height is always reserved with a transparent thumb; hover\n   only paints the thumb. That way the bar never appears/disappears as a\n   layout change and Featured Projects won’t shift a few pixels. */\n.preview-span,\n.featured-preview-span {\n  --pretext-h-scroll-bar: 12px;\n  overflow-x: auto;\n  overflow-y: hidden;\n  touch-action: pan-x;\n  overscroll-behavior-x: contain;\n  scrollbar-width: thin;\n  -ms-overflow-style: auto;\n}\n.preview-span::-webkit-scrollbar,\n.featured-preview-span::-webkit-scrollbar {\n  width: 0;\n  height: var(--pretext-h-scroll-bar);\n  background: transparent;\n}\n.preview-span::-webkit-scrollbar:vertical,\n.featured-preview-span::-webkit-scrollbar:vertical {\n  display: none;\n  width: 0;\n  height: 0;\n}\n.preview-span::-webkit-scrollbar-track,\n.featured-preview-span::-webkit-scrollbar-track {\n  background: transparent;\n}\n.preview-span::-webkit-scrollbar-thumb,\n.featured-preview-span::-webkit-scrollbar-thumb {\n  background: transparent;\n  border-radius: 999px;\n}\n.preview-span:hover::-webkit-scrollbar-thumb,\n.featured-preview-span:hover::-webkit-scrollbar-thumb {\n  background: rgba(0, 0, 0, 0.28);\n}\n\n/* Project tabs (Index captions + Featured metadata): hidden until sequential\n   snap-in. No transition — opacity is a step, not a fade. */\n.preview-span .preview-caption-details,\n.projects-span .div-block-248 {\n  opacity: 0;\n}\n.preview-span .preview-caption-details.project-tab-in,\n.projects-span .div-block-248.project-tab-in {\n  opacity: 1;\n}\n\n/* ====================== SILH-TITLE ====================== */\n.silh-title {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-touch-callout: none;\n  -webkit-tap-highlight-color: rgba(0,0,0,0);\n  -webkit-user-drag: none;\n}\n\n.silh-title > span,\n.spawned-letter {\n  border-radius: 0;\n}\n\n.silh-title > span:focus-visible,\n.spawned-letter:focus-visible {\n  outline: none;\n  box-shadow: none;\n  border: 1px dotted #000;\n  border-radius: 0;\n}\n\n.silh-title:focus-visible {\n  outline: none;\n  box-shadow: none;\n  border: 1px dotted #000;\n  border-radius: 0;\n}\n\n.silh-title {\n  white-space: pre;\n}\n\n.silh-title > span.silh-ch-space {\n  display: inline-block;\n  width: 0.28em;\n  min-width: 0.28em;\n  pointer-events: none;\n}\n\n.updates-section .update-name,\n.updates-section .update-name .un-ghost,\n.updates-section .update-name .un-ticker,\n.updates-section .update-name .t-body-1 {\n  white-space: pre;\n}\n\n/* Mid-grey portfolio typography: ~5% load (mutually exclusive with magenta) */\nhtml.pretext-font-acacac {\n  --ui-activity-text: #acacac;\n  --ui-card-text: #acacac;\n}\nhtml.pretext-font-acacac .silh-title,\nhtml.pretext-font-acacac .spawned-letter,\nhtml.pretext-font-acacac .caption-text-a,\nhtml.pretext-font-acacac .t-body-1,\nhtml.pretext-font-acacac .project-caption,\nhtml.pretext-font-acacac .update-name,\nhtml.pretext-font-acacac .section-title {\n  color: #acacac !important;\n}\nhtml.pretext-font-acacac .nav-input-container .caption-text-a,\nhtml.pretext-font-acacac .nav-input-container.top-banner .caption-text-a,\nhtml.pretext-font-acacac #pretext-lotgd-forest .caption-text-a,\nhtml.pretext-font-acacac #pretext-reading-history .caption-text-a {\n  color: var(--ui-bar-text) !important;\n}\nhtml.pretext-font-acacac .update-indiv:hover .t-body-1,\nhtml.pretext-font-acacac .update-indiv.pretext-sand-hover .t-body-1,\nhtml.pretext-font-acacac .update-indiv.pretext-activity-open .t-body-1 {\n  color: var(--ui-activity-text) !important;\n}\nhtml.pretext-font-acacac .recent-cards {\n  color: var(--ui-card-text) !important;\n}\n\n/* Hot pink portfolio typography: 1% load discovery or unlocked magenta panel */\nhtml.pretext-font-magenta .silh-title,\nhtml.pretext-font-magenta .spawned-letter,\nhtml.pretext-font-magenta .caption-text-a,\nhtml.pretext-font-magenta .t-body-1,\nhtml.pretext-font-magenta .project-caption,\nhtml.pretext-font-magenta .update-name,\nhtml.pretext-font-magenta .section-title,\nhtml[data-ui-bar-theme=\"magenta\"] .silh-title,\nhtml[data-ui-bar-theme=\"magenta\"] .spawned-letter,\nhtml[data-ui-bar-theme=\"magenta\"] .caption-text-a,\nhtml[data-ui-bar-theme=\"magenta\"] .t-body-1,\nhtml[data-ui-bar-theme=\"magenta\"] .project-caption,\nhtml[data-ui-bar-theme=\"magenta\"] .update-name,\nhtml[data-ui-bar-theme=\"magenta\"] .section-title {\n  color: #ff0084 !important;\n}\nhtml.pretext-font-magenta .nav-input-container .caption-text-a,\nhtml.pretext-font-magenta .nav-input-container.top-banner .caption-text-a,\nhtml[data-ui-bar-theme=\"magenta\"] .nav-input-container .caption-text-a,\nhtml[data-ui-bar-theme=\"magenta\"] .nav-input-container.top-banner .caption-text-a,\nhtml.pretext-font-magenta #pretext-lotgd-forest .caption-text-a,\nhtml[data-ui-bar-theme=\"magenta\"] #pretext-lotgd-forest .caption-text-a,\nhtml.pretext-font-magenta #pretext-reading-history .caption-text-a,\nhtml[data-ui-bar-theme=\"magenta\"] #pretext-reading-history .caption-text-a {\n  color: var(--ui-bar-text) !important;\n}\nhtml.pretext-font-magenta .update-indiv:hover .t-body-1,\nhtml.pretext-font-magenta .update-indiv.pretext-sand-hover .t-body-1,\nhtml.pretext-font-magenta .update-indiv.pretext-activity-open .t-body-1,\nhtml[data-ui-bar-theme=\"magenta\"] .update-indiv:hover .t-body-1,\nhtml[data-ui-bar-theme=\"magenta\"] .update-indiv.pretext-sand-hover .t-body-1,\nhtml[data-ui-bar-theme=\"magenta\"] .update-indiv.pretext-activity-open .t-body-1 {\n  color: var(--ui-activity-text) !important;\n}\nhtml.pretext-font-magenta .recent-cards,\nhtml[data-ui-bar-theme=\"magenta\"] .recent-cards {\n  color: var(--ui-card-text) !important;\n}\n\n/* Section headers sit above the carousel/graphic strips that follow them.\n   Shuffle (s) and stamp (;) move or scale letter spans with transforms that\n   bleed past the title row; without a lift, those glyphs paint under\n   .carouselly .cara-img { z-index: 1 } in the sibling block below. */\n.section-title {\n  position: relative;\n  z-index: 2;\n}\n";
    (document.head || document.documentElement).appendChild(st);
  }

  /* ---- load-font-chance.js ---- */

(function () {
  // Load-effect probe: ?loadSweep=N reloads N times and tallies fires in localStorage.
  window.__pretextLoadEffects = Object.create(null);
  window.__pretextNoteLoadEffect = function (id) {
    if (!id) return;
    window.__pretextLoadEffects[id] = true;
  };
  try {
    var sweepParams = new URLSearchParams(location.search);
    if (sweepParams.get('loadSweepReset') === '1') {
      try { localStorage.removeItem('pretext.loadSweep.v1'); } catch (e0) {}
      sweepParams.delete('loadSweepReset');
      if (!sweepParams.get('loadSweep')) sweepParams.set('loadSweep', '100');
      location.replace(location.pathname + '?' + sweepParams.toString() + location.hash);
      return;
    }
    var sweepN = Number(sweepParams.get('loadSweep') || 0);
    window.__pretextLoadSweepN = Number.isFinite(sweepN) && sweepN > 0 ? Math.floor(sweepN) : 0;
  } catch (e) {
    window.__pretextLoadSweepN = 0;
  }
  if (Math.random() < 0.01) {
    document.documentElement.classList.add('pretext-font-magenta');
    window.__pretextNoteLoadEffect('magenta-font');
    try {
      window.localStorage.setItem('pretext.magentaDiscovered', '1');
    } catch (e) {}
  } else if (Math.random() < 0.05) {
    document.documentElement.classList.add('pretext-font-acacac');
    window.__pretextNoteLoadEffect('acacac-font');
  }
})();


  /* ---- sound.js ---- */

(function () {
  var MAX_CONCURRENT = 3;
  var PRELOAD_GAP_MS = 100;
  var PRETEXT_SFX_VOLUME = 0.135;
  window.__pretextSfxVolume = PRETEXT_SFX_VOLUME;
  window.__pretextApplySfxVolume = function (el) {
    el.volume = PRETEXT_SFX_VOLUME;
  };
  var activePlays = 0;
  var tier1Queue = [];
  var tier2Queue = [];
  var drainingTier1 = false;
  var drainingTier2 = false;
  var playUnlocked = false;
  var heavyUnlocked = false;
  var pendingPlayRetries = [];
  var audioCtx = null;
  var flushingPlayRetries = false;
  var htmlUnlockEl = null;

  function getAudioCtx() {
    if (!audioCtx) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (AC) audioCtx = new AC();
      } catch (e) {}
    }
    return audioCtx;
  }

  function resumeAudioCtx() {
    var ctx = getAudioCtx();
    if (!ctx || ctx.state !== 'suspended') return Promise.resolve();
    return ctx.resume().catch(function () {});
  }

  function playSilentTick(ctx) {
    try {
      var buf = ctx.createBuffer(1, 1, ctx.sampleRate || 44100);
      var src = ctx.createBufferSource();
      src.buffer = buf;
      src.connect(ctx.destination);
      src.start(0);
    } catch (e) {}
  }

  /**
   * Safari treats HTMLMediaElement autoplay separately from AudioContext.
   * Muted play does NOT lift the unmuted autoplay gate — prime unmuted at ~0 volume.
   */
  function primeHtmlMediaUnlock() {
    try {
      if (!htmlUnlockEl) {
        // Minimal valid silent WAV
        htmlUnlockEl = new Audio(
          'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA='
        );
        htmlUnlockEl.preload = 'auto';
        htmlUnlockEl.setAttribute('playsinline', '');
      }
      var el = htmlUnlockEl;
      el.muted = false;
      el.volume = 0.01;
      var p = el.play();
      if (p && p.then) {
        p.then(function () {
          el.pause();
          el.currentTime = 0;
        }).catch(function () {});
      }
    } catch (e) {}
  }

  function flushPendingPlayRetries() {
    if (flushingPlayRetries || !pendingPlayRetries.length) return;
    flushingPlayRetries = true;
    var retries = pendingPlayRetries.slice();
    pendingPlayRetries.length = 0;
    retries.forEach(function (fn) {
      try { fn(); } catch (e) {}
    });
    flushingPlayRetries = false;
  }

  function unlockPlay() {
    // Light interaction marker only — Safari does NOT treat hover/move as media unlock.
    playUnlocked = true;
  }

  function unlockHeavy() {
    unlockPlay();
    // Must run in click/pointerdown/touchstart/keydown (or music play) for Safari SFX.
    var firstHeavy = !heavyUnlocked;
    var ctx = getAudioCtx();
    if (ctx && ctx.state === 'suspended') {
      resumeAudioCtx().then(function () { playSilentTick(ctx); });
    } else if (ctx && firstHeavy) {
      playSilentTick(ctx);
    }
    // First gesture only: unmuted HTML prime (muted play does NOT unlock Safari).
    // Later gestures still flush retries so brush SFX queued on NotAllowed recover.
    if (firstHeavy) primeHtmlMediaUnlock();
    else resumeAudioCtx();
    heavyUnlocked = true;
    // Flush synchronously in this gesture so HTMLAudioElement.play() is allowed.
    flushPendingPlayRetries();
    if (firstHeavy) drainTier2Queue();
  }

  // Capture phase so unlock runs BEFORE brush/nav/silh target handlers play SFX.
  // Not once: every real gesture must flush retries queued after a prior unlock.
  document.addEventListener('click', unlockHeavy, { capture: true });
  document.addEventListener('pointerdown', unlockHeavy, { capture: true, passive: true });
  document.addEventListener('touchstart', unlockHeavy, { capture: true, passive: true });
  document.addEventListener('keydown', unlockHeavy, { capture: true });
  document.addEventListener('pointermove', unlockPlay, { once: true, passive: true });

  function bindHoverUnlock() {
    var selectors = '.gui-nav-container, .update-indiv, .case-peak-link, .nav-input-container, .nav-input-link, #pretext-reading-history, #pretext-lotgd-forest, #lotgd-device-chassis, #pretext-lotgd-side-dock, #pretext-lotgd-power';
    document.querySelectorAll(selectors).forEach(function (el) {
      el.addEventListener('pointerenter', unlockPlay, { once: true, passive: true });
      el.addEventListener('mouseenter', unlockPlay, { once: true, passive: true });
    });
  }

  window.__pretextAudioUnlock = unlockHeavy;
  window.__pretextAudioResume = resumeAudioCtx;
  window.__pretextAudioGetCtx = getAudioCtx;
  window.__pretextAudioQueueRetry = queuePlayRetry;
  window.__pretextAudioDeferTier1 = function (task) {
    tier1Queue.push(task);
    scheduleTier1Drain();
  };
  window.__pretextAudioDefer = function (task) {
    tier2Queue.push(task);
    if (heavyUnlocked) drainTier2Queue();
  };

  function scheduleTier1Drain() {
    if (document.readyState === 'loading') {
      __pretextOnReady(drainTier1Queue, { once: true });
    } else {
      drainTier1Queue();
    }
  }

  function drainTier1Queue() {
    drainQueue(tier1Queue, 'drainingTier1');
    bindHoverUnlock();
  }

  function drainTier2Queue() {
    drainQueue(tier2Queue, 'drainingTier2');
  }

  function drainQueue(queue, drainingFlag) {
    if (drainingFlag === 'drainingTier1' ? drainingTier1 : drainingTier2) return;
    if (drainingFlag === 'drainingTier1') drainingTier1 = true;
    else drainingTier2 = true;
    (function step() {
      if (!queue.length) {
        if (drainingFlag === 'drainingTier1') drainingTier1 = false;
        else drainingTier2 = false;
        return;
      }
      var task = queue.shift();
      Promise.resolve()
        .then(task)
        .catch(function () {})
        .then(function () {
          setTimeout(step, PRELOAD_GAP_MS);
        });
    })();
  }

  function queuePlayRetry(fn) {
    pendingPlayRetries.push(fn);
    // Never flush here. Hover-only playUnlocked used to retry outside a gesture and
    // Safari kept rejecting — wait for unlockHeavy (pointer/key/music play).
  }

  function preloadElement(url) {
    return new Promise(function (resolve) {
      var el = new Audio(url);
      window.__pretextApplySfxVolume(el);
      el.preload = 'auto';
      el.load();
      var done = function () { resolve(el); };
      el.addEventListener('canplaythrough', done, { once: true });
      el.addEventListener('loadeddata', done, { once: true });
      setTimeout(done, 1200);
    });
  }

  function playElement(base, onEnd) {
    if (!base || activePlays >= MAX_CONCURRENT) return { stop: function () {} };
    activePlays += 1;
    // Prefer a fresh element over cloneNode — Safari clones of remote <audio>
    // often stay at readyState 0 and never audible even after unlock.
    var src = base.currentSrc || base.src;
    var el = src ? new Audio(src) : base.cloneNode();
    el.preload = 'auto';
    window.__pretextApplySfxVolume(el);
    try { el.currentTime = 0; } catch (e) {}
    var released = false;
    function release() {
      if (released) return;
      released = true;
      activePlays = Math.max(0, activePlays - 1);
    }
    el.addEventListener('ended', function () {
      release();
      if (onEnd) onEnd();
    }, { once: true });
    // Resume is best-effort; keep play() synchronous so Safari user-activation
    // from unlockHeavy / click handlers is not lost across a promise tick.
    resumeAudioCtx();
    el.play().catch(function (err) {
      if (err && err.name === 'NotAllowedError') {
        release();
        queuePlayRetry(function () { playElement(base, onEnd); });
        return;
      }
      release();
    });
    return {
      stop: function () {
        el.pause();
        el.currentTime = 0;
        release();
      }
    };
  }

  function onReady() {
    /* SOUND 1: NAV + CASE PEAK LINK SOUND */
    (function () {
      var navBaseAudio = null;
      var navHandle = null;
      var navCooldown = false;
      var navPendingPlays = [];
      var NAV_COOLDOWN_MS = 80;

      window.__pretextAudioDeferTier1(function () {
        return preloadElement('https://raw.githubusercontent.com/adamho91/adamho91/main/MenuToggleA.wav')
          .then(function (el) {
            window.__pretextApplySfxVolume(el);
            navBaseAudio = el;
            console.log('[Nav Sound] Fast audio preloaded');
            if (navPendingPlays.length) {
              var pending = navPendingPlays.slice();
              navPendingPlays.length = 0;
              pending.forEach(function (fn) { fn(); });
            }
          });
      });

      function stopNavSound() {
        if (navHandle) {
          navHandle.stop();
          navHandle = null;
        }
      }

      function playNavNow(label, i) {
        if (!navBaseAudio) {
          navPendingPlays[0] = function () { playNavNow(label, i); };
          return;
        }
        if (navCooldown) return;
        navCooldown = true;
        setTimeout(function () { navCooldown = false; }, NAV_COOLDOWN_MS);
        // Don't cut the previous beep — 3D cube spins used to fire mouseleave
        // and kill the clip before it was audible.
        navHandle = playElement(navBaseAudio);
        console.log('[Nav Sound] Triggered on', label, i);
      }

      window.__pretextPlayNavHoverSound = function () {
        playNavNow('.nav-input-container', 0);
      };

      var navHoverRow = null;
      var navRoot = document.querySelector('.gui-nav-container') || document;
      navRoot.addEventListener('pointerover', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var row = t.closest('.nav-input-container');
        if (!row || (navRoot !== document && !navRoot.contains(row))) return;
        if (navHoverRow === row) return;
        navHoverRow = row;
        playNavNow('.nav-input-container', 0);
      }, true);
      navRoot.addEventListener('pointerout', function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var row = t.closest('.nav-input-container');
        if (!row || navHoverRow !== row) return;
        var next = e.relatedTarget;
        if (next && row.contains(next)) return;
        navHoverRow = null;
      }, true);

      document.querySelectorAll('.case-peak-link').forEach(function (link, i) {
        link.addEventListener('mouseenter', function () { playNavNow('.case-peak-link hover', i); });
        link.addEventListener('click', function () { playNavNow('.case-peak-link click', i); });
        link.addEventListener('mouseleave', stopNavSound);
      });
    })();

    /* SOUND 2: SILH TITLE JIGGLE SOUNDS */
    (function () {
      var silhUrls = [
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_01.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_02.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_03.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_04.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_05.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_06.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_07.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_08.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_09.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_10.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_12.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_13.wav',
        'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_11.wav'
      ];

      var sounds = [];
      var currentIndex = 0;

      silhUrls.forEach(function (url, i) {
        window.__pretextAudioDefer(function () {
          return preloadElement(url).then(function (el) {
            window.__pretextApplySfxVolume(el);
            sounds[i] = el;
            console.log('[Silh Sound] Preloaded:', i);
          });
        });
      });

      document.addEventListener('click', function (e) {
        var silhElement = e.target.closest('.silh-title');
        if (!silhElement) return;
        var sound = sounds[currentIndex];
        if (!sound) return;
        console.log('[Silh Sound] Playing index:', currentIndex);
        playElement(sound);
        currentIndex = (currentIndex + 1) % silhUrls.length;
      }, true);
    })();
  }

  if (document.readyState === 'loading') {
    __pretextOnReady(onReady);
  } else {
    onReady();
  }
})();


  /* ---- pause-audio.js ---- */

__pretextOnReady(() => {
  const sounds = {
    // jsDelivr serves audio/wav (raw.githubusercontent.com is octet-stream).
    morning: "https://cdn.jsdelivr.net/gh/adamho91/adamho91@main/1Dreaming_MistLogic.wav",
    afternoon: "https://cdn.jsdelivr.net/gh/adamho91/adamho91@main/2Thinking_SignalSorting.wav",
    night: "https://cdn.jsdelivr.net/gh/adamho91/adamho91@main/3Doing_ProcessBloom_260316.wav"
  };

  function currentTrackSlot() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    return 'night';
  }

  let activeSlot = currentTrackSlot();

  const audio = document.createElement('audio');
  audio.preload = 'auto';
  audio.loop = false;
  audio.volume = 0;
  audio.playsInline = true;
  audio.setAttribute('playsinline', '');
  audio.style.display = 'none';
  document.body.appendChild(audio);

  function notifyMainTrackPlayingChange() {
    document.dispatchEvent(new CustomEvent('pretext-main-track-playing', {
      detail: { playing: isPlaying && !userStopped && !audio.paused && !audio.ended }
    }));
  }
  window.__pretextIsMainTrackPlaying = function () {
    return isPlaying && !userStopped && !audio.paused && !audio.ended;
  };

  // Prefer typed blob: URLs so play stays reliable across hosts/MIME quirks.
  const trackBlobUrls = Object.create(null);
  const trackBlobPending = Object.create(null);

  let isPlaying = false;
  let userStopped = false;
  let fadeInterval = null;
  let watchdogInterval = null;
  let playGeneration = 0;
  const TARGET_VOLUME = 0.5;
  const MAIN_TRACK_PLAY_KEY = 'pretext-main-track-played';

  function mainTrackDayKey() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  }

  let mainTrackCalendarDay = mainTrackDayKey();

  function playedSlotsForDay(day) {
    try {
      const raw = localStorage.getItem(MAIN_TRACK_PLAY_KEY);
      if (!raw) return [];
      if (raw.charAt(0) !== '{') {
        // Legacy once-per-day flag — that day used up all auto slots.
        return raw === day ? ['morning', 'afternoon', 'night'] : [];
      }
      const data = JSON.parse(raw);
      return Array.isArray(data[day]) ? data[day] : [];
    } catch (e) {
      return [];
    }
  }

  function hasPlayedMainTrackSlotToday(slot) {
    return playedSlotsForDay(mainTrackDayKey()).indexOf(slot) !== -1;
  }

  function markMainTrackSlotPlayed(slot) {
    try {
      const day = mainTrackDayKey();
      const slots = playedSlotsForDay(day).slice();
      if (slots.indexOf(slot) === -1) slots.push(slot);
      localStorage.setItem(MAIN_TRACK_PLAY_KEY, JSON.stringify({ [day]: slots }));
    } catch (e) {}
  }

  function canStartMainTrackToday() {
    return !hasPlayedMainTrackSlotToday(currentTrackSlot());
  }

  function resolveTrackBlobUrl(slot) {
    if (trackBlobUrls[slot]) return Promise.resolve(trackBlobUrls[slot]);
    if (trackBlobPending[slot]) return trackBlobPending[slot];
    trackBlobPending[slot] = fetch(sounds[slot])
      .then(res => {
        if (!res.ok) throw new Error('Main track fetch failed: ' + res.status);
        return res.arrayBuffer();
      })
      .then(buf => {
        const objectUrl = URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
        trackBlobUrls[slot] = objectUrl;
        delete trackBlobPending[slot];
        return objectUrl;
      })
      .catch(err => {
        delete trackBlobPending[slot];
        throw err;
      });
    return trackBlobPending[slot];
  }

  function applyTrackSrc(objectUrl) {
    if (audio.src === objectUrl) return;
    audio.src = objectUrl;
    try {
      audio.load();
    } catch (e) {}
  }

  function syncCurrentTrackSlot() {
    const slot = currentTrackSlot();
    if (slot === activeSlot) return slot;
    activeSlot = slot;
    if (!isPlaying) {
      if (trackBlobUrls[slot]) applyTrackSrc(trackBlobUrls[slot]);
    }
    return slot;
  }

  function syncMainTrackState() {
    const today = mainTrackDayKey();
    if (today !== mainTrackCalendarDay) {
      mainTrackCalendarDay = today;
      userStopped = false;
      isPlaying = false;
      notifyMainTrackPlayingChange();
    }
    syncCurrentTrackSlot();
    if (canStartMainTrackToday()) armUnlockPlayListener();
    else disarmUnlockPlayListener();
  }

  function disarmUnlockPlayListener() {
    document.removeEventListener('pointerdown', tryUnlockPlay, true);
    document.removeEventListener('keydown', tryUnlockPlay, true);
    document.removeEventListener('click', tryUnlockPlay, true);
  }

  function armUnlockPlayListener() {
    disarmUnlockPlayListener();
    // Capture + pointer/key so the first gesture after password gate still unlocks.
    document.addEventListener('pointerdown', tryUnlockPlay, true);
    document.addEventListener('keydown', tryUnlockPlay, true);
    document.addEventListener('click', tryUnlockPlay, true);
  }

  function clearFade() {
    if (fadeInterval) {
      clearInterval(fadeInterval);
      fadeInterval = null;
    }
  }

  function fadeTo(target, step = 0.02, speed = 50, onDone) {
    clearFade();

    fadeInterval = setInterval(() => {
      const diff = target - audio.volume;

      if (Math.abs(diff) <= step) {
        audio.volume = target;
        clearFade();
        if (onDone) onDone();
        return;
      }

      audio.volume += diff > 0 ? step : -step;
    }, speed);
  }

  function safePlay(resetToStart = false, opts = {}) {
    const manual = opts.manual === true;
    const autoDaily = opts.autoDaily === true;
    if (userStopped && !manual) return;
    if (resetToStart && !manual && !canStartMainTrackToday()) return;

    const generation = ++playGeneration;
    const slot = activeSlot;

    const attempt = () => {
      if (generation !== playGeneration) return;
      if (userStopped && !manual) return;
      if (resetToStart) {
        try {
          audio.currentTime = 0;
        } catch (e) {}
      }

      audio.play().then(() => {
        if (generation !== playGeneration) return;
        if (userStopped && !manual) {
          audio.pause();
          return;
        }
        if (autoDaily) markMainTrackSlotPlayed(currentTrackSlot());
        isPlaying = true;
        userStopped = false;
        fadeTo(TARGET_VOLUME);
        startWatchdog();
        notifyMainTrackPlayingChange();
        if (typeof opts.onStarted === 'function') opts.onStarted();
      }).catch(err => {
        if (generation !== playGeneration) return;
        console.log('Main track play failed:', err);
      });
    };

    resolveTrackBlobUrl(slot)
      .then(objectUrl => {
        if (generation !== playGeneration) return;
        applyTrackSrc(objectUrl);

        if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          attempt();
          return;
        }

        let ready = false;
        const onReady = () => {
          if (ready) return;
          ready = true;
          audio.removeEventListener('canplay', onReady);
          audio.removeEventListener('loadeddata', onReady);
          clearTimeout(readyTimer);
          attempt();
        };
        const readyTimer = window.setTimeout(() => {
          console.log('Main track load slow — trying play anyway');
          onReady();
        }, 8000);
        audio.addEventListener('canplay', onReady);
        audio.addEventListener('loadeddata', onReady);
      })
      .catch(err => {
        if (generation !== playGeneration) return;
        console.log('Main track prepare failed:', err);
      });
  }

  function startAudio() {
    userStopped = false;
    isPlaying = false;
    clearFade();
    syncCurrentTrackSlot();
    safePlay(true, { manual: true });
  }

  function stopAudio() {
    userStopped = true;
    isPlaying = false;
    playGeneration += 1;
    stopWatchdog();
    clearFade();
    audio.volume = 0;
    audio.pause();
    notifyMainTrackPlayingChange();
  }

  function resumeMainTrackIfNeeded() {
    if (userStopped || !isPlaying || audio.ended) return;
    safePlay(false);
  }

  function startWatchdog() {
    stopWatchdog();

    // Only recover from unexpected pauses. Remote WAV buffering can sit on the
    // same currentTime for seconds without being broken — the old stall counter
    // treated that as failure and audio.load() restarted the track every ~6–10s.
    watchdogInterval = setInterval(() => {
      if (!isPlaying || userStopped) return;
      if (audio.paused && !audio.ended) {
        console.log('Main track paused unexpectedly — resuming');
        resumeMainTrackIfNeeded();
      }
    }, 2000);
  }

  function stopWatchdog() {
    if (watchdogInterval) {
      clearInterval(watchdogInterval);
      watchdogInterval = null;
    }
  }

  function bindMainTrackControls() {
    if (bindMainTrackControls._bound) return;
    bindMainTrackControls._bound = true;
    document.addEventListener('click', onMainTrackControlClick, true);
  }

  function onMainTrackControlClick(e) {
    if (!(e.target instanceof Element)) return;
    const start = e.target.closest('.startaudio');
    if (start) {
      e.preventDefault();
      e.stopPropagation();
      if (window.__pretextAudioUnlock) window.__pretextAudioUnlock();
      startAudio();
      return;
    }
    const stop = e.target.closest('.stopaudio');
    if (stop) {
      e.preventDefault();
      e.stopPropagation();
      stopAudio();
    }
  }

  bindMainTrackControls();
  window.addEventListener('load', bindMainTrackControls, { once: true });
  window.__pretextStartMainTrack = startAudio;
  window.__pretextStopMainTrack = stopAudio;

  audio.addEventListener('ended', () => {
    console.log('Track ended');
    isPlaying = false;
    stopWatchdog();
    clearFade();
    audio.volume = 0;
    notifyMainTrackPlayingChange();
    // Play once per start — only the play button restarts it.
  });

  audio.addEventListener('stalled', () => {
    console.log('Audio stalled');
  });

  audio.addEventListener('suspend', () => {
    console.log('Audio suspended');
  });

  audio.addEventListener('waiting', () => {
    console.log('Audio waiting');
  });

  audio.addEventListener('error', (e) => {
    if (userStopped) return;
    console.log('Main track error — retrying play:', e);
    resumeMainTrackIfNeeded();
  });

  function tryUnlockPlay() {
    syncMainTrackState();
    if (window.__pretextAudioUnlock) window.__pretextAudioUnlock();
    if (userStopped || isPlaying || !canStartMainTrackToday()) return;
    safePlay(true, {
      autoDaily: true,
      onStarted: () => disarmUnlockPlayListener(),
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncMainTrackState();
  });
  window.addEventListener('focus', syncMainTrackState);
  setInterval(syncMainTrackState, 60000);
  syncMainTrackState();
  // Warm the current daypart track so the first gesture can play immediately.
  resolveTrackBlobUrl(activeSlot).catch(() => {});

  console.log('Main track slot:', activeSlot, sounds[activeSlot]);
});


  /* ---- superscript.js ---- */

(function () {
  var MIN = 2, MAX = 5;
  var FACTOR = 0.78;   // superscript size as a fraction of the letter's real size
  var RAISE  = 0.45;   // how far up, as a fraction of the real size

  function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

  function run() {
    var candidates = Array.prototype.filter.call(
      document.querySelectorAll(".silh-title:not(.d0t):not(.ms)"),
      function (el) {
        var t = el.textContent.trim();
        return t.length === 1 && /[A-Za-z]/.test(t);
      }
    );
    if (!candidates.length) return;

    for (var i = candidates.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = candidates[i]; candidates[i] = candidates[j]; candidates[j] = t;
    }
    var count = Math.min(randInt(MIN, MAX), candidates.length);
    for (var k = 0; k < count; k++) {
      var el = candidates[k];
      var px = parseFloat(getComputedStyle(el).fontSize) || 16; // real rendered size
      el.style.fontSize = (px * FACTOR) + "px";
      el.style.verticalAlign = (px * RAISE) + "px";  // raise relative to real size
      el.style.position = "";
      el.style.top = "";
    }
  }

  window.addEventListener("load", run);
})();


  /* ---- ui-bar-theme.js ---- */

(function () {
  /** 3 color sets — grey (default), black, magenta */
  var UI_BAR_THEMES = [
    {
      id: 'slate',
      label: 'Grey',
      bar: '#888888', barHover: '#666666', barText: '#ffffff', barBorder: '#888888',
      activityHover: '#fff200', activityText: '#212122',
      cardBg: '#ffffff', cardBorder: '#000000', cardText: '#212122',
      iconFilter: 'none'
    },
    {
      id: 'ink',
      label: 'Black',
      bar: '#000000', barHover: '#272727', barText: '#ffffff', barBorder: '#000000',
      activityHover: '#000000', activityText: '#ffffff',
      cardBg: '#f3f3f3', cardBorder: '#000000', cardText: '#212122',
      iconFilter: 'none'
    },
    {
      id: 'magenta',
      label: 'Magenta',
      bar: '#ff0084', barHover: '#d9006f', barText: '#ffffff', barBorder: '#ff0084',
      activityHover: '#ffd6eb', activityText: '#4a0020',
      cardBg: '#fff0f8', cardBorder: '#ff0084', cardText: '#4a0020',
      iconFilter: 'none'
    }
  ];

  function applyTheme(theme) {
    var root = document.documentElement;
    root.style.setProperty('--ui-bar', theme.bar);
    root.style.setProperty('--ui-bar-hover', theme.barHover);
    root.style.setProperty('--ui-bar-text', theme.barText);
    root.style.setProperty('--ui-bar-border', theme.barBorder);
    root.style.setProperty('--ui-activity-hover', theme.activityHover);
    root.style.setProperty('--ui-activity-text', theme.activityText);
    root.style.setProperty('--ui-card-bg', theme.cardBg);
    root.style.setProperty('--ui-card-border', theme.cardBorder);
    root.style.setProperty('--ui-card-text', theme.cardText);
    root.style.setProperty('--ui-bar-icon-filter', theme.iconFilter || 'none');
    root.setAttribute('data-ui-bar-theme', theme.id);
    // ~5% grey-text load: keep card/activity ink on #ACACAC across theme cycles.
    if (root.classList.contains('pretext-font-acacac')) {
      root.style.setProperty('--ui-activity-text', '#acacac');
      root.style.setProperty('--ui-card-text', '#acacac');
    }
  }

  var THEME_STORAGE_KEY = 'pretext.uiBarTheme';
  var MAGENTA_DISCOVERED_KEY = 'pretext.magentaDiscovered';

  function hasMagentaDiscovered() {
    try {
      return window.localStorage.getItem(MAGENTA_DISCOVERED_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function availableThemes() {
    if (hasMagentaDiscovered()) return UI_BAR_THEMES;
    return UI_BAR_THEMES.filter(function (theme) {
      return theme.id !== 'magenta';
    });
  }

  function hasThemeId(id) {
    var themes = availableThemes();
    for (var i = 0; i < themes.length; i++) {
      if (themes[i].id === id) return true;
    }
    return false;
  }

  function saveTheme(id) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch (e) {}
  }

  function loadSavedThemeId() {
    try {
      var saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && hasThemeId(saved)) return saved;
    } catch (e) {}
    return null;
  }

  function themeById(id) {
    for (var i = 0; i < UI_BAR_THEMES.length; i++) {
      if (UI_BAR_THEMES[i].id === id) return UI_BAR_THEMES[i];
    }
    return UI_BAR_THEMES[0];
  }

  function currentIndex() {
    var id = document.documentElement.getAttribute('data-ui-bar-theme') || 'slate';
    var themes = availableThemes();
    for (var i = 0; i < themes.length; i++) {
      if (themes[i].id === id) return i;
    }
    return 0;
  }

  function cycleTheme(dir) {
    var themes = availableThemes();
    var next = (currentIndex() + (dir || 1) + themes.length) % themes.length;
    var theme = themes[next];
    applyTheme(theme);
    saveTheme(theme.id);
  }

  window.UI_BAR_THEMES = UI_BAR_THEMES;
  window.applyUiBarTheme = function (id) {
    if (id === 'magenta' && !hasMagentaDiscovered()) id = 'slate';
    var theme = themeById(id);
    applyTheme(theme);
    saveTheme(theme.id);
  };
  window.cycleUiBarTheme = cycleTheme;
  window.pretextHasMagentaDiscovered = hasMagentaDiscovered;

  // Restore the last palette the user left it on (persisted in localStorage);
  // fall back to grey when nothing valid is saved. Magenta stays locked until
  // the 1% hot-pink typography roll has been discovered once.
  applyTheme(themeById(loadSavedThemeId() || 'slate'));

  __pretextOnReady(function () {
    var banner = document.querySelector('.nav-input-container.top-banner')
      || document.querySelector('.gui-nav-container .div-block-238');
    if (banner) {
      banner.style.cursor = 'pointer';
      banner.title = 'Click to cycle bar / activity color sets';
      banner.addEventListener('click', function (e) {
        e.preventDefault();
        cycleTheme(1);
      });
    }
  });
})();


  /* ---- recent-activity.js ---- */
__pretextOnReady(function () {
  var triggers = document.querySelectorAll('.update-indiv');
  var allCards = document.querySelectorAll('.recent-cards');
  if (!triggers.length || !allCards.length) return;

  function isPretextRpgEnabled() {
    // Activity XP panel off (battle system removed).
    return false;
  }

  var OFFSET_X = 16, OFFSET_Y = 16;
  var EDGE_MARGIN = 16;
  var PIN_MIN_GAP = 32;
  var PIN_PLACE_TRIES = 48;
  // .nav-header is 100000000; sand paint host is 100000002. Cards must sit above
  // paint so pinned cards stay clickable in brush mode.
  var CARD_ABOVE_HEADER_Z = '100000003';

  // Activity panel experiment — click log + xpSystem integration.
  var ACTIVITY_STATE_KEY = 'pretext.activityState';
  var ACTIVITY_COLLAPSED_KEY = 'pretext.activityPanelCollapsed';
  var ACTIVITY_POS_KEY = 'pretext.activityPanelPos';
  var LEGACY_HISTORY_KEY = 'pretext.recentActivityHistory';
  var HISTORY_MAX = 20;
  var ACTIVITY_XP_AMOUNT = 10;
  var ACTIVITY_PANEL_GAP = 4;
  var historyPanel = null;
  var historyListEl = null;
  var xpFillEl = null;
  var xpLabelEl = null;
  var levelEl = null;
  var levelBadgeTickerBound = false;
  var activityPositionBound = false;
  var activityDragBound = false;
  var activityCustomPos = null;
  var activityDragging = false;
  var positionPanelRaf = 0;
  var lastPositionedPanelWidth = -1;
  var lastPositionedPanelTop = -1;
  var lastPositionedPanelRight = -1;
  var lastNavAnchorWidth = -1;
  var lastNavAnchorBottom = -1;
  var navResizeDebounce = 0;
  var levelTickerRaf = 0;
  var positioningPanel = false;
  var updatingLevelTicker = false;
  var suppressBadgeResize = false;
  var lastObservedBadgeWidth = -1;
  var TICKER_ON_PAD_PX = 4;
  var TICKER_OFF_PAD_PX = 1;

  function getXpSystem() {
    return window.xpSystem || null;
  }

  function activityClickKey(id) {
    return 'activity-' + id;
  }

  (function injectHistoryStyles() {
    if (!isPretextRpgEnabled()) return;
    var s = document.createElement('style');
    s.id = 'pretext-reading-history-style';
    s.textContent =
      '#pretext-reading-history {' +
        'position:fixed;top:0;right:4px;left:auto;bottom:auto;z-index:' + CARD_ABOVE_HEADER_Z + ';' +
        'width:min(320px,34vw);min-width:160px;max-height:min(360px,calc(100vh - 24px));' +
        'overflow-y:auto;padding:4px;' +
        'scrollbar-width:none;-ms-overflow-style:none;' +
        'background:var(--ui-card-bg,#c7f3c6);border:1px dotted var(--ui-card-border,#01a451);' +
        'color:var(--ui-card-text,#05140e);pointer-events:auto;box-shadow:none;' +
        'font-family:AH_silHOuette VARIABLE,Arial,sans-serif;contain:layout style;' +
      '}' +
      '#pretext-reading-history::-webkit-scrollbar{display:none;width:0;height:0;}' +
      '#pretext-reading-history[hidden]{display:none!important;}' +
      '#pretext-reading-history[data-collapsed="true"]{max-height:none;overflow:visible;}' +
      '#pretext-reading-history[data-collapsed="true"] .prh-body{display:none;}' +
      '#pretext-reading-history .prh-card{display:flex;flex-direction:column;gap:4px;}' +
      '#pretext-reading-history .prh-tessa{display:flex;align-items:stretch;justify-content:space-between;' +
        'width:100%;background:var(--ui-bar,#888);padding:3px 0 2px 4px;' +
        'cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;}' +
      '#pretext-reading-history[data-dragging="true"] .prh-tessa{cursor:grabbing;}' +
      '#pretext-reading-history .prh-tessa button,' +
      '#pretext-reading-history .prh-tessa .prh-inv-btn{cursor:pointer;touch-action:manipulation;}' +
      '#pretext-reading-history .prh-head-title{color:var(--ui-bar-text,#fff);flex:0 0 auto;' +
        'font-variation-settings:"wght" 94,"MONO" 100,"SANS" 0;font-size:13px;line-height:126%;margin:0;' +
        'pointer-events:none;}' +
      '#pretext-reading-history .prh-head-meta{display:flex;align-items:center;gap:4px;padding-right:2px;' +
        'flex:1 1 auto;min-width:0;justify-content:flex-end;}' +
      '#pretext-reading-history .prh-toggle{flex:0 0 auto;width:20px;height:18px;margin:0;padding:0;' +
        'border:1px dotted var(--ui-bar-text,#fff);background:transparent;color:var(--ui-bar-text,#fff);' +
        'font-family:inherit;font-variation-settings:"wght" 94,"MONO" 100,"SANS" 0;font-size:13px;line-height:1;' +
        'cursor:pointer;}' +
      '#pretext-reading-history .prh-toggle:hover{' +
        'background:color-mix(in srgb,var(--ui-bar-hover,#666) 35%,transparent);}' +
      '#pretext-reading-history .prh-level{display:flex;align-items:stretch;margin:0;min-width:0;flex:1 1 auto;' +
        'font-variation-settings:"wght" 94,"MONO" 100,"SANS" 0;font-size:13px;line-height:126%;}' +
      '#pretext-reading-history .prh-level-label{display:flex;align-items:center;flex:0 0 auto;' +
        'padding:1px 4px 1px 0;color:var(--ui-bar-text,#fff);}' +
      '#pretext-reading-history .prh-level-badge{display:flex;align-items:center;flex:1 1 auto;min-width:0;' +
        'padding:1px 0 1px 6px;background:color-mix(in srgb,var(--ui-bar-text,#fff) 38%,var(--ui-bar,#888));' +
        'color:var(--ui-bar-text,#fff);overflow:hidden;}' +
      '#pretext-reading-history .prh-level-badge-viewport{flex:1 1 auto;min-width:0;overflow:hidden;display:block;}' +
      '#pretext-reading-history .prh-level-badge-track{display:inline-flex;align-items:center;white-space:nowrap;' +
        'gap:var(--prh-ticker-gap,24px);will-change:transform;}' +
      '#pretext-reading-history .prh-level-badge-text{display:inline-block;white-space:nowrap;padding-right:6px;}' +
      '#pretext-reading-history .prh-level-badge[data-ticker="true"] .prh-level-badge-track{' +
        'animation:prh-level-ticker linear infinite;animation-duration:var(--prh-ticker-duration,10s);}' +
      '#pretext-reading-history .prh-level-badge[data-ticker="true"]:hover .prh-level-badge-track{' +
        'animation-play-state:paused;}' +
      '@keyframes prh-level-ticker{' +
        '0%{transform:translateX(0);}100%{transform:translateX(calc(-1 * var(--prh-ticker-distance,0px)));}}' +
      '#pretext-reading-history .prh-body{padding:0 2px 2px;}' +
      '#pretext-reading-history .prh-xp{margin-bottom:6px;}' +
      '#pretext-reading-history .prh-xp-track{height:6px;border:1px dotted var(--ui-card-border,#01a451);' +
        'background:color-mix(in srgb,var(--ui-card-bg,#c7f3c6) 65%,#fff);overflow:hidden;}' +
      '#pretext-reading-history .prh-xp-fill{height:100%;width:0;transition:width 180ms ease;}' +
      '#pretext-reading-history .prh-xp-label{margin-top:3px;font-size:11px;line-height:126%;' +
        'color:var(--ui-card-text,#05140e);opacity:0.85;' +
        'font-variation-settings:"wght" 94,"MONO" 100,"SANS" 0;}' +
      '#pretext-reading-history .prh-list{margin:0;padding:0;list-style:none;}' +
      '#pretext-reading-history .prh-item{margin-top:4px;}' +
      '#pretext-reading-history .prh-item-bar{display:flex;align-items:center;justify-content:space-between;' +
        'gap:8px;background:var(--ui-bar,#888);padding:2px 4px;}' +
      '#pretext-reading-history .prh-item-title{color:var(--ui-bar-text,#fff);font-size:12px;' +
        'font-variation-settings:"wght" 94,"MONO" 100,"SANS" 0;line-height:126%;' +
        'flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:0;}' +
      '#pretext-reading-history .prh-item-date{color:var(--ui-bar-text,#fff);font-size:11px;' +
        'font-variation-settings:"wght" 94,"MONO" 100,"SANS" 0;line-height:126%;' +
        'white-space:nowrap;padding-right:4px;margin:0;}' +
      '#pretext-reading-history .prh-item-when{display:block;margin-top:2px;padding-left:4px;' +
        'font-variation-settings:"wght" 111,"MONO" 100,"SANS" 0;font-size:11px;line-height:130%;' +
        'color:var(--ui-card-text,#05140e);opacity:0.8;}';
    document.head.appendChild(s);
  })();

  function createHistoryPanel() {
    if (historyPanel) return;
    historyPanel = document.createElement('aside');
    historyPanel.id = 'pretext-reading-history';
    historyPanel.setAttribute('aria-label', 'Activity');
    historyPanel.hidden = true;
    historyPanel.innerHTML =
      '<div class="prh-card">' +
        '<div class="prh-tessa">' +
          '<div class="caption-text-a prh-head-title">Activity</div>' +
          '<div class="prh-head-meta">' +
            '<div class="caption-text-a mono prh-level">' +
              '<span class="prh-level-label">Lv</span>' +
              '<span class="prh-level-badge">' +
                '<span class="prh-level-badge-viewport">' +
                  '<span class="prh-level-badge-track">' +
                    '<span class="prh-level-badge-text">1 · Wanderer A</span>' +
                  '</span>' +
                '</span>' +
              '</span>' +
            '</div>' +
            '<button type="button" class="prh-toggle" aria-expanded="true" title="Minimize Activity">−</button>' +
          '</div>' +
        '</div>' +
        '<div class="prh-body">' +
          '<div class="prh-xp">' +
            '<div class="prh-xp-track"><div class="prh-xp-fill"></div></div>' +
            '<div class="caption-text-a mono prh-xp-label">0/20 XP</div>' +
          '</div>' +
          '<ol class="prh-list"></ol>' +
        '</div>' +
      '</div>';
    historyListEl = historyPanel.querySelector('.prh-list');
    xpFillEl = historyPanel.querySelector('.prh-xp-fill');
    xpLabelEl = historyPanel.querySelector('.prh-xp-label');
    levelEl = historyPanel.querySelector('.prh-level-badge');
    bindLevelBadgeTicker();
    var toggleBtn = historyPanel.querySelector('.prh-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleActivityCollapsed();
      });
    }
    setActivityCollapsed(loadActivityCollapsed());
    activityCustomPos = loadActivityPanelPos();
    bindActivityPanelPosition();
    bindActivityPanelDrag();
    document.body.appendChild(historyPanel);
    positionActivityPanel();
  }

  function getNavAnchor() {
    return document.querySelector('.gui-nav-container');
  }

  function loadActivityPanelPos() {
    try {
      var raw = window.localStorage.getItem(ACTIVITY_POS_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      var left = Number(parsed.left);
      var top = Number(parsed.top);
      if (!isFinite(left) || !isFinite(top)) return null;
      return { left: left, top: top };
    } catch (e) {
      return null;
    }
  }

  function saveActivityPanelPos(pos) {
    try {
      if (!pos) {
        window.localStorage.removeItem(ACTIVITY_POS_KEY);
        return;
      }
      window.localStorage.setItem(
        ACTIVITY_POS_KEY,
        JSON.stringify({ left: Math.round(pos.left), top: Math.round(pos.top) })
      );
    } catch (e) {}
  }

  function clearActivityPanelPos() {
    activityCustomPos = null;
    saveActivityPanelPos(null);
    lastPositionedPanelTop = -1;
    lastPositionedPanelRight = -1;
    lastPositionedPanelWidth = -1;
    if (historyPanel) {
      historyPanel.style.left = '';
      historyPanel.removeAttribute('data-dragged');
    }
    positionActivityPanel();
  }

  function clampActivityPanelPos(left, top) {
    if (!historyPanel) return { left: left, top: top };
    var margin = 4;
    var w = historyPanel.offsetWidth || 200;
    var h = historyPanel.offsetHeight || 80;
    var maxLeft = Math.max(margin, window.innerWidth - w - margin);
    var maxTop = Math.max(margin, window.innerHeight - h - margin);
    return {
      left: Math.min(maxLeft, Math.max(margin, Math.round(left))),
      top: Math.min(maxTop, Math.max(margin, Math.round(top))),
    };
  }

  function applyActivityCustomPos(pos) {
    if (!historyPanel || !pos) return;
    var clamped = clampActivityPanelPos(pos.left, pos.top);
    activityCustomPos = clamped;
    historyPanel.style.left = clamped.left + 'px';
    historyPanel.style.top = clamped.top + 'px';
    historyPanel.style.right = 'auto';
    historyPanel.setAttribute('data-dragged', 'true');
    lastPositionedPanelTop = clamped.top;
    lastPositionedPanelRight = -1;
  }

  function syncActivityPanelWidthFromNav() {
    if (!historyPanel) return;
    var nav = getNavAnchor();
    if (!nav) {
      if (lastPositionedPanelWidth !== -1) return;
      historyPanel.style.width = 'min(320px, 34vw)';
      lastPositionedPanelWidth = -1;
      lastObservedBadgeWidth = -1;
      scheduleLevelBadgeTicker(levelEl);
      return;
    }
    var panelWidth = Math.round(nav.getBoundingClientRect().width);
    if (panelWidth === lastPositionedPanelWidth) return;
    historyPanel.style.width = panelWidth + 'px';
    lastPositionedPanelWidth = panelWidth;
    lastObservedBadgeWidth = -1;
    scheduleLevelBadgeTicker(levelEl);
  }

  function scheduleLevelBadgeTicker(badge) {
    if (!badge) return;
    if (levelTickerRaf) return;
    levelTickerRaf = requestAnimationFrame(function () {
      levelTickerRaf = 0;
      updateLevelBadgeTicker(badge);
    });
  }

  function positionActivityPanelNow() {
    if (!historyPanel || historyPanel.hidden || positioningPanel || activityDragging) return;
    positioningPanel = true;
    try {
      if (activityCustomPos) {
        applyActivityCustomPos(activityCustomPos);
        syncActivityPanelWidthFromNav();
        return;
      }
      var nav = getNavAnchor();
      if (!nav) {
        var fallbackTop = 4;
        var fallbackRight = 4;
        if (
          fallbackTop === lastPositionedPanelTop &&
          fallbackRight === lastPositionedPanelRight
        ) {
          return;
        }
        historyPanel.style.left = '';
        historyPanel.style.top = fallbackTop + 'px';
        historyPanel.style.right = fallbackRight + 'px';
        historyPanel.style.width = 'min(320px, 34vw)';
        historyPanel.removeAttribute('data-dragged');
        lastPositionedPanelTop = fallbackTop;
        lastPositionedPanelRight = fallbackRight;
        lastPositionedPanelWidth = -1;
        lastObservedBadgeWidth = -1;
        scheduleLevelBadgeTicker(levelEl);
        return;
      }
      var rect = nav.getBoundingClientRect();
      var top = Math.round(rect.bottom + ACTIVITY_PANEL_GAP);
      var right = Math.max(4, Math.round(window.innerWidth - rect.right));
      var panelWidth = Math.round(rect.width);
      if (
        top === lastPositionedPanelTop &&
        right === lastPositionedPanelRight &&
        panelWidth === lastPositionedPanelWidth
      ) {
        return;
      }
      historyPanel.style.left = '';
      historyPanel.style.right = right + 'px';
      historyPanel.style.top = top + 'px';
      historyPanel.style.width = panelWidth + 'px';
      historyPanel.removeAttribute('data-dragged');
      lastPositionedPanelTop = top;
      lastPositionedPanelRight = right;
      if (panelWidth !== lastPositionedPanelWidth) {
        lastPositionedPanelWidth = panelWidth;
        lastObservedBadgeWidth = -1;
        scheduleLevelBadgeTicker(levelEl);
      }
    } finally {
      positioningPanel = false;
    }
  }

  function positionActivityPanel() {
    if (positionPanelRaf) return;
    positionPanelRaf = requestAnimationFrame(function () {
      positionPanelRaf = 0;
      positionActivityPanelNow();
    });
  }

  function bindActivityPanelPosition() {
    if (activityPositionBound) return;
    activityPositionBound = true;
    window.addEventListener('resize', function () {
      lastNavAnchorWidth = -1;
      lastNavAnchorBottom = -1;
      lastPositionedPanelTop = -1;
      lastPositionedPanelRight = -1;
      lastPositionedPanelWidth = -1;
      if (activityCustomPos) {
        applyActivityCustomPos(activityCustomPos);
        saveActivityPanelPos(activityCustomPos);
      }
      positionActivityPanel();
    });
    var nav = getNavAnchor();
    if (nav && typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function (entries) {
        var entry = entries[0];
        if (!entry) return;
        var w = Math.round(entry.contentRect.width);
        var bottom = Math.round(entry.target.getBoundingClientRect().bottom);
        if (w === lastNavAnchorWidth && bottom === lastNavAnchorBottom) return;
        lastNavAnchorWidth = w;
        lastNavAnchorBottom = bottom;
        if (navResizeDebounce) clearTimeout(navResizeDebounce);
        navResizeDebounce = setTimeout(function () {
          navResizeDebounce = 0;
          positionActivityPanel();
        }, 48);
      });
      ro.observe(nav);
    }
    nav && nav.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('.w-dropdown-toggle, .w-dropdown-link')) {
        setTimeout(positionActivityPanel, 0);
        setTimeout(positionActivityPanel, 160);
      }
    }, true);
  }

  function isActivityDragHandleTarget(target) {
    if (!target || !target.closest) return false;
    if (target.closest('button, a, input, select, textarea, .prh-inv-btn, .prh-toggle')) return false;
    return !!target.closest('.prh-tessa');
  }

  function bindActivityPanelDrag() {
    if (activityDragBound || !historyPanel) return;
    activityDragBound = true;
    var dragPointerId = null;
    var dragOffsetX = 0;
    var dragOffsetY = 0;

    historyPanel.addEventListener('pointerdown', function (e) {
      if (e.button != null && e.button !== 0) return;
      if (!isActivityDragHandleTarget(e.target)) return;
      var rect = historyPanel.getBoundingClientRect();
      activityDragging = true;
      dragPointerId = e.pointerId;
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      historyPanel.setAttribute('data-dragging', 'true');
      historyPanel.style.left = Math.round(rect.left) + 'px';
      historyPanel.style.top = Math.round(rect.top) + 'px';
      historyPanel.style.right = 'auto';
      try {
        historyPanel.setPointerCapture(e.pointerId);
      } catch (err) {}
      e.preventDefault();
    });

    historyPanel.addEventListener('pointermove', function (e) {
      if (!activityDragging || dragPointerId !== e.pointerId) return;
      var next = clampActivityPanelPos(e.clientX - dragOffsetX, e.clientY - dragOffsetY);
      historyPanel.style.left = next.left + 'px';
      historyPanel.style.top = next.top + 'px';
      historyPanel.style.right = 'auto';
    });

    function endDrag(e) {
      if (!activityDragging) return;
      if (e && dragPointerId != null && e.pointerId !== dragPointerId) return;
      activityDragging = false;
      dragPointerId = null;
      historyPanel.removeAttribute('data-dragging');
      var rect = historyPanel.getBoundingClientRect();
      var pos = clampActivityPanelPos(rect.left, rect.top);
      activityCustomPos = pos;
      applyActivityCustomPos(pos);
      saveActivityPanelPos(pos);
      try {
        if (e) historyPanel.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    historyPanel.addEventListener('pointerup', endDrag);
    historyPanel.addEventListener('pointercancel', endDrag);

    var head = historyPanel.querySelector('.prh-tessa');
    if (head) {
      head.title = 'Drag to move · double-click to reset';
      head.addEventListener('dblclick', function (e) {
        if (!isActivityDragHandleTarget(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        clearActivityPanelPos();
      });
    }
  }

  function loadActivityCollapsed() {
    try {
      return window.localStorage.getItem(ACTIVITY_COLLAPSED_KEY) === '1';
    } catch (e) { return false; }
  }

  function saveActivityCollapsed(collapsed) {
    try {
      window.localStorage.setItem(ACTIVITY_COLLAPSED_KEY, collapsed ? '1' : '0');
    } catch (e) {}
  }

  function setActivityCollapsed(collapsed) {
    createHistoryPanel();
    historyPanel.setAttribute('data-collapsed', collapsed ? 'true' : 'false');
    var btn = historyPanel.querySelector('.prh-toggle');
    if (btn) {
      btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      btn.textContent = collapsed ? '+' : '−';
      btn.title = collapsed ? 'Expand Activity' : 'Minimize Activity';
    }
    saveActivityCollapsed(collapsed);
    positionActivityPanel();
  }

  function toggleActivityCollapsed() {
    if (!historyPanel) return;
    setActivityCollapsed(historyPanel.getAttribute('data-collapsed') === 'true' ? false : true);
  }

  function showHistoryPanel() {
    createHistoryPanel();
    historyPanel.hidden = false;
    positionActivityPanel();
  }

  function emptyActivityState() {
    return { history: [] };
  }

  function syncSeenIdsToXpSystem(seenIds) {
    var xp = getXpSystem();
    if (!xp || !seenIds || !seenIds.length) return;
    var changed = false;
    seenIds.forEach(function (id) {
      var key = activityClickKey(id);
      if (!xp.clickedItems.has(key)) {
        xp.clickedItems.add(key);
        changed = true;
      }
    });
    if (changed && typeof xp.saveProgress === 'function') xp.saveProgress();
  }

  function normalizeActivityState(raw) {
    var state = emptyActivityState();
    if (!raw) return state;
    if (Array.isArray(raw)) {
      state.history = raw.slice();
      return state;
    }
    if (typeof raw !== 'object') return state;
    state.history = Array.isArray(raw.history) ? raw.history.slice() : [];
    if (Array.isArray(raw.seenIds) && raw.seenIds.length) syncSeenIdsToXpSystem(raw.seenIds);
    return state;
  }

  function loadActivityState() {
    try {
      var raw = window.localStorage.getItem(ACTIVITY_STATE_KEY);
      if (raw) return normalizeActivityState(JSON.parse(raw));
      var legacy = window.localStorage.getItem(LEGACY_HISTORY_KEY);
      if (legacy) {
        var parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) {
          var migrated = normalizeActivityState({ history: parsed });
          saveActivityState(migrated);
          window.localStorage.removeItem(LEGACY_HISTORY_KEY);
          return migrated;
        }
      }
    } catch (e) {}
    return emptyActivityState();
  }

  function saveActivityState(state) {
    try {
      window.localStorage.setItem(ACTIVITY_STATE_KEY, JSON.stringify({ history: state.history }));
    } catch (e) {}
  }

  function awardActivityXp(activityId, triggerEl) {
    if (!isPretextRpgEnabled()) return false;
    var xp = getXpSystem();
    if (!xp) return false;
    var key = activityClickKey(activityId);
    if (xp.clickedItems.has(key)) return false;
    xp.clickedItems.add(key);
    if (triggerEl && typeof xp.showXPGain === 'function') xp.showXPGain(triggerEl, ACTIVITY_XP_AMOUNT);
    xp.addXP(ACTIVITY_XP_AMOUNT);
    return true;
  }

  function hasActivityPanelProgress() {
    var xp = getXpSystem();
    if (!xp) return false;
    if (xp.player.xp > 0 || xp.player.level > 1) return true;
    var found = false;
    xp.clickedItems.forEach(function (key) {
      if (String(key).indexOf('activity-') === 0) found = true;
    });
    return found;
  }

  function formatClickedAt(iso) {
    try {
      var d = new Date(iso);
      return d.toLocaleString(undefined, {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      });
    } catch (e) { return iso; }
  }

  function ensureLevelBadgeStructure(badge, text) {
    if (!badge) return null;
    var viewport = badge.querySelector('.prh-level-badge-viewport');
    if (viewport) {
      var existing = badge.querySelector('.prh-level-badge-text:not(.prh-level-badge-dup)');
      if (existing && text != null) existing.textContent = text;
      return existing;
    }
    var content = text != null ? text : (badge.textContent || '').replace(/\s+/g, ' ').trim();
    badge.textContent = '';
    viewport = document.createElement('span');
    viewport.className = 'prh-level-badge-viewport';
    var track = document.createElement('span');
    track.className = 'prh-level-badge-track';
    var textEl = document.createElement('span');
    textEl.className = 'prh-level-badge-text';
    textEl.textContent = content;
    track.appendChild(textEl);
    viewport.appendChild(track);
    badge.appendChild(viewport);
    return textEl;
  }

  function updateLevelBadgeTicker(badge) {
    if (!badge || updatingLevelTicker) return;
    updatingLevelTicker = true;
    suppressBadgeResize = true;
    try {
    var viewport = badge.querySelector('.prh-level-badge-viewport');
    var track = badge.querySelector('.prh-level-badge-track');
    var textEl = badge.querySelector('.prh-level-badge-text:not(.prh-level-badge-dup)');
    if (!viewport || !track || !textEl) return;

    var gap = 24;
    var textWidth = textEl.scrollWidth;
    var viewWidth = viewport.clientWidth;
    var hadTicker = badge.getAttribute('data-ticker') === 'true';
    var overflow = textWidth - viewWidth;
    var needsTicker = viewWidth > 0 && (
      hadTicker ? overflow > TICKER_OFF_PAD_PX : overflow > TICKER_ON_PAD_PX
    );

    if (!needsTicker) {
      if (!hadTicker) return;
      badge.removeAttribute('data-ticker');
      track.style.removeProperty('--prh-ticker-distance');
      track.style.removeProperty('--prh-ticker-gap');
      track.style.removeProperty('--prh-ticker-duration');
      var staleDup = track.querySelector('.prh-level-badge-dup');
      if (staleDup) staleDup.remove();
      return;
    }

    var distance = textWidth + gap;
    var distancePx = distance + 'px';
    var duration = Math.max(8, distance / 22) + 's';
    if (hadTicker) {
      var prevDistance = track.style.getPropertyValue('--prh-ticker-distance');
      var prevDuration = track.style.getPropertyValue('--prh-ticker-duration');
      if (prevDistance === distancePx && prevDuration === duration && track.querySelector('.prh-level-badge-dup')) {
        return;
      }
    }

    badge.removeAttribute('data-ticker');
    track.style.removeProperty('--prh-ticker-distance');
    track.style.removeProperty('--prh-ticker-gap');
    track.style.removeProperty('--prh-ticker-duration');
    var dup = track.querySelector('.prh-level-badge-dup');
    if (dup) dup.remove();

    var dupEl = textEl.cloneNode(true);
    dupEl.className = 'prh-level-badge-text prh-level-badge-dup';
    dupEl.setAttribute('aria-hidden', 'true');
    track.appendChild(dupEl);

    track.style.setProperty('--prh-ticker-distance', distancePx);
    track.style.setProperty('--prh-ticker-gap', gap + 'px');
    track.style.setProperty('--prh-ticker-duration', duration);
    badge.setAttribute('data-ticker', 'true');
    } finally {
      updatingLevelTicker = false;
      requestAnimationFrame(function () {
        suppressBadgeResize = false;
      });
    }
  }

  function setLevelBadgeText(text) {
    if (!levelEl) return;
    lastObservedBadgeWidth = -1;
    ensureLevelBadgeStructure(levelEl, text);
    scheduleLevelBadgeTicker(levelEl);
  }

  function bindLevelBadgeTicker() {
    if (!levelEl || levelBadgeTickerBound) return;
    levelBadgeTickerBound = true;
    var mo = new MutationObserver(function () {
      if (!levelEl.querySelector('.prh-level-badge-viewport')) {
        var text = (levelEl.textContent || '').replace(/\s+/g, ' ').trim();
        ensureLevelBadgeStructure(levelEl, text);
        scheduleLevelBadgeTicker(levelEl);
      }
    });
    mo.observe(levelEl, { childList: true, characterData: true, subtree: true });
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function (entries) {
        if (suppressBadgeResize || updatingLevelTicker) return;
        var entry = entries[0];
        if (!entry) return;
        var w = Math.round(entry.contentRect.width);
        if (w <= 0 || w === lastObservedBadgeWidth) return;
        lastObservedBadgeWidth = w;
        scheduleLevelBadgeTicker(levelEl);
      });
      ro.observe(levelEl);
    }
  }

  window.pretextSetLevelBadgeText = setLevelBadgeText;

  function renderXpFromSystem() {
    if (!isPretextRpgEnabled()) return;
    createHistoryPanel();
    if (!xpFillEl || !xpLabelEl || !levelEl) return;
    var xp = getXpSystem();
    if (!xp) {
      xpFillEl.style.width = '0%';
      xpFillEl.style.background = '#0095ff';
      xpLabelEl.textContent = '0/20 XP';
      setLevelBadgeText('1 · Wanderer A');
      levelEl.style.color = '';
      return;
    }
    var p = xp.player;
    var classData = xp.classes[p.class] || { color: '#0095ff' };
    var pct = p.xpNeeded ? (p.xp / p.xpNeeded) * 100 : 0;
    xpFillEl.style.width = Math.min(100, Math.max(0, pct)) + '%';
    xpFillEl.style.background = classData.color;
    xpLabelEl.textContent = Math.floor(p.xp) + '/' + p.xpNeeded + ' XP';
    setLevelBadgeText(p.level + ' · ' + p.class + ' ' + p.sublevel);
    levelEl.style.color = '';
  }

  window.pretextRenderActivityXp = renderXpFromSystem;

  function renderHistoryList(entries) {
    createHistoryPanel();
    if (!historyListEl) return;
    historyListEl.innerHTML = '';
    entries.forEach(function (entry) {
      var li = document.createElement('li');
      li.className = 'prh-item';
      var bar = document.createElement('div');
      bar.className = 'prh-item-bar';
      var title = document.createElement('div');
      title.className = 'caption-text-a prh-item-title';
      title.textContent = entry.title;
      var date = document.createElement('div');
      date.className = 'caption-text-a mono prh-item-date';
      date.textContent = entry.date || '';
      bar.appendChild(title);
      bar.appendChild(date);
      li.appendChild(bar);
      var when = entry.clickedAt ? formatClickedAt(entry.clickedAt) : '';
      if (when) {
        var whenEl = document.createElement('span');
        whenEl.className = 't-body-1 prh-item-when';
        whenEl.textContent = 'Opened ' + when;
        li.appendChild(whenEl);
      }
      historyListEl.appendChild(li);
    });
  }

  function renderActivityPanel(state) {
    if (!isPretextRpgEnabled()) {
      if (historyPanel) historyPanel.hidden = true;
      return;
    }
    createHistoryPanel();
    var hasContent = state.history.length > 0 || hasActivityPanelProgress();
    if (!hasContent) {
      historyPanel.hidden = true;
      return;
    }
    showHistoryPanel();
    renderXpFromSystem();
    renderHistoryList(state.history);
    positionActivityPanel();
  }

  function readText(el) {
    if (!el) return '';
    return (el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function getActivityCard(trigger, index) {
    return trigger.querySelector('.recent-cards') || allCards[index] || null;
  }

  function activityIdFromTitle(title, index) {
    var slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    return slug || ('item-' + index);
  }

  function activityIdFromMeta(trigger, title, index) {
    var slug = trigger.getAttribute('data-activity-id');
    if (slug) return slug;
    return activityIdFromTitle(title, index);
  }

  function readActivityMeta(trigger, index) {
    var card = getActivityCard(trigger, index);
    var title = '';
    var date = '';

    if (card) {
      var tessa = card.querySelector('.tessa.bbnb');
      if (tessa) {
        title = readText(tessa.querySelector('.caption-text-a:not(.mono)'));
        date = readText(tessa.querySelector('.case-peaks .caption-text-a, .input-container.case-peaks .caption-text-a'));
      }
      if (!title) {
        title = readText(card.querySelector('.peak-container .caption-text-a:not(.mono)'));
      }
      if (!date) {
        date = readText(card.querySelector('.case-peaks .caption-text-a, .input-container.case-peaks .caption-text-a'));
      }
    }

    if (!title) {
      title = readText(
        trigger.querySelector('.update-name .un-ghost') ||
        trigger.querySelector('.update-name .un-ticker') ||
        trigger.querySelector('.update-name .t-body-1') ||
        trigger.querySelector('.update-name')
      );
    }

    if (!date) {
      date = readText(
        trigger.querySelector('.update-date .t-body-1') ||
        trigger.querySelector('.update-date')
      );
    }

    if (!title) title = 'Item ' + (index + 1);

    return {
      id: activityIdFromMeta(trigger, title, index),
      title: title,
      date: date
    };
  }

  function recordActivityPin(trigger, index) {
    if (!isPretextRpgEnabled()) return;
    var meta = readActivityMeta(trigger, index);
    var state = loadActivityState();
    awardActivityXp(meta.id, trigger);
    state.history = state.history.filter(function (e) { return e.id !== meta.id; });
    state.history.unshift({
      id: meta.id,
      title: meta.title,
      date: meta.date,
      clickedAt: new Date().toISOString()
    });
    if (state.history.length > HISTORY_MAX) state.history.length = HISTORY_MAX;
    saveActivityState(state);
    renderActivityPanel(state);
  }

  if (isPretextRpgEnabled()) renderActivityPanel(loadActivityState());

  var PRETEXT_SFX_VOLUME = window.__pretextSfxVolume != null ? window.__pretextSfxVolume : 0.135;
  var applySfxVolume = window.__pretextApplySfxVolume || function (el) {
    el.volume = PRETEXT_SFX_VOLUME;
  };
  var ACTIVITY_HOVER_SOUND_ENABLED = true;
  var hoverSoundUrls = [
    'https://raw.githubusercontent.com/adamho91/adamho91/main/MenuToggleB_01.wav',
    'https://raw.githubusercontent.com/adamho91/adamho91/main/MenuToggleB_02.wav',
    'https://raw.githubusercontent.com/adamho91/adamho91/main/MenuToggleB_03.wav',
    'https://raw.githubusercontent.com/adamho91/adamho91/main/MenuToggleB_04.wav',
    'https://raw.githubusercontent.com/adamho91/adamho91/main/MenuToggleB_05.wav'
  ];
  var hoverSounds = [];
  var pinSoundUrl = 'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_04.wav';
  var levelUpSoundUrl = 'https://raw.githubusercontent.com/adamho91/adamho91/main/TextJiggleA_03.wav';
  var pinSoundBase = null;
  var levelUpSoundBase = null;
  var activityActivePlays = 0;
  var ACTIVITY_MAX_CONCURRENT = 1;
  var ACTIVITY_PENDING_CAP = 2;
  var HOVER_SOUND_GAP_MS = 80;
  var lastHoverSoundMs = 0;
  var lastHoverSoundTrigger = null;
  var activityPendingPlays = [];
  var hoverSoundPick = 0;

  function preloadActivityElement(url) {
    return new Promise(function (resolve) {
      var el = new Audio(url);
      el.preload = 'auto';
      applySfxVolume(el);
      var done = false;
      function finish() {
        if (done) return;
        done = true;
        resolve(el);
      }
      el.addEventListener('canplaythrough', finish, { once: true });
      el.addEventListener('loadeddata', finish, { once: true });
      setTimeout(finish, 1500);
      el.load();
    });
  }

  function flushActivityPendingPlays() {
    if (!activityPendingPlays.length) return;
    if (activityPendingPlays.length > ACTIVITY_PENDING_CAP) activityPendingPlays.length = 0;
    var fn = activityPendingPlays.shift();
    if (fn) fn();
  }

  function deferActivityPreload(task, tier) {
    var defer = tier === 2 ? window.__pretextAudioDefer : (window.__pretextAudioDeferTier1 || window.__pretextAudioDefer);
    if (defer) {
      defer(task);
      return;
    }
    task().catch(function () {});
  }

  if (ACTIVITY_HOVER_SOUND_ENABLED) {
    deferActivityPreload(function () {
      return Promise.all(hoverSoundUrls.map(function (url, i) {
        return preloadActivityElement(url).then(function (el) {
          hoverSounds[i] = el;
        });
      }));
    }, 1);
  }
  deferActivityPreload(function () {
    return preloadActivityElement(pinSoundUrl).then(function (el) {
      pinSoundBase = el;
      flushActivityPendingPlays();
    });
  }, 1);
  if (isPretextRpgEnabled()) {
    deferActivityPreload(function () {
      return preloadActivityElement(levelUpSoundUrl).then(function (el) {
        levelUpSoundBase = el;
      });
    }, 2);
  }

  function playActivityClone(base) {
    if (!base || activityActivePlays >= ACTIVITY_MAX_CONCURRENT) return false;
    activityActivePlays += 1;
    var src = base.currentSrc || base.src;
    var el = src ? new Audio(src) : base.cloneNode();
    applySfxVolume(el);
    el.preload = 'auto';
    try { el.currentTime = 0; } catch (e) {}
    var released = false;
    function release() {
      if (released) return;
      released = true;
      activityActivePlays = Math.max(0, activityActivePlays - 1);
      flushActivityPendingPlays();
    }
    el.addEventListener('ended', release, { once: true });
    if (typeof window.__pretextAudioResume === 'function') window.__pretextAudioResume();
    void el.play().catch(function (err) {
      if (err && err.name === 'NotAllowedError') {
        release();
        var retry = function () { playActivityClone(base); };
        if (window.__pretextAudioQueueRetry) window.__pretextAudioQueueRetry(retry);
        else if (activityPendingPlays.length < ACTIVITY_PENDING_CAP) activityPendingPlays.push(retry);
        return;
      }
      release();
    });
    return true;
  }

  function playRandomMenuToggleBNow() {
    var url = hoverSoundUrls[Math.floor(Math.random() * hoverSoundUrls.length)];
    var base = new Audio(url);
    applySfxVolume(base);
    base.preload = 'auto';
    playActivityClone(base);
  }

  function playRandomMenuToggleB() {
    var played = false;
    function once() {
      if (played) return;
      played = true;
      playRandomMenuToggleBNow();
    }
    function waitFor(promise) {
      var timer = setTimeout(once, 4000);
      promise.then(function () {
        clearTimeout(timer);
        once();
      }, once);
    }
    var ready = window.__pretextGridLoadSoundDone;
    if (ready && typeof ready.then === 'function') {
      waitFor(ready);
      return;
    }
    requestAnimationFrame(function () {
      var later = window.__pretextGridLoadSoundDone;
      if (later && typeof later.then === 'function') waitFor(later);
      else once();
    });
  }

  // Match the nav panel hot path: play a fresh element from the preloaded src.
  function playRandomHoverSound(trigger) {
    if (!ACTIVITY_HOVER_SOUND_ENABLED) return;
    var now = Date.now();
    if (trigger && trigger === lastHoverSoundTrigger) return;
    if (now - lastHoverSoundMs < HOVER_SOUND_GAP_MS) return;

    var len = hoverSounds.length;
    if (!len) return;
    var base = null;
    for (var t = 0; t < len; t++) {
      var idx = (hoverSoundPick + t) % len;
      if (hoverSounds[idx]) {
        base = hoverSounds[idx];
        hoverSoundPick = idx + 1;
        break;
      }
    }
    if (!base) return;

    lastHoverSoundMs = now;
    lastHoverSoundTrigger = trigger || null;
    var src = base.currentSrc || base.src;
    var el = src ? new Audio(src) : base.cloneNode();
    el.preload = 'auto';
    applySfxVolume(el);
    try { el.currentTime = 0; } catch (e) {}
    void el.play().catch(function () {});
  }

  function playPinSound() {
    if (!pinSoundBase) {
      activityPendingPlays.push(playPinSound);
      return;
    }
    playActivityClone(pinSoundBase);
  }

  function playLevelUpSound() {
    if (!isPretextRpgEnabled()) return;
    if (!levelUpSoundBase) return;
    playActivityClone(levelUpSoundBase);
  }

  window.pretextPlayLevelUpSound = playLevelUpSound;

  // Track pinned card rects so new pins spread across the viewport.
  var pinnedPlacements = [];

  function readCardRect(card) {
    var rect = card.getBoundingClientRect();
    return { card: card, left: rect.left, top: rect.top, w: rect.width, h: rect.height };
  }

  function rectsFarEnough(a, b, gap) {
    return a.left + a.w + gap <= b.left ||
           b.left + b.w + gap <= a.left ||
           a.top + a.h + gap <= b.top ||
           b.top + b.h + gap <= a.top;
  }

  function isFarFromOthers(candidate, others, gap) {
    for (var i = 0; i < others.length; i++) {
      if (others[i].card === candidate.card) continue;
      if (!rectsFarEnough(candidate, others[i], gap)) return false;
    }
    return true;
  }

  function getPinTopRange(h, topViewport, opts) {
    opts = opts || {};
    var maxTop = Math.max(EDGE_MARGIN, window.innerHeight - h - EDGE_MARGIN);
    if (!topViewport) return { min: EDGE_MARGIN, max: maxTop };
    // Load / composition pins: keep cards in the upper viewport band.
    // Composition spreads a bit deeper so staggered columns have vertical room.
    var bandFrac = opts.composition ? 0.78 : 0.52;
    var bandBottom = Math.max(EDGE_MARGIN * 2, Math.round(window.innerHeight * bandFrac));
    var bandMaxTop = Math.min(maxTop, Math.max(EDGE_MARGIN, bandBottom - h));
    return { min: EDGE_MARGIN, max: bandMaxTop };
  }

  function measurePinnedCardSize(card) {
    card.style.display = 'block';
    card.style.transform = '';
    var rect = card.getBoundingClientRect();
    var w = rect.width || card.offsetWidth;
    var h = rect.height || card.offsetHeight;
    if (!w || !h) {
      w = card.offsetWidth;
      h = card.offsetHeight;
    }
    return { w: w, h: h };
  }

  function clampPinLeft(left, w) {
    var maxLeft = Math.max(EDGE_MARGIN, window.innerWidth - w - EDGE_MARGIN);
    return Math.min(Math.max(left, EDGE_MARGIN), maxLeft);
  }

  function clampPinTop(top, h) {
    var maxTop = Math.max(EDGE_MARGIN, window.innerHeight - h - EDGE_MARGIN);
    return Math.min(Math.max(top, EDGE_MARGIN), maxTop);
  }

  function applyPinnedPosition(card, left, top, w, h) {
    card.style.left = clampPinLeft(left, w) + 'px';
    card.style.top = clampPinTop(top, h) + 'px';
    return readCardRect(card);
  }

  function clampPinnedCardInViewport(card) {
    var size = measurePinnedCardSize(card);
    var rect = card.getBoundingClientRect();
    return applyPinnedPosition(card, rect.left, rect.top, size.w, size.h);
  }

  function watchPinnedCardLayout(card) {
    clampPinnedCardInViewport(card);
    card.querySelectorAll('img').forEach(function (img) {
      if (img.complete) return;
      img.addEventListener('load', function () {
        if (!card.classList.contains('recent-card-pinned')) return;
        var placed = clampPinnedCardInViewport(card);
        var idx = -1;
        for (var i = 0; i < pinnedPlacements.length; i++) {
          if (pinnedPlacements[i].card === card) { idx = i; break; }
        }
        if (idx !== -1) pinnedPlacements[idx] = placed;
      }, { once: true });
    });
  }

  function spiralFallback(card, w, h, others, opts) {
    opts = opts || {};
    var topRange = getPinTopRange(h, opts.topViewport, opts);
    // Prefer several lanes even when cards are wide so composition doesn't
    // collapse into a single column.
    var minLane = opts.composition ? 3 : 1;
    var cols = Math.max(
      minLane,
      Math.floor((window.innerWidth - EDGE_MARGIN * 2) / (Math.max(w * 0.55, 140) + PIN_MIN_GAP)),
    );
    var idx = typeof opts.compositionIndex === 'number' ? opts.compositionIndex : others.length;
    var col = typeof opts.compositionLane === 'number' ? opts.compositionLane % cols : idx % cols;
    var row = Math.floor(idx / cols);
    if (opts.topViewport) {
      var maxRow = Math.max(0, Math.floor((topRange.max - EDGE_MARGIN) / Math.max(48, h * 0.35 + PIN_MIN_GAP)));
      row = Math.min(row, maxRow);
    }
    var laneW = (window.innerWidth - EDGE_MARGIN * 2) / cols;
    var left = EDGE_MARGIN + col * laneW + Math.max(0, (laneW - w) * 0.15);
    var top = EDGE_MARGIN + row * Math.max(48, Math.min(h, (topRange.max - EDGE_MARGIN) / Math.max(1, Math.ceil((idx + 1) / cols))) + PIN_MIN_GAP * 0.25);
    return applyPinnedPosition(card, left, top, w, h);
  }

  /** Scatter composition pins across shuffled lanes so they don't stack in one column. */
  function placePinnedInCompositionLane(card, w, h, others, opts) {
    var lanes = Math.max(3, opts.compositionLanes | 0);
    var lane = ((opts.compositionLane | 0) % lanes + lanes) % lanes;
    var index = opts.compositionIndex | 0;
    var total = Math.max(1, opts.compositionTotal | 0);
    var topRange = getPinTopRange(h, true, opts);
    var usableW = Math.max(1, window.innerWidth - EDGE_MARGIN * 2);
    var laneW = usableW / lanes;
    var laneLeft = EDGE_MARGIN + lane * laneW;
    var maxOffset = Math.max(0, laneW - w);
    // Keep most of the card in its lane, with a little overlap into neighbors.
    var jitterPad = Math.min(24, maxOffset * 0.25);

    for (var t = 0; t < PIN_PLACE_TRIES; t++) {
      var left = laneLeft + (maxOffset > 0 ? Math.random() * maxOffset : 0);
      left += (Math.random() - 0.5) * jitterPad * 2;
      // Golden-ratio scatter in the vertical band, then nudge by try index.
      var span = Math.max(0, topRange.max - topRange.min);
      var phase = ((index * 0.6180339887) + lane / lanes + t * 0.07) % 1;
      var top = topRange.min + phase * span;
      var candidate = applyPinnedPosition(card, left, top, w, h);
      if (isFarFromOthers(candidate, others, PIN_MIN_GAP)) return candidate;
    }
    return spiralFallback(card, w, h, others, opts);
  }

  function applyPinnedImageSize(card) {
    // Pinned cards keep their natural card size and full chrome (border, text,
    // label). No random image-only resizing.
    clearPinnedImageSize(card);
  }

  function clearPinnedImageSize(card) {
    card.style.width = '';
    card.style.maxWidth = '';
    card.style.height = '';
    delete card.dataset.pinAspect;
  }

  function placePinnedRandomly(card, opts) {
    opts = opts || {};
    card.style.display = 'block';
    card.style.transform = '';
    applyPinnedImageSize(card);
    var size = measurePinnedCardSize(card);
    var w = size.w;
    var h = size.h;
    var maxLeft = Math.max(EDGE_MARGIN, window.innerWidth - w - EDGE_MARGIN);
    var topRange = getPinTopRange(h, opts.topViewport, opts);
    var others = pinnedPlacements.slice();
    var placed = null;

    if (opts.composition && typeof opts.compositionLane === 'number') {
      placed = placePinnedInCompositionLane(card, w, h, others, opts);
    } else {
      for (var t = 0; t < PIN_PLACE_TRIES; t++) {
        var left = EDGE_MARGIN + Math.random() * (maxLeft - EDGE_MARGIN);
        var span = topRange.max - topRange.min;
        var top = span > 0 ? topRange.min + Math.random() * span : topRange.min;
        var candidate = applyPinnedPosition(card, left, top, w, h);
        if (isFarFromOthers(candidate, others, PIN_MIN_GAP)) {
          placed = candidate;
          break;
        }
      }
      if (!placed) placed = spiralFallback(card, w, h, others, opts);
      else placed = clampPinnedCardInViewport(card);
    }

    pinnedPlacements = pinnedPlacements.filter(function (p) { return p.card !== card; });
    pinnedPlacements.push(placed);
    watchPinnedCardLayout(card);
  }

  function removePinnedPlacement(card) {
    pinnedPlacements = pinnedPlacements.filter(function (p) { return p.card !== card; });
  }

  function syncPinnedPlacement(card) {
    var idx = -1;
    for (var i = 0; i < pinnedPlacements.length; i++) {
      if (pinnedPlacements[i].card === card) { idx = i; break; }
    }
    var placed = clampPinnedCardInViewport(card);
    if (idx === -1) return;
    pinnedPlacements[idx] = placed;
  }

  // Hide + set up EVERY card on load
  allCards.forEach(function (c) {
    c.style.display = 'none';
    c.style.position = 'fixed';
    c.style.left = '0';
    c.style.top = '0';
    c.style.pointerEvents = 'none';
    c.style.zIndex = '9999';
    c.style.transform = 'translate3d(-9999px,-9999px,0)';
    c.style.willChange = 'transform';
  });

  // Each trigger registers its card here so a page scroll can dismiss every
  // currently-shown card (hovered or pinned) one-by-one with a stagger.
  var cardControllers = [];

  // After a pin (esp. paint-mode synthetic click), the brush router still emits a
  // native click on the same gesture. Ignore click-away for that beat so the
  // first click pins instead of instantly unpinning.
  var ignoreClickAwayUntil = 0;
  var HOVER_SHOW_DELAY_MS = 16;
  var HOVER_HIDE_DELAY_MS = 120;
  var ACTIVITY_OPEN_CLASS = 'pretext-activity-open';

  function armClickAwayGuard() {
    ignoreClickAwayUntil = Date.now() + 450;
  }

  triggers.forEach(function (t, i) {
    // Prefer a card nested inside the trigger; else match by index
    var card = t.querySelector('.recent-cards') || allCards[i];
    if (!card) return;

    var visible = false;
    // Cached card size. Measuring offsetWidth/Height forces a synchronous
    // layout; doing it inside position() (which runs on every mousemove, and
    // once more per move when the brush forwards a synthetic mousemove) caused
    // layout thrashing. The card's size is stable while shown, so measure once
    // when it becomes visible and reuse until the next show or a viewport change.
    var cardW = 0, cardH = 0;
    var cardLeft = NaN, cardTop = NaN;
    var measured = false;
    var showTimer = 0;
    var hideTimer = 0;
    var pendingEnterX = 0, pendingEnterY = 0;

    function measureCard() {
      cardW = card.offsetWidth;
      cardH = card.offsetHeight;
      cardLeft = NaN;
      cardTop = NaN;
      measured = cardW > 0 && cardH > 0;
    }

    function position(e) {
      var w = cardW, h = cardH;
      var margin = 8;

      // Horizontal: flip to the left of the cursor if it'd run off the right
      var x = e.clientX + OFFSET_X;
      if (x + w > window.innerWidth) x = e.clientX - w - OFFSET_X;

      // Vertical: always below the cursor. If it'd overflow the bottom,
      // pull it up just enough to stay on screen — never flip above.
      var y = e.clientY + OFFSET_Y;
      if (y + h > window.innerHeight - margin) {
        y = window.innerHeight - h - margin;
      }
      if (y < margin) y = margin; // safety for cards taller than the viewport

      if (Math.abs(x - cardLeft) < 0.5 && Math.abs(y - cardTop) < 0.5) return;
      cardLeft = x;
      cardTop = y;
      card.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    }

    var moveRaf = 0;
    var pendingMove = null;
    function schedulePosition(e) {
      pendingMove = e;
      if (moveRaf) return;
      moveRaf = requestAnimationFrame(function () {
        moveRaf = 0;
        var ev = pendingMove;
        pendingMove = null;
        if (!ev || pinned || !visible) return;
        position(ev);
      });
    }

    var pinned = false;
    var dragging = false;
    var moved = false;
    var dragStartX = 0, dragStartY = 0, dragBaseLeft = 0, dragBaseTop = 0;
    var DRAG_THRESHOLD = 4;

    function hideHoverCard() {
      if (pinned) return;
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      hideTimer = 0;
      setTriggerOpen(false);
      visible = false;
      card.style.pointerEvents = 'none';
      card.style.display = 'none';
      card.style.transform = 'translate3d(-9999px,-9999px,0)';
    }

    function scheduleHideHoverCard() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hideHoverCard, HOVER_HIDE_DELAY_MS);
    }

    function pin(opts) {
      opts = opts || {};
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      hideTimer = 0;
      pinned = true;
      visible = true;
      setTriggerOpen(true);
      card.style.display = 'block';
      card.style.pointerEvents = 'auto';
      card.style.cursor = 'grab';
      card.style.userSelect = 'none';
      card.style.zIndex = CARD_ABOVE_HEADER_Z;
      card.classList.add('recent-card-pinned');
      placePinnedRandomly(card, opts);
      armClickAwayGuard();
      if (!opts.silent) playPinSound();
      if (!opts.skipHistory) recordActivityPin(t, i);
    }

    // Pinned cards stay on the canvas after the pointer leaves the trigger,
    // become interactive (draggable), and stop following the cursor.
    function showHoverCard() {
      if (pinned) return;
      clearTimeout(hideTimer);
      hideTimer = 0;
      card.style.display = 'block';
      // Outside brush mode, the preview itself can pin on click and sit above
      // the page. In brush mode CSS forces pointer-events:none + z under the
      // paint host so strokes always start through the hover.
      var brushHost = document.querySelector('.pretext-sand-screen-brush-host');
      var brushActive = brushHost && !brushHost.classList.contains('pretext-sand-screen-brush-host--disabled');
      card.style.pointerEvents = brushActive ? 'none' : 'auto';
      card.style.zIndex = brushActive ? '100000001' : CARD_ABOVE_HEADER_Z;
      visible = true;
      setTriggerOpen(true);
      requestAnimationFrame(function () {
        if (!visible || pinned) return;
        if (!measured) measureCard();
        position({ clientX: pendingEnterX, clientY: pendingEnterY });
      });
    }

    function setTriggerOpen(on) {
      if (on) t.classList.add(ACTIVITY_OPEN_CLASS);
      else t.classList.remove(ACTIVITY_OPEN_CLASS);
    }

    // Unpinning fully resets the card: hidden, non-interactive, and free to
    // hover-follow again. Also drops any in-flight drag so it can't get stuck.
    function unpin() {
      removePinnedPlacement(card);
      clearTimeout(showTimer);
      pinned = false;
      setTriggerOpen(false);
      dragging = false;
      visible = false;
      clearPinnedImageSize(card);
      card.style.display = 'none';
      card.style.pointerEvents = 'none';
      card.style.cursor = '';
      card.style.userSelect = '';
      card.style.zIndex = '9999';
      card.style.opacity = '';
      card.style.transition = '';
      card.style.left = '0';
      card.style.top = '0';
      card.style.transform = 'translate3d(-9999px,-9999px,0)';
      card.classList.remove('recent-card-pinned');
    }

    // Fade this card out, then fully reset it via unpin() so re-hovering later
    // works normally. Used by the scroll one-by-one dismissal.
    function dismiss() {
      if (!visible && !pinned) return;
      card.style.transition = 'opacity 180ms ease';
      card.style.opacity = '0';
      setTimeout(unpin, 190);
    }

    cardControllers.push({
      trigger: t,
      card: card,
      isActive: function () { return visible || pinned; },
      isPinned: function () { return pinned; },
      dismiss: dismiss,
      dismissHover: hideHoverCard,
      pin: pin,
      unpin: unpin,
      remeasure: function () {
        measured = false;
        if (visible && !pinned) measureCard();
      }
    });

    t.addEventListener('mouseenter', function (e) {
      if (pinned) return;
      playRandomHoverSound(t);
      clearTimeout(hideTimer);
      hideTimer = 0;
      pendingEnterX = e.clientX;
      pendingEnterY = e.clientY;
      clearTimeout(showTimer);
      showTimer = setTimeout(showHoverCard, HOVER_SHOW_DELAY_MS);
    });
    t.addEventListener('mousemove', function (e) {
      if (pinned) return;
      pendingEnterX = e.clientX;
      pendingEnterY = e.clientY;
      if (!visible) return;
      schedulePosition(e);
    });
    t.addEventListener('mouseleave', function (e) {
      clearTimeout(showTimer);
      lastHoverSoundTrigger = null;
      if (pinned) return;
      if (e.relatedTarget && (card === e.relatedTarget || card.contains(e.relatedTarget))) return;
      scheduleHideHoverCard();
    });

    card.addEventListener('mouseenter', function () {
      if (pinned || !visible) return;
      clearTimeout(hideTimer);
      hideTimer = 0;
    });
    card.addEventListener('mouseleave', function (e) {
      if (pinned || !visible) return;
      if (e.relatedTarget && (t === e.relatedTarget || t.contains(e.relatedTarget))) return;
      scheduleHideHoverCard();
    });

    // Click toggles the card: pin on first click, unpin on second (same in paint
    // mode via the brush router's synthetic click forwarding).
    t.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (pinned) {
        armClickAwayGuard();
        unpin();
        return;
      }
      pendingEnterX = e.clientX;
      pendingEnterY = e.clientY;
      pin();
    });

    // Drag a pinned card around the fixed-position canvas via pointer capture.
    // Only pinned cards are interactive; unpinned hover-follow cards keep
    // pointer-events:none so they never steal hover from the trigger.
    card.addEventListener('pointerdown', function (e) {
      if (!pinned) return;
      e.stopPropagation();
      e.preventDefault();
      dragging = true;
      moved = false;
      dragStartX = e.clientX; dragStartY = e.clientY;
      var rect = card.getBoundingClientRect();
      dragBaseLeft = rect.left; dragBaseTop = rect.top;
      card.style.cursor = 'grabbing';
      try { card.setPointerCapture(e.pointerId); } catch (err) {}
    });
    card.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - dragStartX, dy = e.clientY - dragStartY;
      if (!moved && (Math.abs(dx) + Math.abs(dy)) > DRAG_THRESHOLD) moved = true;
      card.style.left = (dragBaseLeft + dx) + 'px';
      card.style.top  = (dragBaseTop + dy) + 'px';
    });
    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      if (pinned) {
        card.style.cursor = 'grab';
        syncPinnedPlacement(card);
      }
      try { card.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);

    // Swallow clicks originating inside the card so a drag-release (or any
    // card interaction) can't bubble to the trigger and toggle the pin off.
    // Clicking a visible hover preview pins (same as clicking the row).
    card.addEventListener('click', function (e) {
      e.stopPropagation();
      if (moved) { e.preventDefault(); moved = false; return; }
      if (pinned) return;
      if (visible) {
        e.preventDefault();
        pin();
      }
    });
  });

  var LOAD_OPEN_ALL_CARDS_CHANCE = 0.05;
  var CARD_STAGGER_MS = 90;
  var dismissing = false;
  var openingAllCards = false;

  function maybeOpenAllActivityCardsOnLoad() {
    if (Math.random() >= LOAD_OPEN_ALL_CARDS_CHANCE) return;
    window.__pretextNoteLoadEffect && window.__pretextNoteLoadEffect('open-all-activity-cards');
    if (!cardControllers.length) return;
    armClickAwayGuard();
    var toOpen = cardControllers.filter(function (c) { return !!c.pin; });
    if (!toOpen.length) return;
    openingAllCards = true;
    playRandomMenuToggleB();

    // Build a lane plan up front so sequential pins don't all collapse left.
    var sample = toOpen[0] && toOpen[0].card;
    var sampleW = 220;
    if (sample) {
      sample.style.display = 'block';
      sample.style.transform = 'translate3d(-9999px,-9999px,0)';
      sampleW = Math.max(140, sample.offsetWidth || sample.getBoundingClientRect().width || 220);
      sample.style.display = 'none';
      sample.style.transform = '';
    }
    var lanes = Math.min(
      toOpen.length,
      Math.max(3, Math.floor((window.innerWidth - EDGE_MARGIN * 2) / (sampleW * 0.55 + PIN_MIN_GAP))),
    );
    // Round-robin through a shuffled lane order so neighbors aren't same-column.
    var lanePool = [];
    for (var L = 0; L < lanes; L++) lanePool.push(L);
    for (var i = lanePool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = lanePool[i];
      lanePool[i] = lanePool[j];
      lanePool[j] = tmp;
    }
    var laneAssign = [];
    for (var k = 0; k < toOpen.length; k++) {
      laneAssign.push(lanePool[k % lanes]);
      if ((k + 1) % lanes === 0) {
        for (var i2 = lanePool.length - 1; i2 > 0; i2--) {
          var j2 = Math.floor(Math.random() * (i2 + 1));
          var tmp2 = lanePool[i2];
          lanePool[i2] = lanePool[j2];
          lanePool[j2] = tmp2;
        }
      }
    }

    toOpen.forEach(function (c, k) {
      setTimeout(function () {
        c.pin({
          topViewport: true,
          silent: true,
          skipHistory: true,
          composition: true,
          compositionLane: laneAssign[k],
          compositionLanes: lanes,
          compositionIndex: k,
          compositionTotal: toOpen.length,
        });
      }, k * CARD_STAGGER_MS);
    });
    setTimeout(function () {
      openingAllCards = false;
    }, toOpen.length * CARD_STAGGER_MS + 260);
  }

  requestAnimationFrame(function () {
    requestAnimationFrame(maybeOpenAllActivityCardsOnLoad);
  });

  document.addEventListener('click', function (e) {
    if (Date.now() < ignoreClickAwayUntil) return;
    var el = e.target;
    if (!el || !el.closest) return;
    // Paint-mode router click is the same gesture that just pinned — never treat
    // it as an outside click-away.
    if (el.closest('.pretext-sand-screen-brush-router, .pretext-sand-screen-brush-host')) return;
    cardControllers.forEach(function (c) {
      if (!c.isPinned || !c.isPinned()) return;
      if (c.trigger && (c.trigger === el || c.trigger.contains(el))) return;
      if (c.card && (c.card === el || c.card.contains(el))) return;
      c.unpin();
    });
  });

  window.addEventListener('resize', function () {
    cardControllers.forEach(function (c) {
      if (c.isActive && c.remeasure) c.remeasure();
    });
  }, { passive: true });

  // Scrolling down clears the shown cards one-by-one with a small stagger,
  // echoing the brush rewind-and-disable feel. Each card fades and fully
  // resets, so nothing gets stuck and re-hovering afterward works normally.
  var lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;

  function dismissCardsOneByOne() {
    if (dismissing || openingAllCards) return;
    var active = cardControllers.filter(function (c) { return c.isActive(); });
    if (!active.length) return;
    dismissing = true;
    active.forEach(function (c, k) {
      setTimeout(function () { c.dismiss(); }, k * CARD_STAGGER_MS);
    });
    setTimeout(function () { dismissing = false; }, active.length * CARD_STAGGER_MS + 260);
  }

  window.addEventListener('scroll', function () {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var goingDown = y > lastScrollY;
    lastScrollY = y;
    if (goingDown) dismissCardsOneByOne();
  }, { passive: true });
});

  /* ---- silh-typewriter-or-main.js ---- */

__pretextOnReady(() => {
    const style = document.createElement('style');
    style.textContent = `
        @media (min-width: 991px) {
            .preview-stack {
                position: fixed;
                bottom: 8px;
                left: 8px;
                z-index: 9999;
                display: flex;
                gap: 8px;
                pointer-events: none;
                align-items: flex-end;
            }
            .preview-item {
                background: white;
                opacity: 1;
                transition: opacity 0.3s ease;
                width: 400px;
                max-height: 80vh;
            }
            .preview-item img {
                width: 100%;
                height: auto;
                display: block;
                vertical-align: bottom;
                object-fit: contain;
                max-height: 80vh;
            }
            .preview-item.fading {
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    const stackContainer = document.createElement('div');
    stackContainer.className = 'preview-stack';
    document.body.appendChild(stackContainer);

    let stackItems = [];
    let isTouch = false;

    const isDesktop = () => window.innerWidth >= 991;

    const getWidthForPosition = (position, totalItems) => {
        if (totalItems <= 5) return 400;
        if (position === 0) return 400;
        if (position === 1) return 200;
        if (position === 2) return 150;
        if (position === 3) return 100;
        return 50;
    };

    const updateStackSizes = () => {
        if (!isDesktop()) return;
        stackItems.forEach((item, index) => {
            const width = getWidthForPosition(index, stackItems.length);
            item.style.width = `${width}px`;
        });
    };

    window.addEventListener('touchstart', function onFirstTouch() {
        isTouch = true;
        window.removeEventListener('touchstart', onFirstTouch);
    });

    window.addEventListener('resize', () => {
        if (!isDesktop()) {
            stackItems.forEach(item => item.remove());
            stackItems = [];
        }
    });

    document.querySelectorAll('.case-study-preview-image').forEach(img => {
        img.addEventListener('click', () => {
            if (!isDesktop() || isTouch) return;

            const stackItem = document.createElement('div');
            stackItem.className = 'preview-item';
            
            const stackImg = new Image();
            stackImg.style.width = '100%';
            stackImg.style.height = 'auto';
            stackImg.src = img.src;
            
            stackItem.appendChild(stackImg);
            stackContainer.appendChild(stackItem);
            stackItems.unshift(stackItem);
            
            updateStackSizes();

            setTimeout(() => {
                stackItem.classList.add('fading');
                setTimeout(() => {
                    const index = stackItems.indexOf(stackItem);
                    if (index > -1) {
                        stackItems.splice(index, 1);
                        stackItem.remove();
                        updateStackSizes();
                    }
                }, 300);
            }, 3000);
        });
    });
});

const style = document.createElement('style');
style.textContent = `
  .serially {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  
  .fade-in {
    opacity: 1;
  }
  
  .fade-out {
    opacity: 0 !important;
    transition: opacity 0.2s ease-out;
  }

  /* Top-right panel rows: hidden until sequential load reveal (opacity only). */
  .gui-nav-container .nav-ia-container > .nav-input-container.top-banner,
  .gui-nav-container .nav-ia-container > .nav-input-link,
  .gui-nav-container .nav-ia-container > .w-dropdown,
  .gui-nav-container .div-block-254 {
    opacity: 0;
    transition: opacity 280ms cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Out Quad */
    pointer-events: none;
  }
  .gui-nav-container .nav-ia-container > .nav-input-container.top-banner.nav-row-in,
  .gui-nav-container .nav-ia-container > .nav-input-link.nav-row-in,
  .gui-nav-container .nav-ia-container > .w-dropdown.nav-row-in,
  .gui-nav-container .div-block-254.nav-row-in {
    opacity: 1;
    pointer-events: auto;
  }

  /* Projects nested list: in-flow when open (same as a click). */
  .gui-nav-container .dropdown-list.w--open {
    display: flex;
    flex-direction: column;
    position: static;
  }

  /* Side panel rows: 4-face prism; each hover advances one face. */
  .gui-nav-container .nav-ia-container,
  .gui-nav-container .nav-input-link,
  .gui-nav-container .w-dropdown,
  .gui-nav-container .dropdown-toggle,
  .gui-nav-container .tier-down-links {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  .gui-nav-container .nav-input-container[data-nav-cube] {
    --nav-cube-d: 20px;
    position: relative;
    width: 100%;
    overflow: hidden;
    perspective: 1100px;
    perspective-origin: 50% 50%;
    z-index: 0;
  }
  /* Keep hover hit-testing on the 2D row box so 3D face spins don't
     fire mouseleave (that was cutting the nav hover sound). */
  .gui-nav-container .nav-input-container[data-nav-cube]::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: auto;
  }
  .gui-nav-container .nav-input-container[data-nav-cube]:hover,
  .gui-nav-container .nav-input-container[data-nav-cube].nav-cube-spinning {
    background-color: var(--ui-bar) !important;
    border-top-color: var(--ui-bar-border) !important;
    z-index: 3;
  }
  .gui-nav-container .nav-cube {
    position: relative;
    flex: 1 1 auto;
    width: 100%;
    min-width: 0;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    transform: translateZ(calc(var(--nav-cube-d) / -2));
    transition: transform 461ms cubic-bezier(0.45, 0.05, 0.2, 1);
  }
  .gui-nav-container .nav-cube-face {
    display: flex;
    align-items: stretch;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    background-color: var(--ui-bar);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  .gui-nav-container .nav-cube-face--0 {
    position: relative;
    transform: rotateX(0deg) translateZ(calc(var(--nav-cube-d) / 2));
  }
  .gui-nav-container .nav-cube-face--1,
  .gui-nav-container .nav-cube-face--2,
  .gui-nav-container .nav-cube-face--3 {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .gui-nav-container .nav-cube-face--1 {
    transform: rotateX(-90deg) translateZ(calc(var(--nav-cube-d) / 2));
  }
  .gui-nav-container .nav-cube-face--2 {
    transform: rotateX(-180deg) translateZ(calc(var(--nav-cube-d) / 2));
  }
  .gui-nav-container .nav-cube-face--3 {
    transform: rotateX(90deg) translateZ(calc(var(--nav-cube-d) / 2));
  }
  .gui-nav-container .nav-input-container[data-nav-cube].nav-cube-axis-y .nav-cube-face--0 {
    transform: rotateY(0deg) translateZ(calc(var(--nav-cube-d) / 2));
  }
  .gui-nav-container .nav-input-container[data-nav-cube].nav-cube-axis-y .nav-cube-face--1 {
    transform: rotateY(-90deg) translateZ(calc(var(--nav-cube-d) / 2));
  }
  .gui-nav-container .nav-input-container[data-nav-cube].nav-cube-axis-y .nav-cube-face--2 {
    transform: rotateY(-180deg) translateZ(calc(var(--nav-cube-d) / 2));
  }
  .gui-nav-container .nav-input-container[data-nav-cube].nav-cube-axis-y .nav-cube-face--3 {
    transform: rotateY(90deg) translateZ(calc(var(--nav-cube-d) / 2));
  }
  .gui-nav-container .nav-cube-face .input-container {
    flex: 1 1 auto;
    width: auto !important;
    min-width: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    .gui-nav-container .nav-cube {
      transition: none;
    }
  }

  /* Index images: same 4-face prism as nav panes. */
  .img-cube-host {
    --img-cube-d: 200px;
    position: relative;
    display: block;
    overflow: hidden;
    perspective: 1100px;
    perspective-origin: 50% 50%;
    z-index: 0;
  }
  .img-cube-host.img-cube-spinning {
    z-index: 3;
  }
  .img-cube-host.img-cube-pending .img-cube-face img {
    opacity: 0;
    visibility: hidden;
  }
  .img-cube {
    position: relative;
    width: 100%;
    transform-style: preserve-3d;
    transform-origin: 50% 50%;
    transform: translateZ(calc(var(--img-cube-d) / -2));
    transition: transform 461ms cubic-bezier(0.45, 0.05, 0.2, 1);
  }
  .img-cube-face {
    display: block;
    box-sizing: border-box;
    width: 100%;
    background-color: var(--portfolio-lazy-color, #eaeaea);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
  }
  .img-cube-face--0 {
    position: relative;
    /* scale overlaps the edge-on neighbor; +1px Z keeps this face in front of that seam */
    transform: rotateX(0deg) translateZ(calc(var(--img-cube-d) / 2 + 1px)) scale(1.012);
  }
  .img-cube-face--1,
  .img-cube-face--2,
  .img-cube-face--3 {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .img-cube-face--1 {
    transform: rotateX(-90deg) translateZ(calc(var(--img-cube-d) / 2 + 1px)) scale(1.012);
  }
  .img-cube-face--2 {
    transform: rotateX(-180deg) translateZ(calc(var(--img-cube-d) / 2 + 1px)) scale(1.012);
  }
  .img-cube-face--3 {
    transform: rotateX(90deg) translateZ(calc(var(--img-cube-d) / 2 + 1px)) scale(1.012);
  }
  .img-cube-host.img-cube-axis-y .img-cube-face--0 {
    transform: rotateY(0deg) translateZ(calc(var(--img-cube-d) / 2 + 1px)) scale(1.012);
  }
  .img-cube-host.img-cube-axis-y .img-cube-face--1 {
    transform: rotateY(-90deg) translateZ(calc(var(--img-cube-d) / 2 + 1px)) scale(1.012);
  }
  .img-cube-host.img-cube-axis-y .img-cube-face--2 {
    transform: rotateY(-180deg) translateZ(calc(var(--img-cube-d) / 2 + 1px)) scale(1.012);
  }
  .img-cube-host.img-cube-axis-y .img-cube-face--3 {
    transform: rotateY(90deg) translateZ(calc(var(--img-cube-d) / 2 + 1px)) scale(1.012);
  }
  .preview-image-container .img-cube-face--0 img {
    display: block;
    width: 100%;
    height: auto;
  }
  .preview-image-container .img-cube-face--1 img,
  .preview-image-container .img-cube-face--2 img,
  .preview-image-container .img-cube-face--3 img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (prefers-reduced-motion: reduce) {
    .img-cube {
      transition: none;
    }
  }

`;
document.head.appendChild(style);


/** Four-face prism: labeled rows roll vertically; play/pause roll sideways. */
function mountNavCubeHovers() {
    const rows = document.querySelectorAll('.gui-nav-container .nav-input-container');
    for (const row of rows) {
        if (row.dataset.navCube) continue;
        const isAudioBtn = !!row.closest('.startaudio, .stopaudio');
        if (!isAudioBtn && !row.querySelector('.caption-text-a')) continue;
        row.dataset.navCube = '1';
        row.dataset.navFace = '0';
        const cube = document.createElement('div');
        cube.className = 'nav-cube';
        const faces = [];
        for (let i = 0; i < 4; i++) {
            const face = document.createElement('div');
            face.className = `nav-cube-face nav-cube-face--${i}`;
            if (i === 0) {
                while (row.firstChild) face.appendChild(row.firstChild);
            } else {
                face.innerHTML = faces[0].innerHTML;
                face.setAttribute('aria-hidden', 'true');
            }
            cube.appendChild(face);
            faces.push(face);
        }
        row.appendChild(cube);
        let axis = 'x';
        const syncDepth = () => {
            const el = faces[0];
            const d = axis === 'y'
                ? (el.offsetWidth || row.offsetWidth || 20)
                : (el.offsetHeight || 20);
            row.style.setProperty('--nav-cube-d', `${d}px`);
        };
        const applyAxis = (next) => {
            axis = next;
            row.classList.toggle('nav-cube-axis-y', next === 'y');
            syncDepth();
        };
        applyAxis(isAudioBtn ? 'y' : 'x');
        let spinIndex = 0;
        const spinTo = (n) => {
            const rot = axis === 'y' ? 'rotateY' : 'rotateX';
            cube.style.transform = `translateZ(calc(var(--nav-cube-d) / -2)) ${rot}(${n * 90}deg)`;
        };
        spinTo(0);
        new ResizeObserver(syncDepth).observe(faces[0]);
        let busy = false;
        let loadLocked = false;
        row._navCubePrepare = () => {
            loadLocked = true;
            busy = false;
            spinIndex = 0;
            row.dataset.navFace = '0';
            cube.style.transition = 'none';
            applyAxis(isAudioBtn ? 'y' : 'x');
            const rot = axis === 'y' ? 'rotateY' : 'rotateX';
            cube.style.transform = `translateZ(calc(var(--nav-cube-d) / -2)) ${rot}(-90deg)`;
            void cube.offsetWidth;
            cube.style.transition = '';
        };
        row._navCubeEnter = () => {
            spinIndex = 0;
            spinTo(0);
            window.setTimeout(() => { loadLocked = false; }, 461);
        };
        row.addEventListener('mouseenter', () => {
            if (typeof window.__pretextPlayNavHoverSound === 'function') {
                window.__pretextPlayNavHoverSound();
            }
            if (loadLocked || busy) return;
            busy = true;
            const nextAxis = isAudioBtn ? 'y' : 'x';
            const dir = isAudioBtn ? (Math.random() < 0.5 ? -1 : 1) : 1;
            if (nextAxis !== axis) {
                cube.style.transition = 'none';
                applyAxis(nextAxis);
                spinTo(spinIndex);
                void cube.offsetWidth;
                cube.style.transition = '';
            }
            spinIndex += dir;
            row.dataset.navFace = String(((spinIndex % 4) + 4) % 4);
            row.classList.add('nav-cube-spinning');
            spinTo(spinIndex);
            window.setTimeout(() => { busy = false; }, 461);
        });
        row.addEventListener('mouseleave', () => {
            row.classList.remove('nav-cube-spinning');
        });
    }
}
mountNavCubeHovers();

/** Index project images: 4-face prism. Hover is usually vertical; 25% rolls sideways. */
function mountIndexImageCubes() {
    const imgs = document.querySelectorAll('.preview-image-container > img.preview-img');
    for (const img of imgs) {
        if (img.closest('.img-cube-host')) continue;
        const host = document.createElement('div');
        host.className = 'img-cube-host img-cube-pending';
        host.dataset.imgCube = '1';
        const cube = document.createElement('div');
        cube.className = 'img-cube';
        const faces = [];
        const clones = [];
        for (let i = 0; i < 4; i++) {
            const face = document.createElement('div');
            face.className = `img-cube-face img-cube-face--${i}`;
            if (i === 0) {
                img.replaceWith(host);
                face.appendChild(img);
            } else {
                const clone = img.cloneNode(true);
                clone.removeAttribute('id');
                clone.setAttribute('aria-hidden', 'true');
                face.appendChild(clone);
                clones.push(clone);
            }
            cube.appendChild(face);
            faces.push(face);
        }
        host.appendChild(cube);

        let axis = 'x';
        const syncDepth = () => {
            const el = faces[0];
            const d = axis === 'y'
                ? (el.offsetWidth || img.offsetWidth || 1)
                : (el.offsetHeight || img.offsetHeight || 1);
            host.style.setProperty('--img-cube-d', `${d}px`);
        };
        const applyAxis = (next) => {
            axis = next;
            host.classList.toggle('img-cube-axis-y', next === 'y');
            syncDepth();
        };
        const syncClones = () => {
            for (const clone of clones) {
                clone.className = img.className;
                if (img.getAttribute('src')) clone.src = img.src;
                if (img.style.aspectRatio) clone.style.aspectRatio = img.style.aspectRatio;
            }
        };
        syncDepth();
        syncClones();
        new ResizeObserver(syncDepth).observe(faces[0]);
        new MutationObserver(() => {
            syncClones();
            syncDepth();
        }).observe(img, { attributes: true, attributeFilter: ['class', 'style', 'src'] });

        let spinIndex = 0;
        let busy = false;
        let loadLocked = false;
        const spinTo = (n) => {
            const rot = axis === 'y' ? 'rotateY' : 'rotateX';
            cube.style.transform = `translateZ(calc(var(--img-cube-d) / -2)) ${rot}(${n * 90}deg)`;
        };
        spinTo(0);
        host._imgCubePrepare = (fromDeg) => {
            loadLocked = true;
            busy = false;
            host.classList.add('img-cube-pending');
            cube.style.transition = 'none';
            applyAxis('x');
            cube.style.transform = `translateZ(calc(var(--img-cube-d) / -2)) rotateX(${fromDeg}deg)`;
            void cube.offsetWidth;
            cube.style.transition = '';
        };
        host._imgCubeReveal = () => {
            host.classList.remove('img-cube-pending');
            loadLocked = false;
            cube.style.transition = 'none';
            applyAxis('x');
            spinTo(0);
            void cube.offsetWidth;
            cube.style.transition = '';
        };
        host._imgCubeEnter = () => {
            host.classList.remove('img-cube-pending');
            spinIndex = 0;
            applyAxis('x');
            spinTo(0);
            window.setTimeout(() => { loadLocked = false; }, 461);
        };
        host.addEventListener('mouseenter', () => {
            if (loadLocked || busy) return;
            busy = true;
            const roll = Math.random();
            const nextAxis = roll < 0.25 ? 'y' : 'x';
            const dir = nextAxis === 'y'
                ? (roll < 0.125 ? -1 : 1)
                : (Math.random() < 0.25 ? -1 : 1);
            if (nextAxis !== axis) {
                cube.style.transition = 'none';
                applyAxis(nextAxis);
                spinTo(spinIndex);
                void cube.offsetWidth;
                cube.style.transition = '';
            }
            spinIndex += dir;
            host.classList.add('img-cube-spinning');
            spinTo(spinIndex);
            window.setTimeout(() => { busy = false; }, 461);
        });
        host.addEventListener('mouseleave', () => {
            host.classList.remove('img-cube-spinning');
        });
    }
}
mountIndexImageCubes();

function shuffleIndexPreviewProjects() {
    const list = document.querySelector('.preview-span .collection-list-14, .preview-span [role="list"]');
    if (!list) return;
    const items = Array.from(list.querySelectorAll(':scope > .preview-indiv-container, :scope > [role="listitem"]'));
    const withImg = [];
    const withoutImg = [];
    for (const item of items) {
        const img = item.querySelector('img.preview-img');
        const has = img && !img.classList.contains('w-dyn-bind-empty') && img.getAttribute('src') && !img.getAttribute('src').includes('placeholder.');
        (has ? withImg : withoutImg).push(item);
    }
    for (let i = withImg.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [withImg[i], withImg[j]] = [withImg[j], withImg[i]];
    }
    for (const el of [...withImg, ...withoutImg]) list.appendChild(el);
}

/** 2–3 on-screen Index images roll in; the rest stay put. Stagger so they don't chorus. */
function animateIndexImageCubesIn() {
    const hosts = Array.from(document.querySelectorAll('.preview-span .img-cube-host'));
    if (!hosts.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        hosts.forEach((host) => {
            if (typeof host._imgCubeReveal === 'function') host._imgCubeReveal();
        });
        return;
    }

    const run = () => {
        const strip = document.querySelector('.preview-span');
        const view = strip ? strip.getBoundingClientRect() : {
            left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight,
        };
        let visible = hosts.filter((host) => {
            const r = host.getBoundingClientRect();
            return r.right > view.left && r.left < view.right && r.bottom > view.top && r.top < view.bottom;
        });
        if (!visible.length) visible = hosts.slice(0, 3);

        const n = Math.min(visible.length, Math.random() < 0.5 ? 2 : 3);
        const pool = visible.slice();
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        const chosen = new Set(pool.slice(0, n));
        hosts.forEach((host) => {
            if (chosen.has(host)) {
                if (typeof host._imgCubePrepare !== 'function') return;
                const fromDeg = Math.random() < 0.25 ? 90 : -90;
                host._imgCubePrepare(fromDeg);
                const delay = 60 + Math.random() * 520;
                window.setTimeout(() => {
                    if (typeof host._imgCubeEnter === 'function') host._imgCubeEnter();
                }, delay);
                return;
            }
            if (typeof host._imgCubeReveal === 'function') host._imgCubeReveal();
        });
    };

    requestAnimationFrame(() => requestAnimationFrame(run));
}

/** Top-right panel rows roll in on the 4-face cube, top→bottom. */
function animateNavRowsSequentially() {
    const rows = Array.from(document.querySelectorAll(
        '.gui-nav-container .nav-ia-container > .nav-input-container.top-banner, ' +
        '.gui-nav-container .nav-ia-container > .nav-input-link, ' +
        '.gui-nav-container .nav-ia-container > .w-dropdown, ' +
        '.gui-nav-container .div-block-254'
    ));
    if (!rows.length) return;
    const cubeOf = (el) => el.matches('.nav-input-container[data-nav-cube]')
        ? el
        : el.querySelector('.nav-input-container[data-nav-cube]');
    const stepMs = 90;
    rows.forEach((row, i) => {
        row.classList.remove('nav-row-in');
        const box = cubeOf(row);
        if (box && typeof box._navCubePrepare === 'function') box._navCubePrepare();
        setTimeout(() => {
            row.classList.add('nav-row-in');
            if (box && typeof box._navCubeEnter === 'function') box._navCubeEnter();
        }, 40 + i * stepMs);
    });
}

/** Index + Featured project tabs snap in left→right, same clock, no easing. */
function animateProjectTabsSequentially() {
    const indexTabs = Array.from(document.querySelectorAll('.preview-span .preview-caption-details'));
    const featuredTabs = Array.from(document.querySelectorAll('.projects-span .div-block-248'));
    const stepMs = 160;
    function reveal(tabs) {
        tabs.forEach((tab, i) => {
            tab.classList.remove('project-tab-in');
            setTimeout(() => tab.classList.add('project-tab-in'), i * stepMs);
        });
    }
    reveal(indexTabs);
    reveal(featuredTabs);
}

function shuffleContent() {
    const elements = Array.from(document.querySelectorAll('.serially'));
    const contents = elements.map(el => el.textContent);
    
    for (let i = contents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [contents[i], contents[j]] = [contents[j], contents[i]];
    }
    
    elements.forEach((el, i) => {
        el.textContent = contents[i];
    });
}

let isAnimating = true;
let currentTimeout = null;
let scrollTimeout = null;
let isScrollFading = false;

function instantFadeOutAll() {
    isAnimating = false;
    isScrollFading = false;
    if (currentTimeout) {
        clearTimeout(currentTimeout);
    }
    
    document.querySelectorAll('.serially').forEach(el => {
        el.classList.remove('fade-in');
        el.classList.add('fade-out');
    });
}

function rhythmicFadeOut() {
    if (!isScrollFading) return;
    
    const visibleElements = Array.from(document.querySelectorAll('.serially.fade-in'));
    if (visibleElements.length === 0) {
        isScrollFading = false;
        return;
    }
    
    const rhythms = [
        [50, 100, 25, 150, 75, 125],
        [150, 150, 150, 50, 50, 50],
        [100, 25, 100, 25, 100, 25],
        [200, 50, 50, 200, 50, 50]
    ];
    
    const currentRhythm = rhythms[Math.floor(Math.random() * rhythms.length)];
    let rhythmIndex = 0;
    
    function fadeNextOut() {
        if (!isScrollFading || visibleElements.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * visibleElements.length);
        const element = visibleElements[randomIndex];
        element.classList.remove('fade-in');
        element.classList.add('fade-out');
        
        visibleElements.splice(randomIndex, 1);
        
        if (visibleElements.length > 0) {
            const delay = currentRhythm[rhythmIndex % currentRhythm.length];
            rhythmIndex++;
            setTimeout(fadeNextOut, delay);
        }
    }
    
    fadeNextOut();
}

function animateElements() {
    const elements = Array.from(document.querySelectorAll('.serially:not(.fade-in)'));
    if (elements.length === 0 || !isAnimating) return;
    
    const rhythms = [
        [50, 100, 25, 150, 75, 125],
        [150, 150, 150, 50, 50, 50],
        [100, 25, 100, 25, 100, 25],
        [200, 50, 50, 200, 50, 50]
    ];
    
    const currentRhythm = rhythms[Math.floor(Math.random() * rhythms.length)];
    let rhythmIndex = 0;
    
    function fadeNext() {
        if (elements.length === 0 || !isAnimating) return;
        
        const randomIndex = Math.floor(Math.random() * elements.length);
        const element = elements[randomIndex];
        element.classList.add('fade-in');
        element.classList.remove('fade-out');
        
        elements.splice(randomIndex, 1);
        
        if (elements.length > 0 && isAnimating) {
            const delay = currentRhythm[rhythmIndex % currentRhythm.length];
            rhythmIndex++;
            currentTimeout = setTimeout(fadeNext, delay);
        }
    }
    
    fadeNext();
}

document.addEventListener('click', instantFadeOutAll);

document.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
        if (isAnimating && !isScrollFading) {
            isAnimating = false;
            isScrollFading = true;
            if (currentTimeout) {
                clearTimeout(currentTimeout);
            }
            rhythmicFadeOut();
        }
    }, 50);
}, { passive: true });

__pretextOnReady(() => {
    mountNavCubeHovers();
    shuffleContent();
    shuffleIndexPreviewProjects();
    animateNavRowsSequentially();
    animateProjectTabsSequentially();
    animateIndexImageCubesIn();
    animateElements();
});

document.addEventListener('keypress', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        isAnimating = true;
        isScrollFading = false;
        const elements = document.querySelectorAll('.serially');
        elements.forEach(el => {
            el.classList.remove('fade-in', 'fade-out');
        });
        shuffleContent();
        shuffleIndexPreviewProjects();
        animateNavRowsSequentially();
        animateProjectTabsSequentially();
        animateIndexImageCubesIn();
        setTimeout(animateElements, 100);
    }
});

__pretextOnReady(() => {
    console.log('Document ready, initializing XP System...');
    window.xpSystem.init();
});

if (document.readyState === 'complete') {
    console.log('Document already loaded, initializing XP System...');
    window.xpSystem.init();
}

const heights = [20, 40, 80, 160, 320];

function getRandomHeight() {
    const randomIndex = Math.floor(Math.random() * heights.length);
    return heights[randomIndex];
}

function isDesktopWidth() {
    return window.innerWidth >= 767;
}

function setRandomSpacerHeights() {
    if (!isDesktopWidth()) return;
    
    const spacers = document.querySelectorAll('.randomspacer');
    
    spacers.forEach(spacer => {
        const height = getRandomHeight();
        spacer.style.height = `${height}px`;
    });
}

__pretextOnReady(setRandomSpacerHeights);
window.addEventListener('load', setRandomSpacerHeights);
window.addEventListener('resize', setRandomSpacerHeights);
window.xpSystem = {
    player: {level: 1, xp: 0, xpNeeded: 20, class: 'Wanderer', sublevel: 'A'},
    classes: {
        'Wanderer': {level: 1, color: '#0095ff'},
        'Novice': {level: 10, color: '#f5320b'},
        'Apprentice': {level: 20, color: '#e362d3'},
        'Specialist': {level: 30, color: '#948eff'},
        'Image Maker': {level: 40, color: '#ff4d4d'},
        'Transient': {level: 50, color: '#9933ff'},
        'Artificer': {level: 60, color: '#ff3399'},
        'Ascended': {level: 70, color: '#0066ff'},
        'Storyteller': {level: 80, color: '#cc00ff'},
        'Artisan': {level: 90, color: '#ff0066'},
        'Graphic Designer': {level: 99, color: '#6600ff'}
    },
    sublevels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    clickedItems: new Set(),
    elements: {},
    hueRotation: 0,

    init() {
        if (window.xpSystemInitialized) return;
        window.xpSystemInitialized = true;

        const flash = document.createElement('div');
        flash.className = 'level-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease-out;
        `;
        document.body.appendChild(flash);

        this.elements = {
            fill: document.querySelector('.my-fill'),
            level: document.querySelector('.my-level'),
            xpCount: document.querySelector('.my-xp-count'),
            classDisplay: document.querySelector('.my-class'),
            sublevelDisplay: document.querySelector('.classay'),
            flash: flash
        };

        this.loadProgress();

        const pageXpUi = this.elements.fill && this.elements.level &&
            this.elements.xpCount && this.elements.classDisplay && this.elements.sublevelDisplay;
        if (!pageXpUi) {
            if (typeof window.pretextRenderActivityXp === 'function') window.pretextRenderActivityXp();
            return;
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                this.addXP(-3);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.col-list-item') || e.target.closest('.col-list-item')) {
                const item = e.target.closest('.col-list-item');
                this.handleItemClick(item);
            }
            if (e.target.matches('.case-study-preview-image')) {
                this.handleCaseStudyClick(e.target);
            }
            if (e.target.matches('.featured-img')) {
                this.handleCaseStudyClick(e.target);
            }
            if (e.target.matches('a[class*="Link Block 7"]')) {
                const link = e.target;
                const linkId = link.href || link.textContent.trim();
                this.handleLinkBlockClick(linkId);
            }
        });

        this.updateDisplay();
        this.updateSublevel();
        this.startXPGain();
    },

    startXPGain() {
        setInterval(() => {
            if (this.player.level < 99) {
                this.addXP(6);
            }
        }, 4000);
    },

    addXP(amount) {
        this.player.xp += amount;
        this.player.xp = Math.max(0, this.player.xp);
        this.hueRotation = (this.player.xp / this.player.xpNeeded) * 10;
        while (this.player.xp >= this.player.xpNeeded && this.player.level < 99) {
            const oldLevel = this.player.level;
            this.levelUp();
            if (typeof this.onLevelUp === 'function') this.onLevelUp(this.player.level, oldLevel);
        }
        this.updateDisplay();
        this.saveProgress();
    },

    handleItemClick(item) {
        const itemId = item.textContent.trim() || item.id || `item-${Date.now()}`;
        if (!this.clickedItems.has(itemId)) {
            this.clickedItems.add(itemId);
            this.showXPGain(item, 10);
            this.addXP(10);
        }
    },

    handleCaseStudyClick(element) {
        this.showXPGain(element, 24);
        this.addXP(24);
    },

    handleLinkBlockClick(linkId) {
        if (!this.clickedItems.has(`link-${linkId}`)) {
            this.clickedItems.add(`link-${linkId}`);
            const oldLevel = this.player.level;
            this.levelUp();
            if (typeof this.onLevelUp === 'function') this.onLevelUp(this.player.level, oldLevel);
            this.updateDisplay();
            this.saveProgress();
            this.showXPGain(document.querySelector('a[class*="Link Block 7"]'), "Level Up!");
        }
    },

    updateSublevel() {
        if (this.elements.sublevelDisplay) {
            this.elements.sublevelDisplay.textContent = this.player.sublevel;
        }
    },

    updateDisplay() {
        const {level, xp, xpNeeded, class: className} = this.player;
        const {fill, level: levelEl, xpCount, classDisplay} = this.elements;
        const classData = this.classes[className];
        const pct = xpNeeded ? `${(xp / xpNeeded) * 100}%` : '0%';

        if (fill) {
            fill.style.width = pct;
            if (classData) {
                fill.style.background = classData.color;
                fill.style.filter = this.hueRotation > 0 ?
                    `brightness(${Math.max(0.5, 1 - (this.hueRotation * 0.05))})` : 'none';
            }
        }
        if (levelEl) levelEl.textContent = `Level ${level}`;
        if (xpCount) xpCount.textContent = `${Math.floor(xp)}/${xpNeeded} XP`;
        if (classDisplay) {
            classDisplay.textContent = className;
            if (classData) classDisplay.style.color = classData.color;
        }
        if (typeof window.pretextRenderActivityXp === 'function') window.pretextRenderActivityXp();
    },

    showXPGain(item, amount) {
        const text = document.createElement('div');
        text.textContent = `+${amount} XP`;
        text.className = 'xp-gain';
        const rect = item.getBoundingClientRect();
        text.style.left = `${rect.left + rect.width/2}px`;
        text.style.top = `${rect.top}px`;
        document.body.appendChild(text);
        setTimeout(() => text.remove(), 500);
    },

    levelUp() {
        const newLevel = Math.min(99, this.player.level + 1);
        
        // Check if we're crossing a tier (levels divisible by 10)
        if (Math.floor(newLevel / 10) > Math.floor(this.player.level / 10)) {
            const randomColor = this.classes[Object.keys(this.classes)[Math.floor(Math.random() * Object.keys(this.classes).length)]].color;
            if (this.elements.flash) {
                this.elements.flash.style.backgroundColor = randomColor;
                this.elements.flash.style.opacity = '0.5';
                setTimeout(() => {
                    if (this.elements.flash) this.elements.flash.style.opacity = '0';
                }, 300);
            }
        }

        this.player.level = newLevel;
        this.player.xp = 0;
        this.player.xpNeeded = Math.floor(20 * Math.pow(1.1, this.player.level - 1));
        this.hueRotation = 0;
        
        const subIdx = this.sublevels.indexOf(this.player.sublevel);
        this.player.sublevel = subIdx < this.sublevels.length - 1 ? 
            this.sublevels[subIdx + 1] : this.sublevels[0];
        
        const oldClass = this.player.class;
        this.updateClass();
        if (oldClass !== this.player.class) this.showClassUpAnimation();
        this.updateSublevel();
    },

    updateClass() {
        let highest = {level: 1, class: 'Wanderer'};
        Object.entries(this.classes).forEach(([name, data]) => {
            if (this.player.level >= data.level && data.level > highest.level) {
                highest = {level: data.level, class: name};
            }
        });
        this.player.class = highest.class;
    },

    showClassUpAnimation() {
        if (this.elements.classDisplay) {
            this.elements.classDisplay.style.animation = 'classUp 1s ease';
        }
    },

    saveProgress() {
        localStorage.setItem('playerXP', JSON.stringify(this.player));
        localStorage.setItem('clickedItems', JSON.stringify([...this.clickedItems]));
    },

    resetProgress() {
        this.player = {level: 1, xp: 0, xpNeeded: 20, class: 'Wanderer', sublevel: 'A'};
        this.clickedItems = new Set();
        this.hueRotation = 0;
        localStorage.removeItem('playerXP');
        localStorage.removeItem('clickedItems');
        localStorage.removeItem('pretext.playerClass');
        localStorage.removeItem('pretext.combatSkills');
        localStorage.removeItem('pretext.inventory');
        localStorage.removeItem('pretext.heroName');
        localStorage.removeItem('pretext.activityState');
        localStorage.removeItem('pretext.recentActivityHistory');
        this.saveProgress();
        this.updateDisplay();
        this.updateSublevel();
        if (typeof window.pretextRenderActivityXp === 'function') window.pretextRenderActivityXp();
    },

    loadProgress() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('pretextResetRpg') === '1') {
            this.resetProgress();
            params.delete('pretextResetRpg');
            const qs = params.toString();
            const clean = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
            window.history.replaceState(null, '', clean);
            return;
        }
        const saved = localStorage.getItem('playerXP');
        const clicks = localStorage.getItem('clickedItems');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.level && data.xp !== undefined && data.xpNeeded) this.player = data;
        }
        if (clicks) this.clickedItems = new Set(JSON.parse(clicks));
    }
};

(function () {
    var prev = window.xpSystem.onLevelUp;
    window.xpSystem.onLevelUp = function (newLevel, oldLevel) {
        if (typeof window.pretextPlayLevelUpSound === 'function') window.pretextPlayLevelUpSound();
        if (typeof prev === 'function') prev(newLevel, oldLevel);
    };
})();

window.xpSystem.init();


  /* ---- silh-misc-88.js ---- */

(function () {
  /* ===================== CONFIG ===================== */
  const intervalMs = 10000;
  const stepPx = 4;
  const maxStep = 200;
  const skipChance = 0;
  const ltrBias = 0.75;
  const startTopPx = 100; // top band for first row
  const EASE_OUT_QUAD = 'cubic-bezier(0.25,0.46,0.45,0.94)';

  // ----- Hover preview -----
  function randomPosition(el) {
    const vw = window.innerWidth;
    const vh = window.innerHeight / 2; // only use top half
    const w = el.offsetWidth || 200, h = el.offsetHeight || 200;
    const ex = vw * 0.15;
    const quads = ['TL','TR','BL','BR'];
    const quad = quads[Math.floor(Math.random()*quads.length)];

    let minX=0, maxX=vw-w, minY=0, maxY=vh-h;
    if (quad==='TL'){minX=ex;maxX=Math.max(ex,vw/2-w);minY=0;maxY=Math.max(0,vh/2-h);}
    else if(quad==='TR'){minX=Math.max(vw/2,0);maxX=Math.max(minX,vw-w-ex);minY=0;maxY=Math.max(0,vh/2-h);}
    else if(quad==='BL'){minX=0;maxX=Math.max(0,vw/2-w);minY=Math.max(vh/2,0);maxY=vh-h;}
    else {minX=Math.max(vw/2,0);maxX=vw-w;minY=Math.max(vh/2,0);maxY=vh-h;}
    if (maxX<minX){minX=0;maxX=vw-w;}
    if (maxY<minY){minY=0;maxY=vh-h;}

    const x = Math.floor(minX + Math.random()*(maxX-minX));
    const y = Math.floor(minY + Math.random()*(maxY-minY));
    el.style.left = x+'px';
    el.style.top = y+'px';
  }

  function wireHoverPreviews(root) {
    const scopes = root.querySelectorAll?.('.w-dyn-item, .collection-item, [role="listitem"]');
    const list = scopes?.length ? Array.from(scopes) : [root];
    list.forEach(scope => {
      const peak = scope.querySelector('.case-peak');
      const img  = scope.querySelector('.case-img-rev');
      if (!peak || !img) return;
      img.style.position = 'fixed';
      img.style.display = 'none';
      peak.addEventListener('mouseenter', () => { randomPosition(img); img.style.display='block'; });
      peak.addEventListener('mouseleave', () => { img.style.display='none'; });
    });
  }

  /* ===================== TARGETS ===================== */
  const all = Array.from(document.querySelectorAll(".case-peak-link"));
  if (!all.length) { wireHoverPreviews(document); return; }

  // prep items + set ease-out-quad transitions
  all.forEach(el => {
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.style.top = "-9999px";
    el.style.transition = `left 280ms ${EASE_OUT_QUAD}, top 280ms ${EASE_OUT_QUAD}, opacity 220ms ${EASE_OUT_QUAD}, transform 220ms ${EASE_OUT_QUAD}`;
    el.classList.remove("is-in");
  });

  const rowH = all.reduce((h, el) => Math.max(h, el.getBoundingClientRect().height || 0), 0) || 24;

  /* ===================== CLASSIC CENTER-ORIGIN ===================== */
  const shuffle = (arr)=>{for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;};
  const stepped = (max, step)=>Math.floor(Math.random()*(Math.floor(max/step)+1))*step;

  let pool = [];
  let placed = [];
  let filledRows = new Set();
  let timer = null;

  // ✅ Only allow placement up to 50vh
  function totalRows() {
    return Math.floor((window.innerHeight * 0.5 - startTopPx) / (rowH + 2)); // rows within top 50vh
  }
  const centerX = () => window.innerWidth / 2;

  function placeNextClassic() {
    if (!pool.length) return;

    const rows = Array.from({ length: totalRows() }, (_, i) => i).filter(i => !filledRows.has(i));
    if (!rows.length) return;

    const row = rows[0];
    const top = startTopPx + row * (rowH + 2);
    filledRows.add(row);

    const el = pool.shift();
    const drift = stepped(maxStep, stepPx);
    const goRight = Math.random() < 0.5;
    const left = goRight ? centerX() + drift : centerX() - drift - el.offsetWidth;

    el.style.top = top + "px";
    el.style.left = left + "px";
    el.style.right = "auto";

    requestAnimationFrame(() => el.classList.add("is-in"));
    placed.push(el);
  }

  function startClassicCycle(auto = true) {
    clearInterval(timer);
    timer = null;
    placed.forEach(el => el.classList.remove("is-in"));
    placed = [];
    pool = shuffle([...all]);
    filledRows.clear();

    if (auto) {
      timer = setInterval(() => {
        const drops = Math.random() < 0.35 ? 2 : 1;
        for (let i = 0; i < drops; i++) placeNextClassic();
        if (pool.length === 0) { clearInterval(timer); timer = null; }
      }, intervalMs);
    }
  }

  /* ===================== KEYS ===================== */
  const keyCooldowns = {};
  window.addEventListener("keydown", (e) => {
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    const k = e.key.toLowerCase();
    if (!["r","<",",",">","."].includes(k)) return;
    if (keyCooldowns[k]) return;
    keyCooldowns[k] = true;
    setTimeout(()=>keyCooldowns[k]=false, 40);

    if (k === "r") startClassicCycle(true);
    else if (k === ">" || k === ".") placeNextClassic();
    else if (k === "<" || k === ",") {
      const el = placed.pop();
      if (el) el.classList.remove("is-in");
    }
  });

  /* ===================== INIT ===================== */
  startClassicCycle(true);

  if (document.readyState === 'loading') {
    __pretextOnReady(() => wireHoverPreviews(document));
  } else {
    wireHoverPreviews(document);
  }
})();


  /* ---- silh-split.js ---- */

(function () {
  function isSilhWhitespace(char) {
    return char === ' ' || char === '\u00a0' || char === '\t';
  }

  window.pretextSplitSilhTitleEl = function (el) {
    if (!el || el.__silhSplitDone) return;
    const text = el.textContent || '';
    el.textContent = '';
    for (const char of text) {
      const span = document.createElement('span');
      if (isSilhWhitespace(char)) {
        span.className = 'silh-ch-space';
        span.textContent = '\u00a0';
        span.setAttribute('aria-hidden', 'true');
      } else {
        span.textContent = char;
      }
      span.style.display = 'inline-block';
      el.appendChild(span);
    }
    el.__silhSplitDone = true;
    if (typeof window.pretextWireSilhLetterTabFocus === 'function') {
      window.pretextWireSilhLetterTabFocus(el);
    }
  };

  window.pretextIsSilhWhitespace = isSilhWhitespace;
})();


  /* ---- silh-axes.js ---- */

const DEFAULT_AXES = {
  wght: [88, 175],   // weight axis (locked during randomize; Shift+=/- adjust live)
  MONO: [0, 100],    // monospace axis
  SANS: [0, 100]     // sans↔serif axis ([/] step live; 100=sans, 0=serif)
};

let FIXED_WEIGHT = 122;            // starting locked weight value
let FIXED_SANS = 0;                // live SANS axis (0=serif … 100=sans)
const RANDOMIZE_EVERY_MS = 8000;   // every 8 seconds
const TRANSITION_MS = 350;         // smooth animation time
const IDLE_MS = 4000;              // 4s idle -> revert to passive

// ====== HELPERS ======
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function getAxesForEl(el) {
  try { return el.dataset.axes ? JSON.parse(el.dataset.axes) : DEFAULT_AXES; }
  catch (_) { return DEFAULT_AXES; }
}

function parseVFS(str) {
  const map = {};
  if (!str || str === 'normal') return map;
  str.split(',').forEach(part => {
    const m = part.trim().match(/["']?([A-Za-z0-9]{4})["']?\s+(-?\d+(\.\d+)?)/);
    if (m) map[m[1]] = parseFloat(m[2]);
  });
  return map;
}
function buildVFS(map) {
  return Object.entries(map).map(([tag, val]) => `'${tag}' ${Math.round(val)}`).join(', ');
}

function pickAxisValue(tag, el, axes) {
  const [min, max] = axes[tag];

  if (tag === 'SANS' && (el.classList.contains('d0t') || el.classList.contains('dummyproof'))) {
    return Math.random() < 0.05 ? 0 : 100;
  }
  if (tag === 'wght') return FIXED_WEIGHT;
  return randInt(min, max);
}

function randomizeElement(el) {
  randomizeSilhTitle(el);
}

function silhAxisTargets(el) {
  if (el.classList?.contains('silh-title')) {
    const spans = el.querySelectorAll(':scope > span');
    if (spans.length) return Array.from(spans);
  }
  return [el];
}

function silhStairWeightActive() {
  return document.documentElement.dataset.pretextSilhStairWeight === '1';
}

function randomizeSilhTitle(title) {
  const axes = getAxesForEl(title);
  const transition =
    TRANSITION_MS > 0
      ? `font-variation-settings ${TRANSITION_MS}ms ease, font-weight ${TRANSITION_MS}ms ease`
      : '';
  const stair = silhStairWeightActive();
  // Shared MONO/SANS roll for the title; wght stays per-letter under stair.
  const mono = axes.MONO ? pickAxisValue('MONO', title, axes) : null;
  const sans = axes.SANS ? pickAxisValue('SANS', title, axes) : null;
  const lockedW = axes.wght ? pickAxisValue('wght', title, axes) : null;
  silhAxisTargets(title).forEach((target) => {
    if (transition) target.style.transition = transition;
    const map = parseVFS(getComputedStyle(target).fontVariationSettings);
    if (mono != null) map.MONO = mono;
    if (sans != null) map.SANS = sans;
    if (axes.wght) {
      map.wght = stair && 'wght' in map ? map.wght : lockedW;
    }
    target.style.fontVariationSettings = buildVFS(map);
    if (map.wght != null) target.style.fontWeight = map.wght;
  });
}

function cacheSilhTitle(title) {
  silhAxisTargets(title).forEach(cachePassive);
}

function restoreSilhTitle(title) {
  silhAxisTargets(title).forEach(restorePassive);
}

function setSilhTitleWeight(title, weight) {
  silhAxisTargets(title).forEach((target) => setWeight(target, weight));
}

function setSilhTitleSans(title, sans) {
  silhAxisTargets(title).forEach((target) => setSans(target, sans));
}

function cachePassive(el) {
  const cs = getComputedStyle(el);
  el.dataset.passiveVfs = cs.fontVariationSettings;
  el.dataset.passiveFw  = cs.fontWeight;
}

function restorePassive(el) {
  if (TRANSITION_MS > 0) {
    el.style.transition = `font-variation-settings ${TRANSITION_MS}ms ease, font-weight ${TRANSITION_MS}ms ease`;
  }
  if (el.dataset.passiveVfs) el.style.fontVariationSettings = el.dataset.passiveVfs;
  if (el.dataset.passiveFw)  el.style.fontWeight = el.dataset.passiveFw;
}

function setWeight(el, weight) {
  const cs = getComputedStyle(el);
  const map = parseVFS(cs.fontVariationSettings);
  if (!('wght' in map)) map.wght = weight;
  map.wght = weight;
  el.style.fontVariationSettings = buildVFS(map);
  el.style.fontWeight = weight;
}

function setSans(el, sans) {
  const cs = getComputedStyle(el);
  const map = parseVFS(cs.fontVariationSettings);
  if (!('wght' in map)) map.wght = FIXED_WEIGHT;
  map.SANS = sans;
  el.style.fontVariationSettings = buildVFS(map);
}

/** One page-wide roll on refresh: interpolate SANS/MONO to their opposite poles. */
const SILH_REFRESH_AXIS_FLIP_CHANCE = 0.05;
/** One page-wide roll: silh-title at the lowest wght. */
const SILH_MIN_WEIGHT_CHANCE = 0.05;
/**
 * One page-wide roll: each title-row letter steps +8 wght from the left.
 */
const SILH_STAIR_WEIGHT_CHANCE = 0.05;
const SILH_STAIR_WEIGHT_STEP = 8;
/**
 * One page-wide roll: each title-row letter starts at max wght and steps −10 left→right.
 */
const SILH_STAIR_WEIGHT_REVERSE_CHANCE = 0.05;
const SILH_STAIR_WEIGHT_REVERSE_STEP = 10;

function flipAxisPole(value, min, max) {
  const v = typeof value === 'number' && !Number.isNaN(value) ? value : min;
  const mid = (min + max) / 2;
  return v >= mid ? min : max;
}

function flippedAxisMap(map, axes) {
  const next = { ...map };
  if (axes.SANS) next.SANS = flipAxisPole(next.SANS, axes.SANS[0], axes.SANS[1]);
  if (axes.MONO) next.MONO = flipAxisPole(next.MONO, axes.MONO[0], axes.MONO[1]);
  return next;
}

function applySilhAxisFlip(el) {
  const axes = getAxesForEl(el);
  const cs = getComputedStyle(el);
  const map = parseVFS(cs.fontVariationSettings);
  if (!('wght' in map)) map.wght = FIXED_WEIGHT;
  const flipped = flippedAxisMap(map, axes);
  const vfs = buildVFS(flipped);
  if (TRANSITION_MS > 0) {
    el.style.transition = `font-variation-settings ${TRANSITION_MS}ms ease, font-weight ${TRANSITION_MS}ms ease`;
  }
  el.style.fontVariationSettings = vfs;
  if ('wght' in flipped) el.style.fontWeight = flipped.wght;
  el.dataset.passiveVfs = vfs;
  el.dataset.passiveFw = String(flipped.wght ?? cs.fontWeight);
}

function collectSilhAxisFlipTargets() {
  const targets = [];
  const seen = new Set();
  const add = (el) => {
    if (!el || seen.has(el)) return;
    seen.add(el);
    targets.push(el);
  };
  document.querySelectorAll('.silh-title').forEach((title) => {
    const spans = title.querySelectorAll(':scope > span');
    if (spans.length) spans.forEach(add);
    else add(title);
  });
  document.querySelectorAll('.spawned-letter').forEach(add);
  return targets;
}

function maybeFlipSilhAxesOnLoad() {
  if (Math.random() >= SILH_REFRESH_AXIS_FLIP_CHANCE) return false;
  document.documentElement.dataset.pretextSilhAxisFlip = '1';
  window.__pretextNoteLoadEffect?.('silh-axis-flip');
  collectSilhAxisFlipTargets().forEach(applySilhAxisFlip);
  return true;
}

function maybeMinWeightSilhTitlesOnLoad() {
  if (Math.random() >= SILH_MIN_WEIGHT_CHANCE) return false;
  const minW = DEFAULT_AXES.wght[0];
  FIXED_WEIGHT = minW;
  document.documentElement.dataset.pretextSilhMinWeight = '1';
  window.__pretextNoteLoadEffect?.('silh-min-weight');
  document.querySelectorAll('.silh-title').forEach((title) => {
    silhAxisTargets(title).forEach((target) => setWeight(target, minW));
  });
  return true;
}

function ensureSilhTitleSplitForStair(title) {
  if (!title || title.__silhSplitDone) return;
  if (typeof window.pretextSplitSilhTitleEl === 'function') {
    window.pretextSplitSilhTitleEl(title);
    return;
  }
  const text = title.textContent || '';
  title.textContent = '';
  for (const char of text) {
    const span = document.createElement('span');
    span.textContent = char;
    span.style.display = 'inline-block';
    if (char === ' ' || char === '\u00a0') span.classList.add('silh-ch-space');
    title.appendChild(span);
  }
  title.__silhSplitDone = true;
}

function isSilhStairLetterSpan(span) {
  if (!span || span.classList.contains('silh-ch-space')) return false;
  const t = span.textContent || '';
  // Skip whitespace and format chars (ZWSP / LRM / etc.).
  if (!t.replace(/[\s\u200b\u200e\u200f\ufeff]/g, '').length) return false;
  return true;
}

function collectSilhStairLettersInRoot(root) {
  const letters = [];
  const titles = root.querySelectorAll
    ? root.querySelectorAll('.silh-title')
    : [];
  // Prefer direct letter titles under a row; fall back to root itself.
  const list = titles.length ? titles : (root.classList?.contains('silh-title') ? [root] : []);
  list.forEach((title) => {
    ensureSilhTitleSplitForStair(title);
    title.querySelectorAll(':scope > span').forEach((span) => {
      if (!isSilhStairLetterSpan(span)) return;
      letters.push(span);
    });
  });
  // DOM order matches reading order; jitter/transform must not reshuffle weights.
  return letters;
}

/**
 * One stair per `.title-row` (each brand/section line). Sitewide would clamp
 * to max wght after ~9 letters and flatten the look.
 */
function collectSilhStairGroups() {
  const rows = document.querySelectorAll('.title-row');
  if (rows.length) {
    return Array.from(rows)
      .map((row) => collectSilhStairLettersInRoot(row))
      .filter((letters) => letters.length > 0);
  }
  // Fallback: one group for every silh-title on the page.
  const letters = collectSilhStairLettersInRoot(document);
  return letters.length ? [letters] : [];
}

/**
 * Ascending: lightest at the first letter, then +step.
 * Reverse: heaviest at the first letter, then −step.
 */
function applySilhStairWeights(direction = 'up') {
  const [minW, maxW] = DEFAULT_AXES.wght;
  const step =
    direction === 'down' ? SILH_STAIR_WEIGHT_REVERSE_STEP : SILH_STAIR_WEIGHT_STEP;
  collectSilhStairGroups().forEach((letters) => {
    letters.forEach((span, i) => {
      const w =
        direction === 'down'
          ? clamp(maxW - i * step, minW, maxW)
          : clamp(minW + i * step, minW, maxW);
      setWeight(span, w);
    });
  });
}

function scheduleSilhStairApply(direction) {
  document.documentElement.dataset.pretextSilhStairWeight = '1';
  if (direction === 'down') {
    document.documentElement.dataset.pretextSilhStairWeightReverse = '1';
  }
  // After split/jitter DCL handlers; one extra frame so spans exist.
  requestAnimationFrame(() => {
    applySilhStairWeights(direction);
    document.querySelectorAll('.silh-title, .spawned-letter').forEach(cacheSilhTitle);
  });
}

function maybeStairWeightSilhTitlesOnLoad() {
  if (Math.random() >= SILH_STAIR_WEIGHT_CHANCE) return false;
  window.__pretextNoteLoadEffect?.('silh-stair-weight');
  scheduleSilhStairApply('up');
  return true;
}

function maybeReverseStairWeightSilhTitlesOnLoad() {
  if (Math.random() >= SILH_STAIR_WEIGHT_REVERSE_CHANCE) return false;
  window.__pretextNoteLoadEffect?.('silh-stair-weight-reverse');
  scheduleSilhStairApply('down');
  return true;
}

function finalizeSilhAxisLoadState() {
  maybeFlipSilhAxesOnLoad();
  maybeMinWeightSilhTitlesOnLoad();
  // Independent rolls; if both land, reverse applies second and wins.
  const stairUp = maybeStairWeightSilhTitlesOnLoad();
  const stairDown = maybeReverseStairWeightSilhTitlesOnLoad();
  if (!stairUp && !stairDown) {
    document.querySelectorAll('.silh-title, .spawned-letter').forEach(cacheSilhTitle);
  }
}

function scheduleSilhAxisFlipOnLoad() {
  const schedule = () => requestAnimationFrame(() => requestAnimationFrame(finalizeSilhAxisLoadState));
  if (document.readyState === 'loading') {
    __pretextOnReady(schedule);
  } else {
    schedule();
  }
}
scheduleSilhAxisFlipOnLoad();

// ====== MAIN ======
(function () {
  // Combine both classes
  const titles = Array.from(document.querySelectorAll('.silh-title, .spawned-letter'));
  if (!titles.length) return;

  titles.forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('mouseenter', () => { resetIdleTimer(); randomizeSilhTitle(el); });
    el.addEventListener('focus', () => { resetIdleTimer(); randomizeSilhTitle(el); });
  });

  // Auto-randomize
  let intervalHandle;
  const startInterval = () => {
    stopInterval();
    intervalHandle = setInterval(() => {
      if (document.hidden || !titles.length) return;
      randomizeSilhTitle(titles[Math.floor(Math.random() * titles.length)]);
    }, RANDOMIZE_EVERY_MS);
  };
  const stopInterval = () => { if (intervalHandle) clearInterval(intervalHandle); };

  // Idle logic
  let idleHandle;
  const resetIdleTimer = () => {
    if (idleHandle) clearTimeout(idleHandle);
    idleHandle = setTimeout(() => {
      titles.forEach(restoreSilhTitle);
      stopInterval();
    }, IDLE_MS);
    if (!intervalHandle && !document.hidden) startInterval();
  };

  function isSilhIdleExemptTarget(target) {
    if (!target || !target.closest) return false;
    return target.closest(
      '.gui-nav-container, .nav-header, #pretext-reading-history, #pretext-sand-panel, #pretext-sand-fab',
    ) !== null;
  }

  const activityEvents = ['mousemove', 'keydown', 'scroll', 'touchstart'];
  activityEvents.forEach(ev => {
    if (ev === 'mousemove') {
      window.addEventListener(ev, (e) => {
        if (isSilhIdleExemptTarget(e.target)) return;
        resetIdleTimer();
      }, { passive: true });
      return;
    }
    window.addEventListener(ev, resetIdleTimer, { passive: true });
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopInterval();
    else resetIdleTimer();
  });

  // Keyboard: [ / ] → SANS axis; Shift+= / Shift+- → weight; Shift+T / Shift+Y → size
  function isEditableTarget(t) {
    return t.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]');
  }
  function adjustWeight(delta) {
    if (silhStairWeightActive()) return;
    const [minW, maxW] = DEFAULT_AXES.wght;
    FIXED_WEIGHT = clamp(FIXED_WEIGHT + delta, minW, maxW);
    titles.forEach(el => setSilhTitleWeight(el, FIXED_WEIGHT));
    resetIdleTimer();
  }
  function adjustFallenLetterSans(sans) {
    const layer = document.getElementById('pretext-fallen-letter-layer');
    if (!layer) return;
    for (const el of layer.children) {
      if (!(el instanceof HTMLElement)) continue;
      if (el.classList.contains('pretext-extrude-letter-mix-stamp')) continue;
      if (el.classList.contains('pretext-pixel-sort-mix-stamp')) continue;
      setSans(el, sans);
    }
  }
  function adjustSans(delta) {
    const [minS, maxS] = DEFAULT_AXES.SANS;
    FIXED_SANS = clamp(FIXED_SANS + delta, minS, maxS);
    titles.forEach(el => setSilhTitleSans(el, FIXED_SANS));
    // Fallen chips are reparented out of .silh-title — nudge SANS on them too.
    adjustFallenLetterSans(FIXED_SANS);
    resetIdleTimer();
  }
  function adjustTitleSize(delta) {
    document.querySelectorAll('.silh-title').forEach((el) => {
      const px = parseFloat(getComputedStyle(el).fontSize) || 16;
      const next = Math.max(6, px + delta);
      el.style.fontSize = next + 'px';
    });
    // Fallen chips are reparented out of .silh-title — grow them too.
    window.__pretextAdjustFallenLetterSize?.(delta);
    // Keep Recent Activity below the fixed header as titles grow/shrink.
    window.__pretextSyncBottomStackToSilhTitles?.();
    resetIdleTimer();
  }
  window.addEventListener('keydown', (e) => {
    if (isEditableTarget(e.target)) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // [ / ] → SANS axis (±10); [ = more sans, ] = more serif
    if (!e.shiftKey && (e.key === '[' || e.code === 'BracketLeft')) {
      e.preventDefault();
      adjustSans(+10);
      return;
    }
    if (!e.shiftKey && (e.key === ']' || e.code === 'BracketRight')) {
      e.preventDefault();
      adjustSans(-10);
      return;
    }
    // Shift+= / Shift+- → fine weight (±1)
    if (!e.shiftKey) return;
    if (e.key === '+' || e.code === 'Equal' || e.code === 'NumpadAdd') {
      e.preventDefault();
      adjustWeight(+1);
      return;
    }
    if (e.key === '_' || e.code === 'Minus' || e.code === 'NumpadSubtract') {
      e.preventDefault();
      adjustWeight(-1);
      return;
    }
    // Shift+T / Shift+Y → silh-title size (±2px, min 6)
    if (e.code === 'KeyT' || e.key === 't' || e.key === 'T') {
      e.preventDefault();
      adjustTitleSize(2);
      return;
    }
    if (e.code === 'KeyY' || e.key === 'y' || e.key === 'Y') {
      e.preventDefault();
      adjustTitleSize(-2);
      return;
    }
  });

  // kick off
  startInterval();
  resetIdleTimer();
})();


  /* ---- silh-knockdown.js ---- */

/* ===============================================================
   Knock-down physics v3 (inter-letter AABB stack)
   - Click/dblclick any .case-peak-link to fall.
   - Press "F" to drop .silh-title letters currently in the viewport.
   - On load, a 5% chance plays the F fall on every on-screen title letter.
   - `,` / `.` / `/` share the 5 · V and R · V knock group (side knock, floor hole).
   - Active letters collide with peers + settled supports (AABB stack),
     like extruded box fall — not pass-through to one floor pile.
   - Hitting a settled chip wakes it (cascade) so stacks compress.
   - Press "X" to reset all to their pre-fall layout.
================================================================ */
(function () {
  // ---- Tunables ----
  const GRAVITY = 2100;           // px/s^2
  const AIR_DRAG = 0.0025;        // linear damping per ms
  const ANGULAR_DRAG = 0.004;     // angular damping per ms
  const FLOOR_PAD = 2;            // px above bottom
  const MAX_INIT_VX = 160;        // px/s
  const CLICK_IMPULSE_VX = 220;   // px/s
  const CLICK_IMPULSE_AV = 1.2;   // rad/s
  const MAX_TILT_AT_REST = 0.45;  // rad — readable tip, not endless spin
  const RESTITUTION = 0.22;
  const FRICTION = 0.55;
  const COLLISION_ITERS = 3;
  const WAKE_IMPACT_SPEED = 90;   // px/s — hard hit wakes settled support

  // Settle when grounded and slow (no same-frame floor freeze)
  const MAX_ACTIVE_MS = 2800;
  const STABLE_SPEED = 22;
  const STABLE_OMEGA = 0.55;
  const STABLE_MS = 140;
  const SUPPORT_SLACK_PX = 3;

  // ---- State ----
  const active = new Set();
  const settled = new Set();
  const culled = new Set();
  const byEl = new WeakMap();
  let raf = null, lastTs = 0;
  /** `/` shares the V · extrude floor hole — letters fall off-screen until it closes. */
  let letterFloorOpen = false;

  // ---- Helpers ----
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const floorY = () => window.innerHeight - FLOOR_PAD;
  const bodyMass = (b) => Math.max(1, b.w * b.h);

  function rotatedAABB(cx, cy, w, h, a) {
    const c = Math.cos(a), s = Math.sin(a);
    const hx = w/2, hy = h/2;
    const ax = Math.abs(c)*hx + Math.abs(s)*hy;
    const ay = Math.abs(s)*hx + Math.abs(c)*hy;
    return { minX: cx - ax, maxX: cx + ax, minY: cy - ay, maxY: cy + ay };
  }

  // Collision uses glyph ink, not the line box, so fallen letters stack on
  // their shapes. ox/oy is the ink center relative to the visual center.
  let inkMeasureCtx = null;
  const baselineRatioCache = new Map();

  function inkMeasure() {
    if (!inkMeasureCtx) inkMeasureCtx = document.createElement('canvas').getContext('2d');
    return inkMeasureCtx;
  }

  function baselineRatio(cs) {
    const key = `${cs.fontStyle}|${cs.fontWeight}|${cs.fontSize}|${cs.lineHeight}|${cs.fontFamily}|${cs.letterSpacing}`;
    const cached = baselineRatioCache.get(key);
    if (cached != null) return cached;
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none';
    const span = document.createElement('span');
    span.style.cssText = `display:inline-block;font:${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily};letter-spacing:${cs.letterSpacing}`;
    span.textContent = 'H';
    const mark = document.createElement('span');
    mark.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
    host.append(span, mark);
    document.body.appendChild(host);
    const box = span.getBoundingClientRect();
    const ratio = box.height > 0 ? (mark.getBoundingClientRect().top - box.top) / box.height : 0.8;
    host.remove();
    baselineRatioCache.set(key, ratio);
    return ratio;
  }

  function glyphCollider(el, boxW, boxH, scale) {
    const full = { w: boxW, h: boxH, ox: 0, oy: 0 };
    const s = scale > 0 ? scale : 1;
    const text = el.textContent || '';
    if (!text.trim()) return full;
    const cs = getComputedStyle(el);
    const ctx = inkMeasure();
    if (!ctx) return full;
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText(text);
    const ascent = m.actualBoundingBoxAscent || 0;
    const descent = m.actualBoundingBoxDescent || 0;
    const left = m.actualBoundingBoxLeft || 0;
    const right = m.actualBoundingBoxRight || 0;
    const inkW = left + right;
    const inkH = ascent + descent;
    if (inkW < 0.5 || inkH < 0.5) return { w: Math.max(1, boxW * 0.08), h: Math.max(1, boxH * 0.08), ox: 0, oy: 0 };
    const localW = boxW / s;
    const localH = boxH / s;
    const baseline = baselineRatio(cs) * localH;
    const inkCx = -left + inkW / 2;
    const inkCy = baseline - ascent + inkH / 2;
    return {
      w: inkW * s,
      h: inkH * s,
      ox: (inkCx - localW / 2) * s,
      oy: (inkCy - localH / 2) * s,
    };
  }

  function bodyCenter(b) {
    const c = Math.cos(b.a), s = Math.sin(b.a);
    return {
      x: b.cx + c * b.ox - s * b.oy,
      y: b.cy + s * b.ox + c * b.oy,
    };
  }

  function bodyAABB(b) {
    const p = bodyCenter(b);
    return rotatedAABB(p.x, p.y, b.w, b.h, b.a);
  }

  /** Product of every CSS `scale(...)` on the element's inline transform. */
  function readCssScale(el) {
    const tr = el.style.transform || '';
    let scale = 1;
    const re = /scale\(([^)]+)\)/gi;
    let m;
    while ((m = re.exec(tr))) {
      const parts = m[1].split(',').map((p) => parseFloat(p.trim()));
      const sx = parts[0];
      if (!Number.isFinite(sx)) continue;
      const sy = parts.length > 1 && Number.isFinite(parts[1]) ? parts[1] : sx;
      scale *= (Math.abs(sx) + Math.abs(sy)) * 0.5;
    }
    return scale > 0 ? scale : 1;
  }

  function applyToDOM(b) {
    // Center-anchored so shuffle translates stay baked into cx/cy and stamp
    // scale survives as an explicit scale() beside the physics rotation.
    b.el.style.left = Math.round(b.cx) + 'px';
    b.el.style.top  = Math.round(b.cy) + 'px';
    const sc = b.scale && b.scale !== 1 ? ` scale(${b.scale})` : '';
    b.el.style.transform = `translate(-50%, -50%)${sc} rotate(${b.a}rad)`;
    // Depth-sort with extruded brush-5 portals in the same mix layer.
    const aabb = bodyAABB(b);
    b.el.style.zIndex = String(Math.max(1, Math.round(aabb.maxY) + 1000));
  }

  /** Shared with extruded stamp portals — depth-sort by Y so letters mix in. */
  function ensureFallenLetterLayer() {
    let layer = document.getElementById('pretext-fallen-letter-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'pretext-fallen-letter-layer';
      layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer);
    }
    return layer;
  }

  function fixAtCurrent(el, preRect) {
    const r = preRect || el.getBoundingClientRect();
    const scale = readCssScale(el);
    // Bake type BEFORE reparent — leaving .silh-title drops inherited vw/em size.
    const cs = getComputedStyle(el);
    if (!el.__fall_orig) {
      el.__fall_orig = {
        position: el.style.position, left: el.style.left, top: el.style.top,
        right: el.style.right, bottom: el.style.bottom, transform: el.style.transform,
        transition: el.style.transition, pointerEvents: el.style.pointerEvents,
        transformOrigin: el.style.transformOrigin, zIndex: el.style.zIndex,
        display: el.style.display, marginRight: el.style.marginRight,
        fontSize: el.style.fontSize,
        fontFamily: el.style.fontFamily,
        fontWeight: el.style.fontWeight,
        fontStyle: el.style.fontStyle,
        fontVariationSettings: el.style.fontVariationSettings,
        lineHeight: el.style.lineHeight,
        letterSpacing: el.style.letterSpacing,
        color: el.style.color,
        parent: el.parentNode,
        nextSibling: el.nextSibling
      };
    }
    const fontPx = parseFloat(cs.fontSize);
    if (Number.isFinite(fontPx) && fontPx > 0) el.style.fontSize = fontPx + 'px';
    if (cs.fontFamily) el.style.fontFamily = cs.fontFamily;
    if (cs.fontWeight) el.style.fontWeight = cs.fontWeight;
    if (cs.fontStyle) el.style.fontStyle = cs.fontStyle;
    if (cs.fontVariationSettings && cs.fontVariationSettings !== 'normal') {
      el.style.fontVariationSettings = cs.fontVariationSettings;
    }
    if (cs.lineHeight && cs.lineHeight !== 'normal') el.style.lineHeight = cs.lineHeight;
    if (cs.letterSpacing && cs.letterSpacing !== 'normal') el.style.letterSpacing = cs.letterSpacing;
    if (cs.color) el.style.color = cs.color;
    el.style.position = 'fixed';
    el.style.left = (r.left + r.width / 2) + 'px';
    el.style.top  = (r.top + r.height / 2) + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    el.style.display = 'inline-block';
    el.style.marginRight = '0';
    el.style.transform = scale !== 1
      ? `translate(-50%, -50%) scale(${scale}) rotate(0rad)`
      : 'translate(-50%, -50%) rotate(0rad)';
    el.style.transition = 'none';
    el.style.pointerEvents = 'none';
    el.style.transformOrigin = '50% 50%';
    // Depth-sort with extruded portals — lower on screen paints in front.
    el.style.zIndex = String(Math.max(1, Math.round(r.bottom) + 1000));
    ensureFallenLetterLayer().appendChild(el);
    return { r, scale };
  }

  function makeBody(el, withImpulse, clickX, preRect) {
    const { r, scale } = fixAtCurrent(el, preRect);
    const cx = r.left + r.width/2;
    const dir = Math.sign((clickX ?? cx) - cx) || (Math.random()<0.5 ? -1 : 1);
    let vx = (Math.random()*2 - 1) * MAX_INIT_VX;
    let av = (Math.random()*2 - 1) * 0.55;
    if (withImpulse) { vx += dir * CLICK_IMPULSE_VX; av += dir * CLICK_IMPULSE_AV; }
    const now = performance.now();
    const ink = glyphCollider(el, r.width, r.height, scale);
    const b = {
      el, w: ink.w, h: ink.h, ox: ink.ox, oy: ink.oy, scale,
      cx, cy: r.top + r.height/2,
      vx, vy: 0, a: 0, av,
      settled:false,
      bornAt: now,
      lastContactAt: null,
      stableSince: null,
      grounded: false
    };
    byEl.set(el,b);
    return b;
  }

  function startFall(el, withImpulse=false, clickX=null, preRect=null) {
    // wake from settled if clicked again
    if (el.__settled) {
      const b = byEl.get(el); if (!b) return;
      b.settled = false; el.__settled = false; settled.delete(b); active.add(b);
      b.cy -= 1; // break contact
      b.grounded = false;
      b.stableSince = null;
      const dir = Math.random()<0.5 ? -1 : 1;
      b.vx += dir * CLICK_IMPULSE_VX; b.av += dir * CLICK_IMPULSE_AV;
      kick(); return;
    }
    if (el.__falling) return;
    const b = makeBody(el, withImpulse, clickX, preRect);
    el.__falling = true;
    active.add(b);
    kick();
  }

  function settle(b) {
    b.vx = b.vy = b.av = 0;
    b.a = clamp(b.a, -MAX_TILT_AT_REST, MAX_TILT_AT_REST);
    b.settled = true;
    b.grounded = true;
    applyToDOM(b);
    active.delete(b);
    settled.add(b);
    b.el.__falling = false;
    b.el.__settled = true;
    b.el.style.pointerEvents = '';
    notifyLetterImpactChanged();
  }

  function listExtrudeImpactAabbs() {
    const fn = window.pretextListExtrudeImpactAabbs;
    if (typeof fn !== 'function') return [];
    try {
      const list = fn();
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function listExtrudeImpactSamples() {
    const fn = window.pretextListExtrudeImpactSamples;
    if (typeof fn === 'function') {
      try {
        const list = fn();
        if (Array.isArray(list)) return list;
      } catch (_) { /* fall through */ }
    }
    return listExtrudeImpactAabbs();
  }

  function notifyLetterImpactChanged() {
    if (typeof window.pretextNotifyExtrudeLetterImpactChanged === 'function') {
      window.pretextNotifyExtrudeLetterImpactChanged();
    }
  }

  /**
   * Wake settled chips and transfer extrude velocity into letter bodies so
   * V · extruded meshes and silh titles shove each other (not static walls).
   */
  function shoveFallenLettersFromExtrudes() {
    const samples = listExtrudeImpactSamples();
    if (!samples.length) return 0;
    let n = 0;
    const bodies = [];
    for (const set of [settled, active]) {
      for (const b of set) bodies.push(b);
    }
    for (const b of bodies) {
      const A = bodyAABB(b);
      for (let k = 0; k < samples.length; k++) {
        const box = samples[k];
        const overlapX = Math.min(A.maxX, box.maxX) - Math.max(A.minX, box.minX);
        const overlapY = Math.min(A.maxY, box.maxY) - Math.max(A.minY, box.minY);
        if (overlapX <= 0 || overlapY <= 0) continue;
        if (b.settled) {
          b.el.__settled = false;
          b.settled = false;
          b.grounded = false;
          b.stableSince = null;
          settled.delete(b);
          active.add(b);
        }
        resolveBodyVsAabb(b, box);
        // Only transfer live Matter velocity — static / zero-vel samples must
        // not invent an outward kick (that jittered chips resting on the ~5%
        // floor seed and on nearly-asleep extrudes).
        const evx = box.vx || 0;
        const evy = box.vy || 0;
        const eav = box.av || 0;
        if (evx || evy || eav) {
          b.vx += evx * 0.55;
          b.vy += evy * 0.55;
          b.av += eav * 0.25;
        }
        n++;
      }
    }
    if (n) kick();
    return n;
  }

  /** Treat a static AABB (extruded brush-5 mesh) as an immovable support. */
  function resolveBodyVsAabb(a, box) {
    const A = bodyAABB(a);
    const overlapX = Math.min(A.maxX, box.maxX) - Math.max(A.minX, box.minX);
    const overlapY = Math.min(A.maxY, box.maxY) - Math.max(A.minY, box.minY);
    if (overlapX <= 0 || overlapY <= 0) return false;

    let nx, ny, overlap;
    if (overlapX < overlapY) {
      nx = a.cx < (box.minX + box.maxX) * 0.5 ? -1 : 1;
      ny = 0;
      overlap = overlapX;
    } else {
      nx = 0;
      ny = a.cy < (box.minY + box.maxY) * 0.5 ? -1 : 1;
      overlap = overlapY;
    }

    a.cx += nx * overlap;
    a.cy += ny * overlap;

    const vn = a.vx * nx + a.vy * ny;
    if (vn < 0) {
      const j = -(1 + RESTITUTION) * vn;
      a.vx += j * nx;
      a.vy += j * ny;
      const tx = -ny, ty = nx;
      const vt = a.vx * tx + a.vy * ty;
      if (Math.abs(vt) > 1e-4) {
        let jt = -vt;
        const maxF = Math.abs(j) * FRICTION;
        jt = clamp(jt, -maxF, maxF);
        a.vx += jt * tx;
        a.vy += jt * ty;
      }
      if (ny !== 0) {
        const dx = a.cx - (box.minX + box.maxX) * 0.5;
        a.av += clamp(dx * 0.012, -1.2, 1.2);
        a.a = clamp(a.a + clamp(dx * 0.0004, -0.06, 0.06), -MAX_TILT_AT_REST * 1.4, MAX_TILT_AT_REST * 1.4);
        a.av *= 0.82;
      }
    }
    if (ny < 0) a.grounded = true;
    return true;
  }

  // wake a settled target so piles can compress
  function wake(targetBody, nudgeDown=true) {
    if (!targetBody || !targetBody.el.__settled) return;
    targetBody.el.__settled = false;
    targetBody.settled = false;
    targetBody.grounded = false;
    targetBody.stableSince = null;
    settled.delete(targetBody);
    active.add(targetBody);
    if (nudgeDown) targetBody.vy += 60;
  }

  /**
   * Lightweight AABB contact: min-axis separation + normal impulse + friction.
   * Settled peers are immovable supports; active↔active share the push.
   */
  function resolveBodies(a, b, aStatic, bStatic) {
    const A = bodyAABB(a);
    const B = bodyAABB(b);
    const overlapX = Math.min(A.maxX, B.maxX) - Math.max(A.minX, B.minX);
    const overlapY = Math.min(A.maxY, B.maxY) - Math.max(A.minY, B.minY);
    if (overlapX <= 0 || overlapY <= 0) return false;

    const ac = bodyCenter(a);
    const bc = bodyCenter(b);
    let nx, ny, overlap;
    if (overlapX < overlapY) {
      nx = ac.x < bc.x ? -1 : 1;
      ny = 0;
      overlap = overlapX;
    } else {
      // Prefer stacking from above when roughly centered vertically-overlap-wise
      nx = 0;
      ny = ac.y < bc.y ? -1 : 1;
      overlap = overlapY;
    }

    const invA = aStatic ? 0 : 1 / bodyMass(a);
    const invB = bStatic ? 0 : 1 / bodyMass(b);
    const invSum = invA + invB;
    if (invSum <= 0) return false;

    const push = overlap / invSum;
    if (!aStatic) { a.cx += nx * push * invA; a.cy += ny * push * invA; }
    if (!bStatic) { b.cx -= nx * push * invB; b.cy -= ny * push * invB; }

    const rvx = a.vx - b.vx;
    const rvy = a.vy - b.vy;
    const vn = rvx * nx + rvy * ny;
    if (vn < 0) {
      const j = -(1 + RESTITUTION) * vn / invSum;
      if (!aStatic) { a.vx += j * nx * invA; a.vy += j * ny * invA; }
      if (!bStatic) { b.vx -= j * nx * invB; b.vy -= j * ny * invB; }

      const tx = -ny, ty = nx;
      const vt = (a.vx - b.vx) * tx + (a.vy - b.vy) * ty;
      if (Math.abs(vt) > 1e-4) {
        let jt = -vt / invSum;
        const maxF = Math.abs(j) * FRICTION;
        jt = clamp(jt, -maxF, maxF);
        if (!aStatic) { a.vx += jt * tx * invA; a.vy += jt * ty * invA; }
        if (!bStatic) { b.vx -= jt * tx * invB; b.vy -= jt * ty * invB; }
      }

      // Tip a little when landing from above — keep readable, bleed spin
      if (ny !== 0) {
        const dx = a.cx - b.cx;
        if (!aStatic) {
          a.av += clamp(dx * 0.012, -1.2, 1.2);
          a.a = clamp(a.a + clamp(dx * 0.0004, -0.06, 0.06), -MAX_TILT_AT_REST * 1.4, MAX_TILT_AT_REST * 1.4);
          a.av *= 0.82;
        }
        if (!bStatic) {
          b.av -= clamp(dx * 0.008, -0.9, 0.9);
          b.av *= 0.82;
        }
      }

      // Hard impact on a settled support → wake so the pile can re-stack
      const impact = -vn;
      if (aStatic && impact > WAKE_IMPACT_SPEED) wake(a, false);
      if (bStatic && impact > WAKE_IMPACT_SPEED) wake(b, false);
    }

    if (!aStatic && ny < 0) a.grounded = true;
    if (!bStatic && ny > 0) b.grounded = true;
    return true;
  }

  function resolveFloorAndWalls(b, floor, W) {
    const aabb = bodyAABB(b);
    if (aabb.minX < 0) {
      b.cx -= aabb.minX;
      if (b.vx < 0) b.vx = -b.vx * RESTITUTION;
    } else if (aabb.maxX > W) {
      b.cx -= aabb.maxX - W;
      if (b.vx > 0) b.vx = -b.vx * RESTITUTION;
    }

    if (letterFloorOpen) {
      const fallen = bodyAABB(b);
      if (fallen.minY > window.innerHeight + 220) cullLetter(b);
      return false;
    }

    const aabb2 = bodyAABB(b);
    if (aabb2.maxY >= floor) {
      b.cy -= (aabb2.maxY - floor);
      if (b.vy > 0) b.vy *= -RESTITUTION;
      b.vx *= 0.88;
      b.av *= 0.55;
      b.a *= 0.78;
      b.grounded = true;
      return true;
    }
    // Ceiling clamp (rare, but keeps jitter from launching off-screen)
    if (aabb2.minY < 0) {
      b.cy -= aabb2.minY;
      if (b.vy < 0) b.vy *= -0.2;
    }
    return false;
  }

  function isSupported(b, floor, extrudes) {
    const aabb = bodyAABB(b);
    if (!letterFloorOpen && aabb.maxY >= floor - SUPPORT_SLACK_PX) return true;
    for (const t of settled) {
      const bb = bodyAABB(t);
      const overlapX = Math.min(aabb.maxX, bb.maxX) - Math.max(aabb.minX, bb.minX);
      if (overlapX <= 1) continue;
      if (Math.abs(aabb.maxY - bb.minY) <= SUPPORT_SLACK_PX + 2) return true;
    }
    // Also treat another active body as a temporary support when resting on it
    for (const t of active) {
      if (t === b) continue;
      const bb = bodyAABB(t);
      const overlapX = Math.min(aabb.maxX, bb.maxX) - Math.max(aabb.minX, bb.minX);
      if (overlapX <= 1) continue;
      if (Math.abs(aabb.maxY - bb.minY) <= SUPPORT_SLACK_PX + 2 && b.cy < t.cy) return true;
    }
    // V · extruded footprints (incl. the five load-seed floor shapes)
    if (!letterFloorOpen && extrudes && extrudes.length) {
      for (let k = 0; k < extrudes.length; k++) {
        const box = extrudes[k];
        const overlapX = Math.min(aabb.maxX, box.maxX) - Math.max(aabb.minX, box.minX);
        if (overlapX <= 1) continue;
        if (Math.abs(aabb.maxY - box.minY) <= SUPPORT_SLACK_PX + 2) return true;
      }
    }
    return !!b.grounded;
  }

  function maybeAutoSettle(b, now, floor, extrudes) {
    if (now - b.bornAt > MAX_ACTIVE_MS && isSupported(b, floor, extrudes)) {
      settle(b);
      return true;
    }
    const speed = Math.hypot(b.vx, b.vy);
    const spinning = Math.abs(b.av) > STABLE_OMEGA;
    if (speed < STABLE_SPEED && !spinning && isSupported(b, floor, extrudes)) {
      if (b.stableSince == null) b.stableSince = now;
      if (now - b.stableSince > STABLE_MS) {
        settle(b);
        return true;
      }
    } else {
      b.stableSince = null;
    }
    return false;
  }

  function tick(ts) {
    if (!lastTs) lastTs = ts;
    const ms = ts - lastTs;
    const dt = Math.min(0.05, ms / 1000);
    const dampL = Math.pow(1 - AIR_DRAG, ms);
    const dampA = Math.pow(1 - ANGULAR_DRAG, ms);
    lastTs = ts;

    const floor = floorY();
    const W = window.innerWidth;
    const actives = Array.from(active);
    // Static + Matter V · extrude footprints — F used to only hit these via the
    // knock shove path, so letters fell straight through the ~5% floor seed.
    const extrudes = letterFloorOpen ? [] : listExtrudeImpactSamples();

    // Wake chips that settled under / inside an extrude (seed planted after F,
    // or a prior fall-through before this continuous resolve existed).
    if (extrudes.length) {
      for (const b of Array.from(settled)) {
        const A = bodyAABB(b);
        const h = Math.max(1, A.maxY - A.minY);
        for (let k = 0; k < extrudes.length; k++) {
          const box = extrudes[k];
          const overlapX = Math.min(A.maxX, box.maxX) - Math.max(A.minX, box.minX);
          const overlapY = Math.min(A.maxY, box.maxY) - Math.max(A.minY, box.minY);
          if (overlapX > 2 && overlapY > Math.min(12, h * 0.35)) {
            wake(b, true);
            break;
          }
        }
      }
    }

    for (const b of actives) {
      b.grounded = false;
      b.vy += (letterFloorOpen ? GRAVITY * 2 : GRAVITY) * dt;
      b.vx *= dampL; b.av *= dampA;
      b.cx += b.vx * dt; b.cy += b.vy * dt; b.a += b.av * dt;
      // Soft angular clamp while airborne so letters stay readable
      b.a = clamp(b.a, -1.15, 1.15);
      b.av = clamp(b.av, -8, 8);
    }

    // Peer + support collisions before floor snap so simultaneous F-drops stack
    for (let iter = 0; iter < COLLISION_ITERS; iter++) {
      for (let i = 0; i < actives.length; i++) {
        const a = actives[i];
        if (!active.has(a)) continue;
        for (let j = i + 1; j < actives.length; j++) {
          const b = actives[j];
          if (!active.has(b)) continue;
          if (resolveBodies(a, b, false, false)) {
            a.lastContactAt = ts;
            b.lastContactAt = ts;
          }
        }
        for (const t of Array.from(settled)) {
          if (resolveBodies(a, t, false, true)) a.lastContactAt = ts;
        }
        for (let k = 0; k < extrudes.length; k++) {
          if (resolveBodyVsAabb(a, extrudes[k])) a.lastContactAt = ts;
        }
      }
    }

    let moved = false;
    for (const b of actives) {
      if (!active.has(b)) continue;
      resolveFloorAndWalls(b, floor, W);
      if (!active.has(b)) { moved = true; continue; }
      if (maybeAutoSettle(b, ts, floor, extrudes)) { moved = true; continue; }
      applyToDOM(b);
      moved = true;
    }
    if (moved) notifyLetterImpactChanged();

    if (active.size) { raf = requestAnimationFrame(tick); }
    else { raf = null; lastTs = 0; }
  }

  function kick(){ if(!raf) raf = requestAnimationFrame(tick); }

  function restoreFallOrig(el) {
    if (!el) return;
    if (el.__fall_orig) {
      const parent = el.__fall_orig.parent;
      const next = el.__fall_orig.nextSibling;
      if (parent && parent.isConnected) {
        try {
          if (next && next.parentNode === parent) parent.insertBefore(el, next);
          else parent.appendChild(el);
        } catch (_) {
          parent.appendChild(el);
        }
      }
      el.style.position = el.__fall_orig.position || '';
      el.style.left     = el.__fall_orig.left || '';
      el.style.top      = el.__fall_orig.top || '';
      el.style.right    = el.__fall_orig.right || '';
      el.style.bottom   = el.__fall_orig.bottom || '';
      el.style.transform = el.__fall_orig.transform || '';
      el.style.transition = el.__fall_orig.transition || '';
      el.style.pointerEvents = el.__fall_orig.pointerEvents || '';
      el.style.transformOrigin = el.__fall_orig.transformOrigin || '';
      el.style.zIndex = el.__fall_orig.zIndex || '';
      el.style.display = el.__fall_orig.display || '';
      el.style.marginRight = el.__fall_orig.marginRight || '';
      el.style.fontSize = el.__fall_orig.fontSize || '';
      el.style.fontFamily = el.__fall_orig.fontFamily || '';
      el.style.fontWeight = el.__fall_orig.fontWeight || '';
      el.style.fontStyle = el.__fall_orig.fontStyle || '';
      el.style.fontVariationSettings = el.__fall_orig.fontVariationSettings || '';
      el.style.lineHeight = el.__fall_orig.lineHeight || '';
      el.style.letterSpacing = el.__fall_orig.letterSpacing || '';
      el.style.color = el.__fall_orig.color || '';
    }
    el.style.visibility = '';
    el.__falling = false;
    el.__settled = false;
    byEl.delete(el);
  }

  // Reset — instant style snap (no tween). Also used by sand scroll rewind /
  // scroll-up restore when a load fall never fully finished.
  function resetAll() {
    if (raf) cancelAnimationFrame(raf);
    raf = null; lastTs = 0;
    letterFloorOpen = false;
    loadFallAborted = true;
    for (const set of [active, settled, culled]) {
      for (const b of Array.from(set)) restoreFallOrig(b.el);
    }
    active.clear(); settled.clear(); culled.clear();
    // Orphans: mid-fall letters that left the sets, or typewriter-reveal races.
    document.querySelectorAll('.silh-title > span, .spawned-letter, .case-peak-link').forEach((el) => {
      if (el.__fall_orig || el.__falling || el.__settled) restoreFallOrig(el);
    });
    notifyLetterImpactChanged();
  }
  window.pretextResetFallenLetters = resetAll;

  function letterBodies() {
    const out = [];
    const seen = new Set();
    for (const b of settled) {
      if (seen.has(b)) continue;
      seen.add(b);
      out.push(b);
    }
    for (const b of active) {
      if (seen.has(b)) continue;
      seen.add(b);
      out.push(b);
    }
    return out;
  }

  function wakeLetter(b) {
    b.el.__settled = false;
    b.el.__falling = true;
    b.el.style.pointerEvents = 'none';
    b.settled = false;
    b.grounded = false;
    b.stableSince = null;
    b.bornAt = performance.now();
    settled.delete(b);
    culled.delete(b);
    active.add(b);
  }

  function cullLetter(b) {
    active.delete(b);
    settled.delete(b);
    culled.add(b);
    b.settled = false;
    b.el.__falling = false;
    b.el.__settled = false;
    b.el.style.visibility = 'hidden';
  }

  /**
   * Same Extrude Lab impulse as `,` / `.` on 5 · V and R · V.
   * `impulse` is the base px/s (and rad/s) before the per-letter spin stagger.
   */
  function knockFallenLetters(sign, impulse) {
    letterFloorOpen = false;
    const s = sign < 0 ? -1 : 1;
    const bodies = letterBodies();
    bodies.forEach((b, i) => {
      wakeLetter(b);
      const spinFactor = 1 + (Math.abs(i) % 3) * 0.2;
      b.vx = s * impulse.vx;
      b.vy = impulse.vy;
      b.av = s * impulse.av * spinFactor;
      b.cy -= 4;
    });
    if (bodies.length) kick();
    return bodies.length;
  }

  /** `/` on — same viewport hole as extruded 5 / R shapes. */
  function dropFallenLettersThroughFloor() {
    letterFloorOpen = true;
    const bodies = letterBodies();
    bodies.forEach((b) => {
      wakeLetter(b);
      b.vy = Math.max(b.vy, 160 + Math.random() * 120);
      b.vx *= 0.45;
      b.av += (Math.random() * 2 - 1) * 2.4;
    });
    if (bodies.length) kick();
    return bodies.length;
  }

  /** `/` off — restore the floor; letters already past it stay gone until X. */
  function closeFallenLettersFloor() {
    letterFloorOpen = false;
    const floor = floorY();
    for (const b of letterBodies()) {
      if (bodyAABB(b).minY >= floor) cullLetter(b);
    }
  }

  function collectFallenLetterImpactAabbs() {
    const out = [];
    for (const set of [active, settled]) {
      for (const b of set) out.push(bodyAABB(b));
    }
    return out;
  }

  window.pretextFallenLetterImpactAabbs = collectFallenLetterImpactAabbs;
  window.pretextKnockFallenLetters = knockFallenLetters;
  window.pretextDropFallenLettersThroughFloor = dropFallenLettersThroughFloor;
  window.pretextCloseFallenLettersFloor = closeFallenLettersFloor;
  window.pretextShoveFallenLettersFromExtrudes = shoveFallenLettersFromExtrudes;

  function ensureSilhSplit(title) {
    if (!title || title.__silhSplitDone) return;
    if (typeof window.pretextSplitSilhTitleEl === 'function') {
      window.pretextSplitSilhTitleEl(title);
      return;
    }
    const text = title.textContent || '';
    title.textContent = '';
    text.split('').forEach((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.display = 'inline-block';
      title.appendChild(span);
    });
    title.__silhSplitDone = true;
  }

  /** True when rect intersects the viewport (small margin OK). */
  function rectInViewport(r, margin = 8) {
    return (
      r.bottom > -margin &&
      r.top < window.innerHeight + margin &&
      r.right > -margin &&
      r.left < window.innerWidth + margin
    );
  }

  /** Drop silh-title letters currently in the viewport onto the floor. */
  function fallAllSilhLetters() {
    document.querySelectorAll('.silh-title').forEach(ensureSilhSplit);
    const spans = [];
    document.querySelectorAll('.silh-title').forEach((title) => {
      title.querySelectorAll(':scope > span').forEach((span) => {
        if (span.classList.contains('silh-ch-space')) return;
        if (!(span.textContent || '').trim()) return;
        spans.push(span);
      });
    });
    // Snapshot every visual rect BEFORE taking any letter out of flow —
    // otherwise earlier letters reflow the rest back toward the title origin.
    // Only letters whose rect intersects the viewport enter the fall/stack.
    const shots = spans
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter((shot) => rectInViewport(shot.r));
    shots.sort((a, b) => (b.r.top - a.r.top) || (a.r.left - b.r.left));
    shots.forEach((shot) => startFall(shot.el, false, null, shot.r));
  }

  /** Chance the load plays the full F fall on every on-screen title letter. */
  const LOAD_FALL_ALL_CHANCE = 0.05;
  /** Extra load rolls: fall after growing titles as if Shift+T were pressed N times (±2px each). */
  const LOAD_FALL_SIZE_15_CHANCE = 0.05;
  const LOAD_FALL_SIZE_30_CHANCE = 0.01;
  const SILH_SHIFT_T_PX = 2;

  /**
   * `.nav-header` is position:fixed; `.bottom-stack` (Recent Activity) clears it
   * with margin-top:15vh. When load/Shift+T grows silh titles, bump that margin
   * to at least the title-block height so the activity row stays below the type.
   */
  function syncBottomStackToSilhTitles() {
    const block = document.querySelector('.silh-title-block');
    const stack = document.querySelector('.bottom-stack');
    if (!block || !stack) return;
    const titleH = block.getBoundingClientRect().height;
    const floor = window.innerHeight * 0.15;
    const next = Math.max(floor, Math.ceil(titleH + 12));
    stack.style.marginTop = next + 'px';
  }
  window.__pretextSyncBottomStackToSilhTitles = syncBottomStackToSilhTitles;

  /** Shift+T / Shift+Y — resize fallen letter chips (physics bodies). */
  function adjustFallenLetterSize(delta) {
    const all = [...active, ...settled];
    if (!all.length) return;
    let changed = false;
    for (const b of all) {
      const el = b.el;
      if (!el || el.classList?.contains('pretext-extrude-letter-mix-stamp')) continue;
      const px = parseFloat(el.style.fontSize) || parseFloat(getComputedStyle(el).fontSize) || 16;
      const next = Math.max(6, px + delta);
      if (!(next > 0) || Math.abs(next - px) < 1e-6) continue;
      const factor = next / px;
      el.style.fontSize = next + 'px';
      b.w *= factor;
      b.h *= factor;
      b.ox *= factor;
      b.oy *= factor;
      if (b.settled) {
        b.settled = false;
        el.__settled = false;
        settled.delete(b);
        active.add(b);
        b.grounded = false;
        b.stableSince = null;
        b.cy -= 0.5;
      }
      applyToDOM(b);
      changed = true;
    }
    if (changed) kick();
  }
  window.__pretextAdjustFallenLetterSize = adjustFallenLetterSize;


  function boostSilhTitleByShiftTPresses(presses) {
    const delta = presses * SILH_SHIFT_T_PX;
    document.querySelectorAll('.silh-title').forEach((el) => {
      const px = parseFloat(getComputedStyle(el).fontSize) || 16;
      el.style.fontSize = Math.max(6, px + delta) + 'px';
      // Bigger load-chance titles: tighter track (~−4%).
      el.style.letterSpacing = '-0.04em';
    });
    // Measure after the grow, before letters leave flow for the fall.
    syncBottomStackToSilhTitles();
  }

  let loadFallDone = false;
  /** Set by resetAll / scroll-up so a mid-boot load fall stops dropping more letters. */
  let loadFallAborted = false;

  /** Resolves after silh-title typewriter finishes (or safety timeout). Load F-fall waits on this. */
  let silhTitlesReadySettled = false;
  let resolveSilhTitlesReady = () => {};
  const silhTitlesReady = new Promise((resolve) => {
    resolveSilhTitlesReady = () => {
      if (silhTitlesReadySettled) return;
      silhTitlesReadySettled = true;
      resolve();
    };
  });
  window.__pretextSilhTitlesReady = silhTitlesReady;
  window.__pretextMarkSilhTitlesReady = resolveSilhTitlesReady;
  // If the typewriter script never marks ready, do not block the load fall forever.
  setTimeout(resolveSilhTitlesReady, 5000);

  function bootLoadFalls() {
    if (loadFallDone) return;
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const pageReady = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((resolve) => window.addEventListener('load', resolve, { once: true }));
    // Wait for typewriter so hidden letters are back in flow before the F fall rolls.
    Promise.all([fontsReady, pageReady, silhTitlesReady]).then(() => {
      if (loadFallDone || loadFallAborted) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (loadFallDone || loadFallAborted) return;
          loadFallDone = true;
          // Rarest sized fall first so 1% (30×) and 5% (15×) do not stack.
          const sizeRoll = Math.random();
          let sizePresses = 0;
          if (sizeRoll < LOAD_FALL_SIZE_30_CHANCE) sizePresses = 30;
          else if (sizeRoll < LOAD_FALL_SIZE_30_CHANCE + LOAD_FALL_SIZE_15_CHANCE) sizePresses = 15;
          const plainFall = Math.random() < LOAD_FALL_ALL_CHANCE;
          if (!sizePresses && !plainFall) return;
          if (sizePresses === 30) window.__pretextNoteLoadEffect?.('silh-fall-size-30');
          else if (sizePresses === 15) window.__pretextNoteLoadEffect?.('silh-fall-size-15');
          if (plainFall) window.__pretextNoteLoadEffect?.('silh-fall-plain');
          if (sizePresses || plainFall) window.__pretextNoteLoadEffect?.('silh-fall-any');
          if (sizePresses) boostSilhTitleByShiftTPresses(sizePresses);
          const drop = () => {
            if (loadFallAborted) return;
            fallAllSilhLetters();
          };
          for (let pass = 0; pass < 8; pass++) drop();
          let frames = 0;
          const again = () => {
            if (loadFallAborted) return;
            drop();
            frames += 1;
            if (frames < 3) requestAnimationFrame(again);
          };
          requestAnimationFrame(again);
        });
      });
    });
  }

  /** Scroll back up → snap every fallen / mid-fall letter home so the phrase is whole again. */
  let fallScrollLastY = window.scrollY || 0;
  function restoreFallenLettersOnScrollUp() {
    const y = window.scrollY || 0;
    const scrollingUp = y < fallScrollLastY - 2;
    fallScrollLastY = y;
    if (!scrollingUp) return;
    // Stop a load fall that never finished dropping every letter.
    if (!loadFallDone) loadFallAborted = true;
    const hasBodies = active.size > 0 || settled.size > 0 || culled.size > 0;
    let orphan = false;
    if (!hasBodies) {
      document.querySelectorAll('.silh-title > span, .spawned-letter').forEach((el) => {
        if (el.__fall_orig || el.__falling || el.__settled) orphan = true;
      });
    }
    if (!hasBodies && !orphan) return;
    resetAll();
  }
  window.addEventListener('scroll', restoreFallenLettersOnScrollUp, { passive: true });

  function isEditableTarget(t) {
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
  }

  // Bindings
  function bind() {
    document.querySelectorAll('.case-peak-link').forEach(el => {
      if (el.__knockBound) return;
      el.__knockBound = true;
      const knock = (e)=>{ e.preventDefault(); startFall(el, true, e.clientX); };
      el.addEventListener('click', knock);
      el.addEventListener('dblclick', knock);
    });
  }
  bind();
  bootLoadFalls();
  const mo = new MutationObserver(bind);
  mo.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('keydown', (e)=>{
    if (isEditableTarget(e.target)) return;
    const k = (e.key || '').toLowerCase();
    // Paint mode owns X as starburst; leave F for silh letter-fall always.
    const paintHost = document.querySelector('.pretext-sand-screen-brush-host');
    const paintOn =
      !!paintHost && !paintHost.classList.contains('pretext-sand-screen-brush-host--disabled');
    if (k === 'f') {
      e.preventDefault();
      if (!silhTitlesReadySettled) {
        silhTitlesReady.then(() => fallAllSilhLetters());
        return;
      }
      fallAllSilhLetters();
      return;
    }
    if (k === 'x') {
      if (paintOn) return;
      resetAll();
    }
  });
})();


  /* ---- case-peak-hover.js ---- */

(function () {
  const TRIGGER_SEL = '.case-peak-link';
  const IMG_SEL     = '.case-img-rev';
  const DURATION_MS = 600;
  const MAX_BLOCK   = 36;
  const MIN_BLOCK   = 1;

  (window.Webflow = window.Webflow || []).push(init);
  window.addEventListener('load', init, { once: true });

  function init() {
    if (init._did) return; init._did = true;

    const dpr = window.devicePixelRatio || 1;

    // Single shared overlay
    const overlay = document.createElement('canvas');
    const octx = overlay.getContext('2d', { willReadFrequently: true });
    overlay.style.position = 'fixed';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '2147483647';
    overlay.style.display = 'none';
    overlay.style.willChange = 'transform,width,height,opacity';
    document.body.appendChild(overlay);

    function sizeOverlayToRect(rect) {
      const wCss = Math.max(1, Math.round(rect.width));
      const hCss = Math.max(1, Math.round(rect.height));
      overlay.style.left = Math.round(rect.left) + 'px';
      overlay.style.top  = Math.round(rect.top)  + 'px';
      overlay.style.width  = wCss + 'px';
      overlay.style.height = hCss + 'px';
      const wBuf = Math.max(1, Math.round(wCss * dpr));
      const hBuf = Math.max(1, Math.round(hCss * dpr));
      if (overlay.width !== wBuf || overlay.height !== hBuf) {
        overlay.width = wBuf; overlay.height = hBuf;
      }
    }

    // ------------- helpers -------------
    function getScopedImg(trigger) {
      let img = trigger.querySelector(IMG_SEL);
      if (!img) {
        const scope = trigger.closest('.w-dyn-item, .collection-item, [role="listitem"]') || trigger;
        img = scope.querySelector(IMG_SEL);
      }
      return img;
    }

    function waitForShownStable(el, timeout = 900) {
      return new Promise(resolve => {
        const start = performance.now();
        let stableFrames = 0, lw = 0, lh = 0;
        (function check() {
          const r = el.getBoundingClientRect();
          const ok = r.width > 2 && r.height > 2 && r.top < innerHeight && r.bottom > 0;
          const stable = Math.abs(r.width - lw) < 0.5 && Math.abs(r.height - lh) < 0.5;
          stableFrames = (ok && stable) ? stableFrames + 1 : 0;
          lw = r.width; lh = r.height;
          if (stableFrames >= 2) return resolve(true);
          if (performance.now() - start > timeout) return resolve(ok);
          requestAnimationFrame(check);
        })();
      });
    }

    function lockElementSize(el) {
      const r = el.getBoundingClientRect();
      const prev = { w: el.style.width, h: el.style.height, op: el.style.opacity };
      el.style.width  = Math.round(r.width) + 'px';
      el.style.height = Math.round(r.height) + 'px';
      return () => { el.style.width = prev.w || ''; el.style.height = prev.h || ''; el.style.opacity = prev.op || ''; };
    }

    function makeStableSource(imgEl) {
      const src = imgEl.currentSrc || imgEl.src;
      const srcImg = new Image();
      srcImg.decoding = 'sync';
      srcImg.src = src;
      return new Promise((res) => {
        if (srcImg.complete && srcImg.naturalWidth) return res(srcImg);
        srcImg.addEventListener('load', () => res(srcImg), { once: true });
        srcImg.addEventListener('error', () => res(imgEl), { once: true }); // fallback
      });
    }

    function parseObjectPosition(pos, boxW, boxH) {
      let [x, y] = (pos || '50% 50%').trim().split(/\s+/);
      if (!y) y = '50%';
      const toPx = (t, s) => {
        if (!t) return 0.5*s;
        t = t.toLowerCase();
        if (t.endsWith('%')) return (parseFloat(t)/100)*s;
        if (t === 'left' || t === 'top') return 0;
        if (t === 'center') return 0.5*s;
        if (t === 'right' || t === 'bottom') return s;
        const n = parseFloat(t); return isNaN(n) ? 0.5*s : n;
      };
      return [toPx(x, boxW), toPx(y, boxH)];
    }

    function objectFitRect(boxW, boxH, imgW, imgH, fit, pos) {
      if (!fit || fit === 'fill') return { dx: 0, dy: 0, dw: boxW, dh: boxH };
      if (fit === 'none') {
        const [px, py] = parseObjectPosition(pos, boxW - imgW, boxH - imgH);
        return { dx: px, dy: py, dw: imgW, dh: imgH };
      }
      if (fit === 'scale-down') {
        const contain = objectFitRect(boxW, boxH, imgW, imgH, 'contain', pos);
        if (imgW <= contain.dw && imgH <= contain.dh) return objectFitRect(boxW, boxH, imgW, imgH, 'none', pos);
        return contain;
      }
      const scale = (fit === 'cover') ? Math.max(boxW/imgW, boxH/imgH) : Math.min(boxW/imgW, boxH/imgH);
      const dw = imgW * scale, dh = imgH * scale;
      const [px, py] = parseObjectPosition(pos, boxW - dw, boxH - dh);
      return { dx: px, dy: py, dw, dh };
    }

    function drawPixelated(ctx, srcImg, canvas, block, computedFit) {
      const cw = canvas.width, ch = canvas.height;
      const iw = srcImg.naturalWidth  || srcImg.width;
      const ih = srcImg.naturalHeight || srcImg.height;
      if (!iw || !ih || cw < 2 || ch < 2) return;

      const fit = computedFit.objectFit || 'fill';
      const pos = computedFit.objectPosition || '50% 50%';
      const dest = objectFitRect(cw, ch, iw, ih, fit, pos);

      const smallW = Math.max(2, Math.floor(dest.dw / block));
      const smallH = Math.max(2, Math.floor(dest.dh / block));
      const off = document.createElement('canvas');
      const octx2 = off.getContext('2d', { willReadFrequently: true });
      off.width = smallW; off.height = smallH;

      octx2.imageSmoothingEnabled = true;
      octx2.clearRect(0, 0, smallW, smallH);
      octx2.drawImage(srcImg, 0, 0, iw, ih, 0, 0, smallW, smallH);

      ctx.clearRect(0, 0, cw, ch);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, 0, 0, smallW, smallH,
        Math.round(dest.dx), Math.round(dest.dy),
        Math.round(dest.dw), Math.round(dest.dh));
    }

    // -------- single-run controller --------
    let current = { trigger: null, img: null, unlock: null, token: null, rafId: 0, start: 0, rect: null, computed: null, srcImg: null };

    function cancelCurrent() {
      if (current.rafId) cancelAnimationFrame(current.rafId);
      overlay.style.display = 'none';
      overlay.width = overlay.width; // clear
      if (current.img) current.img.style.opacity = ''; // show back
      if (current.unlock) current.unlock();
      current = { trigger: null, img: null, unlock: null, token: null, rafId: 0, start: 0, rect: null, computed: null, srcImg: null };
    }

    async function startRun(trigger) {
      const img = getScopedImg(trigger);
      if (!img) return;

      // cancel any previous run immediately
      cancelCurrent();

      // ensure only this preview is visible (others opacity 0)
      document.querySelectorAll(IMG_SEL).forEach(el => { el.style.opacity = (el === img) ? '1' : '0'; });

      // wait for final size
      const ok = await waitForShownStable(img, 900);
      if (!ok) return;

      // stable source (prevents srcset swap mid-run)
      const srcImg = await makeStableSource(img);

      // lock size + hide the real image during the effect (no double image)
      const unlock = lockElementSize(img);
      img.style.opacity = '0';

      let rect = img.getBoundingClientRect();
      sizeOverlayToRect(rect);
      overlay.style.display = 'block';

      const computed = getComputedStyle(img);
      const token = {};
      current = { trigger, img, unlock, token, rafId: 0, start: 0, rect, computed, srcImg };

      // Delay first paint by one rAF so overlay size is committed (avoids "small first frame")
      requestAnimationFrame(() => {
        if (current.token !== token) return;
        current.start = performance.now();

        const step = (now) => {
          if (current.token !== token) return;
          const t = Math.min(1, (now - current.start) / DURATION_MS);
          const eased = 1 - Math.pow(1 - t, 3);
          const block = Math.max(MIN_BLOCK, Math.round(MAX_BLOCK - (MAX_BLOCK - MIN_BLOCK) * eased));

          const r = img.getBoundingClientRect();
          if (Math.abs(r.left - rect.left) > 0.5 || Math.abs(r.top - rect.top) > 0.5 ||
              Math.abs(r.width - rect.width) > 0.5 || Math.abs(r.height - rect.height) > 0.5) {
            rect = r; sizeOverlayToRect(rect); current.rect = rect;
          }

          drawPixelated(octx, srcImg, overlay, block, computed);

          if (t < 1) {
            current.rafId = requestAnimationFrame(step);
          } else {
            cancelCurrent(); // restores image + unlocks size
          }
        };
        current.rafId = requestAnimationFrame(step);
      });
    }

    // Event delegation (no duplicate listeners)
    let hoverWithin = null;

    document.addEventListener('pointerenter', (e) => {
      const trigger = e.target.closest?.(TRIGGER_SEL);
      if (!trigger || hoverWithin === trigger) return;
      hoverWithin = trigger;
      startRun(trigger);
    }, true);

    document.addEventListener('pointerleave', (e) => {
      const trigger = e.target.closest?.(TRIGGER_SEL);
      if (!trigger) return;
      requestAnimationFrame(() => {
        if (!trigger.matches(':hover')) {
          if (current.trigger === trigger) cancelCurrent();
          const img = getScopedImg(trigger);
          if (img) img.style.opacity = '0';
          if (hoverWithin === trigger) hoverWithin = null;
        }
      });
    }, true);

    // Safety sweep — throttled; the old always-on rAF loop scanned every
    // .case-peak-link on every pointermove frame and added load while hovering
    // elsewhere on the page (including recent-activity rows).
    var sweepFlag = false;
    var sweepRaf = 0;
    var lastSweepMs = 0;
    var SWEEP_MIN_MS = 200;
    function runSweep() {
      sweepRaf = 0;
      if (!sweepFlag) return;
      var now = performance.now();
      if (now - lastSweepMs < SWEEP_MIN_MS) {
        sweepRaf = requestAnimationFrame(runSweep);
        return;
      }
      lastSweepMs = now;
      sweepFlag = false;
      document.querySelectorAll(TRIGGER_SEL).forEach(function (tr) {
        if (!tr.matches(':hover')) {
          if (current.trigger === tr) cancelCurrent();
          var img = getScopedImg(tr);
          if (img) img.style.opacity = '0';
        }
      });
    }
    document.addEventListener('pointermove', function () {
      sweepFlag = true;
      if (!sweepRaf) sweepRaf = requestAnimationFrame(runSweep);
    }, { passive: true });
  }
})();


  /* ---- silh-tab-focus.js ---- */

  (function () {
    function wireSilhLetterTabFocus(root) {
      (root || document).querySelectorAll('.silh-title').forEach(function (el) {
        var spans = el.querySelectorAll(':scope > span');
        if (!spans.length) {
          if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
          return;
        }
        el.setAttribute('tabindex', '-1');
        if (!el.hasAttribute('role')) el.setAttribute('role', 'group');
        spans.forEach(function (span) {
          if (!(span.textContent || '').trim()) return;
          span.setAttribute('tabindex', '0');
          if (span.style.display === 'inline') span.style.display = 'inline-block';
        });
      });
    }
    window.pretextWireSilhLetterTabFocus = wireSilhLetterTabFocus;

    // Enhance click targets & kill selection programmatically as a fallback
    __pretextOnReady(function () {
      wireSilhLetterTabFocus();
      var els = document.querySelectorAll('.silh-title');
      els.forEach(function (el) {
        if (!el.hasAttribute('role')) el.setAttribute('role', el.querySelector(':scope > span') ? 'group' : 'button');

        // Prevent any selection that slips past CSS (Safari/iOS edge cases)
        el.addEventListener('selectstart', function (e) { e.preventDefault(); });

        el.querySelectorAll(':scope > span[tabindex="0"]').forEach(function (span) {
          span.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              el.click();
            }
          });
        });

        // Space/Enter on unsplit titles
        if (!el.querySelector(':scope > span[tabindex="0"]')) {
          el.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              el.click();
            }
          });
        }
      });
      requestAnimationFrame(function () { wireSilhLetterTabFocus(); });
    });
  })();


  /* ---- silh-jitter.js ---- */

  __pretextOnReady(function () {
    const titles = document.querySelectorAll(".silh-title");
    const allSpans = [];

    const SKEW_CHANCE_CLICK = 0; // was 0.05 — shear off for now
    const SKEW_LOAD_LETTER_COUNT = 0; // was 2 — shear off for now
    const SKEW_AMP_X = 45;    // ±deg skewX
    const SKEW_AMP_Y = 45;    // ±deg skewY

    function randIntAmp(amp) {
      if (amp <= 0) return 0;
      return Math.floor(Math.random() * (amp * 2 + 1)) - amp; // -amp..+amp
    }

    function randSkewDeg(ampDeg) {
      if (ampDeg <= 0) return 0;
      // continuous degrees in [-amp, +amp]
      return Math.random() * ampDeg * 2 - ampDeg;
    }

    // Compose: load translate (if any) + angular skew + settle rotate
    // Pattern: translate(tx,ty) skew(sxdeg, sydeg) rotate(rdeg)
    function composeSilhTransform(span) {
      const parts = [];
      const tx = Number(span.dataset.silhTx || 0);
      const ty = Number(span.dataset.silhTy || 0);
      if (tx || ty) parts.push(`translate(${tx}px, ${ty}px)`);

      const sx = Number(span.dataset.silhSkewX || 0);
      const sy = Number(span.dataset.silhSkewY || 0);
      if (sx || sy) parts.push(`skew(${sx}deg, ${sy}deg)`);

      const rot = span.dataset.silhRot;
      if (rot != null && rot !== "") parts.push(`rotate(${rot}deg)`);

      span.style.display = "inline-block";
      span.style.transform = parts.join(" ");
    }

    // Load-time position nudge only (not angular skew)
    function jitterSpan(span, ampX, ampY) {
      const ax = ampX == null ? 4 : ampX;
      const ay = ampY == null ? 4 : ampY;
      span.dataset.silhTx = String(randIntAmp(ax));
      span.dataset.silhTy = String(randIntAmp(ay));
      composeSilhTransform(span);
    }

    // Photoshop-style angular shear on one letter span
    function skewSpan(span) {
      span.dataset.silhSkewX = String(randSkewDeg(SKEW_AMP_X));
      span.dataset.silhSkewY = String(randSkewDeg(SKEW_AMP_Y));
      composeSilhTransform(span);
    }

    // Click path: shear every non-space letter in a title
    function skewTitleLetters(el) {
      el.querySelectorAll("span").forEach((span) => {
        if (span.classList.contains("silh-ch-space")) return;
        skewSpan(span);
      });
    }

    function rotateSpan(span) {
      const angle = Math.random() * 6 - 3; // [-3, 3)
      span.dataset.silhRot = String(angle);
      composeSilhTransform(span);
    }

    titles.forEach((el) => {
      if (!el.__silhSplitDone && typeof window.pretextSplitSilhTitleEl === 'function') {
        window.pretextSplitSilhTitleEl(el);
      } else if (!el.__silhSplitDone) {
        const text = el.textContent;
        el.textContent = "";
        text.split("").forEach((char) => {
          const span = document.createElement("span");
          span.textContent = char;
          span.style.display = "inline-block";
          el.appendChild(span);
        });
        el.__silhSplitDone = true;
      }

      el.querySelectorAll("span").forEach((span) => {
        if (!span.classList.contains('silh-ch-space') && span.textContent.trim().length > 0) {
          allSpans.push(span);
        }
      });

      // Click: always re-jitter letter positions; 5% also applies ±45° angular skew
      el.addEventListener("click", () => {
        el.querySelectorAll("span").forEach((span) => {
          if (!span.classList.contains("silh-ch-space")) jitterSpan(span);
        });
        if (Math.random() < SKEW_CHANCE_CLICK) {
          skewTitleLetters(el);
        }
      });
    });

    // Load: shear exactly 2 random non-space letters sitewide (not whole titles)
    if (allSpans.length) {
      const skewCount = Math.min(SKEW_LOAD_LETTER_COUNT, allSpans.length);
      const skewPicked = new Set();
      while (skewPicked.size < skewCount) {
        skewPicked.add(Math.floor(Math.random() * allSpans.length));
      }
      [...skewPicked].forEach((idx) => skewSpan(allSpans[idx]));
    }

    // Pre-jitter letterz (load-time translate nudge; independent of angular skew)
    if (allSpans.length) {
      const count = Math.min(allSpans.length, Math.floor(Math.random() * 4) + 5); // 5–8
      const picked = new Set();
      while (picked.size < count) {
        picked.add(Math.floor(Math.random() * allSpans.length));
      }
      [...picked].forEach((idx) => jitterSpan(allSpans[idx]));
    }

    // Settle look: tilt 3–5 random letter glyphs (persists after scramble/typewriter)
    const letterSpans = allSpans.filter((s) => /^[A-Za-z]$/.test(s.textContent || ""));
    const rotPool = letterSpans.length >= 3 ? letterSpans : allSpans;
    if (rotPool.length) {
      const rotCount = Math.min(rotPool.length, Math.floor(Math.random() * 3) + 3); // 3–5
      const rotPicked = new Set();
      while (rotPicked.size < rotCount) {
        rotPicked.add(Math.floor(Math.random() * rotPool.length));
      }
      [...rotPicked].forEach((idx) => rotateSpan(rotPool[idx]));
    }
  });


  /* ---- silh-stamp-shuffle.js ---- */

(function () {
  /** Multi-letter silh scale stamp — `;` / Semicolon (was Shift+T). */
  const KEY_STAMP = ';';
  /** Alt+T resets stamped silh titles; plain T / Shift+T stay with brush hatch. */
  const KEY_STAMP_RESET = 't';
  const KEY_SHUFFLE = 's';
  /** Shift+Z — plain Z is blank-canvas studio in sand-portfolio. */
  const KEY_UNSHUFFLE = 'z';

  const MAX_MARGIN_PX = 12;
  const MAX_SHIFT_X_PX = 6;
  const MAX_SHIFT_Y_PX = 2;

  const SCALE_MIN = 1.1;
  const SCALE_MAX = 4.0;
  const SCALE_STEP = 0.1;

  const AXES = { wght: [88, 175], MONO: [0, 100], SANS: [0, 100] };
  const LOCK_WEIGHT = true;

  const SHUFFLE_MIN = 4;
  const SHUFFLE_MAX = 20;
  const SHUFFLE_STEP = 2;

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  function randScale() {
    const steps = Math.round((SCALE_MAX - SCALE_MIN) / SCALE_STEP);
    const k = randInt(0, steps);
    return Math.round((SCALE_MIN + k * SCALE_STEP) * 10) / 10;
  }

  function randStepPx(min, max, step) {
    const steps = Math.round((max - min) / step);
    return min + randInt(0, steps) * step;
  }

  function isEditableTarget(t) {
    return t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
  }

  function ensureSplit(el) {
    if (el.__silhSplitDone) return;
    if (typeof window.pretextSplitSilhTitleEl === 'function') {
      window.pretextSplitSilhTitleEl(el);
    } else {
      const text = el.textContent || '';
      el.textContent = '';
      text.split('').forEach(char => {
        const s = document.createElement('span');
        s.textContent = char;
        s.style.display = 'inline-block';
        el.appendChild(s);
      });
      el.__silhSplitDone = true;
    }
    el.querySelectorAll('span').forEach(cachePassive);
  }

  function cachePassive(span) {
    if (span.__passiveCached) return;
    const cs = getComputedStyle(span);
    span.dataset.passiveVfs = cs.fontVariationSettings;
    span.dataset.passiveFw = cs.fontWeight;
    span.dataset.passiveMr = span.style.marginRight || '';
    span.dataset.passiveTr = span.style.transform || '';
    span.dataset.passiveDs = span.style.display || '';
    span.dataset.passiveTo = span.style.transformOrigin || '';
    span.dataset.passiveLh = span.style.lineHeight || '';
    span.dataset.shuffleBaseTr = span.style.transform || '';
    span.__passiveCached = true;
  }

  function restorePassive(span) {
    if (!span) return;
    span.style.fontVariationSettings = span.dataset.passiveVfs || '';
    span.style.fontWeight = span.dataset.passiveFw || '';
    span.style.marginRight = span.dataset.passiveMr || '';
    span.style.transform = span.dataset.passiveTr || '';
    span.style.display = span.dataset.passiveDs || 'inline';
    span.style.transformOrigin = span.dataset.passiveTo || '';
    span.style.lineHeight = span.dataset.passiveLh || '';
    span.classList.remove('t-stamped');
    span.removeAttribute('data-t-stamped');
    span.removeAttribute('data-s-shuffled');
    span.dataset.shuffleBaseTr = span.style.transform || '';
  }

  function getFixedWeight() {
    return typeof window.FIXED_WEIGHT === 'number' ? window.FIXED_WEIGHT : 122;
  }

  function buildRandomVFS(span) {
    const parts = [];
    for (const tag in AXES) {
      let v;
      if (tag === 'wght') v = LOCK_WEIGHT ? getFixedWeight() : randInt(AXES.wght[0], AXES.wght[1]);
      else v = randInt(AXES[tag][0], AXES[tag][1]);
      parts.push(`'${tag}' ${v}`);
      if (tag === 'wght') span.style.fontWeight = v;
    }
    span.style.fontVariationSettings = parts.join(', ');
  }

  function pickAllSpans() {
    const titles = Array.from(document.querySelectorAll('.silh-title'));
    titles.forEach(ensureSplit);
    const spans = [];
    titles.forEach(t =>
      t.querySelectorAll('span').forEach(s => {
        cachePassive(s);
        if (s.textContent && s.textContent.trim().length) spans.push(s);
      })
    );
    return spans;
  }

  function isSpecialTitleSpan(span) {
    return !!span.closest('.silh-title.dummyproof, .silh-title.d0t');
  }

  function stamp(span, scaleOverride) {
    if (!span || span.dataset.tStamped === '1') return;
    span.dataset.tStamped = '1';
    span.classList.add('t-stamped');

    const dx = randInt(-MAX_SHIFT_X_PX, MAX_SHIFT_X_PX);
    const dy = randInt(-MAX_SHIFT_Y_PX, MAX_SHIFT_Y_PX);
    const sc = scaleOverride != null ? scaleOverride : randScale();

    span.style.display = 'inline-block';
    span.style.transformOrigin = '50% 60%';
    span.style.transform = `translate(${dx}px, ${dy}px) scale(${sc})`;
    span.dataset.shuffleBaseTr = span.style.transform || '';

    if (isSpecialTitleSpan(span)) return;

    span.style.marginRight = randInt(0, MAX_MARGIN_PX) + 'px';
    buildRandomVFS(span);
  }

  function stampN(n) {
    const spans = pickAllSpans().filter(s => s.dataset.tStamped !== '1');
    for (let i = 0; i < Math.min(n, spans.length); i++) {
      const idx = Math.floor(Math.random() * spans.length);
      stamp(spans.splice(idx, 1)[0]);
    }
  }

  /** Disabled: was 5% page load roll for one silh letter at ~3× scale. */
  const SILH_LOAD_GIANT_LETTER_CHANCE = 0;
  const SILH_LOAD_GIANT_LETTER_SCALE = 3;

  function maybeStampGiantLetterOnLoad() {
    if (Math.random() >= SILH_LOAD_GIANT_LETTER_CHANCE) return;
    const spans = pickAllSpans().filter(s => s.dataset.tStamped !== '1');
    if (!spans.length) return;
    stamp(spans[Math.floor(Math.random() * spans.length)], SILH_LOAD_GIANT_LETTER_SCALE);
  }

  function resetAllStamps() {
    document.querySelectorAll('.silh-title span[data-t-stamped="1"]').forEach(restorePassive);
  }

  function shuffleAllLetters() {
    const spans = pickAllSpans();
    spans.forEach(span => {
      span.style.display = 'inline-block';
      const base = span.dataset.shuffleBaseTr || span.style.transform || '';

      const magX = randStepPx(SHUFFLE_MIN, SHUFFLE_MAX, SHUFFLE_STEP);
      const magY = randStepPx(SHUFFLE_MIN, SHUFFLE_MAX, SHUFFLE_STEP);
      const sx = (Math.random() < 0.5 ? -1 : 1) * magX;
      const sy = (Math.random() < 0.5 ? -1 : 1) * magY;

      span.style.transformOrigin = span.style.transformOrigin || '50% 60%';
      span.style.transform = `${base} translate(${sx}px, ${sy}px)`.trim();
      span.dataset.sShuffled = '1';
    });
  }

  /** Undo `s` letter jitter — restores each span to its pre-shuffle transform. */
  function unshuffleAllLetters() {
    document.querySelectorAll('.silh-title span[data-s-shuffled="1"]').forEach((span) => {
      span.style.transform = span.dataset.shuffleBaseTr || span.dataset.passiveTr || '';
      span.removeAttribute('data-s-shuffled');
    });
  }

  function typewriterReveal(totalMs) {
    const markReady = () => window.__pretextMarkSilhTitlesReady?.();
    const spans = pickAllSpans();
    const hideCount = Math.round(spans.length * 0.35);
    if (hideCount <= 0) {
      markReady();
      return;
    }

    const pool = spans.slice();
    const hidden = [];
    for (let i = 0; i < hideCount && pool.length; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      hidden.push(pool.splice(idx, 1)[0]);
    }

    hidden.forEach(s => {
      s.dataset.revealDisplay = s.style.display || 'inline';
      s.style.display = 'none';
    });
    const step = totalMs / hidden.length;
    hidden.forEach((s, i) => {
      setTimeout(() => {
        s.style.display = s.dataset.revealDisplay || 'inline';
        if (i === hidden.length - 1) markReady();
      }, Math.round(step * (i + 1)));
    });
  }

  const SCRAMBLE_FRACTION = 0.25;
  const SCRAMBLE_POOL_SIZE = 4;
  const SCRAMBLE_WORDS = [
    'Adam Ho, I.S.P.',
    'Independent',
    'Studio',
    'Practice',
    'AH, I.S.P.',
    'Silhouette',
    'Study',
    'Transient',
    'Graphic',
    'Lineage',
    'Signature',
    'Art',
  ];

  const SCRAMBLE_SYMBOLS = ['*', '^', '%', '#', '!'];

  /** Sample ≤4 distinct glyphs from lexicon letters + symbols for one scrambled letter. */
  function scrambleGlyphPool() {
    const lexicon = SCRAMBLE_WORDS.join('').replace(/\s+/g, '') + SCRAMBLE_SYMBOLS.join('');
    const pool = [];
    const seen = new Set();
    let guard = 0;
    while (pool.length < SCRAMBLE_POOL_SIZE && guard < 48) {
      guard++;
      const ch = lexicon[Math.floor(Math.random() * lexicon.length)];
      if (!ch || seen.has(ch)) continue;
      seen.add(ch);
      pool.push(ch);
    }
    return pool.length ? pool : ['A', 'H', 'I', 'S'];
  }

  /** Cycle a small glyph pool on ~25% of silh-title letters, then settle to the real char. */
  function scrambleReveal(totalMs) {
    const spans = pickAllSpans().filter((s) => {
      const t = s.textContent || '';
      return t.length === 1 && !/\s/.test(t);
    });
    const count = Math.round(spans.length * SCRAMBLE_FRACTION);
    if (count <= 0) return;

    const pool = spans.slice();
    const picked = [];
    for (let i = 0; i < count && pool.length; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }

    const tickMs = 80;
    picked.forEach((span, i) => {
      const original = span.textContent || '';
      const glyphs = scrambleGlyphPool();
      span.dataset.scrambleOrig = original;
      // Stagger settle times across the typewriter window.
      const settleAt = Math.round(
        (totalMs * 0.35) + (totalMs * 0.65) * ((i + 1) / picked.length),
      );
      const started = performance.now();
      let timer = 0;

      function tick(now) {
        if (now - started >= settleAt) {
          span.textContent = original;
          delete span.dataset.scrambleOrig;
          return;
        }
        if (now - timer >= tickMs) {
          timer = now;
          span.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (isEditableTarget(e.target)) return;
    const k = (e.key || '').toLowerCase();

    if (k === KEY_SHUFFLE) {
      e.preventDefault();
      shuffleAllLetters();
      return;
    }

    if (k === KEY_UNSHUFFLE) {
      if (!e.shiftKey) return;
      e.preventDefault();
      unshuffleAllLetters();
      return;
    }

    if (k === KEY_STAMP_RESET && e.altKey) {
      e.preventDefault();
      resetAllStamps();
      return;
    }

    if (k === KEY_STAMP || e.code === 'Semicolon') {
      e.preventDefault();
      stampN(5);
      return;
    }
  });

  __pretextOnReady(() => {
    document.querySelectorAll('.silh-title').forEach(ensureSplit);
    typewriterReveal(2000);
    // scrambleReveal(2000); — off for now
    maybeStampGiantLetterOnLoad();
  });
})();

})();
