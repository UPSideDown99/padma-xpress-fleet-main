"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

type Category = "luxury" | "logistics" | "service";
type GalleryItem = {
  id: number;
  image: string;      // pakai string path dari /public/assets
  title: string;
  category: Category;
  description: string;
};

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState<"all" | Category>("all");
  const { t } = useTranslation();

  const categories = useMemo(
    () => [
      { id: "all" as const, label: t("all") },
      { id: "luxury" as const, label: t("luxuryVehicles") },
      { id: "logistics" as const, label: t("logistics") },
      { id: "service" as const, label: t("service") },
    ],
    [t]
  );

  // GANTI nama file sesuai yang kamu punya di public/assets
  const galleryItems: GalleryItem[] = useMemo(
    () => [
      {
        id: 1,
        image: "/assets/luxury-fleet.jpg",
        title: t("premiumFleetArmada"),
        category: "luxury",
        description: t("premiumFleetDesc"),
      },
      {
        id: 2,
        image: "/assets/logistics-warehouse.jpg",
        title: t("modernWarehouse"),
        category: "logistics",
        description: t("modernWarehouseDesc"),
      },
      {
        id: 3,
        image: "/assets/executive-service.jpg",
        title: t("executiveTransportation"),
        category: "service",
        description: t("executiveTransportationDesc"),
      },
      {
        id: 4,
        image: "/assets/luxury-fleet.jpg",
        title: t("mercedesSClass"),
        category: "luxury",
        description: t("mercedesSClassDesc"),
      },
      {
        id: 5,
        image: "/assets/logistics-warehouse.jpg",
        title: t("coldChainStorage"),
        category: "logistics",
        description: t("coldChainStorageDesc"),
      },
      {
        id: 6,
        image: "/assets/executive-service.jpg",
        title: t("airportTransfer"),
        category: "service",
        description: t("airportTransferDesc"),
      },
    ],
    [t]
  );

  const filteredItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((i) => i.category === activeCategory);

  return (
    <section id="gallery" className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t("ourServiceGallery")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("galleryDescription")}
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <Badge
                  key={category.id}
                  variant={active ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-all duration-300 ${
                    active
                      ? "bg-accent text-accent-foreground shadow-glow"
                      : "hover:bg-accent/10"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.label}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-0 bg-card hover:shadow-premium transition-all duration-500 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-primary-foreground/90">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-primary mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-accent rounded-2xl p-1">
            <div className="bg-background rounded-xl p-8 m-1">
              <h3 className="text-2xl font-bold text-primary mb-3">
                {t("wantToSeeMore")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("wantToSeeMoreDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Badge variant="outline" className="px-4 py-2">
                  📍 Jakarta Selatan
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  📞 +62 21 123 4567
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  🕒 24/7 Available
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
