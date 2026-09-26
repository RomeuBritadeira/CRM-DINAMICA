// SEÇÕES DE CADA ÁREA + PAINEL DA PRESIDÊNCIA
// As funções de métrica ficam separadas da renderização para que a
// Presidência consolide exatamente os mesmos números mostrados em cada área.

const KEYS = {
  jfRevenue: 'dinamica_jf_receita',
  jfCash: 'dinamica_jf_caixa',
  jfCashOpening: 'dinamica_jf_saldo_inicial',
  jfReceivables: 'dinamica_jf_recebiveis',
  projDeliveries: 'dinamica_proj_entregas',
  projSales: 'dinamica_proj_vendas',
  mktActions: 'dinamica_mkt_acoes',
  mktSales: 'dinamica_mkt_vendas',
  dhoTurnover: 'dinamica_dho_turnover',
  dhoTrainings: 'dinamica_dho_capacitacoes',
  dhoMembers: 'dinamica_dho_membros',
  dhoEnps: 'dinamica_dho_enps',
  negSales: 'neg_crm_sales',
  negTasks: 'neg_crm_tasks',
  negStatuses: 'neg_crm_statuses',
  okr: 'dinamica_okr_v1'
};

// ---------- Dados iniciais ----------

function seedRevenueMonths() {
  const year = new Date().getFullYear();
  return MONTHS_PT.map((_, i) => ({ id: newId(), month: `${year}-${pad2(i + 1)}`, meta: '', realized: '' }));
}

function seedTurnover() {
  return ['1º Ciclo', '2º Ciclo', '3º Ciclo'].map(c => ({ id: newId(), cycle: c, start: '', admissions: '', departures: '', end: '' }));
}

function seedEnps() {
  const year = new Date().getFullYear();
  return [1, 2, 3, 4].map(q => ({ id: newId(), quarter: `${q}º Tri/${year}`, promoters: '', passives: '', detractors: '' }));
}

// ---------- Helpers de status ----------

function badge(text, kind) { return el('span', { className: 'badge badge-' + kind, text }); }

function revenueClass(ratio) {
  if (ratio == null) return '';
  return ratio >= 1 ? 'is-good' : ratio >= 0.8 ? 'is-warn' : 'is-bad';
}

// Meta de CSAT dos OKRs de Projetos: nota 9
function csatClass(v) {
  if (v == null) return '';
  return v >= 9 ? 'is-good' : v >= 7 ? 'is-warn' : 'is-bad';
}

// Zonas usuais do eNPS
function enpsZone(v) {
  if (v == null) return { label: 'Sem dados', kind: 'neutral', cls: '' };
  if (v >= 75) return { label: 'Excelência', kind: 'good', cls: 'is-good' };
  if (v >= 50) return { label: 'Qualidade', kind: 'good', cls: 'is-good' };
  if (v >= 0) return { label: 'Aperfeiçoamento', kind: 'warn', cls: 'is-warn' };
  return { label: 'Crítica', kind: 'bad', cls: 'is-bad' };
}

function sumBy(rows, field) { return rows.reduce((s, r) => s + (num(r[field]) || 0), 0); }

// ============================================================
// MÉTRICAS
// ============================================================

// Vendas de todas as origens (Negócios, Projetos, Marketing)
function allSalesByOrigin() {
  return [
    { origin: 'Negócios', color: '#2B6CB0', sales: loadData(KEYS.negSales, []) },
    { origin: 'Projetos', color: '#2E9E6B', sales: loadData(KEYS.projSales, []) },
    { origin: 'Marketing', color: '#DD6B20', sales: loadData(KEYS.mktSales, []) }
  ];
}

function salesInMonth(ym) {
  return allSalesByOrigin().reduce((sum, o) => sum + o.sales
    .filter(s => s.paymentStatus !== 'cancelado' && (s.date || '').startsWith(ym))
    .reduce((t, s) => t + (Number(s.totalValue) || 0), 0), 0);
}

function jfRevenueMetrics(rows, month) {
  const row = rows.find(r => r.month === month) || {};
  const meta = num(row.meta);
  const realized = num(row.realized);
  const year = (month || currentMonthISO()).slice(0, 4);
  const ytdRows = rows.filter(r => (r.month || '').startsWith(year) && r.month <= currentMonthISO());
  const ytdMeta = sumBy(ytdRows, 'meta');
  const ytdRealized = sumBy(ytdRows, 'realized');
  return {
    meta, realized,
    ratio: meta ? (realized || 0) / meta : null,
    diff: meta != null || realized != null ? (realized || 0) - (meta || 0) : null,
    ytdMeta, ytdRealized,
    ytdRatio: ytdMeta ? ytdRealized / ytdMeta : null
  };
}

function cashMetrics(rows, opening, month) {
  const inPeriod = rows.filter(r => month === 'all' || (r.date || '').startsWith(month));
  const inflow = inPeriod.filter(r => r.type === 'Entrada').reduce((s, r) => s + (num(r.value) || 0), 0);
  const outflow = inPeriod.filter(r => r.type === 'Saída').reduce((s, r) => s + (num(r.value) || 0), 0);
  const totalIn = rows.filter(r => r.type === 'Entrada').reduce((s, r) => s + (num(r.value) || 0), 0);
  const totalOut = rows.filter(r => r.type === 'Saída').reduce((s, r) => s + (num(r.value) || 0), 0);
  return { inflow, outflow, result: inflow - outflow, balance: (num(opening) || 0) + totalIn - totalOut };
}

// Inadimplência = valor vencido e não pago ÷ valor total já vencido
function receivableMetrics(rows) {
  const today = todayISO();
  const overdue = rows.filter(r => r.due && r.due < today);
  const overdueTotal = overdue.reduce((s, r) => s + (num(r.value) || 0), 0);
  const unpaid = overdue.filter(r => r.status !== 'Pago');
  const unpaidValue = unpaid.reduce((s, r) => s + (num(r.value) || 0), 0);
  const openTotal = rows.filter(r => r.status !== 'Pago').reduce((s, r) => s + (num(r.value) || 0), 0);
  return {
    rate: overdueTotal > 0 ? unpaidValue / overdueTotal : null,
    unpaidValue,
    unpaidCount: unpaid.length,
    openTotal
  };
}

function deliveryStatus(r) {
  const today = todayISO();
  if (r.delivered) {
    if (r.due && r.delivered > r.due) return { label: 'Entregue com atraso', kind: 'bad', onTime: false };
    return { label: 'Entregue no prazo', kind: 'good', onTime: true };
  }
  if (r.due && r.due < today) return { label: 'Pendente (vencida)', kind: 'bad' };
  return { label: 'Pendente', kind: 'neutral' };
}

