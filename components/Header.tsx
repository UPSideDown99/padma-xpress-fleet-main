"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, Calendar, LogOut, User2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";
import AuthOnDemand from "@/components/auth/AuthOnDemand";

const SimpleBookingModal = dynamic(() => import("@/components/SimpleBookingModal"), { ssr: false });

type Me = { id?: string; email?: string; full_name?: string | null; role?: string } | null;

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [me, setMe] = useState<Me>(null);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  const router = useRouter();

  // ambil status login ringan; cocok dengan API /api/auth/me yang bisa mengembalikan { user, profile } atau flat
  const loadMe = async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
      if (!res.ok) throw new Error("unauth");
      const data = await res.json();
      // terima dua bentuk: {user,profile} atau langsung flat
      const user = data?.user ?? data ?? null;
      // fallback nama
      const normalized: Me = user
        ? {
            id: user.id,
            email: user.email,
            full_name: data?.profile?.full_name ?? user.full_name ?? null,
            role: user.role,
          }
        : null;
      setMe(normalized);
    } catch {
      setMe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMe();
    const h = () => loadMe();
    window.addEventListener("auth-changed", h);
    return () => window.removeEventListener("auth-changed", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navItems = useMemo(
    () => [
      { label: "Beranda", href: "/" },
      { label: "Tentang", href: "/tentang" },
      { label: "Armada", href: "/armada" },
      { label: t("services"), href: "/#services" },
      { label: "Artikel", href: "/artikel" },
      { label: t("contact"), href: "/#contact" },
    ],
    [t]
  );

  const nameOrEmail = me?.full_name || me?.email || "";

  const onLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    // beri tahu listener lain & refresh UI
    window.dispatchEvent(new Event("auth-changed"));
    setMe(null);
    router.replace("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" aria-label="Beranda">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-primary leading-tight">PADMA LOGISTIK</h1>
              <p className="text-xs text-muted-foreground">XPRESS</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Primary">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Toggles */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Auth & Booking (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+62 21 123 4567</span>
            </div>

            {loading ? null : me ? (
              <>
                {/* chip nama */}
                <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                  <User2 className="w-4 h-4" />
                  <span className="max-w-[160px] truncate">{nameOrEmail}</span>
                </div>

                {/* admin shortcut (opsional) */}
                {me.role === "admin" && (
                  <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                    Admin
                  </Button>
                )}

                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Button>

                <Button variant="ghost" size="sm" onClick={onLogout} className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              // belum login → arahkan ke /auth (boleh bawa redirect)
              <Button variant="accent" size="sm" onClick={() => router.push("/auth?redirect=/")}>
                {t("contactUs")}
              </Button>
            )}
          </div>

          {/* Mobile toggles */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
            <button
              className="ml-2"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setIsMenuOpen((s) => !s)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden py-4 border-t border-border animate-fadeInUp">
            <nav className="flex flex-col space-y-4" aria-label="Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-border">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
                  <Phone className="w-4 h-4" />
                  <span>+62 21 123 4567</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <Mail className="w-4 h-4" />
                  <span>info@padmalogistik.com</span>
                </div>

                {loading ? null : me ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm">
                      <User2 className="w-4 h-4" />
                      <span className="max-w-[180px] truncate">{nameOrEmail}</span>
                    </div>

                    {me.role === "admin" && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          router.push("/admin");
                          setIsMenuOpen(false);
                        }}
                      >
                        Admin
                      </Button>
                    )}

                    <Button
                      variant="accent"
                      className="w-full"
                      onClick={() => {
                        setIsBookingModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={() => {
                      router.push("/auth?redirect=/");
                      setIsMenuOpen(false);
                    }}
                  >
                    {t("contactUs")}
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Booking modal */}
      {isBookingModalOpen && (
        <AuthOnDemand>
          <SimpleBookingModal isOpen onClose={() => setIsBookingModalOpen(false)} />
        </AuthOnDemand>
      )}
    </header>
  );
}
