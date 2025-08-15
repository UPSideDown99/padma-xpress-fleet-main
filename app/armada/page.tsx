// app/armada/page.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// samakan dengan impor di API kamu (app/api/*) yang pakai "@/lib/db"
import { prisma } from "@/lib/db";
import FleetClient from "./FleetClient";

export const revalidate = 300; // ISR 5 menit

export default async function Page() {
  // Ambil kendaraan + relasinya (nama relasi yang benar: VehicleCategory)
  const rows = await prisma.vehicle.findMany({
    where: { status: "available" },
    orderBy: { id: "desc" },
    include: { VehicleCategory: true },
  });

  // Bentuk ulang supaya komponen client dapat field "category" seperti sebelumnya
  const vehicles = rows.map(({ VehicleCategory, ...v }) => ({
    ...v,
    category: VehicleCategory
      ? {
          id: VehicleCategory.id,
          name: VehicleCategory.name,
          description: (VehicleCategory as any).description ?? null,
          base_price_per_hour: (VehicleCategory as any).base_price_per_hour ?? null,
          base_price_per_day: (VehicleCategory as any).base_price_per_day ?? null,
          active: VehicleCategory.active,
        }
      : null,
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Armada Kendaraan</h1>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                Koleksi kendaraan premium dengan perawatan terbaik untuk perjalanan
                yang aman dan nyaman
              </p>
            </div>
          </div>
        </section>

        {/* Grid & modal dikelola komponen client */}
        <FleetClient vehicles={vehicles as any} />
      </main>
      <Footer />
    </div>
  );
}
