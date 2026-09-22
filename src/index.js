const BOOK_ASSET_PREFIX = "/assets/books/";
const FALLBACK_COVER = "/assets/books/cover-unavailable.svg";
const FALLBACK_ASSET = "/assets/asset-unavailable.svg";
const HEALTH_PATH = "/__site-health";
const IMAGE_ASSET = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === HEALTH_PATH) {
      return healthResponse(env);
    }

    const response = await env.ASSETS.fetch(request);
    if (IMAGE_ASSET.test(url.pathname) && url.pathname.startsWith("/assets/") && response.status === 404) {
      ctx.waitUntil(logFallback(url.pathname));
      const fallbackPath = url.pathname.startsWith(BOOK_ASSET_PREFIX) ? FALLBACK_COVER : FALLBACK_ASSET;
      const fallback = await env.ASSETS.fetch(new Request(new URL(fallbackPath, url), request));
      const headers = new Headers(fallback.headers);
      headers.set("x-tmh-fallback", fallbackPath);
      return new Response(fallback.body, { status: fallback.status, headers });
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
