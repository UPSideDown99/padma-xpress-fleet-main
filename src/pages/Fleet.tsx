import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Users, Luggage, Fuel, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import SimpleBookingModal from "@/components/SimpleBookingModal";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  capacity: number;
  features: string[];
  image_url: string;
  status: string;
  category: {
    name: string;
    description: string;
    base_price_per_hour: number;
    base_price_per_day: number;
  };
}

const Fleet = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          *,
          category:vehicle_categories(
            name,
            description,
            base_price_per_hour,
            base_price_per_day
          )
        `)
        .eq('status', 'available');

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Armada Kendaraan
              </h1>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                Koleksi kendaraan premium dengan perawatan terbaik untuk perjalanan 
                yang aman dan nyaman
              </p>
            </div>
          </div>
        </section>

        {/* Fleet Grid */}
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
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden hover-lift">
                    <div className="aspect-video bg-muted relative">
                      {vehicle.image_url ? (
                        <img 
                          src={vehicle.image_url} 
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                      <Badge 
                        className="absolute top-3 right-3"
                        variant={vehicle.status === 'available' ? 'default' : 'secondary'}
                      >
                        {vehicle.status === 'available' ? 'Tersedia' : 'Tidak Tersedia'}
                      </Badge>
                    </div>
                    
                    <CardHeader>
                      <CardTitle className="text-xl">
                        {vehicle.brand} {vehicle.model}
                      </CardTitle>
                      <p className="text-muted-foreground">{vehicle.category?.name}</p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{vehicle.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{vehicle.capacity} orang</span>
                        </div>
                      </div>

                      {vehicle.features && vehicle.features.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Fitur:</h4>
                          <div className="flex flex-wrap gap-1">
                            {vehicle.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {vehicle.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{vehicle.features.length - 3} lainnya
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      {vehicle.category && (
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Per Jam:</span>
                            <span className="font-medium">
                              Rp {vehicle.category.base_price_per_hour?.toLocaleString('id-ID')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Per Hari:</span>
                            <span className="font-medium">
                              Rp {vehicle.category.base_price_per_day?.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      )}

                      <Button 
                        className="w-full" 
                        onClick={() => handleBookVehicle(vehicle)}
                        disabled={vehicle.status !== 'available'}
                      >
                        {vehicle.status === 'available' ? 'Pesan Sekarang' : 'Tidak Tersedia'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />

      <SimpleBookingModal 
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedVehicle(null);
        }}
      />
    </div>
  );
};

export default Fleet;