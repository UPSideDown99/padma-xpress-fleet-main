"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const Contact = () => {
  const { t } = useTranslation();
  
  const contactInfo = [
    {
      icon: MapPin,
      title: t('officeAddress'),
      content: "Jl. Sudirman No. 123, Jakarta Selatan 12190",
      subContent: "Indonesia"
    },
    {
      icon: Phone,
      title: t('telephone'),
      content: "+62 21 123 4567",
      subContent: t('customerService247')
    },
    {
      icon: Mail,
      title: t('email'),
      content: "info@padmalogistik.com",
      subContent: "sales@padmalogistik.com"
    },
    {
      icon: Clock,
      title: t('operatingHours'),
      content: t('operatingHoursValue'),
      subContent: t('readyToServe')
    }
  ];

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t('contactUs')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contactDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-premium">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{t('sendMessage')}</CardTitle>
                <CardDescription>
                  {t('sendMessageDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('firstName')}</Label>
                    <Input id="firstName" placeholder={t('firstName')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('lastName')}</Label>
                    <Input id="lastName" placeholder={t('lastName')} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input id="email" type="email" placeholder="nama@email.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phoneNumber')}</Label>
                  <Input id="phone" placeholder="+62 812 3456 7890" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service">{t('serviceNeeded')}</Label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground">
                    <option value="">{t('selectService')}</option>
                    <option value="logistics">{t('logisticsShipping')}</option>
                    <option value="luxury-rental">{t('luxuryVehicleRental')}</option>
                    <option value="warehouse">{t('warehouseStorage')}</option>
                    <option value="consultation">{t('consultation')}</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">{t('message')}</Label>
                  <Textarea 
                    id="message" 
                    placeholder={t('tellUsYourNeeds')} 
                    className="min-h-[120px]"
                  />
                </div>
                
                <Button variant="premium" className="w-full" size="lg">
                  {t('sendMessageBtn')}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  {t('bySubmitting')}{" "}
                  <a href="#" className="text-accent hover:underline">
                    {t('privacyPolicy')}
                  </a>{" "}
                  kami.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card 
                key={index} 
                className="border-0 hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <info.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-1">{info.title}</h3>
                      <p className="text-foreground font-medium">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.subContent}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Map Placeholder */}
            <Card className="border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-primary mb-1">{t('officeLocation')}</h3>
                    <p className="text-sm text-muted-foreground">
                      Jl. Sudirman No. 123<br />
                      Jakarta Selatan, Indonesia
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-primary rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-primary-foreground mb-3">
              {t('needImmediateHelp')}
            </h3>
            <p className="text-primary-foreground/90 mb-6">
              {t('customerServiceReady')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                {t('callNow')}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20"
              >
                {t('whatsapp')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;