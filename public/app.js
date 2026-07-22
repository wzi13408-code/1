const workflows = [
  ['listing', '✨ Listing 优化'],
  ['ads', '📈 广告诊断'],
  ['inventory', '📦 库存补货'],
  ['compliance', '🛡️ 合规检查']
];
let activeWorkflow = 'listing';

const metricsEl = document.querySelector('#metrics');
const productsEl = document.querySelector('#products');
const workflowsEl = document.querySelector('#workflows');
const promptEl = document.querySelector('#prompt');
const answerEl = document.querySelector('#answer');
const runButton = document.querySelector('#run');

renderWorkflowButtons();
loadDashboard();
runButton.addEventListener('click', runAssistant);

function renderWorkflowButtons() {
  workflowsEl.innerHTML = workflows.map(([id, label]) => `<button data-id="${id}" class="${id === activeWorkflow ? 'active' : ''}">${label}</button>`).join('');
  workflowsEl.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    activeWorkflow = button.dataset.id;
    renderWorkflowButtons();
  }));
}

async function loadDashboard() {
  const dashboard = await fetch('/api/dashboard').then((res) => res.json());
  const acos = dashboard.totals.sales30d ? dashboard.totals.adSpend / dashboard.totals.sales30d : 0;
  metricsEl.innerHTML = [
    ['30 日销售额', `€${dashboard.totals.sales30d.toLocaleString()}`],
    ['广告花费', `€${dashboard.totals.adSpend.toLocaleString()}`],
    ['综合 ACOS', `${(acos * 100).toFixed(1)}%`],
    ['FBA 库存', `${dashboard.totals.inventory} 件`]
  ].map(([title, value]) => `<div class="metric"><span>${title}</span><strong>${value}</strong></div>`).join('');
  productsEl.innerHTML = dashboard.products.map((product) => `<div class="row"><div><strong>${escapeHtml(product.title)}</strong><small>${product.marketplace} · ${product.sku} · ${product.asin}</small></div><span>€${product.sales30d.toLocaleString()}</span><span>库存 ${product.inventory}</span><span>Buy Box ${(product.buyBoxShare * 100).toFixed(0)}%</span></div>`).join('');
}

async function runAssistant() {
  runButton.disabled = true;
  runButton.textContent = '分析中...';
  answerEl.hidden = false;
  answerEl.textContent = '';
  try {
    const response = await fetch('/api/ai/run', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ workflow: activeWorkflow, input: promptEl.value }) });
    const data = await response.json();
    answerEl.textContent = data.output || data.message || '未获得回复';
  } finally {
    runButton.disabled = false;
    runButton.textContent = '生成运营建议';
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}
