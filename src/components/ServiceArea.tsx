import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import sisaket from "../assets/areas/sisaket.png";
import ubon from "../assets/areas/ubon.jpg";
import khonkaen from "../assets/areas/khonkaen.jpg";
import kalasin from "../assets/areas/kalasin2.png";
import roiet from "../assets/areas/roiet.jpeg";
import mahasarakham from "../assets/areas/mahasarakham.jpg";

/* ================= DATA ================= */

const activeArea = {
  name: "ศรีสะเกษ",
  image: sisaket,
  description: "ครอบคลุมพื้นที่ อ.เมือง และจุดสำคัญทั่วจังหวัด",
  landmark: "หอคอยศรีลำดวนเฉลิมพระเกียรติ",
};

const upcomingAreas = [
  { name: "อุบลราชธานี", image: ubon, landmark: "วัดสิรินธรวรารามภูพร้าว" },
  { name: "ขอนแก่น", image: khonkaen, landmark: "พระมหาธาตุแก่นนคร" },
  { name: "กาฬสินธุ์", image: kalasin, landmark: "พิพิธภัณฑ์สิรินธร" },
  { name: "ร้อยเอ็ด", image: roiet, landmark: "บึงพลาญชัย" },
  { name: "มหาสารคาม", image: mahasarakham, landmark: "พระธาตุนาดูน" },
];

/* ================= COMPONENT ================= */

const ServiceArea = () => {
  const [selectedArea, setSelectedArea] = useState<{
    name: string;
    image: string;
    landmark?: string;
  } | null>(null);

  // Duplicate for infinite loop illusion
  const loopAreas = [...upcomingAreas, ...upcomingAreas, ...upcomingAreas];

  return (
    <section className="py-24 bg-[#F8F9FB] relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-[#ff2500]/5 to-[#fe3d00]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#ff2500] font-bold tracking-widest uppercase text-sm mb-3 block"
          >
            Service Area
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6"
          >
            พื้นที่ให้บริการ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2500] to-[#fe3d00]">SENd</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 max-w-2xl mx-auto text-lg font-light"
          >
            เราเริ่มต้นที่ศรีสะเกษ และกำลังขยายพื้นที่อย่างต่อเนื่อง<br className="hidden md:block"/>เพื่อส่งมอบความสะดวกสบายไปให้ถึงมือคุณ
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* ACTIVE AREA (HERO CARD) */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-full min-h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer"
              onClick={() => setSelectedArea(activeArea)}
            >
              <img
                src={activeArea.image}
                alt={activeArea.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Glass Overlay */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="absolute top-6 left-6">
                   <div className="bg-white/10 backdrop-blur-md border border-white/20 text-black-500 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      เปิดให้บริการแล้ว
                   </div>
                </div>

                <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="text-4xl font-bold text-white mb-2">{activeArea.name}</h3>
                  <p className="text-slate-200 text-lg mb-4 opacity-90">{activeArea.description}</p>
                  <div className="inline-flex items-center gap-2 text-white font-semibold border-b border-white/30 pb-0.5 group-hover:border-white transition-colors">
                    ดูรายละเอียด <span className="text-xl">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* UPCOMING AREAS (CAROUSEL) */}
          <div className="lg:col-span-7 flex flex-col justify-center relative">
            <div className="mb-6 flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-[#ff2500] rounded-full block"></span>
                เร็ว ๆ นี้ (Coming Soon)
              </h3>
            </div>

            <div className="relative overflow-hidden -mx-4 px-4 py-4">
              <style>{`
                @keyframes scroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-33.333%); }
                }
                .animate-scroll {
                  animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div className="flex gap-6 w-max animate-scroll">
                {loopAreas.map((area, index) => (
                  <motion.div
                    key={`${area.name}-${index}`}
                    onClick={() => setSelectedArea(area)}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="relative w-[240px] aspect-[4/3] rounded-3xl overflow-hidden shadow-lg cursor-pointer flex-shrink-0 group"
                  >
                    <img
                      src={area.image}
                      alt={area.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/50 backdrop-blur-md text-white/90 text-[10px] px-3 py-1 rounded-full border border-white/10">
                        COMING SOON
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <h4 className="text-2xl font-bold text-white mb-1">{area.name}</h4>
                      <div className="h-1 w-12 bg-[#ff2500] rounded-full group-hover:w-full transition-all duration-500" />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Fade Edges */}
              <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#F8F9FB] to-transparent pointer-events-none z-10" />
              <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-[#F8F9FB] to-transparent pointer-events-none z-10" />
            </div>
          </div>

        </div>
      </div>

      {/* ================= POPUP MODAL ================= */}
      <AnimatePresence>
        {selectedArea && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedArea(null)} />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-[2rem] overflow-hidden shadow-2xl z-10"
            >
              <div className="relative h-[400px]">
                <img
                  src={selectedArea.image}
                  alt={selectedArea.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <button
                  onClick={() => setSelectedArea(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>

                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-4xl font-bold mb-2">{selectedArea.name}</h3>
                  <div className="flex justify-between items-center text-white/80 text-lg">
                    <span>
                      {selectedArea.name === "ศรีสะเกษ" 
                        ? "พร้อมให้บริการเต็มรูปแบบ สั่งเลย!" 
                        : "อดใจรออีกนิด เรากำลังรีบไปหาคุณ"}
                    </span>
                    <span className="text-right">{selectedArea.landmark}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ServiceArea;
