// STORES & STATE
let tasks = [];
let recentActivities = [];
let statuses = [];
let sales = [];
let totalLeads = 0; // Topo do funil de vendas: quantidade de leads (definida manualmente)
let salesGoal = 0;  // Meta de faturamento da Previsão de Vendas (definida manualmente)

// KANBAN STATUS DEFINITIONS (dynamic / editable)
// Soft badge color palette. New statuses cycle through these.
const STATUS_COLORS = [
  { bg: '#EDF2F7', text: '#4A5568' }, // cinza
  { bg: '#EBF8FF', text: '#2B6CB0' }, // azul
  { bg: '#E6FFFA', text: '#234E52' }, // verde-água
  { bg: '#FFF5F5', text: '#C53030' }, // vermelho
  { bg: '#FAF5FF', text: '#6B46C1' }, // roxo
  { bg: '#FFFAF0', text: '#B7791F' }, // laranja
  { bg: '#F0FFF4', text: '#276749' }, // verde
];

const defaultStatuses = [
  { id: 'todo', label: 'Pendente', colorIndex: 0 },
  { id: 'in_progress', label: 'Em Andamento', colorIndex: 1 },
  { id: 'done', label: 'Concluído', colorIndex: 2 },
];

// MOCK DATA GENERATION
const defaultAssignees = {
  "Gregory Joseph": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  "Charlie David": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  "John Washington": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
  "Anastasia Greene": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
  "Benham Lee": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
  "Vivek Malhotra": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "Penelope Lawson": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
};

const defaultContactAvatars = {
  "Peter Washington": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
  "Sandra Johnson": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  "Melissa McCartney": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
  "Jane Cooper": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
  "Ronald Richards": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
  "Darlene Robertson": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  "Darrell Steward": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  "Marvin McKinney": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
  "Robert Fox": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
};

const mockTasks = [
  {
    id: "task-1",
    title: "Peter Washington",
    subtitle: "Acme Solution Pvt Ltd",
    email: "peter.washington@acmesolutions.com",
    phone: "(208) 555-0112",
    valor: 12000,
    assignee: "Gregory Joseph",
    tag: "Website",
    priority: "low",
    status: "todo",
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: "task-2",
    title: "Sandra Johnson",
    subtitle: "Focal Stack",
    email: "sandra.johnson@focalstack.com",
    phone: "(704) 555-0127",
    valor: 8500,
    assignee: "Charlie David",
    tag: "Website",
    priority: "medium",
    status: "todo",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0] // yesterday
  },
  {
    id: "task-3",
    title: "Melissa McCartney",
    subtitle: "Terraforma Technologies",
    email: "melissa.mccartney@terraformatech.com",
    phone: "(316) 555-0116",
    valor: 25000,
    assignee: "Charlie David",
    tag: "LinkedIn",
    priority: "high",
    status: "todo",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]
  },
  {
    id: "task-4",
    title: "Jane Cooper",
    subtitle: "FocalStack Inc.",
    email: "jane.cooper@focalstack.com",
    phone: "(219) 555-0114",
    valor: 15000,
    assignee: "John Washington",
    tag: "LinkedIn",
    priority: "medium",
    status: "todo",
    date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0]
  },
  {
    id: "task-5",
    title: "Ronald Richards",
    subtitle: "Loopline AI",
    email: "ronald.richards@looplineai.com",
    phone: "(406) 555-0120",
    valor: 42000,
    assignee: "Anastasia Greene",
    tag: "Website",
    priority: "high",
    status: "in_progress",
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: "task-6",
    title: "Darlene Robertson",
    subtitle: "Helix Desk",
    email: "darlene.robertson@helixdesk.com",
    phone: "(480) 555-0103",
    valor: 9800,
    assignee: "Benham Lee",
    tag: "LinkedIn",
    priority: "low",
    status: "in_progress",
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0]
  },
  {
    id: "task-7",
    title: "Darrell Steward",
    subtitle: "Taskgrid",
    email: "darell.steward@taskgrid.com",
    phone: "(319) 555-0115",
    valor: 30000,
    assignee: "Vivek Malhotra",
    tag: "Website",
    priority: "low",
    status: "done",
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0]
  },
  {
    id: "task-8",
    title: "Marvin McKinney",
    subtitle: "Vectraflux",
    email: "marvin.mckinney@vectraflux.com",
    phone: "(405) 555-0128",
    valor: 18000,
    assignee: "Penelope Lawson",
    tag: "LinkedIn",
    priority: "medium",
    status: "done",
    date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0]
  },
  {
    id: "task-9",
    title: "Robert Fox",
    subtitle: "Dashcloud",
    email: "robert.fox@dashcloud.com",
    phone: "(629) 555-0129",
    valor: 22000,
    assignee: "Penelope Lawson",
    tag: "LinkedIn",
    priority: "medium",
    status: "done",
    date: new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0]
  }
];

const mockActivities = [
  {
    id: "act-1",
    type: "create",
    taskTitle: "Peter Washington",
    assignee: "Gregory Joseph",
    time: "Há 10 minutos"
  },
  {
    id: "act-2",
    type: "status",
    taskTitle: "Darrell Steward",
    assignee: "Vivek Malhotra",
    time: "Há 2 horas"
  },
  {
    id: "act-3",
    type: "create",
    taskTitle: "Ronald Richards",
    assignee: "Anastasia Greene",
    time: "Há 4 horas"
  },
  {
    id: "act-4",
    type: "edit",
    taskTitle: "Sandra Johnson",
    assignee: "Charlie David",
    time: "Ontem"
  }
];

const mockSales = [
  {
    id: "sale-1",
    client: "Darrell Steward / Taskgrid",
    service: "Implementação do CRM",
    category: "Implementação",
    description: "Setup completo do CRM, migração de dados e integração com e-mail.",
    seller: "Vivek Malhotra",
    qty: 1,
    unitValue: 30000,
    totalValue: 30000,
    paymentMethod: "Boleto",
    paymentStatus: "pago",
    date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    notes: ""
  },
  {
    id: "sale-2",
    client: "Marvin McKinney / Vectraflux",
    service: "Consultoria de Processos",
    category: "Consultoria",
    description: "Projeto de mapeamento de funil de vendas, parcelado em 8x.",
    seller: "Penelope Lawson",
    qty: 8,
    unitValue: 450,
    totalValue: 3600,
    paymentMethod: "Parcelado",
    paymentStatus: "parcial",
    date: new Date(Date.now() - 86400000 * 90).toISOString().split('T')[0],
    notes: "Pagamento mensal a partir da data da venda."
  }
];

// STATE MANAGEMENT FUNCTIONS
function loadState() {
  const savedTasks = localStorage.getItem('neg_crm_tasks');
  const savedActivities = localStorage.getItem('neg_crm_activities');
  const savedStatuses = localStorage.getItem('neg_crm_statuses');
  const savedSales = localStorage.getItem('neg_crm_sales');
  const savedLeads = localStorage.getItem('neg_crm_total_leads');
  totalLeads = savedLeads != null ? (parseInt(savedLeads, 10) || 0) : 0;
  const savedGoal = localStorage.getItem('neg_crm_sales_goal');
  salesGoal = savedGoal != null ? (parseFloat(savedGoal) || 0) : 0;

  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
    // Backfill deal value for tasks saved before this field existed
    tasks.forEach(t => { if (t.valor == null) t.valor = 0; });
  } else {
    tasks = [...mockTasks];
    saveTasks();
  }

  if (savedActivities) {
    recentActivities = JSON.parse(savedActivities);
  } else {
    recentActivities = [...mockActivities];
    saveActivities();
  }

  if (savedStatuses) {
    statuses = JSON.parse(savedStatuses);
  } else {
    statuses = defaultStatuses.map(s => ({ ...s }));
    saveStatuses();
  }

  if (savedSales) {
    sales = JSON.parse(savedSales);
  } else {
    sales = [...mockSales];
    saveSales();
  }
}