function deliveryMetrics(rows) {
  const delivered = rows.filter(r => r.delivered);
  const onTime = delivered.filter(r => deliveryStatus(r).onTime);
  const csats = rows.map(r => num(r.csat)).filter(v => v != null);
  return {
    total: rows.length,
    delivered: delivered.length,
    onTimeRate: delivered.length ? onTime.length / delivered.length : null,
    csatAvg: csats.length ? csats.reduce((a, b) => a + b, 0) / csats.length : null,
    csatCount: csats.length,
    lateOpen: rows.filter(r => !r.delivered && r.due && r.due < todayISO()).length
  };
}

function mktMetrics(rows, month) {
  const inPeriod = rows.filter(r => month === 'all' || (r.period || '') === month);
  const leads = sumBy(inPeriod, 'leads');
  const investment = sumBy(inPeriod, 'investment');
  const diagnostics = sumBy(inPeriod, 'diagnostics');
  return {
    leads, investment, diagnostics,
    cpl: leads ? investment / leads : null,
    conversion: leads ? diagnostics / leads : null
  };
}

// Turnover do ciclo = desligamentos ÷ média de membros (início + fim) / 2
function turnoverOf(r) {
  const start = num(r.start);
  const end = num(r.end);
  const dep = num(r.departures);
  if (start == null || end == null || dep == null) return null;
  const avg = (start + end) / 2;
  return avg > 0 ? dep / avg : null;
}

function latestTurnover(rows) {
  const filled = rows.filter(r => turnoverOf(r) != null);
  return filled.length ? filled[filled.length - 1] : null;
}

// Membros ativos: valor informado na DHO ou, se vazio, membros ao fim do último ciclo
function activeMembers() {
  const typed = num(loadData(KEYS.dhoMembers, ''));
  if (typed) return typed;
  const last = latestTurnover(loadData(KEYS.dhoTurnover, seedTurnover));
  return last ? num(last.end) : null;
}

function trainingMetrics(rows, cycle) {
  const inCycle = rows.filter(r => cycle === 'all' || r.cycle === cycle);
  const personHours = inCycle.reduce((s, r) => s + (num(r.hours) || 0) * (num(r.participants) || 0), 0);
  const members = activeMembers();
  return { sessions: inCycle.length, personHours, members, perMember: members ? personHours / members : null };
}

// eNPS = (% promotores − % detratores) × 100
function enpsOf(r) {
  const p = num(r.promoters), n = num(r.passives), d = num(r.detractors);
  if (p == null && n == null && d == null) return null;
  const total = (p || 0) + (n || 0) + (d || 0);
  return total > 0 ? (((p || 0) - (d || 0)) / total) * 100 : null;
}

function enpsMetrics(rows) {
  const filled = rows.filter(r => enpsOf(r) != null);
  const last = filled[filled.length - 1] || null;
  const prev = filled[filled.length - 2] || null;
  const current = last ? enpsOf(last) : null;
  return {
    current,
    quarter: last ? last.quarter : null,
    respondents: last ? (num(last.promoters) || 0) + (num(last.passives) || 0) + (num(last.detractors) || 0) : null,
    delta: last && prev ? current - enpsOf(prev) : null
  };
}

// ============================================================
// JURÍDICO-FINANCEIRO
// ============================================================

function renderJfRevenue(panel) {
  const rows = loadData(KEYS.jfRevenue, seedRevenueMonths);
  let month = rows.some(r => r.month === currentMonthISO()) ? currentMonthISO() : (rows[0] && rows[0].month);

  const draw = () => {
    const m = jfRevenueMetrics(rows, month);
    const monthOptions = rows.filter(r => r.month).map(r => ({ value: r.month, label: monthLabel(r.month) }));

    panel.innerHTML = '';
    panel.appendChild(panelHead('Receita realizada x Meta', 'Compare a receita realizada com a meta esperada de cada mês.',
      monthOptions.length ? filterSelect('Mês', monthOptions, month, v => { month = v; draw(); }) : null));
    panel.appendChild(statGrid([
      { label: `Meta de ${monthLabel(month)}`, value: m.meta == null ? '—' : fmtBRL(m.meta), icon: 'target', tone: 'blue' },
      { label: 'Receita realizada', value: m.realized == null ? '—' : fmtBRL(m.realized), icon: 'dollar-sign', tone: 'green' },
      { label: '% da meta atingida', value: fmtPct(m.ratio), valueClass: revenueClass(m.ratio), icon: 'percent', tone: 'purple',
        sub: m.diff == null ? null : (m.diff >= 0 ? `${fmtBRL(m.diff)} acima da meta` : `Faltam ${fmtBRL(-m.diff)}`) },
      { label: 'Acumulado no ano', value: fmtPct(m.ytdRatio), valueClass: revenueClass(m.ytdRatio), icon: 'calendar', tone: 'yellow',
        sub: `${fmtBRL(m.ytdRealized)} de ${fmtBRL(m.ytdMeta)}` }
    ]));

    panel.appendChild(card('Metas e receita por mês', 'Preencha a meta e a receita realizada. A coluna "Vendas cadastradas" soma as vendas de Negócios, Projetos e Marketing do mês, como referência.',
      recordTable({
        rows,
        columns: [
          { key: 'month', label: 'Mês', type: 'month' },
          { key: 'meta', label: 'Meta (R$)', type: 'currency', num: true },
          { key: 'realized', label: 'Realizada (R$)', type: 'currency', num: true },
          { key: 'pct', label: '% atingido', type: 'computed', num: true, compute: r => {
            const meta = num(r.meta);
            const ratio = meta ? (num(r.realized) || 0) / meta : null;
            return el('span', { className: revenueClass(ratio), text: fmtPct(ratio) });
          } },
          { key: 'diff', label: 'Diferença', type: 'computed', num: true, compute: r =>
            (num(r.meta) == null && num(r.realized) == null) ? '—' : fmtBRL((num(r.realized) || 0) - (num(r.meta) || 0)) },
          { key: 'sales', label: 'Vendas cadastradas', type: 'computed', num: true, compute: r => r.month ? fmtBRL(salesInMonth(r.month)) : '—' }
        ],
        onChange: changed,
        newRow: () => ({ month: '', meta: '', realized: '' }),
        addLabel: 'Adicionar mês'
      }),
      el('span', { className: 'formula', text: '% atingido = Realizada ÷ Meta' })));
    refreshIcons();
  };

  const changed = (focusKey) => {
    rows.sort((a, b) => (a.month || '9999').localeCompare(b.month || '9999'));
    saveData(KEYS.jfRevenue, rows);
    redraw(panel, draw, focusKey);
  };
  draw();
}

