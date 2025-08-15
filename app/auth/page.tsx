"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Truck, User, Mail, Phone, Building } from "lucide-react";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true); // check sesi dulu
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    companyName: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/"; // kemana setelah login
  const { toast } = useToast();

  // Cek sesi via API kamu sendiri
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = res.ok ? await res.json() : null;
        if (!alive) return;

        if (data?.user) {
          // sudah login → langsung arahkan ke redirect
          router.replace(redirect);
        } else {
          setChecking(false); // tampilkan form
        }
      } catch {
        setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [router, redirect]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((s) => ({ ...s, [e.target.id]: e.target.value }));

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Login gagal");
      }

      // beri tahu context sederhana
      window.dispatchEvent(new Event("auth-changed"));
      router.replace(redirect || "/");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Login gagal" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          phone: formData.phone,
          company_name: formData.companyName,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Registrasi gagal");
      }

      toast({
        title: "Registrasi berhasil",
        description: "Akun dibuat. Silakan login.",
      });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message || "Registrasi gagal" });
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-sm text-muted-foreground">Memuat…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header mini */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-primary-foreground">PADMA LOGISTIK</h1>
              <p className="text-xs text-primary-foreground/80">XPRESS</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">Welcome</h2>
          <p className="text-primary-foreground/90">Sign in atau buat akun baru</p>
        </div>

        <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-premium">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Account Access</CardTitle>
            <CardDescription className="text-center">Masuk / daftar akun Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Sign In */}
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@email.com" className="pl-10"
                             value={formData.email} onChange={onChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                             className="pr-10" value={formData.password} onChange={onChange} required />
                      <button
                        type="button"
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label="toggle password"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* Sign Up */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="fullName" placeholder="Nama lengkap" className="pl-10"
                             value={formData.fullName} onChange={onChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@email.com" className="pl-10"
                             value={formData.email} onChange={onChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="phone" placeholder="+62…" className="pl-10"
                             value={formData.phone} onChange={onChange} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company (opsional)</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="companyName" placeholder="Nama perusahaan" className="pl-10"
                             value={formData.companyName} onChange={onChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min 6 karakter"
                             className="pr-10" value={formData.password} onChange={onChange} required minLength={6} />
                      <button
                        type="button"
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                        onClick={() => setShowPassword((s) => !s)}
                        aria-label="toggle password"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