function saveTasks() {
  localStorage.setItem('neg_crm_tasks', JSON.stringify(tasks));
}

function saveStatuses() {
  localStorage.setItem('neg_crm_statuses', JSON.stringify(statuses));
}

function saveSales() {
  localStorage.setItem('neg_crm_sales', JSON.stringify(sales));
}

function saveTotalLeads() {
  localStorage.setItem('neg_crm_total_leads', String(totalLeads));
}

function saveSalesGoal() {
  localStorage.setItem('neg_crm_sales_goal', String(salesGoal));
}

// Ticket médio = valor médio por negócio fechado (etapa concluído/vendido).
// Fonte única usada pelo Dashboard e pela Previsão de Vendas.
function getAverageTicket(taskList) {
  const list = taskList || tasks;
  const doneId = getDoneStatusId();
  const closed = list.filter(t => t.status === doneId);
  const closedValue = closed.reduce((s, t) => s + (Number(t.valor) || 0), 0);
  return closed.length > 0 ? closedValue / closed.length : 0;
}

// STATUS HELPERS
function getStatusById(id) {
  return statuses.find(s => s.id === id);
}

function getStatusStyle(id) {
  const st = getStatusById(id);
  const idx = st ? st.colorIndex % STATUS_COLORS.length : 0;
  return STATUS_COLORS[idx];
}

function getStatusLabel(id) {
  const st = getStatusById(id);
  return st ? st.label : id;
}

