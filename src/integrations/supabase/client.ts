// src/integrations/supabase/client.ts
// Supabase shim untuk Next + Prisma. Mendukung:
// auth.*, from(table).select(...).eq(...).order(...).limit(...)
// Juga dukung detail by slug/id untuk articles.

type Json = any;
type OrderOpts = { ascending?: boolean };

async function j<T = any>(url: string, init?: RequestInit) {
  try {
    const r = await fetch(url, {
      ...init,
      headers: { "content-type": "application/json", ...(init?.headers || {}) },
    });
    if (!r.ok) {
      const txt = await r.text();
      return { data: null as T, error: txt || r.statusText };
    }
    const data = (await r.json()) as T;
    return { data, error: null as any };
  } catch (e: any) {
    return { data: null as T, error: e?.message || String(e) };
  }
}

/* ========================= AUTH ========================= */
function makeAuth() {
  const listeners = new Set<(event: string, session: any) => void>();
  const notify = async () => {
    const { data } = await j<{ user: any; profile: any }>("/api/auth/me");
    const session = data?.user ? { user: data.user } : null;
    listeners.forEach((cb) => cb("SIGNED_IN", session));
  };
  if (typeof window !== "undefined") {
    window.addEventListener("auth-changed", notify);
  }
  return {
    async getSession() {
      const { data, error } = await j<{ user: any; profile: any }>("/api/auth/me");
      return { data: { session: data?.user ? { user: data.user } : null }, error };
    },
    async signInWithPassword({ email, password }: { email: string; password: string }) {
      const res = await j("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (!res.error && typeof window !== "undefined") window.dispatchEvent(new Event("auth-changed"));
      return res;
    },
    async signUp({ email, password, options }: { email: string; password: string; options?: { emailRedirectTo?: string; data?: any } }) {
      const body = {
        email,
        password,
        full_name: options?.data?.full_name,
        phone: options?.data?.phone,
        company_name: options?.data?.company_name,
        role: options?.data?.role,
      };
      const res = await j("/api/auth/register", { method: "POST", body: JSON.stringify(body) });
      if (!res.error && typeof window !== "undefined") window.dispatchEvent(new Event("auth-changed"));
      return res;
    },
    async signOut() {
      const res = await j("/api/auth/logout", { method: "POST" });
      if (!res.error && typeof window !== "undefined") window.dispatchEvent(new Event("auth-changed"));
      return res;
    },
    onAuthStateChange(callback: (event: string, session: any) => void) {
      listeners.add(callback);
      this.getSession().then(({ data }) => callback("INITIAL", data.session));
      return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
    },
  };
}

/* ========================= QUERY BUILDER ========================= */
function from(table:
  | "vehicles"
  | "vehicle_categories"
  | "bookings"
  | "articles"
  | "profiles"
) {
  type State = {
    columns?: string;
    filters: { field: string; value: any }[];
    order?: { field: string; ascending: boolean } | null;
    limit?: number | null;
    range?: { from: number; to: number } | null;
  };
  const state: State = { filters: [], order: null, limit: null, range: null };

  const applyFiltersSortLimit = (rows: any[]) => {
    // generic eq filters
    for (const f of state.filters) {
      if (f.field === "id" || f.field === "slug") continue; // ditangani khusus
      rows = rows.filter((r: any) => {
        const v = r?.[f.field];
        return String(v) === String(f.value);
      });
    }
    // order
    if (state.order) {
      const { field, ascending } = state.order;
      rows = [...rows].sort((a: any, b: any) => {
        const av = a?.[field];
        const bv = b?.[field];
        if (av == null && bv != null) return -1;
        if (av != null && bv == null) return 1;
        if (av > bv) return 1;
        if (av < bv) return -1;
        return 0;
      });
      if (!ascending) rows.reverse();
    }
    // limit/range
    if (state.range) {
      const { from, to } = state.range;
      rows = rows.slice(from, to + 1);
    } else if (state.limit != null) {
      rows = rows.slice(0, state.limit);
    }
    return rows;
  };

  const exec = async () => {
    // VEHICLES
    if (table === "vehicles") {
      const status = state.filters.find((f) => f.field === "status")?.value;
      const res = await j<any[]>("/api/vehicles" + (status != null ? `?status=${encodeURIComponent(status)}` : ""));
      let rows = res.data || [];
      rows = applyFiltersSortLimit(rows);
      return { data: rows, error: res.error };
    }

    // VEHICLE CATEGORIES
    if (table === "vehicle_categories") {
      const active = state.filters.find((f) => f.field === "active")?.value;
      const res = await j<any[]>("/api/vehicle_categories" + (active != null ? `?active=${encodeURIComponent(active)}` : ""));
      let rows = res.data || [];
      rows = applyFiltersSortLimit(rows);
      return { data: rows, error: res.error };
    }

    // BOOKINGS
    if (table === "bookings") {
      const res = await j<any[]>("/api/bookings");
      let rows = res.data || [];
      const id = state.filters.find((f) => f.field === "id")?.value;
      if (id != null) rows = rows.filter((r: any) => String(r.id) === String(id));
      rows = applyFiltersSortLimit(rows);
      return { data: rows, error: res.error };
    }

    // PROFILES
    if (table === "profiles") {
      const res = await j<any[]>("/api/profiles");
      let rows = res.data || [];
      const id = state.filters.find((f) => f.field === "id")?.value;
      if (id != null) rows = rows.filter((r: any) => String(r.id) === String(id));
      rows = applyFiltersSortLimit(rows);
      return { data: rows, error: res.error };
    }

    // ARTICLES
    if (table === "articles") {
      // detail by slug/id → pakai endpoint khusus
      const slug = state.filters.find((f) => f.field === "slug")?.value;
      const id   = state.filters.find((f) => f.field === "id")?.value;
      if (slug != null) return j(`/api/articles/${encodeURIComponent(slug)}`);
      if (id != null)   return j(`/api/articles/by-id/${encodeURIComponent(id)}`);

      const res = await j<any[]>("/api/articles");
      let rows = res.data || [];
      rows = applyFiltersSortLimit(rows);
      return { data: rows, error: res.error };
    }

    return { data: null, error: "Unknown table" };
  };

  const builder: any = {
    select: (_columns?: string) => { state.columns = _columns; return builder; },
    eq: (field: string, value: any) => { state.filters.push({ field, value }); return builder; },
    order: (field: string, opts?: OrderOpts) => { state.order = { field, ascending: opts?.ascending !== false }; return builder; },
    limit: (n: number) => { state.limit = n; return builder; },
    range: (from: number, to: number) => { state.range = { from, to }; return builder; },
    maybeSingle: () => builder,
    single: () => builder,
    then: (onFulfilled: any, onRejected: any) => exec().then(onFulfilled, onRejected),
    // write ops
    insert: async (rows: any | any[]) => {
      const body = Array.isArray(rows) ? rows[0] : rows;
      if (table === "vehicles")  return j(`/api/vehicles`, { method: "POST", body: JSON.stringify(body) });
      if (table === "bookings")  return j(`/api/bookings`, { method: "POST", body: JSON.stringify(body) });
      if (table === "articles")  return j(`/api/articles`, { method: "POST", body: JSON.stringify(body) });
      if (table === "profiles")  return j(`/api/profiles`, { method: "POST", body: JSON.stringify(body) });
      if (table === "vehicle_categories") return j(`/api/vehicle_categories`, { method: "POST", body: JSON.stringify(body) });
      return { data: null, error: "Unsupported table" };
    },
    update: async (row: any) => {
      const id = state.filters.find((f) => f.field === "id")?.value;
      const slug = state.filters.find((f) => f.field === "slug")?.value;
      if (table === "vehicles" && id != null)   return j(`/api/vehicles/${id}`, { method: "PUT", body: JSON.stringify(row) });
      if (table === "bookings" && id != null)   return j(`/api/bookings/${id}`, { method: "PUT", body: JSON.stringify(row) });
      if (table === "articles" && id != null)   return j(`/api/articles/by-id/${id}`, { method: "PUT", body: JSON.stringify(row) });
      if (table === "articles" && slug != null) return j(`/api/articles/${slug}`, { method: "PUT", body: JSON.stringify(row) });
      if (table === "profiles" && id != null)   return j(`/api/profiles/${id}`, { method: "PUT", body: JSON.stringify(row) });
      if (table === "vehicle_categories" && id != null) return j(`/api/vehicle_categories/${id}`, { method: "PUT", body: JSON.stringify(row) });
      return { data: null, error: "Missing eq('id'|'slug')" };
    },
    delete: () => ({
      eq: async (field: string, v: any) => {
        if (table === "vehicles" && field === "id") return j(`/api/vehicles/${v}`, { method: "DELETE" });
        if (table === "bookings" && field === "id") return j(`/api/bookings/${v}`, { method: "DELETE" });
        if (table === "articles" && field === "id") return j(`/api/articles/by-id/${v}`, { method: "DELETE" });
        if (table === "profiles" && field === "id") return j(`/api/profiles/${v}`, { method: "DELETE" });
        if (table === "vehicle_categories" && field === "id") return j(`/api/vehicle_categories/${v}`, { method: "DELETE" });
        return { data: null, error: "Unsupported delete target" };
      },
    }),
  };

  return builder;
}

export const supabase = {
  auth: makeAuth(),
  from,
};
