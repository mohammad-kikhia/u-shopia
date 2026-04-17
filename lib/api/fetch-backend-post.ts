/**
 * Server-side fetch to the auth backend without losing method/body on redirects.
 *
 * Default `fetch` follows 301/302/303 with GET (body dropped). This uses
 * `redirect: "manual"` and repeats the same method (and body for POST) to each
 * `Location` until a non-redirect response.
 */
const REDIRECT = new Set([301, 302, 303, 307, 308]);
const MAX_REDIRECTS = 10;

type BackendMethod = "GET" | "POST";

export async function fetchBackendWithRedirects(
  startUrl: string,
  init: {
    method: BackendMethod;
    headers: Record<string, string>;
    /** Omit for GET; optional for POST (e.g. refresh uses cookie only). */
    body?: string;
  },
): Promise<Response> {
  let url = startUrl;
  const { method, headers, body } = init;

  for (let hop = 0; hop < MAX_REDIRECTS; hop++) {
    const res = await fetch(url, {
      method,
      headers,
      ...(body !== undefined ? { body } : {}),
      redirect: "manual",
      cache: "no-store",
    });

    if (!REDIRECT.has(res.status)) {
      return res;
    }

    const loc = res.headers.get("location");
    if (!loc) {
      return res;
    }

    await res.arrayBuffer().catch(() => undefined);
    url = new URL(loc, url).href;
  }

  throw new Error(`fetchBackendWithRedirects: exceeded ${MAX_REDIRECTS} redirects from ${startUrl}`);
}

/** JSON POST with body (sign-in, register). */
export async function fetchBackendPost(
  startUrl: string,
  headers: Record<string, string>,
  body: string,
): Promise<Response> {
  return fetchBackendWithRedirects(startUrl, { method: "POST", headers, body });
}