// Format a number as Brazilian currency (R$)
function formatCurrency(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// The "concluído" concept for dashboard/charts = last column on the board
function getDoneStatusId() {
  return statuses.length ? statuses[statuses.length - 1].id : 'done';
}

function generateStatusId() {
  return 'status-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Populate the status <select> inside the task modal from current statuses
function populateStatusSelect(selectedId) {
  const sel = document.getElementById('task-status');
  if (!sel) return;
  sel.innerHTML = '';
  statuses.forEach(st => {
    const opt = document.createElement('option');
    opt.value = st.id;
    opt.textContent = st.label;
    sel.appendChild(opt);
  });
  if (selectedId) sel.value = selectedId;
}

// CREATE A NEW STATUS COLUMN
function addStatus() {
  const name = prompt('Nome do novo status de andamento:');
  if (!name || !name.trim()) return;

  statuses.push({
    id: generateStatusId(),
    label: name.trim(),
    colorIndex: statuses.length % STATUS_COLORS.length
  });
  saveStatuses();
  renderAtividades();
}

// RENAME AN EXISTING STATUS
function renameStatus(id) {
  const st = getStatusById(id);
  if (!st) return;

  const name = prompt('Renomear status:', st.label);
  if (!name || !name.trim()) return;

  st.label = name.trim();
  saveStatuses();
  renderAtividades();
  if (currentView === 'dashboard') renderDashboard();
}

// DELETE A STATUS (tasks in it are moved to another column)
function deleteStatus(id) {
  if (statuses.length <= 1) {
    alert('É necessário manter pelo menos um status.');
    return;
  }
  const st = getStatusById(id);
  if (!st) return;

  const affected = tasks.filter(t => t.status === id);
  const fallback = statuses.find(s => s.id !== id);

  let msg = `Excluir o status "${st.label}"?`;
  if (affected.length > 0) {
    msg += `\n\n${affected.length} atividade(s) serão movidas para "${fallback.label}".`;
  }
  if (!confirm(msg)) return;

  affected.forEach(t => { t.status = fallback.id; });
  statuses = statuses.filter(s => s.id !== id);
  saveStatuses();
  saveTasks();
  renderAtividades();
}

function saveActivities() {
  localStorage.setItem('neg_crm_activities', JSON.stringify(recentActivities));
}

function addActivityLog(type, taskTitle, assigneeName) {
  const actionText = {
    create: 'Criou a atividade',
    status: 'Moveu de status a atividade',
    edit: 'Editou os detalhes de',
    delete: 'Removeu a atividade'
  };

  const newActivity = {
    id: 'act-' + Date.now(),
    type: type,
    taskTitle: taskTitle,
    assignee: assigneeName,
    time: "Agora mesmo"
  };

  recentActivities.unshift(newActivity);
  if (recentActivities.length > 10) {
    recentActivities.pop(); // keep top 10
  }
  saveActivities();
}

// CHARTS INSTANCES
let categoryChartInstance = null;

// VIEW ROUTING
let currentView = 'dashboard';
let currentStyle = 'list'; // 'list' or 'kanban'

function switchView(viewName) {
  currentView = viewName;
  
  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    if (item.dataset.view === viewName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Toggle view panels in DOM
  document.getElementById('view-dashboard').classList.remove('active');
  document.getElementById('view-atividades').classList.remove('active');
  document.getElementById('view-vendas').classList.remove('active');
  document.getElementById('view-previsao').classList.remove('active');

  const subHeader = document.getElementById('sub-header-controls');
  const search = document.getElementById('header-search-container');
  const btnAddActivity = document.getElementById('btn-add-activity');
  const btnAddSale = document.getElementById('btn-add-sale');
  const btnExport = document.getElementById('btn-export');

  if (viewName === 'vendas') {
    document.getElementById('view-vendas').classList.add('active');
    document.getElementById('page-title').innerText = 'Vendas';
    document.getElementById('page-subtitle').innerText = 'Cadastre e acompanhe os serviços vendidos.';
    subHeader.style.display = 'none';
    search.style.display = 'none';
    btnAddActivity.style.display = 'none';
    btnAddSale.style.display = 'flex';
    btnExport.style.display = 'none';

    renderSales();
  } else if (viewName === 'previsao') {
    document.getElementById('view-previsao').classList.add('active');
    document.getElementById('page-title').innerText = 'Previsão de Vendas';
    document.getElementById('page-subtitle').innerText = 'Projeção de receita a partir do valor e da probabilidade de cada etapa do funil.';
    subHeader.style.display = 'none';
    search.style.display = 'none';
    btnAddActivity.style.display = 'none';
    btnAddSale.style.display = 'none';
    btnExport.style.display = 'none';

    renderForecast();
  } else if (viewName === 'atividades') {
    document.getElementById('view-atividades').classList.add('active');
    document.getElementById('page-title').innerText = 'Atividades';
    document.getElementById('page-subtitle').innerText = 'Acompanhe e gerencie todos os clientes, contatos e andamentos das tarefas.';
    subHeader.style.display = 'flex';
    search.style.display = 'flex';
    btnAddActivity.style.display = 'flex';
    btnAddSale.style.display = 'none';
    btnExport.style.display = 'flex';

    renderAtividades();
  } else {
    document.getElementById('view-dashboard').classList.add('active');
    document.getElementById('page-title').innerText = 'Dashboard';
    document.getElementById('page-subtitle').innerText = 'Monitore sua produtividade, tarefas pendentes e progresso recente.';
    subHeader.style.display = 'none';
    search.style.display = 'none';
    btnAddActivity.style.display = 'flex';
    btnAddSale.style.display = 'none';
    btnExport.style.display = 'flex';

    renderDashboard();
  }

  // Reinitialize icons if any new ones were rendered
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// GET USER INITIALS
function getInitials(name) {
  if (!name) return "?";
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}

// GET ONLY THE FIRST LETTER OF A NAME (used for Kanban client placeholder)
function getFirstLetter(name) {
  if (!name) return "?";
  return name.trim().charAt(0).toUpperCase();
}

// PRIORITY DOTS BUILDER
function renderPriorityDots(priority) {
  let activeClass = '';
  let count = 0;
  
  if (priority === 'high') {
    activeClass = 'active-high';
    count = 4;
  } else if (priority === 'medium') {
    activeClass = 'active-medium';
    count = 3;
  } else {
    activeClass = 'active-low';
    count = 1;
  }

  let html = '<div class="priority-dots">';
  for (let i = 1; i <= 4; i++) {
    if (i <= count) {
      html += `<span class="priority-dot ${activeClass}"></span>`;
    } else {
      html += '<span class="priority-dot empty"></span>';
    }
  }
  html += '</div>';
  return html;
}

// Currently selected quarter (trimestre) filter for the dashboard.
// 'all' = year-to-date / everything, '1'..'4' = quarters of the current year.
let dashboardQuarter = 'all';

// Returns the tasks that fall inside the selected dashboard quarter.
// When 'all' is selected, returns every task untouched.
function getDashboardTasks() {
  if (dashboardQuarter === 'all') return tasks;

  const q = Number(dashboardQuarter);
  const startMonth = (q - 1) * 3;      // 0-indexed first month of the quarter
  const year = new Date().getFullYear();

  return tasks.filter(t => {
    if (!t.date) return false;
    const d = new Date(t.date + 'T00:00:00');
    return d.getFullYear() === year &&
           d.getMonth() >= startMonth &&
           d.getMonth() < startMonth + 3;
  });
}

// Updates the small period label next to the quarter tabs.
function updateQuarterPeriodLabel() {
  const label = document.getElementById('dashboard-quarter-period');
  if (!label) return;

  const year = new Date().getFullYear();
  const ranges = {
    'all': `Todo o período`,
    '1': `Jan – Mar de ${year}`,
    '2': `Abr – Jun de ${year}`,
    '3': `Jul – Set de ${year}`,
    '4': `Out – Dez de ${year}`
  };
  label.innerText = ranges[dashboardQuarter] || '';
}

// RENDER DASHBOARD
function renderDashboard() {
  const dashTasks = getDashboardTasks();
  const total = dashTasks.length;
  const doneId = getDoneStatusId();
  const done = dashTasks.filter(t => t.status === doneId).length;
  const pending = total - done;

  const productivity = total > 0 ? Math.round((done / total) * 100) : 0;

  // Sum of deal values still in negotiation (not in the "concluído" column)
  const dealValueInNegotiation = dashTasks
    .filter(t => t.status !== doneId)
    .reduce((sum, t) => sum + (Number(t.valor) || 0), 0);

  // Ticket médio = valor médio por negócio fechado (etapa "concluído"/vendido)
  const avgTicket = getAverageTicket(dashTasks);

  updateQuarterPeriodLabel();

  // Set UI stats
  document.getElementById('stat-total-tasks').innerText = total;
  document.getElementById('stat-pending-tasks').innerText = pending;
  document.getElementById('stat-completed-tasks').innerText = done;
  document.getElementById('stat-productivity-rate').innerText = `${productivity}%`;
  document.getElementById('stat-deal-value').innerText = formatCurrency(dealValueInNegotiation);
  document.getElementById('stat-avg-ticket').innerText = formatCurrency(avgTicket);

  // Render conversion funnel by kanban stage
  renderConversionFunnel();

  // Render sales funnel (value-based) by kanban stage
  renderSalesFunnel();

  // Render recent activities
  const recentContainer = document.getElementById('recent-activities-list');
  recentContainer.innerHTML = '';
  
  if (recentActivities.length === 0) {
    recentContainer.innerHTML = `<div class="empty-state">Sem histórico recente.</div>`;
  } else {
    recentActivities.slice(0, 5).forEach(act => {
      let icon = 'plus';
      let iconColor = 'text-blue';
      let bgClass = 'bg-light-blue';
      
      if (act.type === 'status') {
        icon = 'refresh-cw';
        iconColor = 'text-purple';
        bgClass = 'bg-light-purple';
      } else if (act.type === 'edit') {
        icon = 'edit-2';
        iconColor = 'text-yellow';
        bgClass = 'bg-light-yellow';
      } else if (act.type === 'delete') {
        icon = 'trash';
        iconColor = 'text-green';
        bgClass = 'bg-light-green';
      }

      const item = document.createElement('div');
      item.className = 'activity-item';
      item.innerHTML = `
        <div class="activity-left">
          <div class="activity-badge ${bgClass}">
            <i data-lucide="${icon}" class="${iconColor}" style="width:14px; height:14px;"></i>
          </div>
          <div class="activity-title-desc">
            <span class="activity-title">${act.assignee}</span>
            <span class="activity-desc">${act.type === 'create' ? 'Adicionou' : act.type === 'edit' ? 'Editou' : act.type === 'status' ? 'Atualizou' : 'Deletou'} <strong>${act.taskTitle}</strong></span>
          </div>
        </div>
        <span class="activity-time">${act.time}</span>
      `;
      recentContainer.appendChild(item);
    });
  }

  // Refresh Charts
  setTimeout(initCharts, 50);
}

// RENDER CONVERSION FUNNEL BY KANBAN STAGE
function renderConversionFunnel() {
  const container = document.getElementById('conversion-funnel');
  if (!container) return;
  container.innerHTML = '';

  const dashTasks = getDashboardTasks();
  const total = dashTasks.length;

  if (total === 0) {
    container.innerHTML = `<div class="funnel-empty">Nenhuma atividade para calcular a conversão.</div>`;
    return;
  }

  // Current count of clients per stage (board order = funnel order)
  const counts = statuses.map(st => dashTasks.filter(t => t.status === st.id).length);

  // Cumulative "reached": clients currently at this stage OR any later stage
  // (in a pipeline, reaching a later stage means having passed the earlier ones)
  const reached = counts.map((_, i) => counts.slice(i).reduce((a, b) => a + b, 0));

  statuses.forEach((st, i) => {
    const style = STATUS_COLORS[st.colorIndex % STATUS_COLORS.length];
    const pctOfTotal = (reached[i] / total) * 100;
    // Step conversion: how many advanced from the previous stage
    const stepPct = i === 0 ? 100 : (reached[i - 1] > 0 ? (reached[i] / reached[i - 1]) * 100 : 0);

    const row = document.createElement('div');
    row.className = 'funnel-row';
    row.innerHTML = `
      <div class="funnel-row-head">
        <span class="funnel-stage-name">
          <span class="funnel-dot" style="background:${style.text};"></span>
          ${st.label}
        </span>
        <span class="funnel-stage-pct">${pctOfTotal.toFixed(0)}%</span>
      </div>
      <div class="funnel-bar-track">
        <div class="funnel-bar-fill" style="width:${pctOfTotal.toFixed(1)}%; background:${style.text};"></div>
      </div>
      <div class="funnel-row-foot">
        <span>${counts[i]} cliente(s) nesta etapa</span>
        <span>${i === 0 ? 'Entrada do funil' : `Conversão da etapa anterior: <strong>${stepPct.toFixed(0)}%</strong>`}</span>
      </div>
    `;
    container.appendChild(row);
  });
}

// RENDER SALES FUNNEL — leads no topo (manual) + pipeline por etapa do Kanban.
// A largura afunila pela QUANTIDADE (leads → negociações); cada barra também
// exibe o valor (R$) em negociação que alcançou aquela etapa.
function renderSalesFunnel() {
  const container = document.getElementById('sales-funnel');
  if (!container) return;
  container.innerHTML = '';

  const dashTasks = getDashboardTasks();

  if (statuses.length === 0 || (dashTasks.length === 0 && totalLeads === 0)) {
    container.innerHTML = `<div class="funnel-empty">Nenhuma negociação para montar o funil de vendas.</div>`;
    return;
  }

  // Per-stage snapshot: how many deals and how much R$ sit in each stage
  const counts = statuses.map(st => dashTasks.filter(t => t.status === st.id).length);
  const values = statuses.map(st =>
    dashTasks.filter(t => t.status === st.id).reduce((s, t) => s + (Number(t.valor) || 0), 0)
  );

  // Cumulative "reached at least this stage" — the pipeline narrows downstream
  const reachedCount = counts.map((_, i) => counts.slice(i).reduce((a, b) => a + b, 0));
  const reachedValue = values.map((_, i) => values.slice(i).reduce((a, b) => a + b, 0));

  // Widths scale by count; the widest reference is the greater of leads or the
  // top stage (guards against a leads value smaller than the deals in stage 1).
  const widthTop = Math.max(totalLeads, reachedCount[0] || 0) || 1;
  const widthFor = (n) => Math.max((n / widthTop) * 100, 22).toFixed(1);
  const pct = (num, den) => (den > 0 ? `${((num / den) * 100).toFixed(0)}%` : '—');

  // 1) Lead entry stage (manual, editable)
  const leadSeg = document.createElement('div');
  leadSeg.className = 'sf-segment';
  leadSeg.innerHTML = `
    <div class="sf-bar sf-bar-leads" style="width:${widthFor(totalLeads)}%;">
      <span class="sf-bar-label">Totalidade de Leads</span>
      <span class="sf-bar-metrics">
        <input type="number" min="0" step="1" id="sf-total-leads-input"
               class="sf-leads-input" value="${totalLeads}" aria-label="Quantidade de leads">
        <span class="sf-bar-count">leads (total)</span>
      </span>
    </div>
  `;
  container.appendChild(leadSeg);

  // 2) Kanban stages
  statuses.forEach((st, i) => {
    const style = STATUS_COLORS[st.colorIndex % STATUS_COLORS.length];
    // Conversion vs. the previous segment (leads for the first stage)
    const stepLabel = i === 0 ? pct(reachedCount[0], totalLeads)
                              : pct(reachedCount[i], reachedCount[i - 1]);

    const conv = document.createElement('div');
    conv.className = 'sf-conversion';
    conv.innerHTML = `↓ Conversão da etapa anterior: <strong>${stepLabel}</strong>`;
    container.appendChild(conv);

    const seg = document.createElement('div');
    seg.className = 'sf-segment';
    seg.innerHTML = `
      <div class="sf-bar" style="width:${widthFor(reachedCount[i])}%; background:${style.text};">
        <span class="sf-bar-label">${st.label}</span>
        <span class="sf-bar-metrics">
          <span class="sf-bar-value">${formatCurrency(reachedValue[i])}</span>
          <span class="sf-bar-count">${reachedCount[i]} negociação(ões)</span>
        </span>
      </div>
    `;
    container.appendChild(seg);
  });

  // Wire the manual leads input
  const leadInput = container.querySelector('#sf-total-leads-input');
  if (leadInput) {
    leadInput.addEventListener('change', () => {
      totalLeads = Math.max(0, parseInt(leadInput.value, 10) || 0);
      saveTotalLeads();
      renderSalesFunnel();
    });
  }
}

// SALES FORECAST (PREVISÃO DE VENDAS)

// Formata uma taxa (fração) no padrão pt-BR com 6 casas, ex.: 0,002667
function formatRate(rate) {
  return rate.toLocaleString('pt-BR', { minimumFractionDigits: 6, maximumFractionDigits: 6 });
}

// Nº de negócios na etapa de fechamento (última coluna / "vendido")
function getSoldCount() {
  const soldId = getDoneStatusId();
  return tasks.filter(t => t.status === soldId).length;
}

// Fechamentos necessários = Meta ÷ Ticket Médio (arredondado para cima)
function getRequiredClosings() {
  const at = getAverageTicket();
  return at > 0 ? Math.ceil(salesGoal / at) : 0;
}

// Taxa de conversão global = Vendidos ÷ Total Abordado
function getGlobalConversionRate() {
  return totalLeads > 0 ? getSoldCount() / totalLeads : 0;
}

// Volume no topo do funil = Fechamentos Necessários ÷ Taxa de Conversão Global
function getTopFunnelVolume() {
  const rate = getGlobalConversionRate();
  return rate > 0 ? getRequiredClosings() / rate : 0;
}

// Recalcula e atualiza todas as células derivadas da Previsão (sem
// re-renderizar as tabelas, para não perder o foco dos campos editáveis).
function updateForecastDerived() {
  const at = getAverageTicket();
  const rate = getGlobalConversionRate();

  const neededEl = document.getElementById('forecast-needed');
  if (neededEl) neededEl.innerText = at > 0 ? String(getRequiredClosings()) : '—';

  const rateEl = document.getElementById('conversion-global-value');
  if (rateEl) rateEl.innerText = formatRate(rate);
  const pctEl = document.getElementById('conversion-global-pct');
  if (pctEl) pctEl.innerText = `${(rate * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;

  const volEl = document.getElementById('top-funnel-volume');
  if (volEl) volEl.innerText = rate > 0
    ? Math.ceil(getTopFunnelVolume()).toLocaleString('pt-BR')
    : '—';

  renderMonthlyPlan();
}

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

// Plano mensal: distribui os contatos ainda a abordar pelos meses restantes.
// Contatos a abordar = Volume no Topo do Funil − Total Abordado (já abordados).
function renderMonthlyPlan() {
  const tbody = document.getElementById('monthly-plan-body');
  if (!tbody) return;

  const volume = Math.ceil(getTopFunnelVolume());
  const remaining = Math.max(0, volume - totalLeads);

  const currentMonth = new Date().getMonth();  // 0-11
  const remainingMonths = 12 - currentMonth;   // inclui o mês atual

  // Distribuição inteira e exata: a sobra vai para os primeiros meses restantes
  const base = remainingMonths > 0 ? Math.floor(remaining / remainingMonths) : 0;
  let extra = remaining - base * remainingMonths;

  let rows = '';
  MONTH_NAMES.forEach((name, i) => {
    let cell;
    if (i < currentMonth) {
      cell = '<span class="mp-past">—</span>';
    } else {
      let alloc = base;
      if (extra > 0) { alloc += 1; extra -= 1; }
      cell = alloc.toLocaleString('pt-BR');
    }
    rows += `
      <tr${i === currentMonth ? ' class="mp-current"' : ''}>
        <td>${name}</td>
        <td class="text-right">${cell}</td>
      </tr>
    `;
  });

  // Linha de total
  rows += `
    <tr class="mp-total-row">
      <td>Total a abordar</td>
      <td class="text-right">${remaining.toLocaleString('pt-BR')}</td>
    </tr>
  `;

  tbody.innerHTML = rows;

  const summaryEl = document.getElementById('monthly-plan-summary');
  if (summaryEl) {
    summaryEl.innerText = remainingMonths > 0
      ? `${remaining.toLocaleString('pt-BR')} contatos a abordar, distribuídos em ${remainingMonths} ${remainingMonths === 1 ? 'mês restante' : 'meses restantes'} de ${new Date().getFullYear()}.`
      : '';
  }
}

function renderForecast() {
  const tbody = document.getElementById('forecast-goal-body');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td>
        <div class="goal-input-wrapper">
          <span class="goal-prefix">R$</span>
          <input type="number" min="0" step="100" id="forecast-goal-input"
                 class="goal-input" value="${salesGoal}" aria-label="Meta de faturamento">
        </div>
      </td>
      <td class="text-right">${formatCurrency(getAverageTicket())}</td>
      <td class="text-right"><strong id="forecast-needed">—</strong></td>
    </tr>
  `;

  const input = document.getElementById('forecast-goal-input');
  if (input) {
    input.addEventListener('input', () => {
      salesGoal = Math.max(0, parseFloat(input.value) || 0);
      saveSalesGoal();
      updateForecastDerived();
    });
  }

  renderConversionTable();
  updateForecastDerived();
}

// Tabela de funil por etapa + "Total Abordado" (topo do funil, manual)
function renderConversionTable() {
  const tbody = document.getElementById('conversion-table-body');
  if (!tbody) return;

  let rows = `
    <tr class="ct-total-row">
      <td>Total Abordado</td>
      <td class="text-right">
        <input type="number" min="0" step="1" id="conversion-total-input"
               class="ct-input" value="${totalLeads}" aria-label="Total abordado">
      </td>
    </tr>
  `;

  statuses.forEach(st => {
    const count = tasks.filter(t => t.status === st.id).length;
    rows += `
      <tr>
        <td>${st.label}</td>
        <td class="text-right">${count}</td>
      </tr>
    `;
  });

  tbody.innerHTML = rows;

  const input = document.getElementById('conversion-total-input');
  if (input) {
    input.addEventListener('input', () => {
      totalLeads = Math.max(0, parseInt(input.value, 10) || 0);
      saveTotalLeads();
      updateForecastDerived();
    });
  }
}

// CHART INITIALIZATION
function initCharts() {
  // Chart: Categories Distribution (Tags count)
  const tagCounts = {};
  getDashboardTasks().forEach(t => {
    tagCounts[t.tag] = (tagCounts[t.tag] || 0) + 1;
  });

  const categories = Object.keys(tagCounts);
  const catData = Object.values(tagCounts);

  const ctxCategory = document.getElementById('categoryChart').getContext('2d');
  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }
  
  // Category colors: Negócios em vermelho, Marketing em azul
  const tagColorsMap = {
    'Negócios': '#E53E3E',
    'Marketing': '#3182CE'
  };

  const chartColors = categories.map(cat => tagColorsMap[cat] || '#CBD5E0');

  categoryChartInstance = new Chart(ctxCategory, {
    type: 'doughnut',
    data: {
      labels: categories,
      datasets: [{
        data: catData,
        backgroundColor: chartColors,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 10,
            font: { family: 'Inter', size: 10 }
          }
        }
      },
      cutout: '65%'
    }
  });
}

// RENDER ATIVIDADES (LIST & KANBAN SENSITIVE)
function renderAtividades() {
  // Read filter elements
  const searchVal = document.getElementById('search-input').value.toLowerCase();
  const dateVal = document.getElementById('filter-date').value;
  const assigneeVal = document.getElementById('filter-assignee').value;
  const priorityVal = document.getElementById('filter-priority').value;

  // Filter tasks array
  const filteredTasks = tasks.filter(task => {
    // Search filter
    const matchesSearch = 
      task.title.toLowerCase().includes(searchVal) || 
      task.subtitle.toLowerCase().includes(searchVal) ||
      task.email.toLowerCase().includes(searchVal) ||
      task.assignee.toLowerCase().includes(searchVal);

    // Date filter
    let matchesDate = true;
    if (dateVal === 'today') {
      const todayStr = new Date().toISOString().split('T')[0];
      matchesDate = task.date === todayStr;
    } else if (dateVal === 'week') {
      const oneWeekAgo = Date.now() - 7 * 86400000;
      const taskTime = new Date(task.date).getTime();
      matchesDate = taskTime >= oneWeekAgo;
    } else if (dateVal === 'month') {
      const oneMonthAgo = Date.now() - 30 * 86400000;
      const taskTime = new Date(task.date).getTime();
      matchesDate = taskTime >= oneMonthAgo;
    } else if (dateVal.startsWith('q')) {
      // Filtro por trimestre (quartil) do ano corrente
      const q = Number(dateVal.slice(1));
      const startMonth = (q - 1) * 3; // mês inicial (0-indexado)
      const year = new Date().getFullYear();
      const d = task.date ? new Date(task.date + 'T00:00:00') : null;
      matchesDate = !!d &&
        d.getFullYear() === year &&
        d.getMonth() >= startMonth &&
        d.getMonth() < startMonth + 3;
    }

    // Assignee filter
    const matchesAssignee = assigneeVal === 'all' || task.assignee === assigneeVal;

    // Priority filter
    const matchesPriority = priorityVal === 'all' || task.priority === priorityVal;

    return matchesSearch && matchesDate && matchesAssignee && matchesPriority;
  });

  // Select rendering mode
  if (currentStyle === 'list') {
    document.getElementById('atividades-list').style.display = 'block';
    document.getElementById('atividades-kanban').style.display = 'none';
    renderListView(filteredTasks);
  } else {
    document.getElementById('atividades-list').style.display = 'none';
    document.getElementById('atividades-kanban').style.display = 'flex';
    renderKanbanView(filteredTasks);
  }

  // Column counts are rendered per-column inside renderKanbanView

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// RENDER LIST VIEW TABLE
function renderListView(filteredTasks) {
  const tableBody = document.getElementById('table-body');
  tableBody.innerHTML = '';

  if (filteredTasks.length === 0) {
    document.getElementById('empty-state-list').style.display = 'flex';
    return;
  } else {
    document.getElementById('empty-state-list').style.display = 'none';
  }

  filteredTasks.forEach(task => {
    const contactAvatar = defaultContactAvatars[task.title] || '';
    const assigneeAvatar = defaultAssignees[task.assignee] || '';
    
    // Status badge (from dynamic statuses)
    const statusText = getStatusLabel(task.status);
    const statusStyle = getStatusStyle(task.status);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="contact-cell">
          ${contactAvatar 
            ? `<img src="${contactAvatar}" alt="${task.title}" class="contact-cell-avatar">` 
            : `<div class="client-avatar-placeholder">${getInitials(task.title)}</div>`
          }
          <div class="contact-info-wrapper">
            <span class="contact-name">${task.title}</span>
            <span class="contact-sub">${task.subtitle}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="tag-pill tag-${task.tag.toLowerCase()}">${task.tag}</span>
      </td>
      <td class="text-muted">${task.email}</td>
      <td class="text-muted">${task.phone}</td>
      <td>
        <div class="assignee-cell">
          ${assigneeAvatar 
            ? `<img src="${assigneeAvatar}" alt="${task.assignee}" class="assignee-avatar">`
            : `<div class="assignee-avatar" style="background:#CBD5E0; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:700;">${getInitials(task.assignee)}</div>`
          }
          <span>${task.assignee}</span>
        </div>
      </td>
      <td>
        ${renderPriorityDots(task.priority)}
      </td>
      <td>
        <span class="status-badge" style="background-color:${statusStyle.bg}; color:${statusStyle.text};">${statusText}</span>
      </td>
      <td class="text-right">
        <div class="list-actions">
          <button class="btn-table-action edit" onclick="openEditTaskModal('${task.id}')" title="Editar">
            <i data-lucide="edit-3"></i>
          </button>
          <button class="btn-table-action delete" onclick="deleteTask('${task.id}')" title="Deletar">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// RENDER KANBAN VIEW (columns are built dynamically from `statuses`)
function renderKanbanView(filteredTasks) {
  const board = document.getElementById('atividades-kanban');
  board.innerHTML = '';

  statuses.forEach(st => {
    const style = STATUS_COLORS[st.colorIndex % STATUS_COLORS.length];
    const columnTasks = filteredTasks.filter(t => t.status === st.id);

    const col = document.createElement('div');
    col.className = 'kanban-column';
    col.dataset.status = st.id;

    col.innerHTML = `
      <div class="column-header">
        <div class="column-title-wrapper">
          <span class="status-badge" style="background-color:${style.bg}; color:${style.text};">${st.label}</span>
          <span class="column-count">${columnTasks.length}</span>
        </div>
        <div class="column-actions">
          <button class="btn-icon-dots btn-edit-status" data-status="${st.id}" title="Renomear status"><i data-lucide="pencil"></i></button>
          <button class="btn-icon-dots btn-delete-status" data-status="${st.id}" title="Excluir status"><i data-lucide="trash-2"></i></button>
          <button class="btn-icon-add btn-add-in-status" data-status="${st.id}" title="Adicionar atividade"><i data-lucide="plus"></i></button>
        </div>
      </div>
      <div class="kanban-cards-wrapper" id="cards-${st.id}"></div>
    `;
    board.appendChild(col);

    const wrapper = col.querySelector('.kanban-cards-wrapper');
    if (columnTasks.length === 0) {
      wrapper.innerHTML = `<div class="kanban-empty-drop">Arraste atividades aqui</div>`;
    } else {
      columnTasks.forEach(task => wrapper.appendChild(buildTaskCard(task)));
    }
  });

  // Partition to create a new status column
  const addCol = document.createElement('div');
  addCol.className = 'kanban-add-column';
  addCol.innerHTML = `
    <button class="btn-add-status" id="btn-add-status">
      <i data-lucide="plus"></i>
      <span>Novo Status</span>
    </button>
  `;
  board.appendChild(addCol);

  // Bind dynamic column controls (re-created on every render)
  board.querySelectorAll('.btn-add-in-status').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); openAddTaskModal(btn.dataset.status); });
  });
  board.querySelectorAll('.btn-edit-status').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); renameStatus(btn.dataset.status); });
  });
  board.querySelectorAll('.btn-delete-status').forEach(btn => {
    btn.addEventListener('click', (e) => { e.stopPropagation(); deleteStatus(btn.dataset.status); });
  });
  document.getElementById('btn-add-status').addEventListener('click', addStatus);

  // Columns are new DOM nodes, so (re)bind drag & drop targets
  initKanbanDragDrop();
}