function renderJfCash(panel) {
  const rows = loadData(KEYS.jfCash, []);
  let opening = loadData(KEYS.jfCashOpening, '');
  let month = currentMonthISO();

  const draw = () => {
    const m = cashMetrics(rows, opening, month);
    const months = distinctMonths(rows, 'date');
    if (!months.includes(currentMonthISO())) months.unshift(currentMonthISO());
    const options = [{ value: 'all', label: 'Todo o período' }].concat(months.map(v => ({ value: v, label: monthLabel(v) })));

    const openingInput = el('input', { type: 'number', step: '0.01', 'aria-label': 'Saldo inicial' });
    openingInput.value = opening;
    openingInput.addEventListener('change', () => {
      opening = openingInput.value === '' ? '' : Number(openingInput.value);
      saveData(KEYS.jfCashOpening, opening);
      draw();
    });

    panel.innerHTML = '';
    panel.appendChild(panelHead('Saldo de caixa', 'Entradas e saídas registradas, com o resultado do período e o saldo atual.',
      filterSelect('Período', options, month, v => { month = v; draw(); })));
    panel.appendChild(statGrid([
      { label: 'Entrou', value: fmtBRL(m.inflow), icon: 'arrow-down-circle', tone: 'green', valueClass: 'is-good' },
      { label: 'Saiu', value: fmtBRL(m.outflow), icon: 'arrow-up-circle', tone: 'red', valueClass: 'is-bad' },
      { label: 'Resultado do período', value: fmtBRL(m.result), icon: 'scale', tone: 'purple', valueClass: m.result >= 0 ? 'is-good' : 'is-bad',
        sub: month === 'all' ? 'Todo o período' : monthLabel(month) },
      { label: 'Saldo em caixa hoje', value: fmtBRL(m.balance), icon: 'wallet', tone: 'blue', sub: 'Saldo inicial + entradas − saídas' }
    ]));

    panel.appendChild(card('Lançamentos', month === 'all' ? 'Todos os lançamentos.' : `Lançamentos de ${monthLabel(month)}.`,
      recordTable({
        rows,
        filter: r => month === 'all' || (r.date || '').startsWith(month),
        columns: [
          { key: 'date', label: 'Data', type: 'date' },
          { key: 'desc', label: 'Descrição', type: 'text', wide: true, placeholder: 'Ex: Pagamento projeto X' },
          { key: 'type', label: 'Tipo', type: 'select', options: ['Entrada', 'Saída'] },
          { key: 'category', label: 'Categoria', type: 'text', placeholder: 'Ex: Projetos, Eventos' },
          { key: 'value', label: 'Valor (R$)', type: 'currency', num: true }
        ],
        onChange: changed,
        newRow: () => ({ date: month === 'all' || month === currentMonthISO() ? todayISO() : `${month}-01`, desc: '', type: 'Entrada', category: '', value: '' }),
        addLabel: 'Adicionar lançamento',
        emptyText: 'Nenhum lançamento neste período.'
      }),
      el('label', { className: 'inline-field' }, ['Saldo inicial (R$)', openingInput])));
    refreshIcons();
  };

  const changed = (focusKey) => {
    rows.sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    saveData(KEYS.jfCash, rows);
    redraw(panel, draw, focusKey);
  };
  draw();
}

function renderJfReceivables(panel) {
  const rows = loadData(KEYS.jfReceivables, []);

  const draw = () => {
    const m = receivableMetrics(rows);
    panel.innerHTML = '';
    panel.appendChild(panelHead('Inadimplência', 'Títulos a receber dos clientes. A inadimplência considera apenas o que já venceu.'));
    panel.appendChild(statGrid([
      { label: 'Inadimplência', value: fmtPct(m.rate), icon: 'alert-triangle', tone: 'red',
        valueClass: m.rate == null ? '' : m.rate === 0 ? 'is-good' : m.rate <= 0.1 ? 'is-warn' : 'is-bad', sub: 'Vencido e não pago ÷ total vencido' },
      { label: 'Valor em atraso', value: fmtBRL(m.unpaidValue), icon: 'clock', tone: 'yellow' },
      { label: 'Títulos em atraso', value: String(m.unpaidCount), icon: 'file-warning', tone: 'purple' },
      { label: 'Total a receber em aberto', value: fmtBRL(m.openTotal), icon: 'wallet', tone: 'blue' }
    ]));

    panel.appendChild(card('Títulos a receber', 'Marque como "Pago" quando o cliente quitar.',
      recordTable({
        rows,
        columns: [
          { key: 'client', label: 'Cliente', type: 'text', wide: true },
          { key: 'desc', label: 'Referência', type: 'text', placeholder: 'Ex: Parcela 2/3' },
          { key: 'due', label: 'Vencimento', type: 'date' },
          { key: 'value', label: 'Valor (R$)', type: 'currency', num: true },
          { key: 'status', label: 'Pagamento', type: 'select', options: ['Em aberto', 'Pago'] },
          { key: 'situation', label: 'Situação', type: 'computed', compute: r => {
            if (r.status === 'Pago') return badge('Pago', 'good');
            if (!r.due) return badge('Sem vencimento', 'neutral');
            const today = todayISO();
            if (r.due < today) {
              const days = Math.round((new Date(today) - new Date(r.due)) / 86400000);
              return badge(`Atrasado há ${days} dia(s)`, 'bad');
            }
            return badge('A vencer', 'blue');
          } }
        ],
        onChange: changed,
        newRow: () => ({ client: '', desc: '', due: '', value: '', status: 'Em aberto' }),
        addLabel: 'Adicionar título',
        emptyText: 'Nenhum título a receber cadastrado.'
      }),
      el('span', { className: 'formula', text: 'Inadimplência = vencido não pago ÷ total vencido' })));
    refreshIcons();
  };

  const changed = (focusKey) => {
    rows.sort((a, b) => (a.due || '9999').localeCompare(b.due || '9999'));
    saveData(KEYS.jfReceivables, rows);
    redraw(panel, draw, focusKey);
  };
  draw();
}

// ============================================================
// PROJETOS
// ============================================================

