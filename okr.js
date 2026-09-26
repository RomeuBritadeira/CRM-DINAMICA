// OKR — quadros editáveis por ciclo, salvos no localStorage

const OKR_STORAGE_KEY = 'dinamica_okr_v1';
const OKR_TAB_KEY = 'dinamica_okr_tab';

const STATUS_OPTIONS = ['Concluído', 'No prazo', 'Atrás', 'Vencido', 'Não iniciado'];
const STATUS_CLASS = {
  'Concluído': 'st-done',
  'No prazo': 'st-ontrack',
  'Atrás': 'st-behind',
  'Vencido': 'st-overdue',
  'Não iniciado': 'st-notstarted'
};

// Colunas editáveis de cada KR (na ordem da planilha)
const KR_FIELDS = [
  { key: 'base', label: 'VALOR BASE' },
  { key: 'target', label: 'VALOR ALVO' },
  { key: 'current', label: 'VALOR ATUAL' },
  { key: 'progress', label: 'PROGRESSO' },
  { key: 'remaining', label: 'FALTA' },
  { key: 'date', label: 'DATAS' }
];

let okrState = null;
let activeCycleId = 'c1';
let saveTimer = null;

// ---------- Persistência ----------

// Converte o formato compacto de okr-data.js no formato de edição
function normalizeSeed(seed) {
  return seed.map(cycle => ({
    id: cycle.id,
    label: cycle.label,
    period: cycle.period,
    boards: cycle.boards.map(b => ({
      title: b.t,
      cycleTag: b.c,
      start: b.i,
      end: b.f,
      sections: b.s.map(s => ({
        heading: s.h,
        objective: s.o,
        krs: s.k.map(r => ({
          code: r[0] || '',
          desc: r[1] || '',
          base: r[2] || '',
          target: r[3] || '',
          current: r[4] || '',
          progress: r[5] || '',
          remaining: r[6] || '',
          status: r[7] || 'Não iniciado',
          notes: r[8] || '',
          date: r[9] || s.d || ''
        }))
      }))
    }))
  }));
}

function loadOkrState() {
  try {
    const saved = localStorage.getItem(OKR_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* storage indisponível: usa os dados originais */ }
  return normalizeSeed(OKR_SEED);
}

function saveOkrState() {
  try {
    localStorage.setItem(OKR_STORAGE_KEY, JSON.stringify(okrState));
    flashSaveStatus('Alterações salvas');
  } catch (e) {
    flashSaveStatus('Não foi possível salvar neste navegador');
  }
}

// Agrupa digitações rápidas em um único salvamento
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveOkrState, 400);
}

function flashSaveStatus(text) {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.innerText = text;
  clearTimeout(flashSaveStatus._t);
  flashSaveStatus._t = setTimeout(() => { el.innerText = ''; }, 2000);
}

function getActiveCycle() {
  return okrState.find(c => c.id === activeCycleId) || okrState[0];
}

// ---------- Helpers de DOM ----------

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (k === 'className') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v);
  });
  (children || []).forEach(child => { if (child) node.appendChild(child); });
  return node;
}

function icon(name) {
  return el('i', { 'data-lucide': name });
}

// Campo editável ligado a um caminho no estado (board / section / kr + campo)
function editable(tag, className, value, path, placeholder) {
  const node = el(tag, {
    className,
    contenteditable: 'true',
    spellcheck: 'false',
    'data-path': JSON.stringify(path),
    'data-placeholder': placeholder || ''
  });
  node.textContent = value;
  return node;
}

// ---------- Renderização ----------

function renderTabs() {
  const tabs = document.getElementById('cycle-tabs');
  tabs.innerHTML = '';
  okrState.forEach(cycle => {
    const isActive = cycle.id === activeCycleId;
    const btn = el('button', {
      className: 'cycle-tab' + (isActive ? ' active' : ''),
      type: 'button',
      role: 'tab',
      'aria-selected': isActive ? 'true' : 'false',
      'data-cycle': cycle.id
    }, [
      el('span', { text: cycle.label }),
      el('small', { text: cycle.period })
    ]);
    tabs.appendChild(btn);
  });
}

function renderChips(cycle) {
  const chips = document.getElementById('board-chips');
  chips.innerHTML = '';
  cycle.boards.forEach((board, b) => {
    chips.appendChild(el('button', {
      className: 'board-chip',
      type: 'button',
      'data-board': String(b),
      text: board.title
    }));
  });
}