// BUILD A SINGLE KANBAN CARD ELEMENT
function buildTaskCard(task) {
  const assigneeAvatar = defaultAssignees[task.assignee] || '';

  const card = document.createElement('div');
  card.className = 'kanban-card';
  card.draggable = true;
  card.id = task.id;
  card.dataset.id = task.id;

  card.innerHTML = `
    <div class="card-top">
      <div class="client-profile">
        <div class="client-avatar-placeholder">${getFirstLetter(task.title)}</div>
        <div class="client-meta">
          <span class="client-name" title="${task.title}">${task.title}</span>
          <span class="client-company" title="${task.subtitle}">${task.subtitle}</span>
        </div>
      </div>
      <span class="tag-pill tag-${task.tag.toLowerCase()}">${task.tag}</span>
    </div>

    <div class="card-details">
      <div class="detail-row">
        <i data-lucide="mail"></i>
        <span class="detail-text" title="${task.email}">${task.email}</span>
      </div>
      <div class="detail-row">
        <i data-lucide="phone"></i>
        <span class="detail-text">${task.phone}</span>
      </div>
    </div>

    <div class="card-deal-value">
      <i data-lucide="dollar-sign"></i>
      <span>${formatCurrency(task.valor)}</span>
    </div>

    <div class="card-bottom">
      <div class="assignee-info">
        ${assigneeAvatar
          ? `<img src="${assigneeAvatar}" alt="${task.assignee}" class="assignee-avatar-sm">`
          : `<div class="assignee-avatar-sm" style="background:#CBD5E0; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:700;">${getInitials(task.assignee)}</div>`
        }
        <span class="assignee-name-sm" title="${task.assignee}">${task.assignee}</span>
      </div>
      ${renderPriorityDots(task.priority)}
    </div>

    <!-- Context/action hover overlays -->
    <div style="position: absolute; right: 12px; top: 12px; display: flex; gap: 4px; opacity: 0; transition: opacity 0.2s;" class="card-hover-actions">
      <button style="border:none; background:white; padding:4px; border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer; color:#2E9E6B;" onclick="event.stopPropagation(); openEditTaskModal('${task.id}')">
        <i data-lucide="edit-3" style="width:12px; height:12px;"></i>
      </button>
      <button style="border:none; background:white; padding:4px; border-radius:4px; box-shadow:0 1px 3px rgba(0,0,0,0.1); cursor:pointer; color:#E53E3E;" onclick="event.stopPropagation(); deleteTask('${task.id}')">
        <i data-lucide="trash-2" style="width:12px; height:12px;"></i>
      </button>
    </div>
  `;

  // Action panel hover interactions
  card.addEventListener('mouseenter', () => {
    const acts = card.querySelector('.card-hover-actions');
    if (acts) acts.style.opacity = '1';
  });
  card.addEventListener('mouseleave', () => {
    const acts = card.querySelector('.card-hover-actions');
    if (acts) acts.style.opacity = '0';
  });

  // Edit on double click
  card.addEventListener('dblclick', () => openEditTaskModal(task.id));

  setupDragAndDropEvents(card);
  return card;
}

