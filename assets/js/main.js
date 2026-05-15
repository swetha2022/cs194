// ──────────────────────────────────────────────────────────────
// Plot-swap fade animation helper.
//
// Adds `.is-loading` (fade out + blur) to the given element, swaps
// its `src`, then removes the class once the new asset finishes
// loading. Works for both <img> and <iframe>.
// ──────────────────────────────────────────────────────────────
function swapWithFade(el, newSrc) {
  if (!el || el.src === new URL(newSrc, document.baseURI).href) return;

  el.classList.add('is-loading');

  const onLoad = () => {
    el.classList.remove('is-loading');
    el.removeEventListener('load', onLoad);
  };
  el.addEventListener('load', onLoad);

  // Fallback: if `load` never fires for some reason (e.g. cached
  // resource on certain browsers), unblock after the CSS transition.
  setTimeout(() => el.classList.remove('is-loading'), 600);

  // Small delay so the fade-out is actually visible before the new
  // source kicks in (especially when the new asset loads instantly).
  setTimeout(() => { el.src = newSrc; }, 140);
}

// ──────────────────────────────────────────────────────────────
// Interactive per-tensor scatter plot switcher
//
// Each <option> inside #plot-select carries the metadata for its
// plot via data-src / data-title / data-subtitle attributes, so the
// dropdown is the single source of truth — no parallel JS array.
// ──────────────────────────────────────────────────────────────
function showPlot(key) {
  const select = document.getElementById('plot-select');
  const opts   = Array.from(select.options);
  const idx    = opts.findIndex(o => o.value === key);
  if (idx === -1) return;

  const opt   = opts[idx];
  const src   = opt.dataset.src;
  const frame = document.getElementById('plot-frame');

  swapWithFade(frame, src);

  document.getElementById('plot-title').textContent    = opt.dataset.title    || opt.textContent;
  document.getElementById('plot-subtitle').textContent = opt.dataset.subtitle || '';
  select.value = key;

  document.querySelectorAll('#plot-dots .eval-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
  });
}

function selectPlot(idx) {
  const select = document.getElementById('plot-select');
  if (idx < 0 || idx >= select.options.length) return;
  showPlot(select.options[idx].value);
}

// ──────────────────────────────────────────────────────────────
// Evaluation results: forgetting-curve image browser
//
// Plots are named   {optimizer}_{ft_type}_{benchmark}.png   inside
// the forgetting_plots/ directory. Picking an Eval Task + a
// Pretraining Optimizer swaps the Full FT and LoRA images.
// ──────────────────────────────────────────────────────────────
function updateEvalPlots() {
  const task = document.getElementById('eval-task-select').value;
  const opt  = document.getElementById('pretrain-opt-select').value;
  const base = `forgetting_plots/${opt}`;
  swapWithFade(document.getElementById('eval-img-fullft'), `${base}_full_ft_${task}.png`);
  swapWithFade(document.getElementById('eval-img-lora'),   `${base}_lora_${task}.png`);
}
