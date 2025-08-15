import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      services: "Services",
      gallery: "Gallery",
      contact: "Contact",
      darkMode: "Dark Mode",
      language: "Language",
      
      // Hero Section
      heroTitle: "Premium Logistics &",
      heroTitleSpan: "Transport Solutions", 
      heroDescription: "PT Padma Logistik Xpress provides reliable logistics services and luxury vehicle rentals for your business and personal needs.",
      startConsultation: "Start Consultation",
      viewServices: "View Services",
      satisfiedClients: "Satisfied Clients",
      premiumVehicles: "Premium Vehicles",
      service247: "Service",
      yearsExperience: "Years Experience",
      premiumQuality: "Premium Quality",
      premiumQualityDesc: "High quality service",
      trusted: "Trusted",
      trustedDesc: "Security guaranteed",
      service247Title: "24/7 Service",
      service247Desc: "Ready to serve anytime",
      
      // Services Section
      ourBestServices: "Our Best Services",
      servicesDescription: "We provide complete solutions for your premium logistics and transportation needs",
      logisticsShipping: "Logistics & Shipping",
      logisticsShippingDesc: "Goods delivery service with guaranteed security and timeliness",
      luxuryVehicleRental: "Luxury Vehicle Rental",
      luxuryVehicleRentalDesc: "Premium vehicle fleet for business needs and special events",
      warehouseStorage: "Warehouse & Storage",
      warehouseStorageDesc: "Modern storage facilities with inventory management system",
      sameDayDelivery: "Same Day Delivery",
      realTimeTracking: "Real-time Tracking",
      goodsInsurance: "Goods Insurance",
      coldChain: "Cold Chain",
      professionalDriver: "Professional Driver",
      routineMaintenance: "Routine Maintenance",
      gpsTracking: "GPS Tracking",
      support247: "24/7 Support",
      climateControl: "Climate Control",
      cctvSecurity: "CCTV Security",
      inventoryManagement: "Inventory Management",
      easyAccess: "Easy Access",
      learnMore: "Learn More",
      nationwideCoverage: "Nationwide Coverage",
      nationwideCoverageDesc: "Coverage throughout Indonesia",
      expressDelivery: "Express Delivery",
      expressDeliveryDesc: "Express service within the city",
      insuranceProtected: "Insurance Protected",
      insuranceProtectedDesc: "Full insurance protection",
      needCustomSolution: "Need a Custom Solution?",
      customSolutionDesc: "Our expert team is ready to help design the right logistics solution according to your business needs",
      freeConsultation: "Free Consultation",
      
      // Gallery Section
      ourServiceGallery: "Our Service Gallery",
      galleryDescription: "See our collection of premium vehicles and modern facilities we provide",
      all: "All",
      luxuryVehicles: "Luxury Vehicles",
      logistics: "Logistics", 
      service: "Service",
      premiumFleetArmada: "Premium Vehicle Fleet",
      premiumFleetDesc: "Collection of luxury vehicles for various needs",
      modernWarehouse: "Modern Warehouse Facility",
      modernWarehouseDesc: "Warehouse with latest technology and best security system",
      executiveTransportation: "Executive Transportation",
      executiveTransportationDesc: "Executive transportation service with professional driver",
      mercedesSClass: "Mercedes S-Class Fleet",
      mercedesSClassDesc: "Mercedes fleet for premium events",
      coldChainStorage: "Cold Chain Storage",
      coldChainStorageDesc: "Temperature-controlled storage for sensitive products",
      airportTransfer: "Airport Transfer Service",
      airportTransferDesc: "Airport transfer service with maximum comfort",
      wantToSeeMore: "Want to See More?",
      wantToSeeMoreDesc: "Visit our showroom or schedule a viewing to see our complete fleet",
      
      // Contact Section
      contactUs: "Contact Us",
      contactDescription: "Ready to help your premium logistics and transportation needs. Our expert team is waiting to provide the best solution.",
      sendMessage: "Send Message",
      sendMessageDesc: "Fill out the form below and our team will contact you within 24 hours",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phoneNumber: "Phone Number",
      serviceNeeded: "Service Needed",
      selectService: "Select service",
      message: "Message",
      tellUsYourNeeds: "Tell us your needs...",
      sendMessageBtn: "Send Message",
      privacyPolicy: "Privacy Policy",
      bySubmitting: "By sending this message, you agree to our",
      officeAddress: "Office Address",
      telephone: "Telephone",
      customerService247: "24/7 Customer Service",
      operatingHours: "Operating Hours",
      operatingHoursValue: "24 Hours Every Day",
      readyToServe: "Ready to Serve Anytime",
      officeLocation: "Office Location",
      needImmediateHelp: "Need Immediate Help?",
      customerServiceReady: "Our customer service team is ready to help 24/7",
      callNow: "Call Now",
      whatsapp: "WhatsApp",
      
      // Footer
      footerDescription: "PT Padma Logistik Xpress is a trusted logistics and premium transportation service company with years of experience serving clients throughout Indonesia.",
      quickLinks: "Quick Links",
      ourServices: "Our Services",
      followUs: "Follow Us",
      allRightsReserved: "All rights reserved",
      
      // Service Options
      consultation: "Consultation"
    }
  },
  id: {
    translation: {
      // Navigation
      home: "Beranda",
      services: "Layanan",
      gallery: "Galeri",
      contact: "Kontak",
      darkMode: "Mode Gelap",
      language: "Bahasa",
      
      // Hero Section
      heroTitle: "Solusi Logistik &",
      heroTitleSpan: "Premium Transport",
      heroDescription: "PT Padma Logistik Xpress menyediakan layanan logistik terpercaya dan sewa kendaraan mewah untuk kebutuhan bisnis dan personal Anda.",
      startConsultation: "Mulai Konsultasi",
      viewServices: "Lihat Layanan",
      satisfiedClients: "Klien Puas",
      premiumVehicles: "Kendaraan Premium",
      service247: "Layanan",
      yearsExperience: "Tahun Pengalaman",
      premiumQuality: "Premium Quality",
      premiumQualityDesc: "Layanan berkualitas tinggi",
      trusted: "Terpercaya",
      trustedDesc: "Keamanan terjamin",
      service247Title: "24/7 Service",
      service247Desc: "Siap melayani kapan saja",
      
      // Services Section
      ourBestServices: "Layanan Terbaik Kami",
      servicesDescription: "Kami menyediakan solusi lengkap untuk kebutuhan logistik dan transportasi premium Anda",
      logisticsShipping: "Logistik & Pengiriman",
      logisticsShippingDesc: "Layanan pengiriman barang dengan jaminan keamanan dan ketepatan waktu",
      luxuryVehicleRental: "Sewa Kendaraan Mewah",
      luxuryVehicleRentalDesc: "Armada kendaraan premium untuk kebutuhan bisnis dan acara khusus",
      warehouseStorage: "Warehouse & Storage",
      warehouseStorageDesc: "Fasilitas penyimpanan modern dengan sistem manajemen inventory",
      sameDayDelivery: "Same Day Delivery",
      realTimeTracking: "Tracking Real-time",
      goodsInsurance: "Asuransi Barang",
      coldChain: "Cold Chain",
      professionalDriver: "Driver Profesional",
      routineMaintenance: "Maintenance Rutin",
      gpsTracking: "GPS Tracking",
      support247: "24/7 Support",
      climateControl: "Climate Control",
      cctvSecurity: "CCTV Security",
      inventoryManagement: "Inventory Management",
      easyAccess: "Easy Access",
      learnMore: "Pelajari Lebih Lanjut",
      nationwideCoverage: "Nationwide Coverage",
      nationwideCoverageDesc: "Jangkauan ke seluruh Indonesia",
      expressDelivery: "Express Delivery",
      expressDeliveryDesc: "Layanan kilat dalam kota",
      insuranceProtected: "Insurance Protected",
      insuranceProtectedDesc: "Perlindungan asuransi penuh",
      needCustomSolution: "Butuh Solusi Khusus?",
      customSolutionDesc: "Tim ahli kami siap membantu merancang solusi logistik yang tepat sesuai kebutuhan bisnis Anda",
      freeConsultation: "Konsultasi Gratis",
      
      // Gallery Section
      ourServiceGallery: "Galeri Layanan Kami",
      galleryDescription: "Lihat koleksi kendaraan premium dan fasilitas modern yang kami sediakan",
      all: "Semua",
      luxuryVehicles: "Kendaraan Mewah",
      logistics: "Logistik",
      service: "Layanan",
      premiumFleetArmada: "Armada Kendaraan Premium",
      premiumFleetDesc: "Koleksi kendaraan mewah untuk berbagai kebutuhan",
      modernWarehouse: "Fasilitas Warehouse Modern",
      modernWarehouseDesc: "Gudang dengan teknologi terkini dan sistem keamanan terbaik",
      executiveTransportation: "Executive Transportation",
      executiveTransportationDesc: "Layanan transportasi eksekutif dengan driver profesional",
      mercedesSClass: "Mercedes S-Class Fleet",
      mercedesSClassDesc: "Armada Mercedes untuk acara premium",
      coldChainStorage: "Cold Chain Storage",
      coldChainStorageDesc: "Penyimpanan dengan kontrol suhu untuk produk sensitif",
      airportTransfer: "Airport Transfer Service",
      airportTransferDesc: "Layanan antar jemput bandara dengan kenyamanan maksimal",
      wantToSeeMore: "Ingin Melihat Lebih Banyak?",
      wantToSeeMoreDesc: "Kunjungi showroom kami atau jadwalkan viewing untuk melihat armada lengkap",
      
      // Contact Section
      contactUs: "Hubungi Kami",
      contactDescription: "Siap membantu kebutuhan logistik dan transportasi premium Anda. Tim ahli kami menunggu untuk memberikan solusi terbaik.",
      sendMessage: "Kirim Pesan",
      sendMessageDesc: "Isi form di bawah ini dan tim kami akan menghubungi Anda dalam 24 jam",
      firstName: "Nama Depan",
      lastName: "Nama Belakang",
      email: "Email",
      phoneNumber: "Nomor Telepon",
      serviceNeeded: "Layanan yang Dibutuhkan",
      selectService: "Pilih layanan",
      message: "Pesan",
      tellUsYourNeeds: "Ceritakan kebutuhan Anda...",
      sendMessageBtn: "Kirim Pesan",
      privacyPolicy: "Kebijakan Privasi",
      bySubmitting: "Dengan mengirim pesan ini, Anda menyetujui",
      officeAddress: "Alamat Kantor",
      telephone: "Telepon",
      customerService247: "24/7 Customer Service",
      operatingHours: "Jam Operasional",
      operatingHoursValue: "24 Jam Setiap Hari",
      readyToServe: "Siap Melayani Kapan Saja",
      officeLocation: "Lokasi Kantor",
      needImmediateHelp: "Butuh Bantuan Segera?",
      customerServiceReady: "Tim customer service kami siap membantu 24/7",
      callNow: "📞 Telepon Sekarang",
      whatsapp: "💬 WhatsApp",
      
      // Footer
      footerDescription: "PT Padma Logistik Xpress adalah perusahaan layanan logistik dan transportasi premium terpercaya dengan pengalaman bertahun-tahun melayani klien di seluruh Indonesia.",
      quickLinks: "Link Cepat",
      ourServices: "Layanan Kami",
      followUs: "Ikuti Kami",
      allRightsReserved: "Semua hak dilindungi",
      
      // Service Options
      consultation: "Konsultasi"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'id', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;