'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  phone: string | null;
  company_name: string | null;
  address: string | null;
  city: string | null;
}

interface AuthContextType {
  user: { id: string; email: string; full_name: string | null; role: string } | null;
  session: { user: any } | null;
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Fallback aman kalau (sementara) belum ada Provider.
// Tidak akan throw; komponen cukup menganggap “belum login”.
const FALLBACK: AuthContextType = {
  user: null,
  session: null,
  profile: null,
  loading: false,
  refresh: async () => {},
  signOut: async () => {},
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<AuthContextType['session']>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const r = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await r.json();
      setUser(data.user ?? null);
      setProfile(data.profile ?? null);
      setSession(data.user ? { user: data.user } : null);
    } catch {
      // abaikan error jaringan; anggap tidak login
      setUser(null);
      setProfile(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) await refresh();
    })();

    const handler = () => refresh();
    window.addEventListener('auth-changed', handler);
    return () => {
      mounted = false;
      window.removeEventListener('auth-changed', handler);
    };
  }, []);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      // segera reset state + kabari listener
      setUser(null);
      setProfile(null);
      setSession(null);
      window.dispatchEvent(new Event('auth-changed'));
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook yang tidak pernah melempar error.
// Jika Provider belum terpasang, kita pakai FALLBACK (status = belum login).
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext) ?? FALLBACK;
};