// DRAG AND DROP HANDLERS
let draggedCardId = null;

function setupDragAndDropEvents(card) {
  card.addEventListener('dragstart', (e) => {
    draggedCardId = card.id;
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', card.id);
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    draggedCardId = null;
    
    // Clear styles
    document.querySelectorAll('.kanban-cards-wrapper').forEach(w => {
      w.classList.remove('drag-hover');
    });
  });
}

function initKanbanDragDrop() {
  const columns = document.querySelectorAll('.kanban-column');
  
  columns.forEach(col => {
    const wrapper = col.querySelector('.kanban-cards-wrapper');
    const status = col.dataset.status;

    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      wrapper.classList.add('drag-hover');
    });

    col.addEventListener('dragleave', () => {
      wrapper.classList.remove('drag-hover');
    });

    col.addEventListener('drop', (e) => {
      e.preventDefault();
      wrapper.classList.remove('drag-hover');
      
      const cardId = e.dataTransfer.getData('text/plain') || draggedCardId;
      if (!cardId) return;

      const task = tasks.find(t => t.id === cardId);
      if (task && task.status !== status) {
        task.status = status;
        saveTasks();
        addActivityLog('status', task.title, task.assignee);
        // Auto pre-registration in Vendas when reaching the "vendido" stage
        maybeCreatePreSale(task);
        renderAtividades();
      }
    });
  });
}

