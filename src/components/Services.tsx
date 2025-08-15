import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Car, Package, MapPin, Clock, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { t } = useTranslation();
  
  const services = [
    {
      icon: Truck,
      title: t('logisticsShipping'),
      description: t('logisticsShippingDesc'),
      features: [t('sameDayDelivery'), t('realTimeTracking'), t('goodsInsurance'), t('coldChain')],
      color: "text-blue-600"
    },
    {
      icon: Car,
      title: t('luxuryVehicleRental'),
      description: t('luxuryVehicleRentalDesc'),
      features: [t('professionalDriver'), t('routineMaintenance'), t('gpsTracking'), t('support247')],
      color: "text-amber-600"
    },
    {
      icon: Package,
      title: t('warehouseStorage'),
      description: t('warehouseStorageDesc'),
      features: [t('climateControl'), t('cctvSecurity'), t('inventoryManagement'), t('easyAccess')],
      color: "text-green-600"
    }
  ];

  const additionalServices = [
    { icon: MapPin, title: t('nationwideCoverage'), description: t('nationwideCoverageDesc') },
    { icon: Clock, title: t('expressDelivery'), description: t('expressDeliveryDesc') },
    { icon: Shield, title: t('insuranceProtected'), description: t('insuranceProtectedDesc') }
  ];

  return (
    <section id="services" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t('ourBestServices')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('servicesDescription')}
          </p>
        </div>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-premium transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <service.icon className={`w-8 h-8 text-primary-foreground`} />
                </div>
                <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="premium" className="w-full">
                  {t('learnMore')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {additionalServices.map((service, index) => (
            <div key={index} className="bg-card rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <service.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-primary mb-2">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-primary rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              {t('needCustomSolution')}
            </h3>
            <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
              {t('customSolutionDesc')}
            </p>
            <Button variant="hero" size="lg">
              {t('freeConsultation')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;