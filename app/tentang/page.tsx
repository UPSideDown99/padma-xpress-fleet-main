import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Target, Award } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const values = [
    {
      icon: CheckCircle,
      title: "Reliabilitas",
      description: "Komitmen untuk memberikan layanan yang dapat diandalkan setiap saat"
    },
    {
      icon: Users,
      title: "Profesionalitas",
      description: "Tim berpengalaman dengan standar pelayanan tertinggi"
    },
    {
      icon: Target,
      title: "Ketepatan Waktu",
      description: "Selalu on-time dengan tracking real-time untuk setiap perjalanan"
    },
    {
      icon: Award,
      title: "Kualitas Terbaik",
      description: "Armada terbaru dan terawat untuk kenyamanan maksimal"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Tentang Padma Transport
              </h1>
              <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
                Perusahaan transportasi terpercaya dengan pengalaman lebih dari 15 tahun 
                melayani kebutuhan perjalanan dan logistik di seluruh Indonesia
              </p>
            </div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Perjalanan Kami
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    Didirikan pada tahun 2008, Padma Transport lahir dari visi untuk 
                    menyediakan layanan transportasi yang aman, nyaman, dan terpercaya 
                    bagi masyarakat Indonesia.
                  </p>
                  <p>
                    Dimulai dengan 5 unit kendaraan, kini kami telah berkembang menjadi 
                    perusahaan transportasi dengan armada lebih dari 100 unit kendaraan 
                    berbagai jenis, melayani rute domestik dan logistik nasional.
                  </p>
                  <p>
                    Komitmen kami terhadap inovasi dan pelayanan prima telah membuat 
                    Padma Transport menjadi pilihan utama ribuan pelanggan di seluruh Indonesia.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-primary mb-2">15+</div>
                    <div className="text-sm text-muted-foreground">Tahun Pengalaman</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-primary mb-2">100+</div>
                    <div className="text-sm text-muted-foreground">Armada Kendaraan</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                    <div className="text-sm text-muted-foreground">Pelanggan Puas</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-6">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-primary mb-2">25</div>
                    <div className="text-sm text-muted-foreground">Kota Jangkauan</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nilai-Nilai Kami
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Prinsip yang menjadi fondasi dalam setiap layanan yang kami berikan
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 hover-lift">
                  <CardContent className="p-0">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Mission */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <Target className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-2xl font-bold">Visi Kami</h3>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Menjadi perusahaan transportasi terdepan di Indonesia yang mengutamakan 
                    keselamatan, kenyamanan, dan kepuasan pelanggan dengan teknologi terkini 
                    dan pelayanan berstandar internasional.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <Award className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-2xl font-bold">Misi Kami</h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Menyediakan layanan transportasi yang aman dan nyaman</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Mengembangkan teknologi untuk meningkatkan efisiensi layanan</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Memberikan kontribusi positif untuk masyarakat dan lingkungan</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Menciptakan lapangan kerja dan memberdayakan SDM berkualitas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;