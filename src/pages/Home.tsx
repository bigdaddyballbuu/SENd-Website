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
import SectionDivider from "../components/SectionDivide";

export default function Home() {
  const pageRef = useRef(null);

  return (
    <div ref={pageRef} className="relative w-full overflow-hidden">
      <Navbar />
      <Hero dragConstraints={pageRef} />
      <DownloadCTA />
      <SectionDivider />
      <AppPreview />
      <LaundryPartners />
      <SectionDivider />
      <WeightCalculator />
      <SectionDivider />
      <ServiceArea />
      <SectionDivider />
      <About />
      <Footer />
    </div>
  );
}
