import { motion } from "framer-motion";
import googlePlay from "../assets/store/google-play.png";
import appStore from "../assets/store/app-store.png";

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
            className="hover:scale-105 transition-transform"
          >
            <img
              src={googlePlay}
              alt="Download on Google Play"
              className="h-14 mx-auto"
            />
          </a>

          {/* App Store */}
          <a
            href="https://apps.apple.com/us/app/send-delivery/id6474961079"
            className="hover:scale-105 transition-transform"
          >
            <img
              src={appStore}
              alt="Download on App Store"
              className="h-14 mx-auto"
            />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default DownloadCTA;
