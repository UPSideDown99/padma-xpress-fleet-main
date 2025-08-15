"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Fallback minimal — kalau kamu sudah punya file JSON, impor yang kamu punya di sini
const idCommon = {
  services: "Layanan",
  contact: "Kontak",
  contactUs: "Hubungi Kami",
};
const enCommon = {
  services: "Services",
  contact: "Contact",
  contactUs: "Contact Us",
};

const saved = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
const lng = saved || "id";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      id: { translation: idCommon },
      en: { translation: enCommon },
    },
    lng,
    fallbackLng: "id",
    interpolation: { escapeValue: false },
    returnEmptyString: false,
  });
}

export default i18n;
