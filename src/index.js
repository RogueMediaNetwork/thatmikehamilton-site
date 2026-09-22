const BOOK_ASSET_PREFIX = "/assets/books/";
const FALLBACK_COVER = "/assets/books/cover-unavailable.svg";
const HEALTH_PATH = "/__site-health";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === HEALTH_PATH) {
      return healthResponse(env);
    }

    const response = await env.ASSETS.fetch(request);
    if (url.pathname.startsWith(BOOK_ASSET_PREFIX) && response.status === 404) {
      ctx.waitUntil(logFallback(url.pathname));
      return env.ASSETS.fetch(new Request(new URL(FALLBACK_COVER, url), request));
    }
    return response;
  },

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(runHealthCheck(env));
  },
};

async function healthResponse(env) {
  const report = await runHealthCheck(env);
  return Response.json(report, { headers: { "cache-control": "no-store" } });
}

async function runHealthCheck(env) {
  const checkedAt = new Date().toISOString();
  const index = await env.ASSETS.fetch("https://health.local/answers/");
  if (!index.ok) {
    const report = { event: "site_health", ok: false, checkedAt, reason: "answers_page_missing", status: index.status };
    console.error(JSON.stringify(report));
    return report;
  }

  const html = await index.text();
  const coverPaths = [...new Set([...html.matchAll(/\/assets\/books\/[^\"'\s<>]+/g)].map((match) => match[0]))]
    .filter((path) => path !== FALLBACK_COVER);
  const checks = await Promise.all(coverPaths.map(async (path) => {
    const response = await env.ASSETS.fetch(`https://health.local${path}`);
    return { path, status: response.status, ok: response.ok };
  }));
  const missing = checks.filter((check) => !check.ok).map((check) => check.path);
  const report = { event: "site_health", ok: missing.length === 0, checkedAt, coversChecked: checks.length, missing };
  (report.ok ? console.log : console.error)(JSON.stringify(report));
  return report;
}

async function logFallback(path) {
  console.error(JSON.stringify({ event: "book_cover_fallback", path, repairedAt: new Date().toISOString() }));
}
