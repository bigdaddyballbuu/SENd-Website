import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import logo from "../assets/logos/send-logo2.png";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";


export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

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
        >
          <Link to="/" className="flex items-center gap-0">
            <img src={logo} alt="SENd" className="h-20 w-auto" />
            <span className="font-bold text-2xl">SENd</span>
          </Link>
        </motion.div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-8 font-normal ml-auto items-center">
          <Link to="/" className="navbar-link">{t('navbar.home')}</Link>
          <Link to="/laundry" className="navbar-link">{t('navbar.laundry')}</Link>
          <Link to="/partner" className="navbar-link">{t('navbar.partner')}</Link>
          <Link to="/announcement" className="navbar-link">{t('navbar.announcement')}</Link>
          <Link to="/help-center" className="navbar-link">{t('navbar.helpCenter')}</Link>
          <LanguageSwitcher />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          {/* Language Switcher - Mobile */}
          <div className="md:hidden">
            <LanguageSwitcher />
          </div>
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
            className="absolute top-[62px] left-0 w-full md:hidden bg-slate-900 text-white shadow-xl border-t border-slate-700 overflow-hidden z-40"
          >
            <div className="px-6 py-6 flex flex-col gap-5 text-base font-medium">
              <Link onClick={() => setOpen(false)} to="/" className="navbar-link">
                {t('navbar.home')}
              </Link>
              <Link onClick={() => setOpen(false)} to="/laundry" className="navbar-link">
                {t('navbar.laundry')}
              </Link>
              <Link onClick={() => setOpen(false)} to="/partner" className="navbar-link">
                {t('navbar.partner')}
              </Link>
              <Link onClick={() => setOpen(false)} to="/announcement" className="navbar-link">
                {t('navbar.announcement')}
              </Link>
              <Link onClick={() => setOpen(false)} to="/help-center" className="navbar-link">
                {t('navbar.helpCenter')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
