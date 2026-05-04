import { useRef } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AppPreview from "../components/AppPreview";
import LaundryPartners from "../components/LaundryPartners";
import WeightCalculator from "../components/WeightCalculator";
import ServiceArea from "../components/ServiceArea";
import About from "../components/About";
import Footer from "../components/Footer";
import DownloadCTA from "../components/DownloadCTA";
import SEO from "../components/SEO";

export default function Home() {
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className="relative w-full overflow-hidden">
      <SEO path="/" />
      <Navbar />
      <Hero dragConstraints={pageRef} />
      <DownloadCTA />
      <AppPreview />
      <LaundryPartners />
      <WeightCalculator />
      <ServiceArea />
      <About />
      <Footer />
    </div>
  );
}
