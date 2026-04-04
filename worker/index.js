export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname;
    let path = url.pathname;

    // Normalize: treat / as /index.html
    if (path.endsWith("/")) {
      path += "index.html";
    }

    const key = `${host}${path}`;

    const object = await env.BUCKET.get(key);

    if (!object) {
      // Try index.html fallback for extensionless paths
      const fallback = await env.BUCKET.get(`${host}${path}/index.html`);
      if (!fallback) {
        // No R2 content for this host — pass through to origin (e.g. backend apps)
        return fetch(request);
      }
      return respond(fallback);
    }

    return respond(object);
  },
};

function respond(object) {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  const ext = object.key.split(".").pop().toLowerCase();
  const contentTypes = {
    html: "text/html; charset=utf-8",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    webp: "image/webp",
  };
  if (contentTypes[ext]) {
    headers.set("content-type", contentTypes[ext]);
  }

  return new Response(object.body, { headers });
}