// FILTER OPTIONS POPULATION
function populateFilters() {
  const assigneeSelect = document.getElementById('filter-assignee');
  // Clear previous options (except placeholder)
  assigneeSelect.innerHTML = '<option value="all">Todos Responsáveis</option>';
  
  // Get unique assignees from tasks
  const assignees = [...new Set(tasks.map(t => t.assignee))];
  
  assignees.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.innerText = name;
    assigneeSelect.appendChild(opt);
  });
}

// RESET FILTERS
function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('filter-date').value = 'all';
  document.getElementById('filter-assignee').value = 'all';
  document.getElementById('filter-priority').value = 'all';
  renderAtividades();
}

// TASK MODAL OPERATIONS
const taskModal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');

function openAddTaskModal(status) {
  document.getElementById('modal-title').innerText = 'Adicionar Nova Atividade';
  document.getElementById('task-id').value = '';
  taskForm.reset();

  // Populate status dropdown from current statuses, default to first column
  const defaultStatus = status || (statuses[0] && statuses[0].id);
  populateStatusSelect(defaultStatus);
  document.getElementById('task-date').value = new Date().toISOString().split('T')[0];

  taskModal.classList.add('open');
}

window.openEditTaskModal = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  document.getElementById('modal-title').innerText = 'Editar Atividade';
  document.getElementById('task-id').value = task.id;
  document.getElementById('task-title').value = task.title;
  document.getElementById('task-subtitle').value = task.subtitle || '';
  document.getElementById('task-email').value = task.email || '';
  document.getElementById('task-phone').value = task.phone || '';
  document.getElementById('task-valor').value = task.valor != null ? task.valor : '';
  document.getElementById('task-assignee').value = task.assignee;
  document.getElementById('task-tag').value = task.tag;
  document.getElementById('task-priority').value = task.priority;
  populateStatusSelect(task.status);
  document.getElementById('task-date').value = task.date;
  document.getElementById('task-notes').value = task.notes || '';

  taskModal.classList.add('open');
}

function closeTaskModal() {
  taskModal.classList.remove('open');
  taskForm.reset();
}

