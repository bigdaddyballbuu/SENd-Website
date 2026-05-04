import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  PackageSearch,
  MessageSquareWarning,
  XCircle,
  FileText
} from "lucide-react";
import { supabase } from "../lib/supabase";
import SEO from "../components/SEO";
import bgImage from "../assets/images/washer.png";
import bikeImage from "../assets/hero/bike.png";

interface ClaimData {
  id: number;
  ticket_id: string;
  name: string;
  problem: string;
  status: string;
  created_at: string;
  branch: string;
  custom_estimate: string | null;
  rejection_reason: string | null;
}

const steps = [
  { id: "รับเรื่องแล้ว", label: "รับเรื่องแล้ว", icon: FileText, desc: "ระบบได้รับข้อมูลการแจ้งเคลมของคุณแล้ว" },
  { id: "กำลังตรวจสอบ", label: "กำลังตรวจสอบ", icon: PackageSearch, desc: "เจ้าหน้าที่กำลังตรวจสอบข้อมูลและหลักฐาน" },
  { id: "กำลังดำเนินการ", label: "กำลังดำเนินการ", icon: Clock, desc: "อยู่ระหว่างการดำเนินการแก้ไขปัญหา" },
  { id: "สำเร็จ", label: "สำเร็จ", icon: CheckCircle2, desc: "ดำเนินการแก้ไขปัญหาเรียบร้อยแล้ว" }
];