function renderProjDeliveries(panel) {
  const rows = loadData(KEYS.projDeliveries, []);
  let project = 'all';

  const draw = () => {
    const scoped = project === 'all' ? rows : rows.filter(r => r.project === project);
    const m = deliveryMetrics(scoped);
    const projects = [...new Set(rows.map(r => r.project).filter(Boolean))].sort();

    panel.innerHTML = '';
    panel.appendChild(panelHead('Entregas e satisfação', 'Prazo e CSAT de cada entrega, não só ao final do projeto.',
      filterSelect('Projeto', [{ value: 'all', label: 'Todos os projetos' }].concat(projects.map(p => ({ value: p, label: p }))), project, v => { project = v; draw(); })));
    panel.appendChild(statGrid([
      { label: '% de entregas no prazo', value: fmtPct(m.onTimeRate), icon: 'calendar-check', tone: 'green',
        sub: `${m.delivered} entrega(s) concluída(s)` },
      { label: 'CSAT médio por entrega', value: m.csatAvg == null ? '—' : fmtNum(m.csatAvg, 1), valueClass: csatClass(m.csatAvg), icon: 'smile', tone: 'purple',
        sub: `${m.csatCount} avaliação(ões) · meta 9` },
      { label: 'Entregas cadastradas', value: String(m.total), icon: 'package', tone: 'blue' },
      { label: 'Pendentes vencidas', value: String(m.lateOpen), valueClass: m.lateOpen ? 'is-bad' : '', icon: 'alert-triangle', tone: 'red' }
    ]));

    panel.appendChild(card('Entregas', 'Registre cada entrega com a data prevista, a data em que foi entregue e o CSAT (0 a 10) dado pelo cliente.',
      recordTable({
        rows,
        filter: r => project === 'all' || r.project === project,
        columns: [
          { key: 'project', label: 'Projeto', type: 'text', placeholder: 'Nome do projeto' },
          { key: 'delivery', label: 'Entrega', type: 'text', wide: true, placeholder: 'Ex: Diagnóstico inicial' },
          { key: 'due', label: 'Prevista', type: 'date' },
          { key: 'delivered', label: 'Entregue em', type: 'date' },
          { key: 'csat', label: 'CSAT (0–10)', type: 'number', num: true },
          { key: 'status', label: 'Situação', type: 'computed', compute: r => { const s = deliveryStatus(r); return badge(s.label, s.kind); } }
        ],
        onChange: changed,
        newRow: () => ({ project: project === 'all' ? '' : project, delivery: '', due: '', delivered: '', csat: '' }),
        addLabel: 'Adicionar entrega',
        emptyText: 'Nenhuma entrega cadastrada.'
      }),
      el('span', { className: 'formula', text: 'No prazo = entregue até a data prevista' })));

    // Resumo por projeto
    if (projects.length) {
      const tbody = el('tbody', {}, projects.map(p => {
        const pm = deliveryMetrics(rows.filter(r => r.project === p));
        return el('tr', {}, [
          el('td', { className: 'computed', text: p }),
          el('td', { className: 'num computed', text: `${pm.delivered}/${pm.total}` }),
          el('td', { className: 'num computed', text: fmtPct(pm.onTimeRate) }),
          el('td', { className: 'num computed' }, [el('span', { className: csatClass(pm.csatAvg), text: pm.csatAvg == null ? '—' : fmtNum(pm.csatAvg, 1) })])
        ]);
      }));
      panel.appendChild(card('Resumo por projeto', null, el('div', { className: 'table-scroll' }, [
        el('table', { className: 'rt' }, [
          el('thead', {}, [el('tr', {}, [
            el('th', { text: 'Projeto' }), el('th', { className: 'num', text: 'Entregues' }),
            el('th', { className: 'num', text: 'No prazo' }), el('th', { className: 'num', text: 'CSAT médio' })
          ])]),
          tbody
        ])
      ])));
    }
    refreshIcons();
  };

  const changed = (focusKey) => { saveData(KEYS.projDeliveries, rows); redraw(panel, draw, focusKey); };
  draw();
}

// ============================================================
// MARKETING
// ============================================================

function renderMktFunnel(panel) {
  const rows = loadData(KEYS.mktActions, []);
  let month = 'all';

  const draw = () => {
    const m = mktMetrics(rows, month);
    const months = distinctMonths(rows, 'period');
    const options = [{ value: 'all', label: 'Todo o período' }].concat(months.map(v => ({ value: v, label: monthLabel(v) })));

    panel.innerHTML = '';
    panel.appendChild(panelHead('Leads e conversão', 'Leads gerados, custo por lead e quantos viraram diagnóstico.',
      filterSelect('Período', options, month, v => { month = v; draw(); })));
    panel.appendChild(statGrid([
      { label: 'Leads gerados', value: fmtNum(m.leads, 0), icon: 'users', tone: 'blue', sub: month === 'all' ? 'Todo o período' : monthLabel(month) },
      { label: 'Investimento', value: fmtBRL(m.investment), icon: 'dollar-sign', tone: 'yellow' },
      { label: 'Custo por lead', value: m.cpl == null ? '—' : fmtBRL(m.cpl), icon: 'tag', tone: 'purple', sub: 'Investimento ÷ leads' },
      { label: 'Conversão conteúdo → diagnóstico', value: fmtPct(m.conversion), icon: 'git-merge', tone: 'green',
        sub: `${fmtNum(m.diagnostics, 0)} diagnóstico(s) de ${fmtNum(m.leads, 0)} lead(s)` }
    ]));

    panel.appendChild(card('Resultados por conteúdo / canal', 'Uma linha por conteúdo, campanha ou canal em cada mês.',
      recordTable({
        rows,
        filter: r => month === 'all' || r.period === month,
        columns: [
          { key: 'period', label: 'Mês', type: 'month' },
          { key: 'channel', label: 'Conteúdo / canal', type: 'text', wide: true, placeholder: 'Ex: Post LinkedIn, Google Ads' },
          { key: 'investment', label: 'Investimento (R$)', type: 'currency', num: true },
          { key: 'leads', label: 'Leads', type: 'number', num: true },
          { key: 'diagnostics', label: 'Diagnósticos', type: 'number', num: true },
          { key: 'cpl', label: 'Custo por lead', type: 'computed', num: true, compute: r => {
            const leads = num(r.leads);
            return leads ? fmtBRL((num(r.investment) || 0) / leads) : '—';
          } },
          { key: 'conv', label: 'Conversão', type: 'computed', num: true, compute: r => {
            const leads = num(r.leads);
            return leads ? fmtPct((num(r.diagnostics) || 0) / leads) : '—';
          } }
        ],
        onChange: changed,
        newRow: () => ({ period: month === 'all' ? currentMonthISO() : month, channel: '', investment: '', leads: '', diagnostics: '' }),
        addLabel: 'Adicionar conteúdo / canal',
        emptyText: 'Nenhum resultado cadastrado neste período.'
      }),
      el('span', { className: 'formula', text: 'Conversão = diagnósticos ÷ leads' })));
    refreshIcons();
  };

  const changed = (focusKey) => {
    rows.sort((a, b) => (b.period || '').localeCompare(a.period || ''));
    saveData(KEYS.mktActions, rows);
    redraw(panel, draw, focusKey);
  };
  draw();
}

// ============================================================
// DHO
// ============================================================

