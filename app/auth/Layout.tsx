"use client";

import type { ReactNode } from "react";
import BaseProviders from "../admin/../providers"; // path relatif ke /app/auth
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useSimpleAuth";

const queryClient = new QueryClient();

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BaseProviders>
        <AuthProvider>{children}</AuthProvider>
      </BaseProviders>
    </QueryClientProvider>
  );
}