// SAVE / UPDATE TASK
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const id = document.getElementById('task-id').value;
  const title = document.getElementById('task-title').value;
  const subtitle = document.getElementById('task-subtitle').value;
  const email = document.getElementById('task-email').value;
  const phone = document.getElementById('task-phone').value;
  const valor = parseFloat(document.getElementById('task-valor').value) || 0;
  const assignee = document.getElementById('task-assignee').value;
  const tag = document.getElementById('task-tag').value;
  const priority = document.getElementById('task-priority').value;
  const status = document.getElementById('task-status').value;
  const date = document.getElementById('task-date').value;
  const notes = document.getElementById('task-notes').value;

  let affectedTask = null;
  if (id) {
    // Update existing task
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], title, subtitle, email, phone, valor, assignee, tag, priority, status, date, notes };
      addActivityLog('edit', title, assignee);
      affectedTask = tasks[taskIndex];
    }
  } else {
    // Create new task
    const newTask = {
      id: 'task-' + Date.now(),
      title,
      subtitle,
      email,
      phone,
      valor,
      assignee,
      tag,
      priority,
      status,
      date,
      notes
    };
    tasks.push(newTask);
    addActivityLog('create', title, assignee);
    affectedTask = newTask;
  }

  saveTasks();
  // Auto pre-registration in Vendas when the task is in the "vendido" stage
  maybeCreatePreSale(affectedTask);
  populateFilters();
  closeTaskModal();
  
  if (currentView === 'dashboard') {
    renderDashboard();
  } else {
    renderAtividades();
  }
});

// DELETE TASK
window.deleteTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  
  if (confirm(`Tem certeza que deseja excluir a atividade para "${task.title}"?`)) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    addActivityLog('delete', task.title, task.assignee);
    populateFilters();
    
    if (currentView === 'dashboard') {
      renderDashboard();
    } else {
      renderAtividades();
    }
  }
}

