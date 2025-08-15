"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useSimpleAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Package,
  Users,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  DollarSign
} from "lucide-react";
import VehicleManagement from "@/components/admin/VehicleManagement";
import BookingManagement from "@/components/admin/BookingManagement";
import UserManagement from "@/components/admin/UserManagement";
import ArticleManagement from "@/components/admin/ArticleManagement";

const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth");
      } else if (profile && profile.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== "admin") {
    return null;
  }

  const stats = [
    { title: "Total Bookings", value: "156", change: "+12%", icon: Calendar, color: "text-blue-600" },
    { title: "Revenue", value: "Rp 45.2M", change: "+23%", icon: DollarSign, color: "text-green-600" },
    { title: "Active Vehicles", value: "24", change: "+2", icon: Car, color: "text-purple-600" },
    { title: "Total Users", value: "89", change: "+15%", icon: Users, color: "text-orange-600" },
  ];

  const recentBookings = [
    { id: "1", type: "Vehicle", customer: "John Doe", status: "pending", amount: "Rp 2,500,000" },
    { id: "2", type: "Logistics", customer: "Jane Smith", status: "confirmed", amount: "Rp 150,000" },
    { id: "3", type: "Vehicle", customer: "Bob Wilson", status: "in_progress", amount: "Rp 3,500,000" },
  ];

  const vehicles = [
    { id: "1", brand: "Mercedes-Benz", model: "S-Class", plate: "B 1234 ABC", status: "available" },
    { id: "2", brand: "BMW", model: "X7", plate: "B 5678 DEF", status: "booked" },
    { id: "3", brand: "Mercedes-Benz", model: "V-Class", plate: "B 9012 GHI", status: "maintenance" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your logistics & transport business</p>
            </div>
            <Button onClick={() => router.push("/")}>
              Back to Website
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Logistics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`p-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600 font-medium">{stat.change}</span> from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{booking.customer}</p>
                          <p className="text-sm text-muted-foreground">{booking.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={booking.status === "pending" ? "secondary" : "default"}>
                            {booking.status}
                          </Badge>
                          <p className="text-sm font-medium mt-1">{booking.amount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Status</CardTitle>
                  <CardDescription>Current fleet status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                        </div>
                        <Badge
                          variant={
                            vehicle.status === "available"
                              ? "default"
                              : vehicle.status === "booked"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {vehicle.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-6">
            <VehicleManagement />
          </TabsContent>

          <TabsContent value="logistics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Logistics Services</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Logistics management interface will be implemented here.
                  Features: Manage services, pricing, delivery tracking, etc.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <ArticleManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h3 className="text-lg font-semibold">System Settings</h3>
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Settings interface will be implemented here.
                  Features: Company settings, pricing, notifications, etc.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
