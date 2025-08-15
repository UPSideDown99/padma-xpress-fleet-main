'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/hooks/useSimpleAuth';

// Pastikan route /admin selalu dirender dinamis (tidak di-SSG)
export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Semua komponen di bawah /admin (termasuk AdminDashboard) sekarang berada dalam AuthProvider
  return <AuthProvider>{children}</AuthProvider>;
}
