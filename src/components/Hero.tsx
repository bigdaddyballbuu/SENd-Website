import { useEffect, useState } from "react";
import { motion } from "framer-motion";


import hero1 from "../assets/hero/hero-1.png";
import hero2 from "../assets/hero/hero-2.png";
import hero3 from "../assets/hero/hero-3.png";
import hero4 from "../assets/hero/hero-4.png";
import hero5 from "../assets/hero/hero-5.png";
import bike from "../assets/hero/bike.png";

const images = [hero1, hero2, hero3, hero4, hero5];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
      <section
          className="
            relative w-full
            min-h-[500px] md:min-h-0 md:aspect-[16/9]
            overflow-visible
            bg-gradient-to-b from-[#EC1C24] to-[#EC5429]
          "
        >
      {/* background images */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={`
              absolute inset-0 w-full h-full object-cover
              transition-opacity duration-1000 ease-in-out
              ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"}
            `}
          />
        ))}
      </div>

      {/* overlay */}
      <div className="absolute inset-0 bg-gray/40 z-20" />

      {/* content */}
      <div className="relative z-30 flex items-end md:items-center h-full py-16 pb-12 md:py-0">
        <div className="max-w-[1440px] mx-auto px-6 text-white font-extrabold flex flex-col md:flex-row items-center gap-8 md:gap-10 font-poppins w-full justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold font-en text-center md:text-left leading-tight drop-shadow-md">
           "SENd คืนเวลาความสุขให้คุณ"
          </h1>
          </div>

          <div className="flex justify-center w-full md:w-auto mt-4 md:mt-0">
            <motion.img
              src={bike}
              drag
              whileDrag={{ rotate: 8, scale: 1.02 }}
              dragElastic={0.15}
              className="w-[100%] sm:w-full max-w-sm md:max-w-3xl lg:max-w-5xl object-contain drop-shadow-2xl z-50 relative"
            />

          </div>
        </div>
    </section>
  );
};
