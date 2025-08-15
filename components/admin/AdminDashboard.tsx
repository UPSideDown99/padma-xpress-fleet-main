// components/admin/AdminDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Car, Package, Users, Calendar, BarChart3, Settings, Plus, DollarSign, LogOut, User as UserIcon,
} from "lucide-react";

import { useAuth } from "@/hooks/useSimpleAuth";

import VehicleManagement from "@/components/admin/VehicleManagement";
import BookingManagement from "@/components/admin/BookingManagement";
import UserManagement from "@/components/admin/UserManagement";
import ArticleManagement from "@/components/admin/ArticleManagement";

export default function AdminDashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Tambahan guard sisi-klien (middleware juga sudah jaga sisi-server)
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/auth?next=/admin");
      } else if (profile && profile.role !== "admin") {
        router.replace("/");
      }
    }
  }, [user, profile, loading, router]);

  const onLogout = async () => {
    try {
      await signOut();                 // panggil dari AuthContext
    } finally {
      router.push("/auth?next=/admin"); // balik ke auth
      router.refresh();                 // segarkan header dsb.
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Saat masih diarahkan oleh guard, jangan render isi
  if (!user || !profile || profile.role !== "admin") {
    return null;
  }

  const displayName = profile.full_name ?? user.email ?? "User";

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
      {/* Top Bar */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your logistics & transport business</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
                <UserIcon className="w-4 h-4" />
                <span className="max-w-[200px] truncate">{displayName}</span>
              </div>

              <Button variant="secondary" onClick={() => router.push("/")}>
                Back to Website
              </Button>

              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="w-4 h-4" /> Vehicles
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex items-center gap-2">
              <Package className="w-4 h-4" /> Logistics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Articles
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <Card key={i} className="hover-lift">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
                    <div className="p-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10">
                      <s.icon className={`h-4 w-4 ${s.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600 font-medium">{s.change}</span> from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Latest booking requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.map((b) => (
                      <div key={b.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{b.customer}</p>
                          <p className="text-sm text-muted-foreground">{b.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={b.status === "pending" ? "secondary" : "default"}>{b.status}</Badge>
                          <p className="text-sm font-medium mt-1">{b.amount}</p>
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
                    {vehicles.map((v) => (
                      <div key={v.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">{v.brand} {v.model}</p>
                          <p className="text-sm text-muted-foreground">{v.plate}</p>
                        </div>
                        <Badge
                          variant={
                            v.status === "available" ? "default" :
                            v.status === "booked" ? "secondary" : "destructive"
                          }
                        >
                          {v.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings" className="space-y-6">
            <BookingManagement />
          </TabsContent>

          {/* Vehicles */}
          <TabsContent value="vehicles" className="space-y-6">
            <VehicleManagement />
          </TabsContent>

          {/* Logistics (placeholder) */}
          <TabsContent value="logistics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Logistics Services</h3>
              <Button><Plus className="w-4 h-4 mr-2" /> Add Service</Button>
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

          {/* Users */}
          <TabsContent value="users" className="space-y-6">
            <UserManagement />
          </TabsContent>

          {/* Articles */}
          <TabsContent value="articles" className="space-y-6">
            <ArticleManagement />
          </TabsContent>

          {/* Settings (placeholder) */}
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
}
