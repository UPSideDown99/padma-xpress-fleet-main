"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, Calendar, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useSimpleAuth";
import SimpleBookingModal from "@/components/SimpleBookingModal";

/**
 * Catatan penting:
 * - Link untuk section pakai "/#services" & "/#contact" (bukan "#services") supaya jalan dari halaman mana pun.
 * - Tidak ada penggunaan href berupa object => menghindari log "/[object Object] 404".
 * - Semua komponen yang pakai i18n tetap "use client".
 */

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const navItems = useMemo(
    () => [
      { label: "Beranda", href: "/" },
      { label: "Tentang", href: "/tentang" },
      { label: "Armada", href: "/armada" },
      // gunakan "/#..." agar bisa diakses dari halaman mana pun
      { label: t("services"), href: "/#services" },
      { label: "Artikel", href: "/artikel" },
      { label: t("contact"), href: "/#contact" },
    ],
    [t]
  );

  const closeMenu = () => setIsMenuOpen(false);

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

          {/* Theme & Language Toggles */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Auth & Booking Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+62 21 123 4567</span>
            </div>

            {user ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="accent"
                  size="sm"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Book Now
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="accent"
                size="sm"
                onClick={() => router.push("/auth")}
              >
                {t("contactUs")}
              </Button>
            )}
          </div>

          {/* Mobile Toggles + Menu Button */}
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
          <div
            id="mobile-menu"
            className="md:hidden py-4 border-t border-border animate-fadeInUp"
          >
            <nav className="flex flex-col space-y-4" aria-label="Mobile">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-accent transition-colors"
                  onClick={closeMenu}
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

                {user ? (
                  <div className="space-y-2">
                    <Button
                      variant="accent"
                      className="w-full"
                      onClick={() => {
                        setIsBookingModalOpen(true);
                        closeMenu();
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        signOut();
                        closeMenu();
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
                      router.push("/auth");
                      closeMenu();
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
      <SimpleBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </header>
  );
}
