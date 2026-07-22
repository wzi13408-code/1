import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const port = Number(process.env.PORT || 8787);
const dataFile = join(root, process.env.DATA_FILE || 'data/store.json');
const publicDir = join(root, 'public');

const workflows = new Set(['listing', 'ads', 'inventory', 'compliance']);
const prompts = {
  listing: 'Amazon Europe listing optimization expert. Return concise Chinese advice with EU marketplace localization details.',
  ads: 'Amazon Ads strategist for EU marketplaces. Diagnose ACOS, keyword structure, budget allocation, and next actions.',
  inventory: 'Amazon EU supply chain analyst. Highlight stockout risk, replenishment timing, and cash-flow tradeoffs.',
  compliance: 'Amazon EU compliance operations assistant. Flag VAT, GPSR, CE, labeling, and marketplace policy risks. Do not provide legal advice.'
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    if (url.pathname === '/api/health') return json(res, { ok: true, service: 'amazon-eu-ai-ops-assistant' });
    if (url.pathname === '/api/dashboard') return json(res, await getDashboard());
    if (url.pathname === '/api/ai/run' && req.method === 'POST') return json(res, await runAssistant(await readJsonBody(req)));
    return serveStatic(url.pathname, res);
  } catch (error) {
    console.error(error);
    json(res, { message: error.message || '服务器内部错误' }, error.statusCode || 500);
  }
});

server.listen(port, () => {
  console.log(`Amazon AI Assistant is running at http://localhost:${port}`);
});

async function getDashboard() {
  const db = await readDb();
  const totals = db.products.reduce((acc, product) => ({
    sales30d: acc.sales30d + product.sales30d,
    adSpend: acc.adSpend + product.adSpend,
    inventory: acc.inventory + product.inventory
  }), { sales30d: 0, adSpend: 0, inventory: 0 });
  return { account: db.account, products: db.products, tasks: db.tasks, totals };
}

async function runAssistant(payload) {
  if (!payload || !workflows.has(payload.workflow) || typeof payload.input !== 'string' || payload.input.trim().length < 3) {
    const error = new Error('请求参数无效：workflow 必须有效，input 至少 3 个字符。');
    error.statusCode = 400;
    throw error;
  }
  const output = await callAi(payload.workflow, payload.input.trim());
  const db = await readDb();
  const run = { id: `run-${Date.now()}`, workflow: payload.workflow, input: payload.input.trim(), output, createdAt: new Date().toISOString() };
  db.aiRuns.unshift(run);
  await writeDb(db);
  return run;
}

async function callAi(workflow, input) {
  if (!process.env.OPENAI_API_KEY) return offlineRecommendation(workflow, input);
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature: 0.3, messages: [{ role: 'system', content: prompts[workflow] }, { role: 'user', content: input }] })
  });
  if (!response.ok) return `${offlineRecommendation(workflow, input)}\n\nOpenAI 接口暂时不可用：HTTP ${response.status}`;
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '未生成建议，请补充更多运营数据后重试。';
}

function offlineRecommendation(workflow, input) {
  const playbooks = {
    listing: '建议：补齐五点描述核心关键词；为 DE/FR/IT/ES 分别本地化标题；检查图片是否覆盖尺寸、材质、场景和包装清单。',
    ads: '建议：拆分品牌词、防御词、竞品词和泛词活动；暂停 14 天无转化高花费词；把预算迁移到 ACOS 低于毛利率 70% 的词。',
    inventory: '建议：按 30 日销量、入仓周期和安全库存重算补货；库存低于 21 天的 SKU 标红；比较 Pan-EU 与本地仓费用差异。',
    compliance: '建议：核对 VAT、GPSR 负责人、CE/UKCA、包装回收注册和多语种标签；高风险事项需咨询专业顾问。'
  };
  return `已收到 ${workflow} 分析请求。当前未配置 OPENAI_API_KEY，因此返回本地规则建议。\n输入摘要：${input.slice(0, 220)}\n\n${playbooks[workflow]}`;
}

async function readDb() {
  if (!existsSync(dataFile)) {
    await mkdir(join(root, 'data'), { recursive: true });
    await writeFile(dataFile, JSON.stringify({ account: {}, products: [], tasks: [], aiRuns: [] }, null, 2));
  }
  return JSON.parse(await readFile(dataFile, 'utf8'));
}

async function writeDb(db) {
  await writeFile(dataFile, `${JSON.stringify(db, null, 2)}\n`);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function serveStatic(pathname, res) {
  const safePath = normalize(pathname === '/' ? '/index.html' : pathname).replace(/^\.\.(\/|\\|$)/, '');
  const filePath = join(publicDir, safePath);
  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': contentType(filePath) });
  createReadStream(filePath).pipe(res);
}

function contentType(filePath) {
  return { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' }[extname(filePath)] || 'application/octet-stream';
}

function json(res, body, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}
