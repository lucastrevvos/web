import "server-only";
const API = process.env.NEXT_PUBLIC_API_URL!;
const APP = process.env.NEXT_PUBLIC_APP_SLUG || "portal";

export async function apiFetch(
  path: string,
  opts: { method?: string; body?: any; accessToken?: string } = {}
) {
  const headers: Record<string, string> = {
    "x-app-slug": APP,
    "content-type": "application/json",
  };
  if (opts.accessToken) headers.Authorization = `Bearer ${opts.accessToken}`;

  const res = await fetch(`${API}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);

  return res.json();
}
