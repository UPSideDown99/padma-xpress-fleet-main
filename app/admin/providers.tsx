"use client";

import { ReactNode } from "react";
import BaseProviders from "../providers"; // i18n/theme/toaster global (client)
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useSimpleAuth";

const queryClient = new QueryClient();

export default function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BaseProviders>
        <AuthProvider>{children}</AuthProvider>
      </BaseProviders>
    </QueryClientProvider>
  );
}
