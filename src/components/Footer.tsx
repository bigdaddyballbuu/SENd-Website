import logo from "../assets/logos/send-logo2.png";
import { useEffect, useState } from "react";

import appStore from "../assets/store/app-store2.png";
import playStore from "../assets/store/google-play2.png";

import instagram from "../assets/socials/instagram.png";
import facebook from "../assets/socials/facebook.png";
import mail from "../assets/socials/mail.png";
import line from "../assets/socials/line.png";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simple check for mobile devices
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      if (/android|iPad|iPhone|iPod/i.test(userAgent)) {
        return true;
      }
      return false;
    };
    setIsMobile(checkIfMobile());
  }, []);

  return (
    <footer className="bg-[#1F2933] text-gray-300">
      {/* ================= TOP ================= */}
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12">

          {/* BRAND */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="SENd" className="h-10 w-auto" />
              <span className="text-white font-bold text-xl">SENd</span>
            </div>

            <p className="text-sm leading-relaxed text-gray-400 max-w-[340px] mb-6">
              แพลตฟอร์มบริการรับ–ส่งซักอบผ้า
              <br />
              ที่ช่วยคืนเวลาความสุขให้คุณในทุกวัน
            </p>

            {/* APP STORE */}
            <div className="flex gap-3">
              <a href="https://apps.apple.com/us/app/send-delivery/id6474961079">
                <img
                  src={appStore}
                  alt="App Store"
                  className="h-11 cursor-pointer hover:opacity-90 transition"
                />
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.sendcompany.send_delivery">
                <img
                  src={playStore}
                  alt="Google Play"
                  className="h-11 cursor-pointer hover:opacity-90 transition"
                />
              </a>
            </div>
          </div>

          {/* ABOUT */}
          <div>
            <h4 className="text-white font-semibold mb-4">เกี่ยวกับ</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">เกี่ยวกับเรา</Link>
              </li>
              <li>
                <Link to="/announcement" className="hover:text-white transition">ข่าวสาร & โปรโมชั่น</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-white transition">บทความ/ทริคซักผ้า</Link>
              </li>
            </ul>
          </div>

          {/* USER */}
          <div>
            <h4 className="text-white font-semibold mb-4">ผู้ใช้งาน</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://apps.apple.com/us/app/send-delivery/id6474961079" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">ดาวน์โหลดแอป</a>
              </li>
              <li>
                <Link to="/help-center" className="hover:text-white transition">ศูนย์ช่วยเหลือ</Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-4">ติดต่อเรา</h4>

            {/* SOCIAL */}
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61551896879435" target="_blank" rel="noopener noreferrer">
                <img
                  src={facebook}
                  alt="Facebook"
                  className="h-6 w-6 cursor-pointer opacity-80 hover:opacity-100 transition"
                />
              </a>
              <a href="https://www.instagram.com/send.delivery?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                <img
                  src={instagram}
                  alt="Instagram"
                  className="h-6 w-6 cursor-pointer opacity-80 hover:opacity-100 transition"
                />
              </a>
              <a href="https://line.me/R/ti/p/@098neegh">
                <img
                  src={line}
                  alt="LINE"
                  className="h-7 w-7 cursor-pointer opacity-80 hover:opacity-100 transition"
                />
              </a>
              <a 
                href={
                  isMobile 
                    ? "mailto:sendgood1990@gmail.com" 
                    : "https://mail.google.com/mail/?view=cm&fs=1&to=sendgood1990@gmail.com"
                }
                target={isMobile ? undefined : "_blank"}
                rel={isMobile ? undefined : "noopener noreferrer"}
              >
                <img
                  src={mail}
                  alt="MAIL"
                  className="h-5.8 w-6 cursor-pointer opacity-80 hover:opacity-100 transition"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DIVIDER ================= */}
      <div className="border-t border-white/10" />

      {/* ================= BOTTOM ================= */}
      <div className="bg-[#ED3226]">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white">
          <span>
            © {new Date().getFullYear()} SENd. All rights reserved.
          </span>

          {/* LEGAL */}
          <div className="flex gap-6 text-white/90">
            <Link to="/privacy" className="hover:underline cursor-pointer">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:underline cursor-pointer">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
