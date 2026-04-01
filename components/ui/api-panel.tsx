"use client";
import { useState } from "react";
import { testConnection } from "@/lib/api-client";

type ApiPanelProps = { token: string; setToken: (t: string) => void };
export function ApiPanel({ token, setToken }: ApiPanelProps) {
  const [status, setStatus] = useState<null | "loading" | "connected" | "error">(null);
  async function handleConnect() {
    if (!token.trim()) { setStatus("error"); return; }
    setStatus("loading");
    const ok = await testConnection(token);
    setStatus(ok ? "connected" : "error");
  }
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface mb-5">
      <input type="password" aria-label="Jellyfish API token" placeholder="Jellyfish API token" value={token} onChange={(e) => { setToken(e.target.value); setStatus(null); }} className="flex-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm font-mono text-text-primary placeholder:text-text-ghost outline-none focus:border-blue" />
      <button onClick={handleConnect} disabled={status === "loading"} className="px-4 py-2 rounded-lg bg-blue-interactive text-white text-sm font-semibold disabled:opacity-50 cursor-pointer">{status === "loading" ? "Testing..." : "Connect"}</button>
      {status === "connected" && <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-dim text-green">Connected</span>}
      {status === "error" && <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-dim text-red">Failed</span>}
    </div>
  );
}