function renderDhoTurnover(panel) {
  const rows = loadData(KEYS.dhoTurnover, seedTurnover);

  const draw = () => {
    const last = latestTurnover(rows);
    panel.innerHTML = '';
    panel.appendChild(panelHead('Turnover no ciclo', 'Entradas e saídas de membros em cada ciclo.'));
    panel.appendChild(statGrid([
      { label: last ? `Turnover · ${last.cycle}` : 'Turnover', value: last ? fmtPct(turnoverOf(last)) : '—', icon: 'repeat', tone: 'purple',
        sub: 'Desligamentos ÷ média de membros' },
      { label: 'Desligamentos', value: last ? fmtNum(num(last.departures), 0) : '—', icon: 'user-minus', tone: 'red' },
      { label: 'Admissões', value: last ? fmtNum(num(last.admissions), 0) : '—', icon: 'user-plus', tone: 'green' },
      { label: 'Membros ao fim do ciclo', value: last ? fmtNum(num(last.end), 0) : '—', icon: 'users', tone: 'blue' }
    ]));
    panel.appendChild(card('Movimentação por ciclo', 'Preencha os membros no início e no fim do ciclo, as admissões e os desligamentos.',
      recordTable({
        rows,
        columns: [
          { key: 'cycle', label: 'Ciclo', type: 'text' },
          { key: 'start', label: 'Membros no início', type: 'number', num: true },
          { key: 'admissions', label: 'Admissões', type: 'number', num: true },
          { key: 'departures', label: 'Desligamentos', type: 'number', num: true },
          { key: 'end', label: 'Membros no fim', type: 'number', num: true },
          { key: 'avg', label: 'Média de membros', type: 'computed', num: true, compute: r =>
            (num(r.start) == null || num(r.end) == null) ? '—' : fmtNum((num(r.start) + num(r.end)) / 2) },
          { key: 'turnover', label: 'Turnover', type: 'computed', num: true, compute: r => fmtPct(turnoverOf(r)) }
        ],
        onChange: changed,
        newRow: () => ({ cycle: `${rows.length + 1}º Ciclo`, start: '', admissions: '', departures: '', end: '' }),
        addLabel: 'Adicionar ciclo'
      }),
      el('span', { className: 'formula', text: 'Turnover = desligamentos ÷ ((início + fim) ÷ 2)' })));
    refreshIcons();
  };

  const changed = (focusKey) => { saveData(KEYS.dhoTurnover, rows); redraw(panel, draw, focusKey); };
  draw();
}

function renderDhoTraining(panel) {
  const rows = loadData(KEYS.dhoTrainings, []);
  let cycle = 'all';
  const cycles = ['1º Ciclo', '2º Ciclo', '3º Ciclo'];

  const draw = () => {
    const m = trainingMetrics(rows, cycle);

    const membersInput = el('input', { type: 'number', min: '0', step: '1', 'aria-label': 'Membros ativos' });
    membersInput.value = loadData(KEYS.dhoMembers, '');
    membersInput.placeholder = m.members ? String(m.members) : '';
    membersInput.addEventListener('change', () => {
      saveData(KEYS.dhoMembers, membersInput.value === '' ? '' : Number(membersInput.value));
      draw();
    });

    panel.innerHTML = '';
    panel.appendChild(panelHead('Horas de capacitação por membro', 'Soma das horas de cada capacitação multiplicadas pelo número de participantes.',
      filterSelect('Ciclo', [{ value: 'all', label: 'Todos os ciclos' }].concat(cycles.map(c => ({ value: c, label: c }))), cycle, v => { cycle = v; draw(); })));
    panel.appendChild(statGrid([
      { label: 'Horas por membro', value: m.perMember == null ? '—' : `${fmtNum(m.perMember, 1)} h`, icon: 'graduation-cap', tone: 'purple',
        sub: m.members ? `Base: ${m.members} membros ativos` : 'Informe os membros ativos' },
      { label: 'Total de horas-pessoa', value: `${fmtNum(m.personHours, 1)} h`, icon: 'clock', tone: 'blue' },
      { label: 'Capacitações realizadas', value: String(m.sessions), icon: 'book-open', tone: 'green' },
      { label: 'Membros ativos', value: m.members ? String(m.members) : '—', icon: 'users', tone: 'yellow' }
    ]));
    panel.appendChild(card('Capacitações', 'Registre treinamentos, imersões e workshops.',
      recordTable({
        rows,
        filter: r => cycle === 'all' || r.cycle === cycle,
        columns: [
          { key: 'date', label: 'Data', type: 'date' },
          { key: 'title', label: 'Capacitação', type: 'text', wide: true, placeholder: 'Ex: Treinamento de feedback' },
          { key: 'cycle', label: 'Ciclo', type: 'select', options: cycles },
          { key: 'hours', label: 'Duração (h)', type: 'number', num: true },
          { key: 'participants', label: 'Participantes', type: 'number', num: true },
          { key: 'ph', label: 'Horas-pessoa', type: 'computed', num: true, compute: r => `${fmtNum((num(r.hours) || 0) * (num(r.participants) || 0), 1)} h` }
        ],
        onChange: changed,
        newRow: () => ({ date: todayISO(), title: '', cycle: cycle === 'all' ? cycles[cycles.length - 1] : cycle, hours: '', participants: '' }),
        addLabel: 'Adicionar capacitação',
        emptyText: 'Nenhuma capacitação cadastrada.'
      }),
      el('label', { className: 'inline-field' }, ['Membros ativos', membersInput])));
    refreshIcons();
  };

  const changed = (focusKey) => {
    rows.sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
    saveData(KEYS.dhoTrainings, rows);
    redraw(panel, draw, focusKey);
  };
  draw();
}

function renderDhoEnps(panel) {
  const rows = loadData(KEYS.dhoEnps, seedEnps);

  const draw = () => {
    const m = enpsMetrics(rows);
    const zone = enpsZone(m.current);
    panel.innerHTML = '';
    panel.appendChild(panelHead('eNPS (pesquisa trimestral)', 'Resultado da pergunta "de 0 a 10, quanto você recomendaria a Dinâmica como lugar para trabalhar?".'));
    panel.appendChild(statGrid([
      { label: m.quarter ? `eNPS · ${m.quarter}` : 'eNPS', value: m.current == null ? '—' : fmtNum(m.current, 0), valueClass: zone.cls, icon: 'heart', tone: 'purple', sub: zone.label },
      { label: 'Variação vs. trimestre anterior', value: m.delta == null ? '—' : `${m.delta >= 0 ? '+' : ''}${fmtNum(m.delta, 0)}`,
        valueClass: m.delta == null ? '' : m.delta >= 0 ? 'is-good' : 'is-bad', icon: 'trending-up', tone: 'blue' },
      { label: 'Respondentes', value: m.respondents == null ? '—' : String(m.respondents), icon: 'users', tone: 'green' },
      { label: 'Meta do OKR Estratégico', value: 'E-NPS ≥ 8,5', icon: 'target', tone: 'yellow', sub: 'Conforme o OKR "Gente"' }
    ]));
    panel.appendChild(card('Resultados por trimestre', 'Promotores deram nota 9–10, neutros 7–8 e detratores 0–6.',
      recordTable({
        rows,
        columns: [
          { key: 'quarter', label: 'Trimestre', type: 'text' },
          { key: 'promoters', label: 'Promotores', type: 'number', num: true },
          { key: 'passives', label: 'Neutros', type: 'number', num: true },
          { key: 'detractors', label: 'Detratores', type: 'number', num: true },
          { key: 'resp', label: 'Respondentes', type: 'computed', num: true, compute: r => {
            const t = (num(r.promoters) || 0) + (num(r.passives) || 0) + (num(r.detractors) || 0);
            return t ? String(t) : '—';
          } },
          { key: 'enps', label: 'eNPS', type: 'computed', num: true, compute: r => { const v = enpsOf(r); return v == null ? '—' : fmtNum(v, 0); } },
          { key: 'zone', label: 'Zona', type: 'computed', compute: r => { const z = enpsZone(enpsOf(r)); return badge(z.label, z.kind); } }
        ],
        onChange: changed,
        newRow: () => ({ quarter: '', promoters: '', passives: '', detractors: '' }),
        addLabel: 'Adicionar trimestre'
      }),
      el('span', { className: 'formula', text: 'eNPS = % promotores − % detratores' })));
    refreshIcons();
  };

  const changed = (focusKey) => { saveData(KEYS.dhoEnps, rows); redraw(panel, draw, focusKey); };
  draw();
}

