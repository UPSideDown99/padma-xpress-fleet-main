"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Users, Calendar, Clock } from "lucide-react";
import BookingModalLazy from "@/components/BookingModalLazy";

type Vehicle = any; // fleksibel, menyesuaikan schema prisma milikmu

export default function FleetClient({ vehicles }: { vehicles: Vehicle[] }) {
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [open, setOpen] = useState(false);

  function openBooking(v: Vehicle) {
    setSelected(v);
    setOpen(true);
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {vehicles.length === 0 ? (
          <div className="text-center py-20">
            <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tidak Ada Kendaraan Tersedia</h3>
            <p className="text-muted-foreground">
              Saat ini tidak ada kendaraan yang tersedia. Silakan coba lagi nanti.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v) => {
              const category =
                v.category ?? v.vehicle_category ?? null; // dukung dua nama relasi
              return (
                <Card key={v.id} className="overflow-hidden hover-lift">
                  <div className="aspect-video bg-muted relative">
                    {v.image_url ? (
                      <img
                        src={v.image_url}
                        alt={`${v.brand ?? ""} ${v.model ?? ""}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                    <Badge
                      className="absolute top-3 right-3"
                      variant={v.status === "available" ? "default" : "secondary"}
                    >
                      {v.status === "available" ? "Tersedia" : "Tidak Tersedia"}
                    </Badge>
                  </div>

                  <CardHeader>
                    <CardTitle className="text-xl">
                      {v.brand} {v.model}
                    </CardTitle>
                    <p className="text-muted-foreground">{category?.name}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{v.year ?? "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{v.capacity ?? 0} orang</span>
                      </div>
                    </div>

                    {Array.isArray(v.features) && v.features.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Fitur:</h4>
                        <div className="flex flex-wrap gap-1">
                          {v.features.slice(0, 3).map((f: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {f}
                            </Badge>
                          ))}
                          {v.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{v.features.length - 3} lainnya
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {category && (
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Per Jam:</span>
                          <span className="font-medium">
                            Rp {Number(category.base_price_per_hour ?? 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Per Hari:</span>
                          <span className="font-medium">
                            Rp {Number(category.base_price_per_day ?? 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      onClick={() => openBooking(v)}
                      disabled={v.status !== "available"}
                    >
                      {v.status === "available" ? "Pesan Sekarang" : "Tidak Tersedia"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal booking */}
      <BookingModalLazy open={open} onClose={() => setOpen(false)} />
    </section>
  );
}