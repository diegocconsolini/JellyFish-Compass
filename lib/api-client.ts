import { API_BASE } from "./constants";

export async function testConnection(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/endpoints/export/v0/teams/list_teams?hierarchy_level=1`, { headers: { Authorization: `Token ${token}` } });
    return res.ok;
  } catch { return false; }
}

export async function callEndpoint(path: string, token: string, params: Record<string, string>): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const url = new URL(path, API_BASE);
    for (const [k, v] of Object.entries(params)) { if (v) url.searchParams.set(k, v); }
    const res = await fetch(url.toString(), { headers: { Authorization: `Token ${token}` } });
    if (res.ok) { return { ok: true, data: await res.json() }; }
    return { ok: false, error: `HTTP ${res.status}: ${await res.text()}` };
  } catch (err) { return { ok: false, error: String(err) }; }
}