// ============================================================
// PRESIDÊNCIA (consolidação)
// ============================================================

// Estado dos OKRs: o salvo pela página OKR ou os dados originais das planilhas
function loadOkrForSummary() {
  const saved = loadData(KEYS.okr, null);
  if (saved) return saved;
  if (typeof OKR_SEED === 'undefined') return [];
  return OKR_SEED.map(c => ({
    id: c.id, label: c.label,
    boards: c.boards.map(b => ({ title: b.t, sections: b.s.map(s => ({ heading: s.h, krs: s.k.map(r => ({ desc: r[1], target: r[3], current: r[4], status: r[7] })) })) }))
  }));
}

// KRs do ciclo mais recente em que o quadro aparece
function okrSummary(boardTitle) {
  const cycles = loadOkrForSummary();
  for (let i = cycles.length - 1; i >= 0; i--) {
    const board = cycles[i].boards.find(b => b.title === boardTitle);
    if (board) {
      const krs = board.sections.flatMap(s => s.krs);
      return {
        cycle: cycles[i].label,
        total: krs.length,
        done: krs.filter(k => k.status === 'Concluído').length,
        late: krs.filter(k => k.status === 'Atrás' || k.status === 'Vencido').length,
        board
      };
    }
  }
  return null;
}

function negociosMetrics() {
  const tasks = loadData(KEYS.negTasks, []);
  const statuses = loadData(KEYS.negStatuses, []);
  const doneId = statuses.length ? statuses[statuses.length - 1].id : 'done';
  const open = tasks.filter(t => t.status !== doneId);
  const sum = salesSummary(loadData(KEYS.negSales, []));
  return {
    revenue: sum.revenue,
    avgTicket: sum.avgTicket,
    openDeals: open.length,
    pipelineValue: open.reduce((s, t) => s + (Number(t.valor) || 0), 0)
  };
}

function directorCard(title, iconName, href, metrics, okr) {
  const list = el('div', { className: 'dir-metrics' }, metrics.map(m => el('div', { className: 'dir-metric' }, [
    el('span', { className: 'dir-metric-label', text: m.label }),
    el('span', { className: 'dir-metric-value ' + (m.cls || ''), text: m.value })
  ])));

  let okrBlock = null;
  if (okr) {
    const ratio = okr.total ? okr.done / okr.total : 0;
    okrBlock = el('div', { className: 'dir-okr' }, [
      el('div', { className: 'dir-okr-head' }, [
        el('span', { text: `OKRs · ${okr.cycle}` }),
        el('strong', { text: `${okr.done}/${okr.total} concluídos` })
      ]),
      el('div', { className: 'dir-okr-track' }, [el('div', { className: 'dir-okr-fill', style: `width:${(ratio * 100).toFixed(0)}%` })]),
      okr.late ? el('span', { className: 'dir-okr-late', text: `${okr.late} KR(s) atrasado(s) ou vencido(s)` }) : null
    ]);
  }

  return el('div', { className: 'card dir-card' }, [
    el('div', { className: 'dir-head' }, [
      el('div', { className: 'stat-icon tone-blue' }, [icon(iconName)]),
      el('h3', { text: title }),
      href ? el('a', { className: 'dir-link', href, text: 'Abrir' }) : null
    ]),
    list,
    okrBlock
  ]);
}

function renderPresDirectorates(panel) {
  const neg = negociosMetrics();
  const jfRows = loadData(KEYS.jfRevenue, seedRevenueMonths);
  const jf = jfRevenueMetrics(jfRows, currentMonthISO());
  const cash = cashMetrics(loadData(KEYS.jfCash, []), loadData(KEYS.jfCashOpening, ''), 'all');
  const rec = receivableMetrics(loadData(KEYS.jfReceivables, []));
  const proj = deliveryMetrics(loadData(KEYS.projDeliveries, []));
  const projSales = salesSummary(loadData(KEYS.projSales, []));
  const mkt = mktMetrics(loadData(KEYS.mktActions, []), 'all');
  const mktSales = salesSummary(loadData(KEYS.mktSales, []));
  const enps = enpsMetrics(loadData(KEYS.dhoEnps, seedEnps));
  const lastTurn = latestTurnover(loadData(KEYS.dhoTurnover, seedTurnover));
  const training = trainingMetrics(loadData(KEYS.dhoTrainings, []), 'all');

  destroyPresCharts();
  panel.innerHTML = '';
  panel.appendChild(panelHead('Métricas por diretoria', 'Principais indicadores de cada área e o andamento dos OKRs no ciclo mais recente.'));

  panel.appendChild(el('div', { className: 'dir-grid' }, [
    directorCard('Negócios', 'briefcase', 'negocios.html', [
      { label: 'Faturamento (vendas)', value: fmtBRL(neg.revenue) },
      { label: 'Ticket médio', value: fmtBRL(neg.avgTicket) },
      { label: 'Negociações em aberto', value: String(neg.openDeals) },
      { label: 'Valor em negociação', value: fmtBRL(neg.pipelineValue) }
    ], okrSummary('Diretoria de Negócios')),
    directorCard('Jurídico-Financeiro', 'scale', 'juridico.html', [
      { label: `Receita x meta · ${monthLabel(currentMonthISO())}`, value: fmtPct(jf.ratio), cls: revenueClass(jf.ratio) },
      { label: 'Saldo em caixa', value: fmtBRL(cash.balance), cls: cash.balance >= 0 ? '' : 'is-bad' },
      { label: 'Inadimplência', value: fmtPct(rec.rate), cls: rec.rate ? 'is-bad' : '' },
      { label: 'Valor em atraso', value: fmtBRL(rec.unpaidValue) }
    ], okrSummary('Diretoria de JF')),
    directorCard('Projetos', 'folder-kanban', 'projetos.html', [
      { label: 'Entregas no prazo', value: fmtPct(proj.onTimeRate) },
      { label: 'CSAT médio por entrega', value: proj.csatAvg == null ? '—' : fmtNum(proj.csatAvg, 1), cls: csatClass(proj.csatAvg) },
      { label: 'Pendentes vencidas', value: String(proj.lateOpen), cls: proj.lateOpen ? 'is-bad' : '' },
      { label: 'Faturamento (vendas)', value: fmtBRL(projSales.revenue) }
    ], okrSummary('Diretoria de Projetos')),
    directorCard('Marketing', 'megaphone', 'marketing.html', [
      { label: 'Leads gerados', value: fmtNum(mkt.leads, 0) },
      { label: 'Custo por lead', value: mkt.cpl == null ? '—' : fmtBRL(mkt.cpl) },
      { label: 'Conversão → diagnóstico', value: fmtPct(mkt.conversion) },
      { label: 'Faturamento (vendas)', value: fmtBRL(mktSales.revenue) }
    ], okrSummary('Diretoria de Marketing')),
    directorCard('Desenvolvimento Humano Organizacional', 'users', 'dho.html', [
      { label: enps.quarter ? `eNPS · ${enps.quarter}` : 'eNPS', value: enps.current == null ? '—' : fmtNum(enps.current, 0), cls: enpsZone(enps.current).cls },
      { label: lastTurn ? `Turnover · ${lastTurn.cycle}` : 'Turnover', value: lastTurn ? fmtPct(turnoverOf(lastTurn)) : '—' },
      { label: 'Horas de capacitação por membro', value: training.perMember == null ? '—' : `${fmtNum(training.perMember, 1)} h` },
      { label: 'Membros ativos', value: training.members ? String(training.members) : '—' }
    ], okrSummary('Diretoria de DHO'))
  ]));
  refreshIcons();
}

