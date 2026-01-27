import { motion } from "framer-motion";
import googlePlay from "../assets/store/google-play.svg";
import appStore from "../assets/store/app-store.svg";

const DownloadCTA = () => {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1440px] mx-auto px-0 text-center">

        {/* TEXT */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6 text-[#FF3333]"
        >
          ดาวน์โหลดแอป SENd ได้แล้ววันนี้
        </motion.h2>

        {/* BUTTONS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-row justify-center gap-4"
        >
          {/* Google Play */}
          <a
            href="https://play.google.com/store/apps/details?id=com.sendcompany.send_delivery"
            className="hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(255,69,0,0.7)] transition-all duration-300 flex items-center justify-center w-44 h-14"
          >
            <img
              src={googlePlay}
              alt="Download on Google Play"
              className="w-full h-full object-contain"
            />
          </a>

          {/* App Store */}
          <a
            href="https://apps.apple.com/us/app/send-delivery/id6474961079"
            className="hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(255,69,0,0.7)] transition-all duration-300 flex items-center justify-center w-44 h-14"
          >
            <img
              src={appStore}
              alt="Download on App Store"
              className="w-full h-full object-contain"
            />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default DownloadCTA;
