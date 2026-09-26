// NÚCLEO COMPARTILHADO DAS ÁREAS
// Utilitários de dados/formatação, tabela editável genérica e cadastro de vendas.

// ---------- Armazenamento ----------

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (saved != null) return JSON.parse(saved);
  } catch (e) { /* storage indisponível: usa o valor padrão */ }
  return typeof fallback === 'function' ? fallback() : fallback;
}

function saveData(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignora */ }
}

function newId(prefix) {
  return (prefix || 'r') + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
}

// ---------- Formatação ----------

function num(v) {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
}

function fmtBRL(v) {
  return (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtPct(ratio, digits) {
  if (ratio == null || !isFinite(ratio)) return '—';
  return (ratio * 100).toLocaleString('pt-BR', { maximumFractionDigits: digits == null ? 1 : digits }) + '%';
}

function fmtNum(v, digits) {
  if (v == null || !isFinite(v)) return '—';
  return Number(v).toLocaleString('pt-BR', { maximumFractionDigits: digits == null ? 1 : digits });
}

function pad2(n) { return String(n).padStart(2, '0'); }

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function currentMonthISO() { return todayISO().slice(0, 7); }

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function monthLabel(ym) {
  if (!ym) return '—';
  const [y, m] = ym.split('-');
  return `${MONTHS_PT[Number(m) - 1]}/${y}`;
}

function dateBR(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Meses distintos (YYYY-MM) presentes num campo das linhas, mais recentes primeiro
function distinctMonths(rows, field) {
  const set = new Set(rows.map(r => (r[field] || '').slice(0, 7)).filter(Boolean));
  return [...set].sort().reverse();
}

// ---------- DOM ----------

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (v == null || v === false) return;
    if (k === 'className') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v === true ? '' : v);
  });
  (children || []).forEach(child => {
    if (child == null || child === false) return;
    node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
  });
  return node;
}

function icon(name) { return el('i', { 'data-lucide': name }); }

function refreshIcons() { if (window.lucide) window.lucide.createIcons(); }

// Cards de indicador: [{ label, value, sub, icon, tone, valueClass }]
function statGrid(items) {
  return el('div', { className: 'stats-grid' }, items.map(it => el('div', { className: 'stat-card' }, [
    el('div', { className: 'stat-icon tone-' + (it.tone || 'blue') }, [icon(it.icon || 'activity')]),
    el('div', { className: 'stat-info' }, [
      el('span', { className: 'stat-label', text: it.label }),
      el('span', { className: 'stat-value ' + (it.valueClass || ''), text: it.value }),
      it.sub ? el('span', { className: 'stat-sub', text: it.sub }) : null
    ])
  ])));
}

function card(title, subtitle, body, extraHead) {
  return el('div', { className: 'card' }, [
    el('div', { className: 'card-head' }, [
      el('div', {}, [el('h3', { text: title }), subtitle ? el('p', { text: subtitle }) : null]),
      extraHead || null
    ]),
    ...(Array.isArray(body) ? body : [body])
  ]);
}

function panelHead(title, subtitle, right) {
  return el('div', { className: 'panel-head' }, [
    el('div', {}, [el('h2', { text: title }), subtitle ? el('p', { text: subtitle }) : null]),
    right || null
  ]);
}

