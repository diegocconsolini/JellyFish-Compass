"use client";
import { useState } from "react";
import { JellyfishEndpoint } from "@/lib/types";
import { callEndpoint } from "@/lib/api-client";

type ApiExplorerProps = { token: string; endpoints: JellyfishEndpoint[]; getParams?: (ep: JellyfishEndpoint) => Record<string, string>; mockResponses?: Record<string, unknown> };

export function ApiExplorer({ token, endpoints, getParams, mockResponses }: ApiExplorerProps) {
  const [selected, setSelected] = useState<JellyfishEndpoint | null>(null);
  const [params, setParams] = useState<Record<string, string>>({});
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(true);

  function handleSelect(ep: JellyfishEndpoint) {
    setSelected(ep); setResult(null); setError(null);
    setParams(getParams ? getParams(ep) : {});
  }

  async function handleExecute() {
    if (!selected) return;
    if (useMock && mockResponses?.[selected.name]) { setResult(mockResponses[selected.name]); setError(null); return; }
    if (!token) { setError("Enter a Jellyfish API token above to use live mode."); return; }
    setLoading(true);
    const res = await callEndpoint(selected.path, token, params);
    setLoading(false);
    if (res.ok) { setResult(res.data); setError(null); } else { setError(res.error || "Request failed"); setResult(null); }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5 mb-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold">API Explorer</h3>
        <div className="flex items-center gap-2 text-[11.5px] text-text-ghost">
          <span>Mock</span>
          <button role="switch" aria-checked={!useMock} aria-label="Toggle between mock and live API mode" onClick={() => setUseMock(!useMock)} className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${useMock ? "bg-blue" : "bg-green shadow-[0_0_8px_rgba(52,211,153,.25)]"}`}>
            <span aria-hidden="true"><div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all shadow ${useMock ? "left-[3px]" : "right-[3px]"}`} /></span>
          </button>
          <span className={useMock ? "text-blue font-semibold" : "text-green font-semibold"}>{useMock ? "Mock" : "Live"}</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3.5">
        {endpoints.map((ep) => (
          <button key={ep.name} onClick={() => handleSelect(ep)} className={`px-3 py-1.5 rounded-md font-mono text-[11.5px] font-medium border transition-all cursor-pointer ${selected?.name === ep.name ? "bg-blue-dim border-blue/30 text-blue" : "bg-surface-raised border-border text-text-ghost hover:text-text-dim hover:border-border-vivid"}`}>{ep.name}</button>
        ))}
      </div>
      {selected && (
        <div className="rounded-xl border border-border-vivid bg-bg p-4">
          <div className="flex items-center gap-2 mb-3.5">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-dim text-green font-mono">GET</span>
            <span className="font-mono text-sm text-text-dim">{selected.path}</span>
          </div>
          {Object.entries(params).map(([k, v]) => (
            <div key={k} className="flex gap-2.5 mb-1.5">
              <span className="font-mono text-[11.5px] font-semibold text-text-ghost w-24 pt-2 text-right">{k}</span>
              <input aria-label={`Parameter: ${k}`} value={v} onChange={(e) => setParams((p) => ({ ...p, [k]: e.target.value }))} className="flex-1 px-3 py-2 rounded-md border border-border bg-surface text-sm font-mono text-text-primary outline-none focus:border-blue" />
            </div>
          ))}
          <button onClick={handleExecute} disabled={loading} className="mt-2.5 px-5 py-2 rounded-lg bg-blue-interactive text-white text-sm font-semibold disabled:opacity-50 cursor-pointer">{loading ? "Calling..." : "\u25B6 Execute"}</button>
          {error && <div className="mt-3 p-3 rounded-lg bg-red-dim text-red text-sm">{error}</div>}
          {result !== null && result !== undefined && <pre className="mt-3 bg-bg-deep border border-border rounded-lg p-4 max-h-[200px] overflow-auto font-mono text-[11.5px] text-[#24292e] dark:text-[#c9d1d9] leading-relaxed" tabIndex={0} aria-label="API response JSON">{JSON.stringify(result, null, 2) as string}</pre>}
        </div>
      )}
    </div>
  );
}