function renderSummary(board) {
  const counts = {};
  board.sections.forEach(s => s.krs.forEach(kr => {
    counts[kr.status] = (counts[kr.status] || 0) + 1;
  }));
  const wrap = el('div', { className: 'board-summary' });
  STATUS_OPTIONS.forEach(st => {
    if (!counts[st]) return;
    wrap.appendChild(el('span', {
      className: 'summary-pill ' + STATUS_CLASS[st],
      text: `${counts[st]} ${st}`
    }));
  });
  return wrap;
}

function renderStatusSelect(kr, path) {
  const select = el('select', {
    className: 'status-select ' + (STATUS_CLASS[kr.status] || ''),
    'data-path': JSON.stringify(path),
    'aria-label': 'Status do KR'
  });
  STATUS_OPTIONS.forEach(st => {
    const opt = el('option', { value: st, text: st });
    if (st === kr.status) opt.selected = true;
    select.appendChild(opt);
  });
  return select;
}

function renderSection(section, b, s) {
  const wrap = el('div', { className: 'okr-section' });

  wrap.appendChild(el('div', { className: 'section-heading' }, [
    editable('span', 'heading-cell', section.heading, ['section', b, s, 'heading'], 'Título da seção')
  ]));

  const headRow = el('tr', {}, [
    el('th', { className: 'th-objective', colspan: '2' }, [
      editable('span', 'objective-cell', section.objective, ['section', b, s, 'objective'], 'Objetivo')
    ])
  ]);
  KR_FIELDS.forEach(f => headRow.appendChild(el('th', { text: f.label })));
  headRow.appendChild(el('th', { text: 'STATUS' }));
  headRow.appendChild(el('th', { text: 'OBSERVAÇÃO' }));
  headRow.appendChild(el('th', { className: 'td-actions' }));

  const tbody = el('tbody');
  section.krs.forEach((kr, k) => {
    const row = el('tr', {}, [
      el('td', { className: 'td-code' }, [editable('span', 'cell', kr.code, ['kr', b, s, k, 'code'], 'KR')]),
      el('td', { className: 'td-desc' }, [editable('span', 'cell', kr.desc, ['kr', b, s, k, 'desc'], 'Descrição do KR')])
    ]);
    KR_FIELDS.forEach(f => {
      row.appendChild(el('td', {}, [editable('span', 'cell', kr[f.key], ['kr', b, s, k, f.key], '')]));
    });
    row.appendChild(el('td', {}, [renderStatusSelect(kr, ['kr', b, s, k, 'status'])]));
    row.appendChild(el('td', { className: 'td-notes' }, [editable('span', 'cell', kr.notes, ['kr', b, s, k, 'notes'], '')]));
    row.appendChild(el('td', { className: 'td-actions' }, [
      el('button', {
        className: 'btn-del-kr',
        type: 'button',
        title: 'Excluir KR',
        'aria-label': 'Excluir KR',
        'data-action': 'del-kr',
        'data-b': String(b), 'data-s': String(s), 'data-k': String(k)
      }, [icon('trash-2')])
    ]));
    tbody.appendChild(row);
  });

  wrap.appendChild(el('div', { className: 'table-scroll' }, [
    el('table', { className: 'okr-table' }, [el('thead', {}, [headRow]), tbody])
  ]));

  wrap.appendChild(el('button', {
    className: 'btn-add-kr',
    type: 'button',
    'data-action': 'add-kr',
    'data-b': String(b), 'data-s': String(s)
  }, [icon('plus'), el('span', { text: 'Adicionar KR' })]));

  return wrap;
}

function renderBoard(board, b) {
  const card = el('section', { className: 'okr-board', id: `board-${b}` });

  const head = el('div', { className: 'board-head' }, [
    el('div', {}, [
      editable('div', 'board-cycle-tag', board.cycleTag, ['board', b, 'cycleTag'], 'Ciclo'),
      editable('h2', 'board-title', board.title, ['board', b, 'title'], 'Diretoria')
    ]),
    el('div', { className: 'board-dates' }, [
      el('span', { className: 'lbl', text: 'Início:' }),
      editable('span', 'val', board.start, ['board', b, 'start'], 'dd/mm/aaaa'),
      el('span', { className: 'lbl', text: 'Término:' }),
      editable('span', 'val', board.end, ['board', b, 'end'], 'dd/mm/aaaa')
    ]),
    renderSummary(board)
  ]);
  card.appendChild(head);

  board.sections.forEach((section, s) => card.appendChild(renderSection(section, b, s)));
  return card;
}

