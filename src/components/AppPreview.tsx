import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import { useTranslation } from "react-i18next";

import phone1 from "../assets/phones/phone1.png";
import phone2 from "../assets/phones/phone2.png";
import phone3 from "../assets/phones/phone-3.png";
import phone4 from "../assets/phones/phone-4.png";

/* =======================
   DATA
======================= */

const phones = [phone1, phone2, phone3, phone4];

const bgImages = [
  "/homepage-bg22.png",
  "/homepage-bg33.png",
  "/homepage-bg44.png",
  "/homepage-bg55.png",
];

const slideThemes = [
  { bubble: "bg-red-300/70", wave: "#fca5a5", glow: "bg-red-500", accent: "#ff2500" },
  { bubble: "bg-blue-300/70", wave: "#93c5fd", glow: "bg-blue-500", accent: "#3b82f6" },
  { bubble: "bg-emerald-300/70", wave: "#6ee7b7", glow: "bg-emerald-500", accent: "#10b981" },
  { bubble: "bg-orange-300/70", wave: "#f5af53ff", glow: "bg-orange-500", accent: "#ff961e" },
];


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
  const [bgIndex, setBgIndex] = useState(0);
  const { t } = useTranslation();

  const slideTexts = [
    { title: t('appPreview.slide1Title'), desc: t('appPreview.slide1Desc') },
    { title: t('appPreview.slide2Title'), desc: t('appPreview.slide2Desc') },
    { title: t('appPreview.slide3Title'), desc: t('appPreview.slide3Desc') },
    { title: t('appPreview.slide4Title'), desc: t('appPreview.slide4Desc') },
  ];

  const paginate = (newDirection: number) => {
    setCurrent(([prev]) => [
      (prev + newDirection + phones.length) % phones.length,
      newDirection,
    ]);
  };

  useEffect(() => {
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [current]);

  // Background crossfade every 10 seconds
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 10000);
    return () => clearInterval(bgTimer);
  }, []);


  return (
    <section className="relative py-10 overflow-hidden bg-transparent">
      {/* Crossfade Background Images - สลับทุก 10 วินาที */}
      <AnimatePresence mode="sync">
        <motion.div
          key={bgIndex}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{ opacity: 0.8, scale: 1.15 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 2, ease: "easeInOut" },
            scale: { duration: 10, ease: "linear" },
          }}
          style={{
            backgroundImage: `url('${bgImages[bgIndex]}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(0.5px)',
          }}
        />
      </AnimatePresence>
      {/* Gradient Fade + Blur - ด้านบนขาวเบลอจางๆ */}
      <div 
        className="absolute inset-x-0 top-0 h-[150px] -z-10 pointer-events-none backdrop-blur-sm"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0) 100%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 20%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 10%, transparent 90%)',
        }}
      />

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
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient mb-6">
          {t('appPreview.title')}
        </h1>
      </div>

       {/* Slider */}
      <div className="relative z-10 flex justify-center items-center h-[420px] cursor-grab active:cursor-grabbing">
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
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.3}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;
              if (offset.x < -50 || swipe < -500) {
                paginate(1);
              } else if (offset.x > 50 || swipe > 500) {
                paginate(-1);
              }
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: 0,
              y: [0, -15, 0],
            }}
            exit={{ x: direction > 0 ? -120 : 120, opacity: 0, scale: 0.85 }}
            transition={{ 
              scale: { type: "spring", stiffness: 80, damping: 18 },
              opacity: { duration: 0.8 },
              x: { duration: 1.0, ease: "easeIn" },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
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
            <h3 className="text-white text-xl font-semibold mb-1">
              {slideTexts[current].title}
            </h3>
            <p className="text-white text-sm max-w-[420px]">
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
