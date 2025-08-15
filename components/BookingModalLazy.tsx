"use client";

import dynamic from "next/dynamic";
import AuthOnDemand from "@/components/auth/AuthOnDemand";

// Import modal asli secara dinamis (client-only)
const SimpleBookingModal = dynamic(
  () => import("@/components/SimpleBookingModal"),
  { ssr: false }
);

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BookingModalLazy({ open, onClose }: Props) {
  if (!open) return null; // penting: jangan mount saat tertutup
  return (
    <AuthOnDemand>
      <SimpleBookingModal isOpen onClose={onClose} />
    </AuthOnDemand>
  );
}
