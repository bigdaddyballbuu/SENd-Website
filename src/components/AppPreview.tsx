import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";

import phone1 from "../assets/phones/phone-1.png";
import phone2 from "../assets/phones/phone-2.png";
import phone3 from "../assets/phones/phone-3.png";
import phone4 from "../assets/phones/phone-4.png";

/* =======================
   DATA
======================= */

const phones = [phone1, phone2, phone3, phone4];

const slideThemes = [
  { bubble: "bg-red-300/70", wave: "#fca5a5", glow: "bg-red-500", accent: "#ff2500" },
  { bubble: "bg-blue-300/70", wave: "#93c5fd", glow: "bg-blue-500", accent: "#3b82f6" },
  { bubble: "bg-emerald-300/70", wave: "#6ee7b7", glow: "bg-emerald-500", accent: "#10b981" },
  { bubble: "bg-purple-300/70", wave: "#d8b4fe", glow: "bg-purple-500", accent: "#a855f7" },
];


const slideTexts = [
  {
    title: "รับผ้าถึงบ้าน",
    desc: "เรียกรถรับผ้าได้ทันที สะดวก รวดเร็ว ไม่ต้องออกจากบ้าน",
  },
  {
    title: "ติดตามสถานะเรียลไทม์",
    desc: "รู้ทุกขั้นตอน ตั้งแต่รับผ้า ซัก อบ จนถึงส่งคืน",
  },
  {
    title: "เลือกร้านใกล้คุณ",
    desc: "รวมร้านซักอบคุณภาพ เลือกได้ตามราคาและระยะทาง",
  },
  {
    title: "ส่งคืนตรงเวลา",
    desc: "ผ้าสะอาด หอม พร้อมใช้งาน ส่งตรงถึงมือคุณ",
  },
];



/* =======================
   WATER WAVES
======================= */

const WaterWaves = ({ color }: { color: string }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Wave 1 */}
      <motion.svg
        className="absolute bottom-0 left-0 w-[200%] h-[260px]"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        animate={{ x: [0, -200, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <path
          fill={color}
          fillOpacity="0.45"
          d="M0,192L48,176C96,160,192,128,288,144C384,160,480,224,576,240C672,256,768,224,864,202.7C960,181,1056,171,1152,160C1248,149,1344,139,1392,134.7L1440,128L1440,320L0,320Z"
        />
      </motion.svg>

      {/* Wave 2 */}
      <motion.svg
        className="absolute bottom-0 left-0 w-[200%] h-[300px] blur-sm"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        animate={{ x: [0, 150, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        <path
          fill={color}
          fillOpacity="0.3"
          d="M0,224L60,213.3C120,203,240,181,360,170.7C480,160,600,160,720,170.7C840,181,960,203,1080,197.3C1200,192,1320,160,1380,144L1440,128L1440,320L0,320Z"
        />
      </motion.svg>

      {/* Wave 3 */}
      <motion.svg
        className="absolute bottom-0 left-0 w-[200%] h-[340px] blur-md"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        animate={{ x: [0, -100, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        <path
          fill={color}
          fillOpacity="0.2"
          d="M0,256L80,240C160,224,320,192,480,176C640,160,800,160,960,176C1120,192,1280,224,1360,240L1440,256L1440,320L0,320Z"
        />
      </motion.svg>
    </div>
  );
};


/* =======================
   BUBBLE
======================= */

const Bubble = ({
  size,
  left,
  delay,
  color,
}: {
  size: number;
  left: string;
  delay: number;
  color: string;
}) => {
  return (
    <motion.div
      className={`absolute bottom-[-50px] rounded-full ${color} shadow-sm backdrop-blur-sm`}
      style={{ width: size, height: size, left }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: -600,
        opacity: [0, 0.6, 0],
      }}
      transition={{
        duration: 8 + Math.random() * 5, // Randomize duration slightly
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

/* =======================
   MAIN COMPONENT
======================= */

const AppPreview = () => {
  const [[current, direction], setCurrent] = useState<[number, number]>([0, 0]);



  const paginate = (newDirection: number) => {
    setCurrent(([prev]) => [
      (prev + newDirection + phones.length) % phones.length,
      newDirection,
    ]);
  };

    useEffect(() => {
      const timer = setInterval(() => paginate(1), 3200);
      return () => clearInterval(timer);
    }, [current]);


  return (
    <section className="relative py-10 overflow-hidden bg-transparent">
      <WaterWaves color={slideThemes[current].wave} />

      {/* 🫧 Bubbles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Bubble size={20} left="10%" delay={0} color={slideThemes[current].bubble} />
        <Bubble size={35} left="25%" delay={2} color={slideThemes[current].bubble} />
        <Bubble size={15} left="40%" delay={4} color={slideThemes[current].bubble} />
        <Bubble size={40} left="55%" delay={1} color={slideThemes[current].bubble} />
        <Bubble size={25} left="75%" delay={3} color={slideThemes[current].bubble} />
        <Bubble size={30} left="90%" delay={5} color={slideThemes[current].bubble} />
      </div>


      {/* Heading */}
      <div className="relative z-10 text-center mb-12 px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#FF3333] mb-4">
          SENd Service
        </h1>
        <p className="text-gray-600 max-w-[520px] mx-auto">
          บริการรับ–ส่งซักอบผ้า ที่ออกแบบมาเพื่อความสะดวกในทุกไลฟ์สไตล์
        </p>
      </div>

      {/* Slider */}
      <div className="relative z-10 flex justify-center items-center h-[420px]">
        {/* Glow Effect */}
        <motion.div
           key={`glow-${current}`}
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 0.6, scale: 1 }}
           exit={{ opacity: 0, scale: 0.8 }}
           transition={{ duration: 0.8 }}
           className={`absolute w-[300px] h-[300px] rounded-full blur-[80px] -z-10 ${slideThemes[current].glow}`}
        />
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={current}
            src={phones[current]}
            alt="App preview"
            className="absolute w-[220px] drop-shadow-xl"
            custom={direction}
            initial={{ x: direction > 0 ? 140 : -140, opacity: 0, scale: 0.9, y: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0], // Floating Effect
            }}
            exit={{ x: direction > 0 ? -140 : 140, opacity: 0, scale: 0.9 }}
            transition={{ 
              x: { type: "spring", stiffness: 70, damping: 20 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }, // Floating transition
            }}
          />
        </AnimatePresence>
      </div>

      {/* Text */}
      <div className="relative mt-8 h-[90px] text-center px-6">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <h3 className="text-xl font-semibold mb-1">
              {slideTexts[current].title}
            </h3>
            <p className="text-gray-600 text-sm max-w-[420px]">
              {slideTexts[current].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 w-full h-[4px] z-10 overflow-hidden bg-slate-100/50">
        {/* RGB Line (Stationary but changing colors - Red Tones) */}
        {/* Dynamic Gradient Line */}
        <motion.div
           key={`line-${current}`}
           className="absolute inset-x-0 h-full w-full"
           style={{ 
             background: `linear-gradient(90deg, transparent, ${slideThemes[current].accent}, transparent)`,
             backgroundSize: "100% 100%"
           }}
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 1 }}
        />
      </div>
    </section>
  );
};

export default AppPreview;
