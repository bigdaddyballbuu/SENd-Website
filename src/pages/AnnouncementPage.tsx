import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   TYPES
========================= */
type AnnouncementType = "promo" | "notice" | "system" | "urgent";

interface Announcement {
  id: number | string;
  title: string;
  description: string;
  type: AnnouncementType;
  active: boolean;
  created_at: string;
  image_url?: string;
  code?: string;
  source: "sheet" | "app";
}

/* =========================
   CONFIG
========================= */
/* =========================
   GOOGLE SHEETS SETUP INSTRUCTIONS
   =========================
   1. Create a new Google Sheet.
   2. Add the following columns in Row 1 (exact spelling):
      id | title | description | type | active | created_at | image_url | code
   3. Fill in your data:
      - id: Unique ID (e.g., 1, 2, promo-1)
      - type: promo | notice | system | urgent
      - active: TRUE or FALSE
      - date columns: YYYY-MM-DD
   4. Go to File > Share > Publish to web.
   5. Select "Sheet1" (or your sheet name) and format "Comma-separated values (.csv)".
   6. Click Publish and copy the link.
   7. Paste the link below in GOOGLE_SHEET_CSV_URL.
========================= */

//const GOOGLE_SHEET_CSV_URL = import.meta.env.VITE_GOOGLE_SHEET_CSV_URL;  .env


// ⬇️⬇️⬇️ ใส่ลิ้งค์ Google Sheet (CSV) ที่นี่ได้เลยครับ ⬇️⬇️⬇️
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRN-8ANTJTDE9iz5IkwO5bNc7DUJfWhBGOXRtnZglZybSA_Urcdlavj_xQEvHJu4Sc7zTTqJgKqpmow/pub?gid=0&single=true&output=csv"; // <--- ใส่ลิ้งค์ตรงนี้ 

/* =========================
   CSV PARSER HELPER
========================= */
const parseCSV = (text: string): any[] => {
  // Normalize line endings
  const source = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const headers: string[] = [];
  const result: any[] = [];
  
  let cursor = 0;
  let inQuote = false;
  let currentValue = '';

  // Extract headers first
  while (cursor < source.length) {
    const char = source[cursor];
    
    if (inQuote) {
      if (char === '"') {
        if (source[cursor + 1] === '"') {
          currentValue += '"'; // updates "" to "
          cursor++;
        } else {
          inQuote = false;
        }
      } else {
        currentValue += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ',') {
        headers.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
      } else if (char === '\n') {
        headers.push(currentValue.trim().replace(/^"|"$/g, ''));
        currentValue = '';
        cursor++;
        break; // Headers done
      } else {
        currentValue += char;
      }
    }
    cursor++;
  }

  // Parse Rows
  let currentValues: string[] = [];
  currentValue = '';
  inQuote = false;

  while (cursor < source.length) {
    const char = source[cursor];

    if (inQuote) {
      if (char === '"') {
        if (source[cursor + 1] === '"') {
          currentValue += '"';
          cursor++;
        } else {
          inQuote = false;
        }
      } else {
        currentValue += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ',') {
        currentValues.push(currentValue);
        currentValue = '';
      } else if (char === '\n') {
        currentValues.push(currentValue);
        
        // Assemble Row
        if (currentValues.length > 1 || currentValues[0] !== '') { // Skip empty lines
             const obj: any = {};
             headers.forEach((h, i) => {
                 let val = currentValues[i] || '';
                 // Cleanup potential wrapping quotes if parser didn't catch them all or specific CSV formatting
                 if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
                     val = val.slice(1, -1).replace(/""/g, '"');
                 } else {
                     val = val.trim();
                 }

                 if (h === 'active') obj[h] = (val.toLowerCase() === 'true');
                 else obj[h] = val;
             });
             result.push(obj);
        }

        currentValue = '';
        currentValues = [];
      } else {
        currentValue += char;
      }
    }
    cursor++;
  }
  
  // Push last row if exists
  if (currentValues.length > 0 || currentValue !== '') {
      currentValues.push(currentValue);
      const obj: any = {};
      headers.forEach((h, i) => {
             let val = currentValues[i] || '';
             if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
                 val = val.slice(1, -1).replace(/""/g, '"');
             } else {
                 val = val.trim();
             }
             if (h === 'active') obj[h] = (val.toLowerCase() === 'true');
             else obj[h] = val;
      });
      result.push(obj);
  }

  return result;
};


