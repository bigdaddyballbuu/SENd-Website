import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

import otteri from "../assets/logos/otteri2.png";
import laundrybar from "../assets/logos/laundrybar2.png";
import maru from "../assets/logos/maru2.png";
import kirei from "../assets/logos/kirei2.png";
import washmetic from "../assets/logos/washmetic2.png";
import washenjoy from "../assets/logos/washenjoy2.png";
import duckwash from "../assets/logos/duckwash2.png";
import magmai from "../assets/logos/magmai2.png";

const partners = [
  { name: "Otteri", logo: otteri },
  { name: "LaundryBar", logo: laundrybar },
  { name: "Maru Laundry", logo: maru },
  { name: "Kirei", logo: kirei },
  { name: "Washmetic", logo: washmetic },
  { name: "Washenjoy", logo: washenjoy },
  { name: "Duck Wash", logo: duckwash },
  { name: "Magmai", logo: magmai },
];

// clone เพื่อ seamless loop
const logos = [...partners, ...partners];

const ITEM_WIDTH = 150;
const GAP = 32;
const LOGO_WIDTH = ITEM_WIDTH + GAP; // 182
const TOTAL_WIDTH = logos.length * LOGO_WIDTH;

const LaundryPartners = () => {
  const x = useMotionValue(0);
  const velocity = useRef(-0.4);
  const isHovering = useRef(false);


  useEffect(() => {
    let raf: number;

    const loop = () => {
      if (!isHovering.current) {
        x.set(x.get() + velocity.current);
      }

      // seamless reset
      if (x.get() <= -TOTAL_WIDTH / 2) {
        x.set(0);
      }

      if (x.get() >= 0) {
        x.set(-TOTAL_WIDTH / 2);
      }

      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="py-8 bg-gray-50 overflow-hidden">
      <h2 className="text-center text-2xl font-bold mb-10 text-[#EF1111]">
        ร้านสะดวกซักที่ให้บริการ
      </h2>

      <div
        className="relative overflow-hidden"
        onMouseEnter={() => (isHovering.current = true)}
        onMouseLeave={() => (isHovering.current = false)}
      >
        {/* Fade Edge */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        <motion.div
          className="flex gap-4"
          style={{ x }}
        >
          {logos.map((item, i) => (
            <div
              key={i}
              className="w-[250px] h-[120px] flex items-center justify-center shrink-0"
            >
              <img
                src={item.logo}
                alt={item.name}
                className="max-h-[120px] object-contain opacity-100 hover:scale-110 transition duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LaundryPartners;