export default function TrackStatusPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ticketId, setTicketId] = useState(searchParams.get("id") || "");
  const [loading, setLoading] = useState(false);
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // If URL has ?id=SENd-..., automatically search
    if (searchParams.get("id")) {
      handleSearch(null, searchParams.get("id")!);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent | null, idToSearch: string = ticketId) => {
    if (e) e.preventDefault();
    if (!idToSearch.trim()) return;

    setLoading(true);
    setError("");
    setSearched(true);
    setClaimData(null);
    
    // Update URL without reloading
    setSearchParams({ id: idToSearch });

    try {
      const { data, error: fetchError } = await supabase
        .from('claims')
        .select('*')
        .eq('ticket_id', idToSearch.trim())
        .single();

      if (fetchError || !data) {
        setError("ไม่พบข้อมูลหมายเลขเคลมนี้ในระบบ โปรดตรวจสอบความถูกต้องอีกครั้ง");
      } else {
        setClaimData(data as ClaimData);
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ โปรดลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'ยกเลิก' || status === 'ปฏิเสธ') return -1;
    return steps.findIndex(s => s.id === status);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 pt-[62px] pb-40 overflow-hidden">
      <SEO title="ติดตามสถานะเคลม" description="ติดตามสถานะการเคลมสินค้า SENd แบบ Real-time ด้วย Ticket ID" path="/track" />
      {/* 🫧 Laundry Theme Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ff2500]/5 to-transparent z-10" />
        <img 
          src={bgImage} 
          alt="background" 
          className="absolute top-0 w-full object-cover opacity-[0.03] scale-105 blur-sm" 
        />
        
        {/* Glow Effects */}
        <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-bl from-blue-300/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#ff2500]/10 to-orange-300/20 rounded-full blur-3xl opacity-60"
        />

        {/* Rising Soap Bubbles */}
        {[...Array(15)].map((_, i) => (
            <motion.div
                key={`bubble-${i}`}
                className="absolute rounded-full border border-blue-200/60 bg-white/40 shadow-sm backdrop-blur-[1px]"
                style={{
                    width: Math.random() * 30 + 15 + 'px',
                    height: Math.random() * 30 + 15 + 'px',
                    left: `${Math.random() * 100}%`,
                    bottom: '-20%',
                    zIndex: 1,
                }}
                animate={{
                    y: -1200,
                    x: [0, Math.random() * 100 - 50, 0],
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1.1, 1.2],
                }}
                transition={{
                    duration: Math.random() * 15 + 20,
                    repeat: Infinity,
                    delay: Math.random() * 10,
                    ease: "linear",
                }}
            />
        ))}

        {/* Floating Water Droplets */}
        {[...Array(10)].map((_, i) => (
            <motion.div
                key={`droplet-${i}`}
                className="absolute w-3 h-3 bg-blue-400/40 rounded-full blur-[0.5px] shadow-sm"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    zIndex: 1,
                }}
                animate={{
                    y: [0, -30, 0],
                    opacity: [0.3, 0.7, 0.3],
                    scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                    duration: 3 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut",
                }}
            />
        ))}

        {/* Clean Sparkles */}
        {[...Array(8)].map((_, i) => (
            <motion.div
                key={`clean-sparkle-${i}`}
                className="absolute text-orange-400/50"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 80}%`,
                    zIndex: 1,
                }}
                animate={{
                    scale: [0, 1.3, 0],
                    rotate: [0, 45, 90],
                    opacity: [0, 0.8, 0],
                }}
                transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "easeInOut",
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </motion.div>
        ))}
        
        {/* Subtle Spinning Washer Elements */}
        <motion.div 
            className="absolute top-[15%] left-[8%] text-blue-200/20 pointer-events-none"
            style={{ zIndex: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
             <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v12" strokeDasharray="2 2" />
                <path d="M6 12h12" strokeDasharray="2 2" />
             </svg>
        </motion.div>
        
        <motion.div 
            className="absolute bottom-[20%] right-[5%] text-orange-200/20 pointer-events-none"
            style={{ zIndex: 0 }}
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
             <svg width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="8" />
                <path d="M12 2v2" /><path d="M12 20v2" />
                <path d="M22 12h-2" /><path d="M4 12H2" />
                <path d="M19.07 4.93L17.66 6.34" /><path d="M6.34 17.66L4.93 19.07" />
                <path d="M19.07 19.07L17.66 17.66" /><path d="M6.34 6.34L4.93 4.93" />
             </svg>
        </motion.div>
      </div>

      {/* Animated Scooter - Bumpy Ride on Realistic Road */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none z-0 h-44 flex items-end">
           {/* Realistic Road */}
           <div className="w-full h-12 bg-slate-700/80 relative flex items-center shadow-lg transform -skew-x-12 scale-110 origin-bottom opacity-80">
              <div className="absolute top-0 w-full h-[1px] bg-slate-600/80"></div>
              <div className="absolute bottom-0 w-full h-[2px] bg-slate-800/80"></div>
              <div className="w-full flex justify-between gap-12 animate-road-move px-4">
                  {[...Array(20)].map((_, i) => (
                      <div key={i} className="w-12 h-1 bg-white/60 rounded-full shrink-0"></div>
                  ))}
              </div>
           </div>
           
           <motion.div
              className="absolute bottom-2 left-0 w-32 md:w-44 z-10 opacity-90"
              initial={{ x: "-20vw" }}
              animate={{ 
                  x: ["-20vw", "120vw"],
                  y: [0, -2, 1, -1, 0, -3, 0],
                  rotate: [0, -1, 1, -1, 0.5, 0] 
              }}
              transition={{ 
                  x: {
                      duration: 18, 
                      repeat: Infinity, 
                      ease: "linear", 
                      delay: 0
                  },
                  y: {
                      duration: 2,
                      repeat: Infinity, 
                      ease: "easeInOut",
                      repeatType: "mirror"
                  },
                  rotate: {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                  }
              }}
           >
              <img src={bikeImage} alt="SENd Scooter" className="w-full h-auto drop-shadow-xl" />
              
              {/* Dust/Smoke Effect */}
              <div className="absolute bottom-2 -left-2 flex space-x-1">
                   <motion.div 
                      className="w-3 h-3 bg-slate-400/20 rounded-full blur-[2px]"
                      animate={{ opacity: [0, 0.5, 0], x: [-5, -15], y: [-5, -15], scale: [0.5, 1.5] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
                  />
                   <motion.div 
                      className="w-2 h-2 bg-slate-400/30 rounded-full blur-[1px]"
                      animate={{ opacity: [0, 0.6, 0], x: [-2, -10], y: [-2, -8], scale: [0.5, 1.2] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay: 0.3 }}
                  />
              </div>
           </motion.div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 lg:py-20">
        
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mx-auto mb-6 rotate-3"
          >
            <Search className="w-10 h-10 text-[#ff2500] -rotate-3" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            ติดตามสถานะการเคลม
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600"
          >
            ตรวจสอบความคืบหน้าของงานเคลมได้ง่ายๆ เพียงกรอกหมายเลข Ticket ของคุณ
          </motion.p>
        </div>

        {/* Search Box */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 max-w-xl mx-auto"
        >
          <form onSubmit={handleSearch} className="flex-1 flex items-center w-full">
            <div className="pl-4 pr-2">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="เช่น SENd-2026-1234"
              className="w-full py-4 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium"
              required
            />
            <button 
              type="submit"
              disabled={loading || !ticketId.trim()}
              className="bg-[#ff2500] hover:bg-[#d62000] text-white px-6 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "ค้นหา"}
            </button>
          </form>
        </motion.div>

        {/* Results Area */}
        <div className="mt-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="w-10 h-10 animate-spin text-[#ff2500] mb-4" />
                <p className="text-slate-500 font-medium">กำลังค้นหาข้อมูล...</p>
              </motion.div>
            )}

            {!loading && error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center"
              >
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">ไม่พบข้อมูล</h3>
                <p className="text-slate-600">{error}</p>
              </motion.div>
            )}

            {!loading && !error && !claimData && !searched && (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 opacity-50"
              >
                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">กรอกหมายเลข Ticket ด้านบนเพื่อดูสถานะ</p>
              </motion.div>
            )}

            {!loading && claimData && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
              >
                {/* Status Header */}
                <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff2500]/20 to-transparent opacity-50" />
                  <div className="relative z-10">
                    <p className="text-slate-400 font-medium mb-1">หมายเลข Ticket</p>
                    <h2 className="text-3xl font-mono font-bold text-white mb-6 tracking-wider">
                      {claimData.ticket_id}
                    </h2>
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium">
                      {claimData.status === 'สำเร็จ' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                      {claimData.status === 'ปฏิเสธ' && <XCircle className="w-5 h-5 text-red-400" />}
                      {claimData.status === 'ยกเลิก' && <AlertCircle className="w-5 h-5 text-slate-400" />}
                      {['รับเรื่องแล้ว', 'กำลังตรวจสอบ', 'กำลังดำเนินการ'].includes(claimData.status) && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                      สถานะปัจจุบัน: {claimData.status}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  
                  {/* Timeline */}
                  {claimData.status !== 'ปฏิเสธ' && claimData.status !== 'ยกเลิก' ? (
                    <div className="relative max-w-lg mx-auto py-8">
                      <div className="absolute left-8 top-12 bottom-12 w-0.5 bg-slate-100" />
                      
                      <div className="space-y-8">
                        {steps.map((step, index) => {
                          const currentIndex = getStepIndex(claimData.status);
                          const isCompleted = index <= currentIndex;
                          const isCurrent = index === currentIndex;
                          
                          return (
                            <div key={step.id} className="relative flex gap-6">
                              <div className={`
                                w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center relative z-10 transition-colors duration-500 shadow-sm
                                ${isCompleted 
                                  ? isCurrent ? 'bg-[#ff2500] text-white shadow-orange-500/30' : 'bg-emerald-500 text-white' 
                                  : 'bg-white border-2 border-slate-100 text-slate-300'
                                }
                              `}>
                                <step.icon className={`w-7 h-7 ${isCurrent ? 'animate-pulse' : ''}`} />
                              </div>
                              
                              <div className="pt-2">
                                <h4 className={`text-lg font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                                  {step.label}
                                </h4>
                                <p className={`text-sm mt-1 leading-relaxed ${isCurrent ? 'text-slate-600' : 'text-slate-400'}`}>
                                  {step.desc}
                                </p>
                                
                                {/* Show custom estimate if currently processing */}
                                {isCurrent && claimData.custom_estimate && (
                                  <div className="mt-3 bg-orange-50 text-orange-800 text-sm px-4 py-2.5 rounded-xl font-medium flex items-start gap-2 border border-orange-100 inline-flex">
                                    <MessageSquareWarning className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>ข้อความจากแอดมิน: {claimData.custom_estimate}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    // Rejected or Cancelled State
                    <div className="text-center py-12 max-w-md mx-auto">
                      <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">
                        คำขอถูก{claimData.status}
                      </h3>
                      {claimData.rejection_reason && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-left flex items-start gap-3 mt-6">
                          <MessageSquareWarning className="w-5 h-5 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-sm mb-1">เหตุผล:</p>
                            <p className="text-sm">{claimData.rejection_reason}</p>
                          </div>
                        </div>
                      )}
                      {claimData.status === 'ยกเลิก' && !claimData.rejection_reason && (
                        <p className="text-slate-600 mt-2">ลูกค้ายกเลิกคำขอนี้ด้วยตนเอง</p>
                      )}
                    </div>
                  )}

                  {/* Summary Box */}
                  <div className="mt-10 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-slate-400" />
                      ข้อมูลการแจ้งเคลม
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-slate-500 mb-1">สาขาที่เกิดเหตุ</p>
                        <p className="font-medium text-slate-900">{claimData.branch}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">ปัญหาที่พบ</p>
                        <p className="font-medium text-slate-900">{claimData.problem}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">วันที่แจ้งเรื่อง</p>
                        <p className="font-medium text-slate-900">
                          {new Date(claimData.created_at).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} น.
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">ชื่อผู้แจ้ง</p>
                        <p className="font-medium text-slate-900">{claimData.name}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
