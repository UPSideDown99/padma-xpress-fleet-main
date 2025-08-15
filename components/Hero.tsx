"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

// gambar harus ada di: public/assets/hero-logistics.jpg
const HERO_IMG = "/assets/hero-logistics.jpg";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background + overlays */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={HERO_IMG}
          alt="Padma Logistik Premium Services"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
          className="scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary-dark/80 to-primary/60" />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float" />
      <div
        className="absolute bottom-32 left-16 w-24 h-24 bg-accent/30 rounded-full blur-lg animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-16 h-16 bg-accent/40 rounded-full blur-sm animate-float"
        style={{ animationDelay: "4s" }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <div className="animate-fadeInUp">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass border border-accent/30 mb-6">
              <span className="text-accent font-medium text-sm">
                ✨ Premium Logistics & Transport Services
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-8 leading-tight">
              {t("heroTitle")}{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent animate-pulse-glow">
                {t("heroTitleSpan")}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-foreground/90 mb-10 leading-relaxed font-light">
              {t("heroDescription")}
            </p>
          </div>

          {/* Feature Highlights */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="glass-dark rounded-xl p-6 border border-accent/20 hover-lift group">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-2 text-lg">
                {t("premiumQuality")}
              </h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                {t("premiumQualityDesc")}
              </p>
            </div>

            <div className="glass-dark rounded-xl p-6 border border-accent/20 hover-lift group">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-2 text-lg">
                {t("trusted")}
              </h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                {t("trustedDesc")}
              </p>
            </div>

            <div className="glass-dark rounded-xl p-6 border border-accent/20 hover-lift group">
              <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-primary-foreground mb-2 text-lg">
                {t("service247Title")}
              </h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                {t("service247Desc")}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-6 animate-fadeInUp"
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              variant="hero"
              size="lg"
              className="group text-lg px-10 py-6 font-semibold"
            >
              {t("startConsultation")}
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>

            <Button
              variant="glass"
              size="lg"
              className="text-lg px-10 py-6 font-medium border-accent/30 text-primary-foreground hover:bg-accent/20"
            >
              {t("viewServices")}
            </Button>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fadeInUp"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="text-center group">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                500+
              </h3>
              <p className="text-primary-foreground/90 mt-2 font-medium">
                {t("satisfiedClients")}
              </p>
            </div>

            <div className="text-center group">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                50+
              </h3>
              <p className="text-primary-foreground/90 mt-2 font-medium">
                {t("premiumVehicles")}
              </p>
            </div>

            <div className="text-center group">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                24/7
              </h3>
              <p className="text-primary-foreground/90 mt-2 font-medium">
                {t("service247")}
              </p>
            </div>

            <div className="text-center group">
              <h3 className="text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                5+
              </h3>
              <p className="text-primary-foreground/90 mt-2 font-medium">
                {t("yearsExperience")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating element */}
      <div className="absolute bottom-10 right-10 animate-float hidden lg:block">
        <div className="w-24 h-24 glass rounded-full flex items-center justify-center border border-accent/30 animate-pulse-glow">
          <div className="w-12 h-12 bg-gradient-accent rounded-full" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-accent/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-accent rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}
