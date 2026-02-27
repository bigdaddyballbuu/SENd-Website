import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import bike from "../assets/hero/bike.png";
import hero11 from "../assets/hero/hero-1.png";
import hero12 from "../assets/hero/hero-2.png";
import hero13 from "../assets/hero/hero-3.jpg";
import hero14 from "../assets/hero/hero-4.jpg";
import hero15 from "../assets/hero/hero-5.jpg";

const images = [hero11, hero12, hero13, hero14, hero15];

export default function Hero({ dragConstraints }: { dragConstraints?: React.RefObject<any> }) {
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-switch images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const { t } = useTranslation();

  return (
      <section
          className="
            relative w-full
            min-h-[500px] md:min-h-50 md:aspect-[16/9]
            overflow-visible
          "
        >
      
      {/* Clipped Background Wrapper */}
      <div className="absolute inset-0 w-full h-full [clip-path:ellipse(160%_100%_at_-10%_-1%)] md:[clip-path:ellipse(65%_100%_at_40%_0%)] z-0">
        {/* background image slider */}
        <div className="absolute inset-0 overflow-hidden bg-red-900">
          <AnimatePresence mode="popLayout">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              src={images[currentImage]}
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        </div>

        {/* overlay — very subtle theme tint */}
        <div className="absolute inset-0 bg-[#EC1C24]/10 z-1" />
      
        {/* Gradient Overlay for smooth transition if needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EC1C24]/0 to-[#EC5429]/0 pointer-events-none" />
      </div>

      {/* content */}
      <div className="relative z-30 flex items-end md:items-center h-full py-16 pb-12 md:py-0 pointer-events-none">
        <div className="max-w-[1440px] mx-auto px-6 text-white font-extrabold flex flex-col md:flex-row items-center gap-8 md:gap-10 font-poppins w-full justify-center pointer-events-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-en text-center md:text-left leading-tight drop-shadow-md">
           {t('hero.slogan')}
          </h1>
          </div>

          <div className="flex justify-center w-full md:w-auto mt-8 md:mt-0 pointer-events-auto">
            <motion.img
              src={bike}
              drag
              dragConstraints={dragConstraints}
              whileDrag={{ rotate: 8, scale: 1.02 }}
              dragElastic={0.15}
              className="w-[120%] sm:w-full max-w-[450px] md:max-w-3xl lg:max-w-5xl object-contain drop-shadow-2xl z-50 relative translate-y-15 md:translate-y-0"
            />

          </div>
        </div>
    </section>
  );
};
