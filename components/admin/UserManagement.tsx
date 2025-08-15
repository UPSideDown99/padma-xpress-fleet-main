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
import { Users, Search, Edit, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Role = "customer" | "admin";

type UserProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  company_name: string | null;
  address: string | null;
  city: string | null;
  role: Role;
  created_at: string;
  // opsi data dari API:
  booking_count?: number;
  bookings?: { count: number }[];
};

async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || `Request failed: ${res.status}`);
  return (body?.data ?? body) as T;
}

function roleBadge(role: Role) {
  return role === "admin" ? "destructive" : "default";
}

export default function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const data = await j<UserProfile[]>("/api/profiles");
        setUsers(data);
      } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [toast]);

  const updateRole = async (id: string, role: Role) => {
    const prev = users;
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, role } : x)));
    try {
      await j(`/api/profiles/${id}`, { method: "PUT", body: JSON.stringify({ role }) });
      toast({ title: "Updated", description: "User role updated" });
    } catch (e: any) {
      setUsers(prev);
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  const filtered = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    const matches =
      (u.full_name || "").toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q) ||
      (u.company_name || "").toLowerCase().includes(q) ||
      (u.city || "").toLowerCase().includes(q);
    const roleOk = roleFilter === "all" || u.role === roleFilter;
    return matches && roleOk;
  });

  const getBookingCount = (u: UserProfile) => u.booking_count ?? u.bookings?.[0]?.count ?? 0;

  if (isLoading) return <div className="flex items-center justify-center p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">User Management</h3>
          <p className="text-muted-foreground">Manage customer accounts and roles</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "customer").length}
            </div>
            <p className="text-xs text-muted-foreground">Customer accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <p className="text-xs text-muted-foreground">Admin accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((u) => {
                const today = new Date();
                const d = new Date(u.created_at);
                return d.toDateString() === today.toDateString();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">New registrations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{u.full_name || "No name"}</div>
                        <div className="text-sm text-muted-foreground">ID: {u.id.slice(0, 8)}...</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      {u.phone && (
                        <div className="flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                          {u.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{u.company_name || "N/A"}</TableCell>
                  <TableCell className="text-sm">
                    {u.city && (
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                        {u.city}
                      </div>
                    )}
                    {u.address && (
                      <div className="text-muted-foreground text-xs mt-1">{u.address}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select value={u.role} onValueChange={(v) => updateRole(u.id, v as Role)}>
                      <SelectTrigger className="w-28">
                        <Badge variant={roleBadge(u.role) as any}>{u.role}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{getBookingCount(u)}</div>
                      <div className="text-xs text-muted-foreground">bookings</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{format(new Date(u.created_at), "MMM dd, yyyy")}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" title="Edit User">
                      <Edit className="w-4 h-4" />
                    </Button>
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