let presCharts = [];
function destroyPresCharts() { presCharts.forEach(c => c.destroy()); presCharts = []; }

function renderPresRevenue(panel) {
  let year = String(new Date().getFullYear());

  const draw = () => {
    destroyPresCharts();
    const origins = allSalesByOrigin();
    const jfRows = loadData(KEYS.jfRevenue, seedRevenueMonths);

    const years = new Set([year]);
    origins.forEach(o => o.sales.forEach(s => { if (s.date) years.add(s.date.slice(0, 4)); }));
    jfRows.forEach(r => { if (r.month) years.add(r.month.slice(0, 4)); });

    const yearSales = origins.map(o => ({ ...o, sales: o.sales.filter(s => (s.date || '').startsWith(year)) }));
    const summaries = yearSales.map(o => ({ ...o, sum: salesSummary(o.sales) }));
    const total = summaries.reduce((s, o) => s + o.sum.revenue, 0);
    const received = summaries.reduce((s, o) => s + o.sum.received, 0);
    const metaYear = sumBy(jfRows.filter(r => (r.month || '').startsWith(year)), 'meta');

    const months = MONTHS_PT.map((_, i) => `${year}-${pad2(i + 1)}`);
    const monthly = yearSales.map(o => months.map(ym => o.sales
      .filter(s => s.paymentStatus !== 'cancelado' && (s.date || '').startsWith(ym))
      .reduce((t, s) => t + (Number(s.totalValue) || 0), 0)));
    const metaByMonth = months.map(ym => { const r = jfRows.find(x => x.month === ym); return r ? num(r.meta) : null; });

    panel.innerHTML = '';
    panel.appendChild(panelHead('Acompanhamento de faturamento', 'Vendas cadastradas em Negócios, Projetos e Marketing comparadas à meta mensal do Jurídico-Financeiro.',
      filterSelect('Ano', [...years].sort().reverse().map(y => ({ value: y, label: y })), year, v => { year = v; draw(); })));
    panel.appendChild(statGrid([
      { label: `Faturamento ${year}`, value: fmtBRL(total), icon: 'dollar-sign', tone: 'green' },
      { label: 'Recebido', value: fmtBRL(received), icon: 'check-circle-2', tone: 'blue' },
      { label: 'A receber', value: fmtBRL(total - received), icon: 'clock', tone: 'yellow' },
      { label: 'Meta anual (JF)', value: metaYear ? fmtBRL(metaYear) : '—', icon: 'target', tone: 'purple',
        sub: metaYear ? `${fmtPct(total / metaYear)} atingido` : 'Defina as metas no Jurídico-Financeiro' }
    ]));

    const canvas = el('canvas', { id: 'pres-revenue-chart' });
    panel.appendChild(card('Faturamento mensal por origem', 'Barras empilhadas por origem da venda; a linha mostra a meta do mês.',
      el('div', { className: 'chart-box' }, [canvas])));

    const tbody = el('tbody', {}, summaries.map(o => el('tr', {}, [
      el('td', { className: 'computed' }, [el('span', { className: 'origin-dot', style: `background:${o.color}` }), o.origin]),
      el('td', { className: 'num computed', text: String(o.sum.activeCount) }),
      el('td', { className: 'num computed', text: fmtBRL(o.sum.revenue) }),
      el('td', { className: 'num computed', text: total ? fmtPct(o.sum.revenue / total) : '—' }),
      el('td', { className: 'num computed', text: fmtBRL(o.sum.avgTicket) })
    ])));
    panel.appendChild(card('Participação por origem', 'O OKR Estratégico prevê 50% do faturamento vindo do Comercial e 25% de Projetos.',
      el('div', { className: 'table-scroll' }, [el('table', { className: 'rt' }, [
        el('thead', {}, [el('tr', {}, [
          el('th', { text: 'Origem' }), el('th', { className: 'num', text: 'Vendas' }), el('th', { className: 'num', text: 'Faturamento' }),
          el('th', { className: 'num', text: 'Participação' }), el('th', { className: 'num', text: 'Ticket médio' })
        ])]),
        tbody
      ])])));

    if (window.Chart) {
      presCharts.push(new Chart(canvas.getContext('2d'), {
        data: {
          labels: MONTHS_PT.map(m => m.slice(0, 3)),
          datasets: [
            ...yearSales.map((o, i) => ({ type: 'bar', label: o.origin, data: monthly[i], backgroundColor: o.color, stack: 'vendas', borderRadius: 4 })),
            { type: 'line', label: 'Meta (JF)', data: metaByMonth, borderColor: '#0E2A42', backgroundColor: '#0E2A42', borderWidth: 2, pointRadius: 3, spanGaps: true }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, beginAtZero: true, ticks: { callback: v => fmtBRL(v) } }
          },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 10, font: { family: 'Inter', size: 11 } } },
            tooltip: { callbacks: { label: c => `${c.dataset.label}: ${fmtBRL(c.parsed.y)}` } }
          }
        }
      }));
    }
    refreshIcons();
  };
  draw();
}