const typeConfig: Record<AnnouncementType, { label: string; bg: string; text: string; icon: string }> = {
  promo: { 
      label: "PROMOTION", 
      bg: "bg-red-50", 
      text: "text-[#ff2500]",
      icon: "🔥"
  },
  notice: { 
      label: "NEWS", 
      bg: "bg-orange-50", 
      text: "text-orange-600",
      icon: "📰"
  },
  system: { 
      label: "APP UPDATE", 
      bg: "bg-blue-50", 
      text: "text-blue-600",
      icon: "📲"
  },
  urgent: {
      label: "URGENT",
      bg: "bg-red-600",
      text: "text-white",
      icon: "🚨"
  }
};

/* =========================
   COMPONENT
========================= */
const AnnouncementPage = () => {
  const [promos, setPromos] = useState<Announcement[]>([]);
  const [prNews, setPrNews] = useState<Announcement[]>([]);
  const [appUpdates, setAppUpdates] = useState<Announcement[]>([]);
  const [urgentNews, setUrgentNews] = useState<Announcement[]>([]);

  const [selected, setSelected] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    const fetchData = async () => {
      // Fetch ALL data from Google Sheets
      const fetchSheet = async () => {
        try {
           // Check if URL is placeholder
           if (GOOGLE_SHEET_CSV_URL.includes("xxxxxxxx")) {
               console.warn("Using Mock Data: Google Sheet URL is not set.");
               throw new Error("Using Mock Data");
           }

           const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${new Date().getTime()}`);
           const text = await response.text();
           const data = parseCSV(text);
           
           // Validate and map data (ensure type safety)
           return data.map((item: any) => ({
               id: item.id || Math.random().toString(),
               title: item.title || "No Title",
               description: item.description || "",
               type: (["promo", "notice", "system", "urgent"].includes(item.type) ? item.type : "notice") as AnnouncementType,
               active: item.active === true || item.active === "TRUE",
               created_at: item.created_at || new Date().toISOString(),
               image_url: item.image_url || "",
               code: item.code || "",
               source: "sheet" as const
           })).filter(item => item.active); // Filter active only

        } catch (e) {
           console.log("Fallback to mock data...");
           // MOCK DATA SIMULATING SHEET ROWS
           // Columns: id, title, description, type, active, created_at, image_url
           const sheetRows: Announcement[] = [
               // --- URGENT ---
               {
                   id: "row-0",
                   title: "ประกาศ: ปิดปรับปรุงระบบซักด่วน (ตัวอย่าง)",
                   description: "นี่คือข้อมูลตัวอย่าง (Mock Data) เนื่องจากยังไม่ได้ใส่ลิงก์ Google Sheet \nหากคุณใส่ลิงก์แล้ว ข้อมูลนี้จะหายไปและแสดงข้อมูลจริงแทนครับ",
                   type: "urgent",
                   active: true,
                   created_at: new Date().toISOString(),
                   image_url: "",
                   source: "sheet"
               },
               // --- PROMOS ---
               {
                   id: "row-1",
                   title: "โปรฯ ซักฟรี 100 บาท!",
                   description: "เพียงสมัครสมาชิกใหม่วันนี้ รับเลยเครดิตซักฟรี 100 บาท ทันที \n*เงื่อนไขเป็นไปตามที่บริษัทกำหนด",
                   type: "promo",
                   active: true,
                   created_at: new Date().toISOString(),
                   image_url: "https://images.unsplash.com/photo-1545173168-9f1947eebb8f?q=80&w=2071&auto=format&fit=crop",
                   code: "SEND100",
                   source: "sheet"
               },
               {
                   id: "row-2",
                   title: "ลด 50% ทุกวันพุธ",
                   description: "Member Day! ลดค่าบริการซัก-อบ 50% ทุกออเดอร์ไม่มีขั้นต่ำ เฉพาะวันพุธเท่านั้น",
                   type: "promo",
                   active: true,
                   created_at: new Date().toISOString(),
                   image_url: "https://images.unsplash.com/photo-1517677208171-0bc5e25bb396?q=80&w=2070&auto=format&fit=crop",
                   source: "sheet"
               },
               // --- PR NEWS ---
               {
                   id: "row-3",
                   title: "เปิดสาขาใหม่! ศรีสะเกษ",
                   description: "ชาวศรีสะเกษเตรียมตัวให้พร้อม พบกับ SENd สาขาใหม่ใจกลางเมือง ใกล้ตึกสุนีย์ พร้อมโปรโมชั่นเปิดร้านเพียบ!",
                   type: "notice",
                   active: true,
                   created_at: "2024-12-25T00:00:00Z",
                   image_url: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2070&auto=format&fit=crop",
                   source: "sheet"
               },
               {
                   id: "row-4",
                   title: "ร่วมมือกับ LaundryBar",
                   description: "SENd จับมือ LaundryBar ขยายเครือข่ายร้านซักมาตรฐานโลกกว่า 50 สาขา เพื่อรองรับความต้องการที่มากขึ้น",
                   type: "notice",
                   active: true,
                   created_at: "2024-12-20T00:00:00Z",
                   image_url: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop",
                   source: "sheet"
               },
               // --- APP UPDATES (SYSTEM) ---
               {
                   id: "row-5",
                   title: "อัปเดตเวอร์ชั่น 1.2.0",
                   description: "🎉 สิ่งใหม่ในเวอร์ชั่นนี้:\n- ⚡ รองรับ Dark Mode เต็มรูปแบบ\n- 🚀 เพิ่มความเร็วในการโหลดแผนที่ 50%\n- 🐛 แก้ไขบั๊กการแจ้งเตือน",
                   type: "system",
                   active: true,
                   created_at: "2024-12-28T00:00:00Z",
                   image_url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop",
                   source: "sheet"
               },
               {
                   id: "row-6",
                   title: "แจ้งปิดปรับปรุงเซิร์ฟเวอร์",
                   description: "ระบบจะทำการปิดปรับปรุงชั่วคราวในวันที่ 1 ม.ค. 2025 เวลา 02:00 - 04:00 น. ขออภัยในความไม่สะดวกครับ",
                   type: "system",
                   active: true,
                   created_at: "2024-12-30T00:00:00Z",
                   image_url: "",
                   source: "sheet"
               }
           ];
           
           return sheetRows;
        }
      };

      // Fetch
      setLoading(true);
      await new Promise(r => setTimeout(r, 600)); // Fake loading
      const allData = await fetchSheet();

      // Filter by Type
      setPromos(allData.filter(d => d.type === 'promo'));
      setPrNews(allData.filter(d => d.type === 'notice'));
      setAppUpdates(allData.filter(d => d.type === 'system'));
      setUrgentNews(allData.filter(d => d.type === 'urgent'));

      setLoading(false);
    };

    fetchData();
  }, []);

  // UI Components helpers
  const SectionHeader = ({ icon, title, color = "text-slate-900" }: { icon: string, title: string, color?: string }) => (
    <div className="flex items-center gap-3 mb-8">
      <span className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xl">{icon}</span>
      <h2 className={`text-2xl font-bold ${color}`}>{title}</h2>
    </div>
  );

  return (
    <section className="min-h-screen bg-[#F8F9FB] pt-28 pb-20 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-orange-50/80 to-transparent -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ff2500]"></span>
              <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Campaigns & Updates</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              ศูนย์รวม <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2500] to-[#fe3d00]">ประกาศ</span>
            </h1>
          </motion.div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-12">
            <div className="flex gap-6 overflow-hidden">
              {[1, 2, 3].map(i => <div key={i} className="min-w-[300px] h-64 bg-white rounded-3xl border border-slate-100 animate-pulse" />)}
            </div>
            <div className="space-y-4">
              <div className="w-48 h-8 bg-slate-200 rounded-lg animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white rounded-3xl border border-slate-100 animate-pulse" />)}
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <AnimatePresence>

            {/* =========================================
                0. ประกาศด่วน (URGENT)
               ========================================= */}
            {urgentNews.length > 0 && (
                <div className="mb-12">
                     {urgentNews.map((item) => (
                         <motion.div
                            key={item.id}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="bg-red-50 border border-red-100 rounded-2xl p-4 md:p-6 mb-4 flex gap-4 items-start shadow-sm"
                         >
                                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 text-2xl animate-pulse">
                                    🚨
                                </div>
                                <div>
                                    <h3 className="text-red-600 font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-red-800/80 text-sm leading-relaxed">{item.description}</p>
                                </div>
                         </motion.div>
                     ))}
                </div>
            )}

            {/* =========================================
                1. ข่าวโปรโมชั่น (Horizontal Scroll)
               ========================================= */}
            <div className="mb-24">
              <SectionHeader icon="🔥" title="โปรโมชั่นจัดเต็ม" />

              <div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 scrollbar-hide snap-x">
                {promos.length === 0 && <div className="text-slate-400 px-6">ไม่มีโปรโมชั่นในขณะนี้</div>}

                {promos.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelected(item)}
                    className="snap-center shrink-0 w-[85vw] md:w-[400px] relative group cursor-pointer"
                  >
                    <div className="h-[250px] rounded-[2rem] overflow-hidden relative shadow-lg shadow-slate-200/50 group-hover:shadow-xl group-hover:shadow-red-500/20 transition-all duration-500">
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={item.title}
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-white/90 backdrop-blur text-[#ff2500] text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">
                          LIMITED OFFER
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
                        <h3 className="text-white text-xl font-bold leading-tight mb-1">{item.title}</h3>
                        <p className="text-white/80 text-sm line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* =========================================
                2. ข่าวประชาสัมพันธ์ (Grid)
               ========================================= */}
            <div className="mb-24">
              <SectionHeader icon="📢" title="ข่าวประชาสัมพันธ์" />

              <div className="grid grid-cols-1 gap-6">
                {prNews.length === 0 && (
                  <div className="col-span-full py-10 text-center bg-white rounded-3xl border border-slate-100 border-dashed text-slate-400">
                    ยังไม่มีข่าวประชาสัมพันธ์
                  </div>
                )}

                {prNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                    onClick={() => setSelected(item)}
                    className="bg-white p-5 rounded-3xl border border-slate-100 cursor-pointer hover:border-orange-200 hover:shadow-lg transition-all group flex gap-4 items-start"
                  >
                    <div className="w-20 h-20 shrink-0 rounded-2xl bg-slate-50 overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">{typeConfig[item.type].icon}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {new Date(item.created_at).toLocaleDateString("th-TH")}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 leading-tight mb-1 truncate group-hover:text-[#ff2500] transition-colors">{item.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* =========================================
                3. ข่าวการอัปเดตแอป (List / Cards)
               ========================================= */}
            <div className="mb-20">
              <SectionHeader icon="📲" title="อัปเดตแอปพลิเคชัน" color="text-blue-600" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {appUpdates.length === 0 && (
                  <div className="col-span-full py-10 text-center bg-blue-50/50 rounded-3xl border border-blue-100/50 border-dashed text-blue-400">
                    ยังไม่มีประวัติการอัปเดต
                  </div>
                )}

                {appUpdates.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.05) }}
                    onClick={() => setSelected(item)}
                    className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50 cursor-pointer hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all group flex flex-col sm:flex-row gap-5"
                  >
                    <div className="w-full sm:w-32 h-32 shrink-0 rounded-2xl bg-white overflow-hidden relative shadow-sm">
                      {item.image_url ? (
                        <img src={item.image_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">{typeConfig[item.type].icon}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded">
                          VERSION UPDATE
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.created_at).toLocaleDateString("th-TH")}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4">{item.description}</p>
                      <div className="flex items-center text-xs font-bold text-blue-600 group-hover:underline decoration-blue-200 underline-offset-4">
                        อ่านรายละเอียดเวอร์ชั่นนี้ ➜
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </AnimatePresence>
        )}
      </div>

      {/* MODAL (Reused) */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelected(null)} 
                className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/80 hover:bg-white text-slate-900 rounded-full flex items-center justify-center shadow-lg backdrop-blur-md transition-all border border-slate-100"
              >
                ✕
              </button>

              {/* IMAGE COLUMN (Left / Top) */}
              <div className="w-full md:w-1/2 bg-slate-100 relative min-h-[300px] md:min-h-full overflow-y-auto custom-scrollbar">
                {selected.image_url ? (
                  <img src={selected.image_url} className="w-full h-auto block" alt="" />
                ) : (
                  <div className="w-full h-full min-h-[300px] flex items-center justify-center text-slate-300">
                      <span className="text-8xl grayscale opacity-50">{typeConfig[selected.type].icon}</span>
                  </div>
                )}
              </div>

              {/* CONTENT COLUMN (Right / Bottom) */}
              <div className="w-full md:w-1/2 p-8 md:p-10 overflow-y-auto custom-scrollbar bg-white flex flex-col max-h-[90vh]">
                 <div className="mb-6 border-b border-slate-100 pb-6">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg inline-block shadow-sm ${selected.type === 'urgent' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {typeConfig[selected.type].label}
                        </span>
                        <span className="text-xs text-slate-400 font-medium tracking-wide">
                            {new Date(selected.created_at).toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-extrabold leading-tight text-slate-900">
                        {selected.title}
                    </h2>
                 </div>

                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-line flex-grow">
                  {selected.description}
                </div>

                {selected.type === 'promo' && selected.code && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 text-center">
                      <span className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-3 block">Code ส่วนลดพิเศษ</span>
                      <div className="flex items-stretch justify-center gap-2 max-w-sm mx-auto">
                         <div className="flex-1 bg-white border-2 border-dashed border-orange-200 rounded-xl py-3 px-4 font-mono text-2xl font-black text-[#ff2500] tracking-widest select-all uppercase">
                            {selected.code}
                         </div>
                         <button 
                           onClick={() => { navigator.clipboard.writeText(selected.code || ""); }}
                           className="bg-[#ff2500] text-white px-5 rounded-xl font-bold hover:bg-[#d92000] transition active:scale-95 shadow-lg shadow-orange-500/20"
                         >
                            COPY
                         </button>
                      </div>
                    </div>
                  </div>
                )}

                {selected.type === 'system' && (
                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <p className="text-center text-slate-400 text-sm mb-4 font-medium">ดาวน์โหลดและอัปเดตได้ที่</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* iOS - App Store */}
                      <a href="https://apps.apple.com/us/app/send-delivery/id6474961079" className="flex items-center justify-center gap-3 w-full py-3.5 bg-black text-white rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_%28iOS%29.svg" 
                          alt="App Store" 
                          className="w-8 h-8 object-contain"
                        />
                        <div className="text-left">
                          <div className="text-[10px] leading-none opacity-80">ดาวน์โหลดบน</div>
                          <div className="font-bold text-lg leading-tight">App Store</div>
                        </div>
                      </a>

                      {/* Android - Google Play */}
                      <a href="https://play.google.com/store/apps/details?id=com.sendcompany.send_delivery" className="flex items-center justify-center gap-3 w-full py-3.5 bg-black text-white rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200 group">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" 
                          alt="Google Play" 
                          className="w-8 h-8 object-contain"
                        />
                        <div className="text-left">
                           <div className="text-[10px] leading-none opacity-80 group-hover:text-white/90">ดาวน์โหลดบน</div>
                           <div className="font-bold text-lg leading-tight">Google Play</div>
                        </div>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default AnnouncementPage;