// Select de filtro: options = [{ value, label }]
function filterSelect(label, options, value, onChange) {
  const select = el('select', { 'aria-label': label });
  options.forEach(o => {
    const opt = el('option', { value: o.value, text: o.label });
    if (o.value === value) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => onChange(select.value));
  return el('div', { className: 'filter-bar' }, [el('label', { text: label }), select]);
}

// Re-renderiza depois do evento atual e devolve o foco ao mesmo campo
// (permite navegar com Tab entre células sem perder a posição).
function redraw(container, draw, focusKey) {
  setTimeout(() => {
    const active = document.activeElement;
    const key = focusKey || (active && container.contains(active) ? active.dataset.cell : null);
    draw();
    if (key) {
      const target = container.querySelector(`[data-cell="${key}"]`);
      if (target) target.focus();
    }
  }, 0);
}

// ---------- Tabela editável genérica ----------
// columns: [{ key, label, type: text|number|currency|date|month|select|computed,
//             options, compute(row) -> string|Node, num, wide, placeholder }]
function recordTable(opts) {
  const { rows, columns, onChange, newRow, addLabel, emptyText, filter } = opts;
  const visible = filter ? rows.filter(filter) : rows;

  const headRow = el('tr', {}, columns.map(c =>
    el('th', { className: c.num ? 'num' : '', text: c.label })
  ));
  headRow.appendChild(el('th', {}));

  const tbody = el('tbody');

  if (visible.length === 0) {
    tbody.appendChild(el('tr', {}, [
      el('td', { className: 'empty', colspan: String(columns.length + 1), text: emptyText || 'Nenhum registro.' })
    ]));
  }

  visible.forEach(row => {
    const tr = el('tr');
    columns.forEach(c => {
      const td = el('td', { className: [c.num ? 'num' : '', c.wide ? 'col-wide' : ''].join(' ').trim() });

      if (c.type === 'computed') {
        td.className += ' computed';
        const out = c.compute(row);
        if (out instanceof Node) td.appendChild(out);
        else td.textContent = out;
      } else {
        let input;
        if (c.type === 'select') {
          input = el('select');
          c.options.forEach(o => {
            const opt = el('option', { value: o, text: o });
            if (row[c.key] === o) opt.selected = true;
            input.appendChild(opt);
          });
        } else {
          const typeMap = { text: 'text', number: 'number', currency: 'number', date: 'date', month: 'month' };
          input = el('input', {
            type: typeMap[c.type] || 'text',
            step: c.type === 'currency' ? '0.01' : (c.type === 'number' ? 'any' : null),
            min: (c.type === 'currency' || c.type === 'number') && !c.allowNegative ? '0' : null,
            placeholder: c.placeholder || null
          });
          input.value = row[c.key] == null ? '' : row[c.key];
        }
        input.dataset.cell = `${row.id}:${c.key}`;
        input.setAttribute('aria-label', c.label);
        input.addEventListener('change', () => {
          const raw = input.value;
          row[c.key] = (c.type === 'number' || c.type === 'currency') ? (raw === '' ? '' : Number(raw)) : raw;
          onChange();
        });
        td.appendChild(input);
      }
      tr.appendChild(td);
    });

    const del = el('button', { className: 'btn-icon', type: 'button', title: 'Excluir', 'aria-label': 'Excluir registro' }, [icon('trash-2')]);
    del.addEventListener('click', () => {
      if (!confirm('Excluir este registro?')) return;
      rows.splice(rows.indexOf(row), 1);
      onChange();
    });
    tr.appendChild(el('td', { className: 'actions' }, [del]));
    tbody.appendChild(tr);
  });

  const wrap = el('div', {}, [
    el('div', { className: 'table-scroll' }, [el('table', { className: 'rt' }, [el('thead', {}, [headRow]), tbody])])
  ]);

  if (newRow) {
    const add = el('button', { className: 'btn-add-row', type: 'button' }, [icon('plus'), el('span', { text: addLabel || 'Adicionar' })]);
    add.addEventListener('click', () => {
      const r = Object.assign({ id: newId() }, newRow());
      rows.push(r);
      const firstEditable = columns.find(c => c.type !== 'computed');
      onChange(firstEditable ? `${r.id}:${firstEditable.key}` : null);
    });
    wrap.appendChild(add);
  }

  return wrap;
}

// ---------- Vendas (mesma lógica da página de Negócios) ----------

const PAYMENT_STATUS = { pendente: 'Pendente', parcial: 'Parcial', pago: 'Pago', cancelado: 'Cancelado' };
const SALE_CATEGORIES = ['Consultoria', 'Implementação', 'Manutenção', 'Treinamento', 'Licença/Assinatura', 'Suporte', 'Outro'];
const PAYMENT_METHODS = ['À vista', 'PIX', 'Cartão de Crédito', 'Boleto', 'Transferência', 'Parcelado'];

// Parcelas já vencidas: a 1ª vence na data da venda e as demais mensalmente
function installmentsDue(sale) {
  const total = Number(sale.qty) || 0;
  if (total <= 0 || !sale.date) return 0;
  const saleDate = new Date(sale.date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isNaN(saleDate.getTime()) || today < saleDate) return 0;
  let months = (today.getFullYear() - saleDate.getFullYear()) * 12 + (today.getMonth() - saleDate.getMonth());
  if (today.getDate() < saleDate.getDate()) months -= 1;
  return Math.max(0, Math.min(months + 1, total));
}

function receivedForSale(sale) {
  if (sale.paymentStatus === 'cancelado') return 0;
  if (sale.paymentStatus === 'pago') return Number(sale.totalValue) || 0;
  return installmentsDue(sale) * (Number(sale.unitValue) || 0);
}

// Resumo de uma lista de vendas (canceladas fora do faturamento)
function salesSummary(sales) {
  const active = sales.filter(s => s.paymentStatus !== 'cancelado');
  const revenue = active.reduce((sum, s) => sum + (Number(s.totalValue) || 0), 0);
  const received = active.reduce((sum, s) => sum + receivedForSale(s), 0);
  return {
    count: sales.length,
    activeCount: active.length,
    revenue,
    received,
    pending: revenue - received,
    avgTicket: active.length > 0 ? revenue / active.length : 0
  };
}

let saleModalEl = null;

// Modal de venda com os mesmos campos da página de Negócios
function openSaleModal(sale, onSave) {
  if (!saleModalEl) {
    saleModalEl = el('div', { className: 'modal-backdrop', id: 'sale-modal' });
    document.body.appendChild(saleModalEl);
    saleModalEl.addEventListener('click', (e) => { if (e.target === saleModalEl) saleModalEl.classList.remove('open'); });
  }
  const s = Object.assign({
    client: '', service: '', category: 'Consultoria', seller: '', description: '',
    qty: 1, unitValue: '', totalValue: '', paymentMethod: 'À vista', paymentStatus: 'pendente',
    date: todayISO(), notes: ''
  }, sale || {});

  const field = (label, control, span) => el('div', { className: 'form-group' + (span ? ' span-2' : '') }, [el('label', { text: label }), control]);
  const input = (attrs, value) => { const i = el('input', attrs); i.value = value == null ? '' : value; return i; };
  const select = (options, value) => {
    const sel = el('select');
    options.forEach(o => {
      const [v, l] = Array.isArray(o) ? o : [o, o];
      const opt = el('option', { value: v, text: l });
      if (v === value) opt.selected = true;
      sel.appendChild(opt);
    });
    return sel;
  };
  const textarea = (rows, value, placeholder) => { const t = el('textarea', { rows: String(rows), placeholder }); t.value = value || ''; return t; };

  const fClient = input({ type: 'text', required: true, placeholder: 'Ex: Sandra Johnson / Focal Stack' }, s.client);
  const fService = input({ type: 'text', required: true, placeholder: 'Ex: Implementação do CRM' }, s.service);
  const fCategory = select(SALE_CATEGORIES, s.category);
  const fSeller = input({ type: 'text', placeholder: 'Ex: Gregory Joseph' }, s.seller);
  const fDesc = textarea(3, s.description, 'Detalhe o escopo do serviço vendido, entregáveis, prazos, etc.');
  const fQty = input({ type: 'number', min: '1', step: '1' }, s.qty);
  const fUnit = input({ type: 'number', min: '0', step: '0.01', placeholder: 'Ex: 1500.00' }, s.unitValue);
  const fTotal = input({ type: 'number', readonly: true, placeholder: 'Parcelas × valor da parcela' }, s.totalValue);
  const fMethod = select(PAYMENT_METHODS, s.paymentMethod);
  const fStatus = select(Object.entries(PAYMENT_STATUS), s.paymentStatus);
  const fDate = input({ type: 'date' }, s.date);
  const fNotes = textarea(2, s.notes, 'Informações adicionais (opcional)');

  const recalc = () => {
    const q = Number(fQty.value) || 0;
    const u = Number(fUnit.value) || 0;
    fTotal.value = q && u ? (q * u).toFixed(2) : '';
  };
  fQty.addEventListener('input', recalc);
  fUnit.addEventListener('input', recalc);

  const close = () => saleModalEl.classList.remove('open');
  const btnClose = el('button', { className: 'btn-icon edit', type: 'button', 'aria-label': 'Fechar' }, [icon('x')]);
  btnClose.addEventListener('click', close);
  const btnCancel = el('button', { className: 'btn btn-secondary', type: 'button', text: 'Cancelar' });
  btnCancel.addEventListener('click', close);

  const form = el('form', {}, [
    el('div', { className: 'modal-body' }, [
      el('div', { className: 'form-grid' }, [
        field('Cliente', fClient, true),
        field('Serviço Vendido', fService, true),
        field('Categoria do Serviço', fCategory),
        field('Vendedor / Responsável', fSeller),
        field('Descrição Detalhada', fDesc, true),
        field('Número de Parcelas', fQty),
        field('Valor da Parcela (R$)', fUnit),
        field('Valor Total (R$)', fTotal, true),
        field('Forma de Pagamento', fMethod),
        field('Status do Pagamento', fStatus),
        field('Data da Venda', fDate, true),
        field('Observações', fNotes, true)
      ])
    ]),
    el('div', { className: 'modal-footer' }, [
      btnCancel,
      el('button', { className: 'btn btn-primary', type: 'submit', text: sale ? 'Salvar Alterações' : 'Salvar Venda' })
    ])
  ]);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    recalc();
    const qty = Math.max(1, parseInt(fQty.value, 10) || 1);
    const unitValue = parseFloat(fUnit.value) || 0;
    onSave(Object.assign({}, s, {
      id: s.id || newId('sale'),
      client: fClient.value.trim(),
      service: fService.value.trim(),
      category: fCategory.value,
      seller: fSeller.value.trim(),
      description: fDesc.value.trim(),
      qty,
      unitValue,
      totalValue: qty * unitValue,
      paymentMethod: fMethod.value,
      paymentStatus: fStatus.value,
      date: fDate.value,
      notes: fNotes.value.trim()
    }));
    close();
  });

  saleModalEl.innerHTML = '';
  saleModalEl.appendChild(el('div', { className: 'modal-card' }, [
    el('div', { className: 'modal-header' }, [el('h3', { text: sale ? 'Editar Venda' : 'Cadastrar Nova Venda' }), btnClose]),
    form
  ]));
  refreshIcons();
  saleModalEl.classList.add('open');
  fClient.focus();
}

