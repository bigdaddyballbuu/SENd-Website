import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import logo from "../assets/logos/send-logo2.png";
import { Link } from "react-router-dom";


export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar fixed top-0 left-0 w-full h-[62px] z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">

        {/* LOGO */}
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            type: "spring",
            stiffness: 120,
            damping: 14,
          }}
          className="flex items-center gap-0"
        >
          <img src={logo} alt="SENd" className="h-20 w-auto" />
          <span className="font-bold text-2xl">SENd</span>
        </motion.div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 font-normal ml-auto">
          <Link to="/" className="navbar-link">หน้าหลัก</Link>
          <Link to="/laundry" className="navbar-link">ร้านสะดวกซัก</Link>
          <Link to="/announcement" className="navbar-link">กระดานข่าว</Link>
          <Link to="/help-center" className="navbar-link">ศูนย์ช่วยเหลือ</Link>
          <Link to="/partner" className="navbar-link">สมัครเป็นพาร์ทเนอร์</Link>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden bg-slate-900 text-white"
          >
            <div className="px-6 py-6 flex flex-col gap-4 text-base">
              <a onClick={() => setOpen(false)} href="/" className="navbar-link">
                หน้าหลัก
              </a>
              <a onClick={() => setOpen(false)} href="/laundry" className="navbar-link">
                ร้านสะดวกซัก
              </a>
              <a onClick={() => setOpen(false)} href="/announcement" className="navbar-link">
                กระดานข่าว
              </a>
              <a onClick={() => setOpen(false)} href="/help-center" className="navbar-link">
                ศูนย์ช่วยเหลือ
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
