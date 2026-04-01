"use client";

import { ApiPanel } from "@/components/ui/api-panel";
import { ApiExplorer } from "@/components/ui/api-explorer";
import type { JellyfishEndpoint } from "@/lib/types";

export function ApiDrawer({
  token,
  setToken,
  endpoints,
  getParams,
  mockResponses,
}: {
  token: string;
  setToken: (t: string) => void;
  endpoints: JellyfishEndpoint[];
  getParams?: (ep: JellyfishEndpoint) => Record<string, string>;
  mockResponses?: Record<string, unknown>;
}) {
  return (
    <div className="space-y-4">
      <ApiPanel token={token} setToken={setToken} />
      <ApiExplorer
        token={token}
        endpoints={endpoints}
        getParams={getParams}
        mockResponses={mockResponses}
      />
    </div>
  );
}
