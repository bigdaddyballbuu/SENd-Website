import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";
import scooterImage from "../assets/hero/bike.png";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-red-50/30 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating bubbles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#ff2500]/5 border border-[#ff2500]/10"
            style={{
              width: Math.random() * 80 + 40,
              height: Math.random() * 80 + 40,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Road + Scooter animation at bottom */}
      <div className="absolute inset-x-0 bottom-0 overflow-hidden pointer-events-none h-24 flex items-end">
        <div className="w-full h-12 bg-slate-700 relative flex items-center">
          <div className="absolute top-0 w-full h-[2px] bg-slate-600" />
          <div className="absolute bottom-0 w-full h-[3px] bg-slate-800" />
          <div className="w-full flex justify-between gap-12 animate-road-move px-4">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-10 h-1.5 bg-white/30 rounded-full shrink-0" />
            ))}
          </div>
        </div>

        <motion.div
          className="absolute bottom-2 w-24 z-10"
          initial={{ x: "-10%" }}
          animate={{
            x: "120vw",
            y: [0, -2, 1, -1, 0],
            rotate: [0, -1, 1, 0],
          }}
          transition={{
            x: { duration: 14, repeat: Infinity, ease: "linear" },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" },
            rotate: { duration: 1.2, repeat: Infinity, ease: "linear" },
          }}
        >
          <img src={scooterImage} alt="SENd Scooter" className="w-full h-auto drop-shadow-md" />
        </motion.div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
        >
          <h1 className="text-[140px] md:text-[180px] font-black leading-none tracking-tighter bg-gradient-to-br from-[#ff2500] via-[#ff4d2a] to-[#ff8c00] bg-clip-text text-transparent drop-shadow-sm select-none">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Search className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              ไม่พบหน้าที่คุณต้องการ
            </h2>
          </div>
          <p className="text-slate-500 mb-10 text-sm md:text-base leading-relaxed">
            หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่เคยมีอยู่<br className="hidden md:block" />
            ลองกลับไปหน้าหลักหรือตรวจสอบ URL อีกครั้ง
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#ff2500] hover:bg-[#d62000] text-white font-semibold rounded-xl shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-200/70 transition-all hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            กลับหน้าหลัก
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            ย้อนกลับ
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
