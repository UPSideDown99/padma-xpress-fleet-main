"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Car,
  Package,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  Weight,
} from "lucide-react";

type MeResponse = { id: number; email: string } | null;

interface SimpleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SimpleBookingModal({ isOpen, onClose }: SimpleBookingModalProps) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState<"vehicle" | "logistics">("vehicle");
  const [currentUser, setCurrentUser] = useState<MeResponse>(null);

  // Vehicle form
  const [vehicleBooking, setVehicleBooking] = useState({
    vehicleCategory: "",
    pickupLocation: "",
    destination: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    notes: "",
  });

  // Logistics form
  const [logisticsBooking, setLogisticsBooking] = useState({
    serviceType: "",
    senderName: "",
    senderPhone: "",
    senderAddress: "",
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    packageWeight: "",
    packageDescription: "",
    specialInstructions: "",
  });

  // Cek login setiap modal dibuka
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          // samakan minimal { id, email }
          setCurrentUser(data?.profile ?? data?.user ?? data ?? null);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    })();
  }, [isOpen]);

  const requireLogin = () => {
    toast({
      title: "Authentication Required",
      description: "Please login to create a booking.",
      variant: "destructive",
    });
  };

  async function createBooking(payload: any) {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.message || "Failed creating booking");
    return body;
  }

  const handleVehicleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return requireLogin();

    setLoading(true);
    try {
      const pickup = `${vehicleBooking.pickupDate}T${vehicleBooking.pickupTime}:00`;
      const back = `${vehicleBooking.returnDate}T${vehicleBooking.returnTime}:00`;

      await createBooking({
        booking_type: "vehicle",
        user_id: currentUser.id,
        vehicle_category: vehicleBooking.vehicleCategory || null,
        pickup_location: vehicleBooking.pickupLocation,
        destination: vehicleBooking.destination,
        pickup_datetime: pickup,
        return_datetime: back,
        notes: vehicleBooking.notes || null,
        booking_status: "pending",
        payment_status: "pending",
      });

      toast({
        title: "Booking Request Submitted!",
        description:
          "Your vehicle booking request has been submitted. We'll contact you soon with pricing and confirmation.",
      });

      onClose();
      setVehicleBooking({
        vehicleCategory: "",
        pickupLocation: "",
        destination: "",
        pickupDate: "",
        pickupTime: "",
        returnDate: "",
        returnTime: "",
        notes: "",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message ?? "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogisticsBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return requireLogin();

    setLoading(true);
    try {
      await createBooking({
        booking_type: "logistics",
        user_id: currentUser.id,
        service_type: logisticsBooking.serviceType || null,
        sender_name: logisticsBooking.senderName,
        sender_phone: logisticsBooking.senderPhone,
        sender_address: logisticsBooking.senderAddress,
        recipient_name: logisticsBooking.recipientName,
        recipient_phone: logisticsBooking.recipientPhone,
        recipient_address: logisticsBooking.recipientAddress,
        package_weight: Number(logisticsBooking.packageWeight || 0),
        package_description: logisticsBooking.packageDescription,
        special_instructions: logisticsBooking.specialInstructions || null,
        booking_status: "pending",
        payment_status: "pending",
      });

      toast({
        title: "Booking Request Submitted!",
        description:
          "Your logistics booking request has been submitted. We'll contact you soon with pricing and confirmation.",
      });

      onClose();
      setLogisticsBooking({
        serviceType: "",
        senderName: "",
        senderPhone: "",
        senderAddress: "",
        recipientName: "",
        recipientPhone: "",
        recipientAddress: "",
        packageWeight: "",
        packageDescription: "",
        specialInstructions: "",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message ?? "Failed to submit booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Booking</DialogTitle>
          <DialogDescription>
            Choose your service type and fill in the details for your booking request.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="vehicle" onValueChange={(v) => setBookingType(v as any)}>
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

          {/* VEHICLE */}
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
                          onChange={(e) =>
                            setVehicleBooking((s) => ({ ...s, pickupLocation: e.target.value }))
                          }
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
                          onChange={(e) =>
                            setVehicleBooking((s) => ({ ...s, destination: e.target.value }))
                          }
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
                          onChange={(e) =>
                            setVehicleBooking((s) => ({ ...s, pickupDate: e.target.value }))
                          }
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
                          onChange={(e) =>
                            setVehicleBooking((s) => ({ ...s, pickupTime: e.target.value }))
                          }
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
                          onChange={(e) =>
                            setVehicleBooking((s) => ({ ...s, returnDate: e.target.value }))
                          }
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
                          onChange={(e) =>
                            setVehicleBooking((s) => ({ ...s, returnTime: e.target.value }))
                          }
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
                      onChange={(e) => setVehicleBooking((s) => ({ ...s, notes: e.target.value }))}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Vehicle Booking"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LOGISTICS */}
          <TabsContent value="logistics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Logistics Service Booking
                </CardTitle>
                <CardDescription>Professional delivery and logistics services</CardDescription>
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
                          onChange={(e) =>
                            setLogisticsBooking((s) => ({ ...s, senderName: e.target.value }))
                          }
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
                          onChange={(e) =>
                            setLogisticsBooking((s) => ({ ...s, senderPhone: e.target.value }))
                          }
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
                        onChange={(e) =>
                          setLogisticsBooking((s) => ({ ...s, senderAddress: e.target.value }))
                        }
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
                          onChange={(e) =>
                            setLogisticsBooking((s) => ({ ...s, recipientName: e.target.value }))
                          }
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
                          onChange={(e) =>
                            setLogisticsBooking((s) => ({ ...s, recipientPhone: e.target.value }))
                          }
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
                        onChange={(e) =>
                          setLogisticsBooking((s) => ({ ...s, recipientAddress: e.target.value }))
                        }
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
                          onChange={(e) =>
                            setLogisticsBooking((s) => ({ ...s, packageWeight: e.target.value }))
                          }
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
                        onChange={(e) =>
                          setLogisticsBooking((s) => ({ ...s, packageDescription: e.target.value }))
                        }
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
                      onChange={(e) =>
                        setLogisticsBooking((s) => ({ ...s, specialInstructions: e.target.value }))
                      }
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
}
