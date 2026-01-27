import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/toaster";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home"));
const LaundryPage = lazy(() => import("./pages/LaundryPage"));
const AnnouncementPage = lazy(() => import("./pages/AnnouncementPage"));
const HelpCenterPage = lazy(() => import("./pages/HelpCenterPage"));
const PartnerInfoPage = lazy(() => import("./pages/PartnerInfoPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const ProductClaimPage = lazy(() => import("./pages/ProductClaimPage"));

function App() {
  return (
    <>
      <Navbar />
      
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500"></div>
        </div>
      }>
        <Routes>
          {/* 👇 หน้าแรก */}
          <Route path="/" element={<Home />} />

          {/* 👇 หน้าอื่น */}
          <Route path="/laundry" element={<LaundryPage />} />
          <Route path="/announcement" element={<AnnouncementPage />} />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/partner" element={<PartnerInfoPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/claim" element={<ProductClaimPage />} />
        </Routes>
      </Suspense>

      <ScrollToTop />
      <Toaster />
    </>
  );
}

export default App;
