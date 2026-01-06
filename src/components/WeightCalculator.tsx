import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import washerImg from "../assets/machines/washer4.jpg";

/* ---------- ICONS (Simple SVGs) ---------- */
const ShirtIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.5 2H9.5L9 4H4V9C4 9 5 9.5 5 11C5 12.5 4 13 4 13V21H20V13C20 13 19 12.5 19 11C19 9.5 20 9 20 9V4H15L14.5 2Z" />
  </svg>
);

const PantIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L3 22H10V12H14V22H21L18 2H6Z" />
  </svg>
);

const ShortsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 2L4 16H10V10H14V16H20L18 2H6Z" />
  </svg>
);

const TowelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V7M4 7H20M4 7V5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V7M9 3V7M15 3V7" />
  </svg>
);

const BedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10M3 10H21M3 10L5 6H19L21 10M7 10V16M17 10V16" />
  </svg>
);

const WasherIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 stroke-current">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6H20M4 6V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V6M4 6V5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5V6M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17ZM17 5H17.01" />
  </svg>
);

/* ---------- COMPONENT ---------- */

const WeightCalculator = () => {
  const [shirts, setShirts] = useState(0);
  const [pants, setPants] = useState(0);
  const [shorts, setShorts] = useState(0);
  const [towels, setTowels] = useState(0);
  const [bedsheets, setBedsheets] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  // Calculate real-time
  useEffect(() => {
    const weight =
      shirts * 0.3 +
      pants * 0.5 +
      shorts * 0.3 +
      towels * 0.7 +
      bedsheets * 1.5;
    setTotalWeight(weight);
  }, [shirts, pants, shorts, towels, bedsheets]);

  const reset = () => {
    setShirts(0);
    setPants(0);
    setShorts(0);
    setTowels(0);
    setBedsheets(0);
  };

  const getRecommendation = (w: number) => {
    if (w === 0) return "เลือกจำนวนผ้า";
    if (w <= 10) return "เครื่องซัก 9 - 10 KG";
    if (w <= 14) return "เครื่องซัก 14 KG";
    if (w <= 20) return "เครื่องซัก 18 - 20 KG";
    if (w <= 28) return "เครื่องซัก 28 KG";
    if (w <= 35) return "เครื่องซัก+อบ(2in1) 35 KG";
    return "แนะนำแบ่งซัก 2 ตะกร้า";
  };

  return (
    <section className="py-12 bg-[#F8F9FB] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-[#ff2500]/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT: CALCULATOR CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-slate-100 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-800">คำนวณน้ำหนักผ้า</h2>
                <p className="text-slate-500 text-sm mt-0.5">กะปริมาณผ้าของคุณได้ง่ายๆ</p>
              </div>
              <button 
                onClick={reset}
                className="text-xs text-slate-400 hover:text-[#ff2500] font-medium transition-colors px-3 py-1 rounded-full hover:bg-red-50"
              >
                รีเซ็ต
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-3 mb-6">
              <Stepper 
                label="เสื้อยืด / เสื้อเชิ้ต" 
                sublabel="~0.3 kg"
                icon={<ShirtIcon />} 
                value={shirts} 
                onChange={setShirts} 
                color="text-blue-500"
                bgColor="bg-blue-50"
              />
              <Stepper 
                label="กางเกงขายาว" 
                sublabel="~0.5 kg"
                icon={<PantIcon />} 
                value={pants} 
                onChange={setPants} 
                color="text-indigo-500"
                bgColor="bg-indigo-50"
              />
              <Stepper 
                label="กางเกงขาสั้น" 
                sublabel="~0.3 kg"
                icon={<ShortsIcon />} 
                value={shorts} 
                onChange={setShorts} 
                color="text-teal-500"
                bgColor="bg-teal-50"
              />
              <Stepper 
                label="ผ้าขนหนู" 
                sublabel="~0.7 kg"
                icon={<TowelIcon />} 
                value={towels} 
                onChange={setTowels} 
                color="text-orange-500"
                bgColor="bg-orange-50"
              />
              <Stepper 
                label="ผ้าปูที่นอน" 
                sublabel="~1.5 kg"
                icon={<BedIcon />} 
                value={bedsheets} 
                onChange={setBedsheets} 
                color="text-purple-500"
                bgColor="bg-purple-50"
              />
            </div>

            {/* Total Display */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff2500] rounded-full blur-[60px] opacity-20" />
              
              <div className="flex items-start justify-between relative z-10">
                <div>
                  <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">น้ำหนักรวม</div>
                  <div className="text-4xl font-extrabold tracking-tight">
                    {totalWeight.toFixed(1)} <span className="text-lg text-slate-500 font-medium">KG</span>
                  </div>
                </div>
                
                {/* Simple Meter */}
                <div className="w-12 h-12 relative flex items-center justify-center">
                   <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="text-[#ff2500] transition-all duration-500 ease-out"
                        strokeDasharray={`${Math.min((totalWeight / 28) * 100, 100)}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                   </svg>
                   <div className="absolute text-[8px] font-bold text-slate-400">
                     {Math.min(Math.round((totalWeight / 28) * 100), 100)}%
                   </div>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="relative z-10 mt-4 pt-4 border-t border-white/10">
                 <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${totalWeight > 0 ? 'bg-[#ff2500] text-white' : 'bg-slate-800 text-slate-500'}`}>
                      <WasherIcon />
                   </div>
                   <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">ขนาดเครื่องที่แนะนำ</div>
                      <div className="text-lg font-bold text-white leading-tight">
                        {getRecommendation(totalWeight)}
                      </div>
                   </div>
                 </div>
              </div>
            </div>

          </motion.div>

          {/* RIGHT: IMAGE / DECOR */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 hidden lg:flex flex-col items-center justify-center text-center relative"
          >
            <div className="relative w-full max-w-none aspect-square">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ff2500]/10 to-orange-100 rounded-full blur-3xl animate-pulse" />
              <img 
                src={washerImg} 
                alt="Washing Machine" 
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="-mt-8 max-w-lg">
              <h3 className="text-xl font-bold text-slate-800 mb-2">เลือกเครื่องซักผ้าให้เหมาะ</h3>
              <p className="text-sm text-slate-500">
                การใส่น้ำหนักผ้าให้พอดีกับขนาดเครื่อง จะช่วยให้ผ้าสะอาดขึ้นและถนอมเนื้อผ้า
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

/* ---------- STEPPER COMPONENT ---------- */
interface StepperProps {
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  value: number;
  onChange: (val: number) => void;
  color: string;
  bgColor: string;
}

const Stepper = ({ label, sublabel, icon, value, onChange, color, bgColor }: StepperProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors group">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${bgColor} ${color} flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <div className="font-bold text-slate-700 text-sm">{label}</div>
          <div className="text-[10px] text-slate-400 font-medium">{sublabel}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border border-slate-100">
        <button 
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-[#ff2500] hover:bg-red-50 transition-colors disabled:opacity-30"
          disabled={value <= 0}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        
        <input
          type="number"
          min="0"
          value={value === 0 ? "" : value}
          onChange={(e) => {
            const val = e.target.value === "" ? 0 : parseInt(e.target.value);
            if (!isNaN(val) && val >= 0) onChange(val);
          }}
          className="w-12 text-center font-bold text-slate-800 text-base outline-none bg-transparent appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="0"
        />
        
        <button 
          onClick={() => onChange(value + 1)}
          className="w-6 h-6 rounded-md flex items-center justify-center bg-[#ff2500] text-white shadow-md shadow-[#ff2500]/30 hover:bg-[#d92000] active:scale-90 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default WeightCalculator;
