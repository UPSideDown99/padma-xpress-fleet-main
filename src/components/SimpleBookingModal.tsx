import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useSimpleAuth";
import { supabase } from "@/integrations/supabase/client";
import { Car, Package, MapPin, Calendar, Clock, User, Phone, Weight } from "lucide-react";

interface SimpleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SimpleBookingModal = ({ isOpen, onClose }: SimpleBookingModalProps) => {
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState<'vehicle' | 'logistics'>('vehicle');
  const [vehicleBooking, setVehicleBooking] = useState({
    vehicleCategory: '',
    pickupLocation: '',
    destination: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    notes: '',
  });
  const [logisticsBooking, setLogisticsBooking] = useState({
    serviceType: '',
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    packageWeight: '',
    packageDescription: '',
    specialInstructions: '',
  });

  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuth();

  const handleVehicleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to create a booking.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        user_id: user.id,
        booking_type: 'vehicle',
        pickup_location: vehicleBooking.pickupLocation,
        destination: vehicleBooking.destination,
        pickup_datetime: `${vehicleBooking.pickupDate}T${vehicleBooking.pickupTime}`,
        return_datetime: `${vehicleBooking.returnDate}T${vehicleBooking.returnTime}`,
        notes: vehicleBooking.notes,
        booking_status: 'pending',
        payment_status: 'pending'
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) throw error;

      toast({
        title: "Booking Request Submitted!",
        description: "Your vehicle booking request has been submitted. We'll contact you soon with pricing and confirmation.",
      });
      
      onClose();
      // Reset form
      setVehicleBooking({
        vehicleCategory: '',
        pickupLocation: '',
        destination: '',
        pickupDate: '',
        pickupTime: '',
        returnDate: '',
        returnTime: '',
        notes: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogisticsBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to create a booking.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const bookingData = {
        user_id: user.id,
        booking_type: 'logistics',
        sender_name: logisticsBooking.senderName,
        sender_phone: logisticsBooking.senderPhone,
        sender_address: logisticsBooking.senderAddress,
        recipient_name: logisticsBooking.recipientName,
        recipient_phone: logisticsBooking.recipientPhone,
        recipient_address: logisticsBooking.recipientAddress,
        package_weight: parseFloat(logisticsBooking.packageWeight),
        package_description: logisticsBooking.packageDescription,
        special_instructions: logisticsBooking.specialInstructions,
        booking_status: 'pending',
        payment_status: 'pending'
      };

      const { error } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (error) throw error;

      toast({
        title: "Booking Request Submitted!",
        description: "Your logistics booking request has been submitted. We'll contact you soon with pricing and confirmation.",
      });
      
      onClose();
      // Reset form
      setLogisticsBooking({
        serviceType: '',
        senderName: '',
        senderPhone: '',
        senderAddress: '',
        recipientName: '',
        recipientPhone: '',
        recipientAddress: '',
        packageWeight: '',
        packageDescription: '',
        specialInstructions: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Booking</DialogTitle>
          <DialogDescription>
            Choose your service type and fill in the details for your booking request.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="vehicle" onValueChange={(value) => setBookingType(value as 'vehicle' | 'logistics')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vehicle" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehicle Rental
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Logistics Service
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicle Rental Booking
                </CardTitle>
                <CardDescription>
                  Book our premium vehicle fleet with professional drivers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVehicleBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Pickup Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pickupLocation"
                          placeholder="Enter pickup address"
                          className="pl-10"
                          value={vehicleBooking.pickupLocation}
                          onChange={(e) => setVehicleBooking({...vehicleBooking, pickupLocation: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="destination"
                          placeholder="Enter destination address"
                          className="pl-10"
                          value={vehicleBooking.destination}
                          onChange={(e) => setVehicleBooking({...vehicleBooking, destination: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pickupDate"
                          type="date"
                          className="pl-10"
                          value={vehicleBooking.pickupDate}
                          onChange={(e) => setVehicleBooking({...vehicleBooking, pickupDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pickupTime">Pickup Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pickupTime"
                          type="time"
                          className="pl-10"
                          value={vehicleBooking.pickupTime}
                          onChange={(e) => setVehicleBooking({...vehicleBooking, pickupTime: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="returnDate">Return Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="returnDate"
                          type="date"
                          className="pl-10"
                          value={vehicleBooking.returnDate}
                          onChange={(e) => setVehicleBooking({...vehicleBooking, returnDate: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="returnTime">Return Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="returnTime"
                          type="time"
                          className="pl-10"
                          value={vehicleBooking.returnTime}
                          onChange={(e) => setVehicleBooking({...vehicleBooking, returnTime: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requests (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requirements or notes for your booking..."
                      value={vehicleBooking.notes}
                      onChange={(e) => setVehicleBooking({...vehicleBooking, notes: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Vehicle Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logistics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Logistics Service Booking
                </CardTitle>
                <CardDescription>
                  Professional delivery and logistics services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogisticsBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Sender Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="senderName"
                          placeholder="Sender's full name"
                          className="pl-10"
                          value={logisticsBooking.senderName}
                          onChange={(e) => setLogisticsBooking({...logisticsBooking, senderName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderPhone">Sender Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="senderPhone"
                          placeholder="+62 812 3456 7890"
                          className="pl-10"
                          value={logisticsBooking.senderPhone}
                          onChange={(e) => setLogisticsBooking({...logisticsBooking, senderPhone: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senderAddress">Pickup Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="senderAddress"
                        placeholder="Complete pickup address"
                        className="pl-10"
                        value={logisticsBooking.senderAddress}
                        onChange={(e) => setLogisticsBooking({...logisticsBooking, senderAddress: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientName">Recipient Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="recipientName"
                          placeholder="Recipient's full name"
                          className="pl-10"
                          value={logisticsBooking.recipientName}
                          onChange={(e) => setLogisticsBooking({...logisticsBooking, recipientName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="recipientPhone">Recipient Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="recipientPhone"
                          placeholder="+62 812 3456 7890"
                          className="pl-10"
                          value={logisticsBooking.recipientPhone}
                          onChange={(e) => setLogisticsBooking({...logisticsBooking, recipientPhone: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipientAddress">Delivery Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="recipientAddress"
                        placeholder="Complete delivery address"
                        className="pl-10"
                        value={logisticsBooking.recipientAddress}
                        onChange={(e) => setLogisticsBooking({...logisticsBooking, recipientAddress: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="packageWeight">Package Weight (kg)</Label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="packageWeight"
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="pl-10"
                          value={logisticsBooking.packageWeight}
                          onChange={(e) => setLogisticsBooking({...logisticsBooking, packageWeight: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="packageDescription">Package Description</Label>
                      <Input
                        id="packageDescription"
                        placeholder="What's being shipped?"
                        value={logisticsBooking.packageDescription}
                        onChange={(e) => setLogisticsBooking({...logisticsBooking, packageDescription: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="Any special handling instructions or delivery requirements..."
                      value={logisticsBooking.specialInstructions}
                      onChange={(e) => setLogisticsBooking({...logisticsBooking, specialInstructions: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Logistics Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleBookingModal;