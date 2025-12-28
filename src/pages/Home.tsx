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
  return (
    <>
      <Navbar />
      <Hero />
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
    </>
  );
}