function renderOkr() {
  const cycle = getActiveCycle();
  activeCycleId = cycle.id;

  renderTabs();
  renderChips(cycle);

  const content = document.getElementById('okr-content');
  content.innerHTML = '';

  if (cycle.boards.length === 0) {
    content.appendChild(el('div', { className: 'okr-empty', text: 'Nenhum quadro de OKR neste ciclo.' }));
  } else {
    cycle.boards.forEach((board, b) => content.appendChild(renderBoard(board, b)));
  }

  if (window.lucide) window.lucide.createIcons();
}

// ---------- Edição ----------

// Aplica um valor no estado a partir do caminho gravado no elemento
function setByPath(path, value) {
  const boards = getActiveCycle().boards;
  const [scope, b, s, third, fourth] = path;
  if (scope === 'board') {
    boards[b][s] = value; // aqui "s" é o nome do campo
  } else if (scope === 'section') {
    boards[b].sections[s][third] = value;
  } else if (scope === 'kr') {
    boards[b].sections[s].krs[third][fourth] = value;
  }
}

function bindOkrEvents() {
  const content = document.getElementById('okr-content');

  // Digitação em qualquer campo editável: salva sem re-renderizar (mantém o cursor)
  content.addEventListener('input', (e) => {
    const target = e.target.closest('[contenteditable][data-path]');
    if (!target) return;
    setByPath(JSON.parse(target.dataset.path), target.textContent.trim());
    scheduleSave();
  });

  // Enter confirma a edição em vez de quebrar linha
  content.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.matches('[contenteditable]')) {
      e.preventDefault();
      e.target.blur();
    }
  });

  // Colar sempre como texto simples
  content.addEventListener('paste', (e) => {
    if (!e.target.closest('[contenteditable]')) return;
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\s*\n\s*/g, ' ');
    document.execCommand('insertText', false, text);
  });

  // Mudança de status: atualiza cor e o resumo do quadro
  content.addEventListener('change', (e) => {
    if (!e.target.matches('.status-select')) return;
    setByPath(JSON.parse(e.target.dataset.path), e.target.value);
    saveOkrState();
    renderOkr();
  });

  // Adicionar / excluir KR
  content.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const b = Number(btn.dataset.b);
    const s = Number(btn.dataset.s);
    const section = getActiveCycle().boards[b].sections[s];

    if (btn.dataset.action === 'add-kr') {
      const last = section.krs[section.krs.length - 1];
      section.krs.push({
        code: `KR 1.${section.krs.length + 1}`,
        desc: '', base: '', target: '', current: '', progress: '', remaining: '',
        date: last ? last.date : '',
        status: 'Não iniciado',
        notes: ''
      });
    } else if (btn.dataset.action === 'del-kr') {
      const k = Number(btn.dataset.k);
      const kr = section.krs[k];
      const name = kr.desc ? `"${kr.desc}"` : kr.code;
      if (!confirm(`Excluir o ${kr.code} ${name}?`)) return;
      section.krs.splice(k, 1);
    }
    saveOkrState();
    renderOkr();
  });

  // Troca de aba de ciclo
  document.getElementById('cycle-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.cycle-tab');
    if (!tab) return;
    activeCycleId = tab.dataset.cycle;
    try { localStorage.setItem(OKR_TAB_KEY, activeCycleId); } catch (err) { /* ignora */ }
    renderOkr();
    window.scrollTo({ top: 0 });
  });

  // Atalho para a diretoria
  document.getElementById('board-chips').addEventListener('click', (e) => {
    const chip = e.target.closest('.board-chip');
    if (!chip) return;
    const target = document.getElementById(`board-${chip.dataset.board}`);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Restaurar os dados originais das planilhas
  document.getElementById('btn-reset-okr').addEventListener('click', () => {
    if (!confirm('Restaurar todos os ciclos para os dados originais das planilhas? As edições feitas serão perdidas.')) return;
    okrState = normalizeSeed(OKR_SEED);
    saveOkrState();
    renderOkr();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  okrState = loadOkrState();
  try {
    const savedTab = localStorage.getItem(OKR_TAB_KEY);
    if (savedTab) activeCycleId = savedTab;
  } catch (e) { /* ignora */ }

  bindOkrEvents();
  renderOkr();
});
