export function parseJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function isTokenValid(token: string | null | undefined): boolean {
  if (!token) return false;
  const payload = parseJwt<{ exp?: number }>(token);
  if (!payload?.exp) return false;
  // exp é em segundos (padrão JWT)
  const expiresAt = payload.exp * 1000;
  return Date.now() < expiresAt;
}
