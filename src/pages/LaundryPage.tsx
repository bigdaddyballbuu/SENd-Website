import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import SEO from "../components/SEO";

// พื้นหลัง Hero
import laundryHeroBg from "../assets/bg/bg-maps.png";

// ไอคอน
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import markerLogo from "../assets/logos/send-logo2.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// สร้างไอคอน
const createStoreIcon = (logo: string) => {
  return L.divIcon({
    className: "custom-store-marker",
    html: `
      <div style="
        position: relative;
        width: 30px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: flex-start;
      ">
        <div style="
          width: 28px; 
          height: 28px; 
          background-color: #ff2500;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          display: flex;
          justify-content: center;
          align-items: center;
        ">
          <div style="
            width: 24px;
            height: 24px;
            background: #ff2500;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(45deg);
          ">
            <img src="${logo}" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
        </div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -42],
  });
};

L.Marker.prototype.options.icon = DefaultIcon;

/* =========================
   TYPES
========================= */
export interface Store {
  id: string;
  name: string;
  logo: string;
  image: string;
  washers: number;
  dryers: number;
  maxKg: number;
  price: number;
  lat: number;
  lng: number;
  isCombo?: boolean;
  province: string; // จังหวัด
  district?: string; // อำเภอ (สำหรับอุบลฯ)
}

// Province configuration
const provinces = {
  sisaket: { name: "ศรีสะเกษ", center: [15.115, 104.33] as [number, number] },
  ubon: { name: "อุบลราชธานี", center: [15.2287, 104.8567] as [number, number] },
};

// District configuration (สำหรับอุบลราชธานี)
const districts = {
  mueang: { name: "อำเภอเมืองอุบล", center: [15.2287, 104.8567] as [number, number] },
  warin: { name: "อำเภอวารินชำราบ", center: [15.1650, 104.8600] as [number, number] },
};

/* =========================
   COMPONENTS
========================= */

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

// User Location Component
function LocationMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 14);
      setLoading(false);
    },
    locationerror(e) {
      console.warn("Geolocation failed:", e.message);
      
      // Fallback location (Sisaket)
      const mockLat = 15.115;
      const mockLng = 104.33;
      
      alert(t('laundryPage.locationError'));
      
      setPosition({ lat: mockLat, lng: mockLng } as L.LatLng);
      map.flyTo([mockLat, mockLng], 14);
      setLoading(false);
    },
  });

  return (
    <>
      {position && (
        <Marker position={position}>
          <Popup>📍 {t('laundryPage.youAreHere')}</Popup>
        </Marker>
      )}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLoading(true);
            map.locate({ enableHighAccuracy: true });
          }}
          disabled={loading}
          className="bg-white text-slate-700 px-4 py-2 rounded-xl shadow-lg border border-slate-200 font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-wait"
        >
          {loading ? t('laundryPage.locating') : `📍 ${t('laundryPage.findMyLocation')}`}
        </button>
      </div>
    </>
  );
}

// Map View Controller - changes map center when province changes
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const LaundryPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [kg, setKg] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<"all" | "sisaket" | "ubon">("all");
  const [selectedDistrict, setSelectedDistrict] = useState<"all" | "mueang" | "warin">("all");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const mappedStores = (data || []).map(row => ({
          id: row.id,
          name: row.name,
          logo: row.logo,
          image: row.image,
          washers: row.washers,
          dryers: row.dryers,
          maxKg: row.max_kg,
          price: row.price,
          lat: row.lat,
          lng: row.lng,
          isCombo: row.is_combo,
          province: row.province,
          district: row.district
        }));
        
        setStores(mappedStores);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  useEffect(() => {
    if (!selectedStore) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedStore(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedStore]);

  // Reset district when province changes
  useEffect(() => {
    if (selectedProvince !== "ubon") {
      setSelectedDistrict("all");
    }
  }, [selectedProvince]);

  // Get map center based on selected province and district
  const getMapCenter = (): [number, number] => {
    if (selectedProvince === "sisaket") {
      return provinces.sisaket.center;
    }
    if (selectedProvince === "ubon") {
      if (selectedDistrict === "mueang") return districts.mueang.center;
      if (selectedDistrict === "warin") return districts.warin.center;
      return provinces.ubon.center;
    }
    return [15.17, 104.59] as [number, number]; // Center between both provinces
  };

  const mapCenter = getMapCenter();
  const mapZoom = selectedProvince === "all" ? 10 : selectedDistrict !== "all" ? 14 : 13;

  const filteredStores = stores.filter(
    (store) =>
      (selectedProvince === "all" || store.province === selectedProvince) &&
      (selectedProvince !== "ubon" || selectedDistrict === "all" || store.district === selectedDistrict) &&
      (kg === "" || store.maxKg >= kg) &&
      (price === "" || store.price <= price)
  );

  return (
    <section className="min-h-screen bg-[#F8F9FB] text-slate-900 pb-20 relative">
      <SEO title="ร้านสะดวกซัก" description="ค้นหาร้านสะดวกซัก SENd ใกล้คุณ พร้อมคำนวณราคาค่าซัก ดูแผนที่สาขาทั่วประเทศ" path="/laundry" />

      {/* HERO BACKGROUND IMAGE - extends to half of search bar */}
      <div className="absolute inset-x-0 top-0 h-[750px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${laundryHeroBg})`
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        {/* Bottom fade to match page background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F8F9FB] to-transparent" />
      </div>

      {/* CONTENT WITH Z-INDEX */}
      <div className="relative z-10">
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* HEADER SECTION */}
            <div className="mb-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl mx-auto"
              >
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                  {t('laundryPage.heroTitle')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b4a] to-[#ffb347]">{t('laundryPage.heroTitleHighlight')}</span>
                </h1>
                <p className="text-lg text-white/90 drop-shadow">
                  {t('laundryPage.heroSubtitle')}
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* MAP SECTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 rounded-3xl overflow-hidden shadow-xl border border-slate-200 h-[400px] relative"
          >
            <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} className="h-full w-full">
              <ChangeView center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {stores.map((store) => (
                <Marker key={store.id} position={[store.lat, store.lng]} icon={createStoreIcon(markerLogo)}>
                  <Popup>
                    <div className="font-sans min-w-[200px]">
                      <h3 className="font-bold text-sm mb-1">{store.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span>💧 {store.washers} {t('laundryPage.washers')}</span>
                        <span>🔥 {store.dryers} {t('laundryPage.dryers')}</span>
                      </div>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full text-center bg-red-500 !text-white text-xs font-bold py-1.5 rounded-lg hover:bg-red-600"
                      >
                        {t('laundryPage.navigate')}
                      </a>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <LocationMarker />
            </MapContainer>
          </motion.div>

          {/* PROVINCE & DISTRICT FILTER */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="flex flex-col items-center gap-3 mb-6"
          >
            {/* Row 1: Province Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="text-sm font-semibold text-slate-500 hidden sm:block">{t('laundryPage.province')}:</span>
              <div className="inline-flex items-center gap-1 p-1.5 bg-white rounded-2xl shadow-lg border border-slate-200">
                <button
                  onClick={() => setSelectedProvince("all")}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    selectedProvince === "all"
                      ? "bg-[#ff2500] text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  🌍 {t('laundryPage.filterAll')}
                </button>
                <button
                  onClick={() => setSelectedProvince("sisaket")}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    selectedProvince === "sisaket"
                      ? "bg-[#ff2500] text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  📍 {t('laundryPage.filterSisaket')}
                </button>
                <button
                  onClick={() => setSelectedProvince("ubon")}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    selectedProvince === "ubon"
                      ? "bg-[#ff2500] text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  📍 {t('laundryPage.filterUbon')}
                </button>
              </div>
            </div>

            {/* Row 2: District Filter (shows only when Ubon is selected) */}
            <AnimatePresence>
              {selectedProvince === "ubon" && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col sm:flex-row items-center gap-2 overflow-hidden"
                >
                  <span className="text-sm font-semibold text-slate-500 hidden sm:block">{t('laundryPage.district')}:</span>
                  <div className="inline-flex items-center gap-1 p-1.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl shadow-md border border-orange-200/50">
                    <button
                      onClick={() => setSelectedDistrict("all")}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        selectedDistrict === "all"
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                          : "text-slate-600 hover:bg-white/80"
                      }`}
                    >
                      {t('laundryPage.filterAll')}
                    </button>
                    <button
                      onClick={() => setSelectedDistrict("mueang")}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        selectedDistrict === "mueang"
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                          : "text-slate-600 hover:bg-white/80"
                      }`}
                    >
                      🏙️ {t('laundryPage.filterMueang')}
                    </button>
                    <button
                      onClick={() => setSelectedDistrict("warin")}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                        selectedDistrict === "warin"
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                          : "text-slate-600 hover:bg-white/80"
                      }`}
                    >
                      🏘️ {t('laundryPage.filterWarin')}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* SEARCH & FILTER BAR */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-xl border border-white/50 max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-3 w-full md:w-auto flex-1 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-[#ff2500]/20 transition-all">
              <span className="text-xl">⚖️</span>
              <div className="flex flex-col flex-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('laundryPage.minSize')}</label>
                <input
                  type="number"
                  min={0}
                  value={kg}
                  onChange={(e) => setKg(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder={t('laundryPage.sizePlaceholder')}
                  className="bg-transparent outline-none w-full text-sm font-medium placeholder-slate-400"
                />
              </div>
            </div>

            <div className="hidden md:block w-px h-10 bg-slate-200"></div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-1 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-[#ff2500]/20 transition-all">
              <span className="text-xl">฿</span>
              <div className="flex flex-col flex-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t('laundryPage.maxBudget')}</label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder={t('laundryPage.pricePlaceholder')}
                  className="bg-transparent outline-none w-full text-sm font-medium placeholder-slate-400"
                />
              </div>
            </div>

            <button className="w-full md:w-auto px-8 py-4 bg-[#ff2500] hover:bg-[#cc1e00] active:bg-[#a61900] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#ff2500]/20">
              {t('laundryPage.searchBtn')}
            </button>
          </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: LIST */}
          <div className="lg:col-span-12 xl:col-span-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredStores.map((store) => (
                  <motion.button
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    className={`
                                group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden text-left h-full flex flex-col
                                ${selectedStore?.id === store.id
                        ? "ring-2 ring-[#ff2500] shadow-xl shadow-[#ff2500]/10 border-transparent z-10"
                        : "border-slate-200 hover:border-orange-300 hover:shadow-lg shadow-slate-200/50"}
                            `}
                  >
                    {/* BRAND HEADER */}
                    <div className="h-40 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center pt-0 pb-2 px-4 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-grid-slate-100/[0.1] pointer-events-none" />
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="w-full h-full object-contain drop-shadow-sm transition-transform group-hover:scale-105 duration-500"
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 line-clamp-2 group-hover:text-[#ff2500] transition-colors">
                        {store.name}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {store.isCombo ? (
                          <Badge className="bg-blue-50 text-blue-700 border border-blue-100">
                             🫧 {t('laundryPage.combo2in1')} {store.washers} {t('laundryPage.washers')}
                          </Badge>
                        ) : (
                          <>
                            <Badge className="bg-orange-50 text-orange-700 border border-orange-100">
                              {store.washers} {t('laundryPage.washMachine')}
                            </Badge>
                            <Badge className="bg-red-50 text-red-700 border border-red-100">
                              {store.dryers} {t('laundryPage.dryMachine')}
                            </Badge>
                          </>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-medium">{t('laundryPage.startFrom')}</span>
                          <span className="text-lg font-bold text-[#ff2500]">฿{store.price}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-slate-500 font-medium">{t('laundryPage.support')}</span>
                          <span className="text-sm font-bold text-slate-700">{store.maxKg} KG</span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            {filteredStores.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-slate-700">{t('laundryPage.noStoresTitle')}</h3>
                <p className="text-slate-500">{t('laundryPage.noStoresSubtitle')}</p>
              </div>
            )}
          </div>

        </div>

        {/* DOWNLOAD CTA SECTION */}
        <div className="mt-20 mb-10">
          <div className="relative overflow-hidden rounded-3xl bg-black text-white p-10 md:p-16 text-center max-w-5xl mx-auto shadow-2xl shadow-slate-200">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 py-2 leading-tight">
                {t('laundryPage.ctaTitle')}
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                {t('laundryPage.ctaDesc')}
                <br className="hidden md:block" /> {t('laundryPage.ctaDesc2')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="https://apps.apple.com/us/app/send-delivery/id6474961079" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-6 py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" alt="App Store" className="w-8 h-8 object-contain" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-300 leading-none">Download on the</div>
                    <div className="text-base font-bold">App Store</div>
                  </div>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.sendcompany.send_delivery" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-6 py-3.5 rounded-xl transition-all hover:scale-105 active:scale-95">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google Play" className="w-8 h-8 object-contain" />
                  <div className="text-left">
                    <div className="text-[10px] text-slate-300 leading-none">GET IT ON</div>
                    <div className="text-base font-bold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[80%] bg-[#ff2500]/20 blur-[120px] rounded-full mix-blend-screen" />
              <div className="absolute -bottom-[50%] -right-[20%] w-[80%] h-[80%] bg-[#fe3d00]/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* MODAL & MAP OVERLAY */}
      <AnimatePresence>
        {selectedStore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedStore(null)}
            />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >

                {/* LEFT: INFO */}
                <div className="md:w-5/12 flex flex-col bg-white overflow-y-auto relative">
                  <div className="relative h-48 md:h-64 shrink-0">
                    {/* Desktop: Image */}
                    <img
                      src={selectedStore.image}
                      className="hidden md:block w-full h-full object-cover"
                      alt="Store Front"
                    />
                    <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black/60 to-transparent items-end p-6">
                      <img src={selectedStore.logo} className="h-12 bg-white/90 p-2 rounded-lg backdrop-blur-sm" alt="logo" />
                    </div>

                    {/* Mobile: Map */}
                    <div className="md:hidden w-full h-full relative z-0">
                      <MapContainer 
                        center={[selectedStore.lat, selectedStore.lng]} 
                        zoom={15} 
                        scrollWheelZoom={false} 
                        className="h-full w-full"
                        key={`mobile-${selectedStore.id}`}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker 
                          position={[selectedStore.lat, selectedStore.lng]} 
                          icon={createStoreIcon(markerLogo)}
                        />
                      </MapContainer>
                    </div>
                    <button
                      onClick={() => setSelectedStore(null)}
                      className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-colors"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>

                  <div className="p-6 md:p-8 flex-1">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedStore.name}</h2>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-sm font-medium">{t('laundryPage.nowOpen')}</span>
                      <span className="text-slate-400 text-sm">• {t('laundryPage.24hours')}</span>
                    </div>

                    <div className="space-y-4">
                      {selectedStore.isCombo ? (
                        <div className="flex items-center p-3 bg-blue-50 rounded-xl">
                           <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 text-xl">🫧</div>
                           <div>
                             <p className="text-sm text-slate-500 font-medium">{t('laundryPage.comboMachine')}</p>
                             <p className="font-bold text-slate-800 text-lg">{selectedStore.washers} {t('laundryPage.washers')}</p>
                           </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center p-3 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-4 text-xl">💧</div>
                            <div>
                              <p className="text-sm text-slate-500 font-medium">{t('laundryPage.washerMachine')}</p>
                              <p className="font-bold text-slate-800 text-lg">{selectedStore.washers} {t('laundryPage.washers')}</p>
                            </div>
                          </div>

                          <div className="flex items-center p-3 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-4 text-xl">🔥</div>
                            <div>
                              <p className="text-sm text-slate-500 font-medium">{t('laundryPage.dryerMachine')}</p>
                              <p className="font-bold text-slate-800 text-lg">{selectedStore.dryers} {t('laundryPage.dryers')}</p>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex items-center p-3 bg-slate-50 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mr-4 text-xl">⚖️</div>
                        <div>
                          <p className="text-sm text-slate-500 font-medium">{t('laundryPage.maxWeight')}</p>
                          <p className="font-bold text-slate-800 text-lg">{selectedStore.maxKg} KG</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100">
                        <div className="flex justify-between items-end">
                          <span className="text-slate-500 font-medium">{t('laundryPage.startingPrice')}</span>
                          <span className="text-3xl font-extrabold text-[#ff2500]">฿{selectedStore.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: MAP */}
                <div className="hidden md:block md:w-7/12 bg-slate-100 relative min-h-[300px] md:min-h-0">
                  {/* Custom Map UI Wrapper */}
                  <div className="absolute inset-0 w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-700">
                    <MapContainer 
                      center={[selectedStore.lat, selectedStore.lng]} 
                      zoom={15} 
                      scrollWheelZoom={false} 
                      className="h-full w-full"
                      key={selectedStore.id} // Add key to force re-render when store changes
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker 
                        position={[selectedStore.lat, selectedStore.lng]} 
                        icon={createStoreIcon(markerLogo)}
                      />
                    </MapContainer>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs shadow-lg text-slate-500 border border-slate-200">
                    📍 {selectedStore.lat.toFixed(4)}, {selectedStore.lng.toFixed(4)}
                  </div>
                </div>

              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LaundryPage;