const PAY_BADGE = { pendente: 'badge-warn', parcial: 'badge-blue', pago: 'badge-good', cancelado: 'badge-bad' };

// Seção completa de vendas (indicadores + tabela + modal) para uma área
function renderSalesSection(panel, storageKey, areaName) {
  const sales = loadData(storageKey, []);

  const draw = () => {
    const sum = salesSummary(sales);
    const btnNew = el('button', { className: 'btn btn-primary', type: 'button' }, [icon('plus'), el('span', { text: 'Nova Venda' })]);
    btnNew.addEventListener('click', () => openSaleModal(null, (sale) => { sales.push(sale); commit(); }));

    const tbody = el('tbody');
    if (sales.length === 0) {
      tbody.appendChild(el('tr', {}, [el('td', { className: 'empty', colspan: '9', text: 'Nenhuma venda cadastrada. Clique em "Nova Venda" para registrar a primeira.' })]));
    }
    [...sales].sort((a, b) => (b.date || '').localeCompare(a.date || '')).forEach(sale => {
      const edit = el('button', { className: 'btn-icon edit', type: 'button', title: 'Editar', 'aria-label': 'Editar venda' }, [icon('edit-3')]);
      edit.addEventListener('click', () => openSaleModal(sale, (updated) => {
        sales[sales.indexOf(sale)] = updated;
        commit();
      }));
      const del = el('button', { className: 'btn-icon', type: 'button', title: 'Excluir', 'aria-label': 'Excluir venda' }, [icon('trash-2')]);
      del.addEventListener('click', () => {
        if (!confirm(`Excluir a venda para "${sale.client}"?`)) return;
        sales.splice(sales.indexOf(sale), 1);
        commit();
      });

      tbody.appendChild(el('tr', {}, [
        el('td', {}, [el('span', { className: 'cell-main', text: sale.client }), sale.seller ? el('span', { className: 'cell-sub', text: sale.seller }) : null]),
        el('td', {}, [el('span', { className: 'cell-main', text: sale.service }), sale.description ? el('span', { className: 'cell-sub', title: sale.description, text: sale.description }) : null]),
        el('td', {}, [el('span', { className: 'badge badge-neutral', text: sale.category })]),
        el('td', { className: 'num' }, [el('span', { className: 'cell-main', text: `${sale.qty}x` }), el('span', { className: 'cell-sub', text: `${installmentsDue(sale)}/${sale.qty} vencida(s)` })]),
        el('td', { className: 'num' }, [el('span', { className: 'cell-main', text: fmtBRL(sale.totalValue) }), el('span', { className: 'cell-sub', text: `${sale.qty}x ${fmtBRL(sale.unitValue)}` })]),
        el('td', { text: sale.paymentMethod }),
        el('td', {}, [el('span', { className: 'badge ' + (PAY_BADGE[sale.paymentStatus] || 'badge-neutral'), text: PAYMENT_STATUS[sale.paymentStatus] || sale.paymentStatus })]),
        el('td', { text: dateBR(sale.date) }),
        el('td', { className: 'actions' }, [el('div', { style: 'display:flex;gap:2px;justify-content:flex-end' }, [edit, del])])
      ]));
    });

    const headRow = el('tr', {}, ['Cliente', 'Serviço', 'Categoria', 'Parcelas', 'Valor Total', 'Pagamento', 'Status', 'Data', ''].map((h, i) =>
      el('th', { className: (i === 3 || i === 4) ? 'num' : '', text: h })));

    panel.innerHTML = '';
    panel.appendChild(panelHead('Cadastro de Vendas', `Vendas originadas por ${areaName}, com os mesmos campos da página de Negócios.`, btnNew));
    panel.appendChild(statGrid([
      { label: 'Total de Vendas', value: String(sum.count), icon: 'shopping-bag', tone: 'blue' },
      { label: 'Faturamento Total', value: fmtBRL(sum.revenue), icon: 'dollar-sign', tone: 'green' },
      { label: 'Valor Recebido', value: fmtBRL(sum.received), icon: 'check-circle-2', tone: 'green' },
      { label: 'A Receber', value: fmtBRL(sum.pending), icon: 'clock', tone: 'yellow' },
      { label: 'Ticket Médio', value: fmtBRL(sum.avgTicket), icon: 'receipt', tone: 'purple' }
    ]));
    panel.appendChild(el('div', { className: 'card' }, [
      el('div', { className: 'table-scroll' }, [el('table', { className: 'rt sales' }, [el('thead', {}, [headRow]), tbody])])
    ]));
    refreshIcons();
  };

  const commit = () => { saveData(storageKey, sales); draw(); };
  draw();
}

// ---------- Montagem da página de uma área ----------

function mountArea(area) {
  document.title = `Dinâmica Consultoria - ${area.title}`;
  document.getElementById('area-title').textContent = area.title;
  document.getElementById('area-intro').textContent = area.intro;

  const tabsEl = document.getElementById('section-tabs');
  const panel = document.getElementById('section-panel');
  const tabKey = `dinamica_tab_${area.id}`;
  let active = loadData(tabKey, area.sections[0].id);
  if (!area.sections.some(s => s.id === active)) active = area.sections[0].id;

  const show = () => {
    tabsEl.innerHTML = '';
    area.sections.forEach(sec => {
      const isActive = sec.id === active;
      const tab = el('button', {
        className: 'section-tab' + (isActive ? ' active' : ''),
        type: 'button', role: 'tab', 'aria-selected': isActive ? 'true' : 'false'
      }, [icon(sec.icon), el('span', { text: sec.label })]);
      tab.addEventListener('click', () => { active = sec.id; saveData(tabKey, active); show(); });
      tabsEl.appendChild(tab);
    });
    panel.innerHTML = '';
    area.sections.find(s => s.id === active).render(panel);
    refreshIcons();
  };
  show();
}
