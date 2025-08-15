"use client";

import { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Eye, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed";

type Booking = {
  id: string;
  booking_type: "vehicle" | "logistics";
  pickup_location?: string | null;
  destination?: string | null;
  pickup_datetime?: string | null;
  return_datetime?: string | null;
  total_price?: number | null;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  sender_name?: string | null;
  recipient_name?: string | null;
  created_at: string;
  // backend bisa kirim salah satu dari ini
  profiles?: { full_name?: string | null; phone?: string | null } | null;
  user?: { full_name?: string | null; phone?: string | null } | null;
};

function getStatusColor(s: BookingStatus) {
  switch (s) {
    case "pending": return "secondary";
    case "confirmed": return "default";
    case "in_progress": return "default";
    case "completed": return "default";
    case "cancelled": return "destructive";
    default: return "secondary";
  }
}

function getPaymentStatusColor(s: PaymentStatus) {
  switch (s) {
    case "pending": return "secondary";
    case "paid": return "default";
    case "failed": return "destructive";
    default: return "secondary";
  }
}

async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || `Request failed: ${res.status}`);
  return (body?.data ?? body) as T;
}

export default function BookingManagement() {
  const [rows, setRows] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "vehicle" | "logistics">("all");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await j<Booking[]>("/api/bookings");
        setRows(data);
      } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [toast]);

  const update = async (id: string, patch: Partial<Booking>) => {
    const prev = rows;
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
    try {
      await j(`/api/bookings/${id}`, { method: "PUT", body: JSON.stringify(patch) });
      toast({ title: "Updated", description: "Booking updated" });
    } catch (e: any) {
      setRows(prev);
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    const prev = rows;
    setRows((r) => r.filter((x) => x.id !== id));
    try {
      await j(`/api/bookings/${id}`, { method: "DELETE" });
      toast({ title: "Deleted", description: "Booking deleted" });
    } catch (e: any) {
      setRows(prev);
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  const filtered = rows.filter((b) => {
    const ownerName = b.user?.full_name || b.profiles?.full_name || "";
    const ownerPhone = b.user?.phone || b.profiles?.phone || "";
    const matchesSearch =
      ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ownerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.sender_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.recipient_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.pickup_location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.destination || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.booking_status === statusFilter;
    const matchesType = typeFilter === "all" || b.booking_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) return <div className="flex items-center justify-center p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">Booking Management</h3>
          <p className="text-muted-foreground">Manage all customer bookings</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Track and manage customer bookings</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {b.user?.full_name || b.profiles?.full_name || b.sender_name || "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {(b.user?.phone || b.profiles?.phone) ?? "No phone"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{b.booking_type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {b.booking_type === "vehicle" ? (
                      <div>
                        <div>{b.pickup_location}</div>
                        <div className="text-muted-foreground">to {b.destination}</div>
                      </div>
                    ) : (
                      <div>
                        <div>{b.sender_name} → {b.recipient_name}</div>
                        <div className="text-muted-foreground">
                          {b.pickup_location} → {b.destination}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>
                      {b.pickup_datetime
                        ? format(new Date(b.pickup_datetime), "MMM dd, yyyy")
                        : format(new Date(b.created_at), "MMM dd, yyyy")}
                    </div>
                    <div className="text-muted-foreground">
                      {b.pickup_datetime
                        ? format(new Date(b.pickup_datetime), "HH:mm")
                        : "No time set"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={b.booking_status}
                      onValueChange={(v) => update(b.id, { booking_status: v as BookingStatus })}
                    >
                      <SelectTrigger className="w-32">
                        <Badge variant={getStatusColor(b.booking_status) as any}>
                          {b.booking_status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={b.payment_status}
                      onValueChange={(v) => update(b.id, { payment_status: v as PaymentStatus })}
                    >
                      <SelectTrigger className="w-24">
                        <Badge variant={getPaymentStatusColor(b.payment_status) as any}>
                          {b.payment_status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => remove(b.id)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
