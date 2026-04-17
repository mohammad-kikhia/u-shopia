/** Read `Response` body and return a JSON object (or `{ message }` for plain text / invalid JSON). */
export async function readBackendJsonBody(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  const t = text.trim();
  if (!t) return {};
  try {
    const p = JSON.parse(t) as unknown;
    if (typeof p === "object" && p !== null && !Array.isArray(p)) {
      return p as Record<string, unknown>;
    }
    return { message: String(p) };
  } catch {
    return { message: t.length > 500 ? `${t.slice(0, 500)}…` : t };
  }
}
