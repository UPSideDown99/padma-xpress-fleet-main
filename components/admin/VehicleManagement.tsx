"use client";

import { useState, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Car, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  plate_number: string;
  color: string | null;
  year: number;
  capacity: number | null;
  status: "available" | "booked" | "maintenance";
  image_url?: string | null;
  features?: string[] | null;
  category_id?: string | null;
  category?: { id: string; name: string } | null;
};

type VehicleCategory = { id: string; name: string; description?: string | null };

async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || `Request failed: ${res.status}`);
  return (body?.data ?? body) as T;
}

function statusVariant(s: Vehicle["status"]) {
  return s === "available" ? "default" : s === "booked" ? "secondary" : "destructive";
}

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [form, setForm] = useState({
    brand: "",
    model: "",
    plate_number: "",
    color: "",
    year: new Date().getFullYear(),
    capacity: 4,
    status: "available" as Vehicle["status"],
    image_url: "",
    category_id: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const [v, c] = await Promise.all([
          j<Vehicle[]>("/api/vehicles"),
          j<VehicleCategory[]>("/api/vehicle_categories"),
        ]);
        setVehicles(v);
        setCategories(c);
      } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: e.message });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [toast]);

  const resetForm = () => {
    setEditing(null);
    setForm({
      brand: "",
      model: "",
      plate_number: "",
      color: "",
      year: new Date().getFullYear(),
      capacity: 4,
      status: "available",
      image_url: "",
      category_id: "",
    });
  };

  const startEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({
      brand: v.brand,
      model: v.model,
      plate_number: v.plate_number,
      color: v.color || "",
      year: v.year,
      capacity: v.capacity ?? 4,
      status: v.status,
      image_url: v.image_url || "",
      category_id: v.category_id || "",
    });
    setIsDialogOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      brand: form.brand,
      model: form.model,
      plate_number: form.plate_number,
      color: form.color || null,
      year: Number(form.year),
      capacity: Number(form.capacity) || null,
      status: form.status,
      image_url: form.image_url || null,
      category_id: form.category_id || null,
    };

    try {
      if (editing) {
        await j(`/api/vehicles/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
        toast({ title: "Success", description: "Vehicle updated successfully" });
      } else {
        await j("/api/vehicles", { method: "POST", body: JSON.stringify(payload) });
        toast({ title: "Success", description: "Vehicle added successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
      const data = await j<Vehicle[]>("/api/vehicles");
      setVehicles(data);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    const prev = vehicles;
    setVehicles((r) => r.filter((x) => x.id !== id));
    try {
      await j(`/api/vehicles/${id}`, { method: "DELETE" });
      toast({ title: "Success", description: "Vehicle deleted successfully" });
    } catch (e: any) {
      setVehicles(prev);
      toast({ variant: "destructive", title: "Error", description: e.message });
    }
  };

  const filtered = vehicles.filter((v) => {
    const q = searchTerm.toLowerCase();
    return (
      v.brand.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.plate_number.toLowerCase().includes(q)
    );
  });

  if (isLoading) return <div className="flex items-center justify-center p-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-semibold">Vehicle Management</h3>
          <p className="text-muted-foreground">Manage your fleet vehicles</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(v) => { setIsDialogOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
              <DialogDescription>
                {editing ? "Update vehicle information" : "Add a new vehicle to your fleet"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} required />
                </div>
              </div>

              <div>
                <Label htmlFor="plate_number">Plate Number</Label>
                <Input id="plate_number" value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input id="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Vehicle["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">(None)</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">{editing ? "Update" : "Add"} Vehicle</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Fleet Vehicles</CardTitle>
              <CardDescription>Manage and track all vehicles</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Plate Number</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((v) => (
                <TableRow key={v.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{v.brand} {v.model}</div>
                        <div className="text-sm text-muted-foreground">{v.year}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{v.plate_number}</TableCell>
                  <TableCell className="text-sm">
                    <div>{v.color || "-"}</div>
                    <div className="text-muted-foreground">{v.capacity ?? "-"} seats</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(v.status) as any}>{v.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => startEdit(v)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => remove(v.id)}>
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
