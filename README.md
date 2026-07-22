# 亚马逊欧洲站 AI 运营助手

这是一个可直接运行的 Amazon Europe AI Assistant。为优先解决本地打开网页的问题，项目已改为零 npm 运行依赖：只需要 Node.js 18+，`npm install` 不再需要访问任何第三方包。

## 功能

- 欧洲站运营首页：30 日销售额、广告花费、ACOS、FBA 库存等指标。
- SKU 看板：按销售额展示 ASIN、SKU、站点、库存和 Buy Box 份额。
- AI 工作流：Listing 优化、广告诊断、库存补货、欧盟合规检查。
- AI 接口：配置 `OPENAI_API_KEY` 后通过 Node.js 内置 `fetch` 调用 OpenAI Chat Completions；未配置时使用本地规则兜底。
- 数据库：使用 `data/store.json` 做本地文件数据库，便于无依赖启动和演示。

## 快速开始

```bash
npm install
cp .env.example .env
npm run db:seed
npm run dev
```

打开 `http://localhost:8787` 即可访问 Amazon AI Assistant 网页。

## 构建

```bash
npm run build
node dist/server.js
```

构建产物会复制到 `dist/`，静态网页位于 `dist/public`。

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `PORT` | 服务端口，默认 `8787` |
| `OPENAI_API_KEY` | OpenAI API Key，留空时使用本地规则建议 |
| `OPENAI_MODEL` | AI 模型名称，默认 `gpt-4o-mini` |
| `DATA_FILE` | 本地 JSON 数据文件路径，默认 `data/store.json` |

## API

- `GET /api/health`：服务健康检查。
- `GET /api/dashboard`：获取 SKU 与汇总指标。
- `POST /api/ai/run`：运行 AI 工作流。
