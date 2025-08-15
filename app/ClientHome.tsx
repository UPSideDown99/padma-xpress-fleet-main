"use client";

import dynamic from "next/dynamic";

// Komponen client-only di-lazy agar tidak masuk First Load
const Hero = dynamic(() => import("@/components/Hero"), {
  ssr: false,
  loading: () => <div className="h-[60vh] animate-pulse bg-muted" />,
});
const Services = dynamic(() => import("@/components/Services"), {
  ssr: false,
  loading: () => <div className="h-[50vh] animate-pulse bg-muted" />,
});
const Gallery = dynamic(() => import("@/components/Gallery"), {
  ssr: false,
  loading: () => <div className="h-[50vh] animate-pulse bg-muted" />,
});
const Contact = dynamic(() => import("@/components/Contact"), {
  ssr: false,
  loading: () => <div className="h-[40vh] animate-pulse bg-muted" />,
});

export default function ClientHome() {
  return (
    <>
      <Hero />
      <Services />
      <Gallery />
      <Contact />
    </>
  );
}
