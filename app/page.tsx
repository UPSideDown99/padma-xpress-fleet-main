// app/page.tsx (SERVER component)
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientHome from "./ClientHome";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      <ClientHome />
      <Footer />
    </div>
  );
}