// EXPORT TO CSV
function exportTasksToCSV() {
  if (tasks.length === 0) {
    alert("Nenhuma atividade para exportar.");
    return;
  }

  // Define headers
  const headers = ["ID", "Cliente/Contato", "Empresa/Detalhes", "E-mail", "Telefone", "Valor Negociacao", "Responsavel", "Canal/Tag", "Prioridade", "Status", "Data"];

  // Format rows
  const rows = tasks.map(t => [
    t.id,
    t.title,
    t.subtitle,
    t.email,
    t.phone,
    Number(t.valor) || 0,
    t.assignee,
    t.tag,
    t.priority,
    getStatusLabel(t.status),
    t.date
  ]);

  // Build CSV content
  let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Include BOM for proper Excel rendering in UTF-8
  csvContent += headers.join(",") + "\n";
  
  rows.forEach(row => {
    const formattedRow = row.map(value => {
      // Escape quotes and wrap in quotes if has comma
      let str = String(value || '');
      str = str.replace(/"/g, '""');
      if (str.includes(",") || str.includes("\n") || str.includes('"')) {
        str = `"${str}"`;
      }
      return str;
    });
    csvContent += formattedRow.join(",") + "\n";
  });

  // Trigger download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `neg_crm_atividades_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ============================================================
// SALES (VENDAS) MODULE
// ============================================================

const PAYMENT_STATUS_LABELS = {
  pendente: 'Pendente',
  parcial: 'Parcial',
  pago: 'Pago',
  cancelado: 'Cancelado'
};

function getPaymentStatusLabel(status) {
  return PAYMENT_STATUS_LABELS[status] || status;
}

// Number of installments already matured (vencidas) for a sale.
// The 1st installment is due on the sale date and the rest fall due monthly.
function getInstallmentsDue(sale) {
  const total = Number(sale.qty) || 0;
  if (total <= 0 || !sale.date) return 0;

  const saleDate = new Date(sale.date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(saleDate.getTime()) || today < saleDate) return 0;

  // Full months elapsed since the sale date
  let months = (today.getFullYear() - saleDate.getFullYear()) * 12
             + (today.getMonth() - saleDate.getMonth());
  if (today.getDate() < saleDate.getDate()) months -= 1;

  const due = months + 1; // first installment matures on the sale date itself
  return Math.max(0, Math.min(due, total));
}

// Amount already received for a sale, driven by matured installments.
// "pago" counts as fully received, "cancelado" as nothing.
function getReceivedForSale(sale) {
  if (sale.paymentStatus === 'cancelado') return 0;
  if (sale.paymentStatus === 'pago') return Number(sale.totalValue) || 0;
  return getInstallmentsDue(sale) * (Number(sale.unitValue) || 0);
}

// A kanban stage counts as "vendido" when its name contains "vend"
// (e.g. "Vendido", "Venda") or when it is the final column of the board.
function isSoldStatus(statusId) {
  const st = getStatusById(statusId);
  if (!st) return false;
  if ((st.label || '').toLowerCase().includes('vend')) return true;
  return statusId === getDoneStatusId();
}

// Create a pre-registration (draft) sale in the Vendas menu from a task's data.
// Guards against duplicates so moving a card in/out of the stage won't re-create it.
function createPreSaleFromTask(task) {
  if (task.saleId && sales.some(s => s.id === task.saleId)) return null;

  const value = Number(task.valor) || 0;
  const sale = {
    id: 'sale-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
    client: task.subtitle ? `${task.title} / ${task.subtitle}` : task.title,
    service: task.subtitle || task.title,
    category: 'Outro',
    seller: task.assignee || '',
    description: `Pré-cadastro gerado automaticamente ao mover o cliente para a etapa de venda no Kanban. Origem: ${task.tag || '-'}.`,
    qty: 1,
    unitValue: value,
    totalValue: value,
    paymentMethod: 'À vista',
    paymentStatus: 'pendente',
    date: new Date().toISOString().split('T')[0],
    notes: `Contato: ${task.email || '-'} • ${task.phone || '-'}`,
    isDraft: true,
    fromTaskId: task.id
  };

  sales.push(sale);
  task.saleId = sale.id;
  saveSales();
  saveTasks();
  return sale;
}

// If a task landed in the "vendido" stage, create its pre-registration sale.
function maybeCreatePreSale(task) {
  if (!task || !isSoldStatus(task.status)) return;
  const created = createPreSaleFromTask(task);
  if (created) {
    addActivityLog('create', `Pré-venda: ${task.title}`, task.assignee);
    showToast(`Pré-cadastro de venda criado para "${task.title}" no menu Vendas.`);
  }
}

// Lightweight non-blocking toast notification
let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i data-lucide="check-circle-2"></i><span>${message}</span>`;
  toast.classList.add('show');
  if (window.lucide) window.lucide.createIcons();

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

// RENDER SALES VIEW (summary + table)
function renderSales() {
  // Summary metrics (cancelled sales excluded from revenue)
  const activeSales = sales.filter(s => s.paymentStatus !== 'cancelado');
  const revenue = activeSales.reduce((sum, s) => sum + (Number(s.totalValue) || 0), 0);
  // Received = matured installments (por vencimento a partir da data da venda)
  const received = activeSales.reduce((sum, s) => sum + getReceivedForSale(s), 0);
  const pending = revenue - received;
  // Ticket médio = faturamento / número de vendas ativas (canceladas excluídas)
  const avgTicket = activeSales.length > 0 ? revenue / activeSales.length : 0;

  document.getElementById('stat-sales-count').innerText = sales.length;
  document.getElementById('stat-sales-revenue').innerText = formatCurrency(revenue);
  document.getElementById('stat-sales-received').innerText = formatCurrency(received);
  document.getElementById('stat-sales-pending').innerText = formatCurrency(pending);
  document.getElementById('stat-sales-avg-ticket').innerText = formatCurrency(avgTicket);

  // Table
  const tbody = document.getElementById('sales-table-body');
  tbody.innerHTML = '';

  if (sales.length === 0) {
    document.getElementById('empty-state-sales').style.display = 'flex';
  } else {
    document.getElementById('empty-state-sales').style.display = 'none';

    // Newest first
    const ordered = [...sales].sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    ordered.forEach(sale => {
      const due = getInstallmentsDue(sale);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="contact-info-wrapper">
            <span class="contact-name">${sale.client}</span>
            ${sale.seller ? `<span class="contact-sub">${sale.seller}</span>` : ''}
          </div>
        </td>
        <td>
          <div class="contact-info-wrapper">
            <span class="contact-name">${sale.service} ${sale.isDraft ? '<span class="draft-pill">Pré-cadastro</span>' : ''}</span>
            ${sale.description ? `<span class="contact-sub" title="${sale.description}">${sale.description}</span>` : ''}
          </div>
        </td>
        <td><span class="category-pill">${sale.category}</span></td>
        <td class="text-right">
          <div class="contact-info-wrapper" style="align-items: flex-end;">
            <span class="contact-name">${sale.qty}x</span>
            <span class="contact-sub">${due}/${sale.qty} vencida(s)</span>
          </div>
        </td>
        <td class="text-right">
          <div class="contact-info-wrapper" style="align-items: flex-end;">
            <span class="contact-name">${formatCurrency(sale.totalValue)}</span>
            <span class="contact-sub">${sale.qty}x ${formatCurrency(sale.unitValue)}</span>
          </div>
        </td>
        <td class="text-muted">${sale.paymentMethod}</td>
        <td><span class="pay-badge pay-${sale.paymentStatus}">${getPaymentStatusLabel(sale.paymentStatus)}</span></td>
        <td class="text-muted">${formatDateBR(sale.date)}</td>
        <td class="text-right">
          <div class="list-actions">
            <button class="btn-table-action edit" onclick="openEditSaleModal('${sale.id}')" title="Editar">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn-table-action delete" onclick="deleteSale('${sale.id}')" title="Excluir">
              <i data-lucide="trash-2"></i>
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  if (window.lucide) window.lucide.createIcons();
}

// Format an ISO date (YYYY-MM-DD) as DD/MM/YYYY
function formatDateBR(iso) {
  if (!iso) return '-';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

// SALE MODAL OPERATIONS
const saleModal = document.getElementById('sale-modal');
const saleForm = document.getElementById('sale-form');

function recalcSaleTotal() {
  const qty = parseFloat(document.getElementById('sale-qty').value) || 0;
  const unit = parseFloat(document.getElementById('sale-unit-value').value) || 0;
  document.getElementById('sale-total-value').value = (qty * unit).toFixed(2);
}

function openAddSaleModal() {
  document.getElementById('sale-modal-title').innerText = 'Cadastrar Nova Venda';
  document.getElementById('sale-id').value = '';
  saleForm.reset();
  document.getElementById('sale-qty').value = 1;
  document.getElementById('sale-date').value = new Date().toISOString().split('T')[0];
  recalcSaleTotal();
  saleModal.classList.add('open');
}

window.openEditSaleModal = function(id) {
  const sale = sales.find(s => s.id === id);
  if (!sale) return;

  document.getElementById('sale-modal-title').innerText = 'Editar Venda';
  document.getElementById('sale-id').value = sale.id;
  document.getElementById('sale-client').value = sale.client;
  document.getElementById('sale-service').value = sale.service;
  document.getElementById('sale-category').value = sale.category;
  document.getElementById('sale-seller').value = sale.seller || '';
  document.getElementById('sale-description').value = sale.description || '';
  document.getElementById('sale-qty').value = sale.qty;
  document.getElementById('sale-unit-value').value = sale.unitValue;
  document.getElementById('sale-total-value').value = Number(sale.totalValue).toFixed(2);
  document.getElementById('sale-payment-method').value = sale.paymentMethod;
  document.getElementById('sale-payment-status').value = sale.paymentStatus;
  document.getElementById('sale-date').value = sale.date;
  document.getElementById('sale-notes').value = sale.notes || '';

  saleModal.classList.add('open');
}

function closeSaleModal() {
  saleModal.classList.remove('open');
  saleForm.reset();
}

// SAVE / UPDATE SALE
saleForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = document.getElementById('sale-id').value;
  const qty = parseFloat(document.getElementById('sale-qty').value) || 0;
  const unitValue = parseFloat(document.getElementById('sale-unit-value').value) || 0;

  const data = {
    client: document.getElementById('sale-client').value,
    service: document.getElementById('sale-service').value,
    category: document.getElementById('sale-category').value,
    seller: document.getElementById('sale-seller').value,
    description: document.getElementById('sale-description').value,
    qty,
    unitValue,
    totalValue: qty * unitValue,
    paymentMethod: document.getElementById('sale-payment-method').value,
    paymentStatus: document.getElementById('sale-payment-status').value,
    date: document.getElementById('sale-date').value,
    notes: document.getElementById('sale-notes').value
  };

  if (id) {
    // Saving a reviewed pre-registration clears its draft flag
    const idx = sales.findIndex(s => s.id === id);
    if (idx > -1) sales[idx] = { ...sales[idx], ...data, isDraft: false };
  } else {
    sales.push({ id: 'sale-' + Date.now(), ...data });
  }

  saveSales();
  closeSaleModal();
  renderSales();
});

// DELETE SALE
window.deleteSale = function(id) {
  const sale = sales.find(s => s.id === id);
  if (!sale) return;

  if (confirm(`Excluir a venda "${sale.service}" para ${sale.client}?`)) {
    sales = sales.filter(s => s.id !== id);
    saveSales();
    renderSales();
  }
}

// EVENT LISTENERS & INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  // Load local state
  loadState();

  // Sidebar navigation click triggers
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
    });
  });

  // Switch display styling: List vs Kanban
  document.querySelectorAll('.view-toggle-container .view-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.view-toggle-container .view-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentStyle = pill.dataset.style;
      renderAtividades();
    });
  });

  // Filter actions
  document.getElementById('search-input').addEventListener('input', renderAtividades);
  document.getElementById('filter-date').addEventListener('change', renderAtividades);
  document.getElementById('filter-assignee').addEventListener('change', renderAtividades);
  document.getElementById('filter-priority').addEventListener('change', renderAtividades);
  document.getElementById('btn-reset-filters').addEventListener('click', resetFilters);

  // Header Actions
  document.getElementById('btn-add-activity').addEventListener('click', () => openAddTaskModal());
  document.getElementById('btn-add-sale').addEventListener('click', () => openAddSaleModal());
  document.getElementById('btn-export').addEventListener('click', exportTasksToCSV);

  // Kanban inline creation buttons and status controls are bound
  // dynamically inside renderKanbanView (columns are re-created each render)

  // Task Modal Cancel Operations
  document.getElementById('btn-close-modal').addEventListener('click', closeTaskModal);
  document.getElementById('btn-cancel-modal').addEventListener('click', closeTaskModal);
  document.getElementById('task-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('task-modal')) {
      closeTaskModal();
    }
  });

  // Sale Modal Operations
  document.getElementById('btn-close-sale-modal').addEventListener('click', closeSaleModal);
  document.getElementById('btn-cancel-sale-modal').addEventListener('click', closeSaleModal);
  document.getElementById('sale-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('sale-modal')) {
      closeSaleModal();
    }
  });
  // Auto-calculate total (qty * unit value) as the user types
  document.getElementById('sale-qty').addEventListener('input', recalcSaleTotal);
  document.getElementById('sale-unit-value').addEventListener('input', recalcSaleTotal);

  // Dashboard shortcuts
  document.getElementById('btn-see-all-activities').addEventListener('click', () => {
    switchView('atividades');
  });

  // Dashboard quarter (trimestre) filter tabs
  const quarterTabs = document.getElementById('dashboard-quarter-tabs');
  if (quarterTabs) {
    quarterTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.quarter-tab');
      if (!tab) return;

      dashboardQuarter = tab.dataset.quarter;

      quarterTabs.querySelectorAll('.quarter-tab').forEach(btn => {
        const isActive = btn === tab;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      renderDashboard();
    });
  }

  // Populate dynamic select filter
  populateFilters();

  // Kanban columns + drag/drop targets are created inside renderKanbanView

  // Render initial dashboard view
  switchView('dashboard');
});
