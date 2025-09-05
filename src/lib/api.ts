export class ApiError extends Error {
  status: number;
  code?: string;
  fields?: string[];
  constructor(opts: {
    message: string;
    status: number;
    code?: string;
    fields?: string[];
  }) {
    super(opts.message);
    this.status = opts.status;
    this.code = opts.code;
    this.fields = opts.fields;
  }
}

export async function apiFetch(
  path: string,
  opts: {
    method?: string;
    body?: any;
    accessToken?: string;
    headers?: Record<string, string>;
  } = {}
) {
  const API = process.env.NEXT_PUBLIC_API_URL!;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-app-slug": process.env.NEXT_PUBLIC_APP_SLUG || "portal",
    ...(opts.headers || {}),
  };
  if (opts.accessToken) headers.Authorization = `Bearer ${opts.accessToken}`;

  const res = await fetch(`${API}${path}`, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    let payload: any = null;
    try {
      payload = await res.json();
    } catch {}
    throw new ApiError({
      message: payload?.message || res.statusText || "Erro",
      status: res.status,
      code: payload?.code,
      fields: payload?.fields,
    });
  }

  if (res.status === 204) return null;
  return res.json();
}