function renderPresEngagement(panel) {
  destroyPresCharts();
  const enpsRows = loadData(KEYS.dhoEnps, seedEnps);
  const turnRows = loadData(KEYS.dhoTurnover, seedTurnover);
  const enps = enpsMetrics(enpsRows);
  const zone = enpsZone(enps.current);
  const lastTurn = latestTurnover(turnRows);
  const training = trainingMetrics(loadData(KEYS.dhoTrainings, []), 'all');

  panel.innerHTML = '';
  panel.appendChild(panelHead('Engajamento dos membros', 'Satisfação, permanência e desenvolvimento dos membros, a partir dos dados da DHO.',
    el('a', { className: 'btn btn-secondary', href: 'dho.html' }, [icon('edit-3'), el('span', { text: 'Editar na DHO' })])));
  panel.appendChild(statGrid([
    { label: enps.quarter ? `eNPS · ${enps.quarter}` : 'eNPS', value: enps.current == null ? '—' : fmtNum(enps.current, 0), valueClass: zone.cls, icon: 'heart', tone: 'purple', sub: zone.label },
    { label: lastTurn ? `Turnover · ${lastTurn.cycle}` : 'Turnover', value: lastTurn ? fmtPct(turnoverOf(lastTurn)) : '—', icon: 'repeat', tone: 'red' },
    { label: 'Horas de capacitação por membro', value: training.perMember == null ? '—' : `${fmtNum(training.perMember, 1)} h`, icon: 'graduation-cap', tone: 'blue' },
    { label: 'Membros ativos', value: training.members ? String(training.members) : '—', icon: 'users', tone: 'green' }
  ]));

  const canvas = el('canvas', { id: 'pres-enps-chart' });
  panel.appendChild(card('Evolução do eNPS', 'Resultado de cada pesquisa trimestral.', el('div', { className: 'chart-box small' }, [canvas])));

  const turnBody = el('tbody', {}, turnRows.map(r => el('tr', {}, [
    el('td', { className: 'computed', text: r.cycle || '—' }),
    el('td', { className: 'num computed', text: num(r.admissions) == null ? '—' : String(r.admissions) }),
    el('td', { className: 'num computed', text: num(r.departures) == null ? '—' : String(r.departures) }),
    el('td', { className: 'num computed', text: num(r.end) == null ? '—' : String(r.end) }),
    el('td', { className: 'num computed', text: fmtPct(turnoverOf(r)) })
  ])));
  panel.appendChild(card('Turnover por ciclo', null, el('div', { className: 'table-scroll' }, [el('table', { className: 'rt' }, [
    el('thead', {}, [el('tr', {}, [
      el('th', { text: 'Ciclo' }), el('th', { className: 'num', text: 'Admissões' }), el('th', { className: 'num', text: 'Desligamentos' }),
      el('th', { className: 'num', text: 'Membros no fim' }), el('th', { className: 'num', text: 'Turnover' })
    ])]),
    turnBody
  ])])));

  // KRs do pilar "Gente" do OKR Estratégico
  const strategic = okrSummary('OKR Estratégico DEJ');
  const gente = strategic ? strategic.board.sections.find(s => (s.heading || '').toUpperCase() === 'GENTE') : null;
  if (gente) {
    const statusKind = { 'Concluído': 'good', 'No prazo': 'blue', 'Atrás': 'warn', 'Vencido': 'bad', 'Não iniciado': 'neutral' };
    panel.appendChild(card(`OKR Estratégico · Gente (${strategic.cycle})`, 'Resultados-chave ligados ao engajamento dos membros.',
      el('div', { className: 'table-scroll' }, [el('table', { className: 'rt' }, [
        el('thead', {}, [el('tr', {}, [el('th', { text: 'Resultado-chave' }), el('th', { className: 'num', text: 'Alvo' }), el('th', { className: 'num', text: 'Atual' }), el('th', { text: 'Status' })])]),
        el('tbody', {}, gente.krs.map(k => el('tr', {}, [
          el('td', { className: 'computed', text: k.desc }),
          el('td', { className: 'num computed', text: k.target || '—' }),
          el('td', { className: 'num computed', text: k.current || '—' }),
          el('td', {}, [badge(k.status, statusKind[k.status] || 'neutral')])
        ])))
      ])])));
  }

  if (window.Chart) {
    const values = enpsRows.map(enpsOf);
    presCharts.push(new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: enpsRows.map(r => r.quarter || '—'),
        datasets: [{
          label: 'eNPS',
          data: values,
          backgroundColor: values.map(v => v == null ? '#E2E8F0' : v >= 50 ? '#2E9E6B' : v >= 0 ? '#DD6B20' : '#C53030'),
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { suggestedMin: -100, suggestedMax: 100 }, x: { grid: { display: false } } },
        plugins: { legend: { display: false } }
      }
    }));
  }
  refreshIcons();
}

// ============================================================
// CONFIGURAÇÃO DAS ÁREAS
// ============================================================

const AREAS = {
  juridico: {
    id: 'juridico',
    title: 'Jurídico-Financeiro',
    intro: 'Acompanhe a receita frente à meta do mês, o saldo de caixa e a inadimplência dos clientes.',
    sections: [
      { id: 'receita', label: 'Receita x Meta', icon: 'target', render: renderJfRevenue },
      { id: 'caixa', label: 'Saldo de Caixa', icon: 'wallet', render: renderJfCash },
      { id: 'inadimplencia', label: 'Inadimplência', icon: 'alert-triangle', render: renderJfReceivables }
    ]
  },
  projetos: {
    id: 'projetos',
    title: 'Projetos',
    intro: 'Acompanhe o prazo e a satisfação de cada entrega e registre as vendas originadas pela diretoria.',
    sections: [
      { id: 'entregas', label: 'Entregas e CSAT', icon: 'calendar-check', render: renderProjDeliveries },
      { id: 'vendas', label: 'Cadastro de Vendas', icon: 'shopping-bag', render: p => renderSalesSection(p, KEYS.projSales, 'Projetos') }
    ]
  },
  marketing: {
    id: 'marketing',
    title: 'Marketing',
    intro: 'Acompanhe a geração de leads, o custo por lead e a conversão em diagnósticos, e registre as vendas do inbound.',
    sections: [
      { id: 'leads', label: 'Leads e Conversão', icon: 'users', render: renderMktFunnel },
      { id: 'vendas', label: 'Cadastro de Vendas', icon: 'shopping-bag', render: p => renderSalesSection(p, KEYS.mktSales, 'Marketing') }
    ]
  },
  dho: {
    id: 'dho',
    title: 'Desenvolvimento Humano Organizacional',
    intro: 'Acompanhe o turnover, as horas de capacitação por membro e o eNPS trimestral.',
    sections: [
      { id: 'turnover', label: 'Turnover', icon: 'repeat', render: renderDhoTurnover },
      { id: 'capacitacao', label: 'Capacitação', icon: 'graduation-cap', render: renderDhoTraining },
      { id: 'enps', label: 'eNPS', icon: 'heart', render: renderDhoEnps }
    ]
  },
  presidencia: {
    id: 'presidencia',
    title: 'Presidência',
    intro: 'Visão consolidada das diretorias. Os números vêm do que cada área registra; para editar, abra a área correspondente.',
    sections: [
      { id: 'diretorias', label: 'Métricas por Diretoria', icon: 'layout-grid', render: renderPresDirectorates },
      { id: 'faturamento', label: 'Faturamento', icon: 'dollar-sign', render: renderPresRevenue },
      { id: 'engajamento', label: 'Engajamento dos Membros', icon: 'heart', render: renderPresEngagement }
    ]
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const area = AREAS[document.body.dataset.area];
  if (area) mountArea(area);
});
