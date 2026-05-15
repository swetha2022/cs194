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

  if (frame.getAttribute('data-src') !== src) {
    frame.setAttribute('data-src', src);
    frame.src = src;
  }

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
// Eval-task dropdown / dot logic (Evaluation Results section)
// ──────────────────────────────────────────────────────────────
const TASKS = [
  'task-pusht',
  'task-ballnav',
  'task-maze2d',
  'task-robopush',
  'task-pointmass'
];

function showTask(taskId) {
  const dots = document.querySelectorAll('#eval-dots .eval-dot');
  TASKS.forEach((id, idx) => {
    const panel  = document.getElementById(id);
    const active = (id === taskId);
    if (panel)     panel.classList.toggle('active', active);
    if (dots[idx]) dots[idx].classList.toggle('active', active);
  });
  document.getElementById('eval-task-select').value = taskId;
}

function selectTask(idx) {
  showTask(TASKS[idx]);
}

// Track currently-selected optimizers. These currently don't change the
// displayed task panel; wire them into showTask() if/when results need to
// depend on optimizer choice.
const evalState = { pretrainOpt: 'adam', finetuneOpt: 'adam' };

function setPretrainOpt(v) { evalState.pretrainOpt = v; }
function setFinetuneOpt(v) { evalState.finetuneOpt = v; }
