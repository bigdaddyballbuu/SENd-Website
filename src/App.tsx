import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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
const TrackStatusPage = lazy(() => import("./pages/TrackStatusPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const DashboardLayout = lazy(() => import("./pages/admin/DashboardLayout"));
const ManageClaims = lazy(() => import("./pages/admin/ManageClaims"));
const ManageNews = lazy(() => import("./pages/admin/ManageNews"));
const ManageBlogs = lazy(() => import("./pages/admin/ManageBlogs"));
const ManageStores = lazy(() => import("./pages/admin/ManageStores"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      
      <Suspense key={location.pathname} fallback={
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
          <Route path="/track" element={<TrackStatusPage />} />

          {/* 👇 Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin" element={<DashboardLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="claims" element={<ManageClaims />} />
            <Route path="news" element={<ManageNews />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="stores" element={<ManageStores />} />
          </Route>

          {/* 👇 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <ScrollToTop />
      <Toaster />
    </>
  );
}

export default App;
