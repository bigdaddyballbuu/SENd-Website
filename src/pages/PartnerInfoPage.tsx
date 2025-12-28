import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LAUNDRY_FORM_URL = "https://forms.gle/asG3b6G8pkm4dTXx6";
const RIDER_FORM_URL = "https://forms.gle/ULVAJJoJWsJrhE8A7";

const PartnerPage: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section className="min-h-screen bg-[#F8F9FB] text-slate-900 pb-20 pt-24">

      {/* HERO SECTION */}
      <div className="relative overflow-hidden mb-20">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-orange-100/50 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-[#ff2500] text-sm font-bold tracking-wide mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2500] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff2500]"></span>
              </span>
              รับสมัครพาร์ทเนอร์รุ่นใหม่
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              เติบโตไปกับธุรกิจ <br className="hidden md:block" />
              สะดวกซักระดับ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2500] to-[#fe3d00]">มืออาชีพ</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              ยกระดับธุรกิจร้านสะดวกซักและงานบริการของคุณด้วยเทคโนโลยีจาก SENd <br className="hidden md:block" />
              แพลตฟอร์มที่เชื่อมโยงลูกค้าเข้ากับบริการของคุณอย่าง ไร้รอยต่อ
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setOpen(true)}
                className="px-8 py-4 bg-[#ff2500] text-white rounded-xl font-bold text-lg shadow-xl shadow-[#ff2500]/30 hover:bg-[#cc1e00] hover:scale-105 transition-all duration-300 transform"
              >
                สมัครเป็นพาร์ทเนอร์
              </button>
              <button 
                onClick={() => document.getElementById('more-info')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:border-slate-300 hover:shadow-lg transition-all duration-300">
                ศึกษาข้อมูลเพิ่มเติม
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div id="more-info" className="max-w-6xl mx-auto px-6">

        {/* STATS STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 mb-24 divide-x divide-slate-100 text-center"
        >
          {[
            { val: "20+", label: "พาร์ทเนอร์ในระบบ" },
            { val: "500+", label: "ผู้ใช้งานในระบบ" },
            { val: "ศรีสะเกษ", label: "ครอบคลุมพื้นที่" },
            { val: "100%", label: "อัตราการเติบโต" }
          ].map((stat, i) => (
            <div key={i} className={`flex flex-col items-center p-2 ${i % 2 !== 0 ? 'border-none md:border-l' : ''}`}>
              <span className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{stat.val}</span>
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* VALUE PROPOSITION */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-16">ทำไมต้องเป็นพาร์ทเนอร์กับ <span className="text-[#ff2500]">SENd</span>?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Revenue Maximization",
                desc: "เพิ่มยอดขายโดยไม่ต้องลงทุนขยายสาขา ระบบของเราช่วยดึงลูกค้าใหม่ๆ เข้าสู่ธุรกิจของคุณตลอด 24 ชม.",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                )
              },
              {
                title: "Smart Operation System",
                desc: "จัดการออเดอร์ ติดตามสถานะ และดูรายงานยอดขายแบบ Real-time ผ่าน Dashboard ระดับ Enterprise",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
                )
              },
              {
                title: "Reliable Payment",
                desc: "หมดห่วงเรื่องบัญชี ระบบสรุปยอดรายรับชัดเจน โปร่งใส และโอนเงินเข้าบัญชีตามรอบอย่างตรงเวลา",
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                )
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:border-orange-200 transition-all cursor-default"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff2500] to-[#fe3d00] flex items-center justify-center mb-6 shadow-lg shadow-[#ff2500]/30">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PARTNER TYPES */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {/* LAUNDRY CARD */}
          <div className="group relative bg-white rounded-[2.5rem] p-10 border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 group-hover:bg-blue-100 transition-colors"></div>

            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-blue-600 font-bold tracking-wider text-xs uppercase mb-2">Business Partner</p>
                <h3 className="text-3xl font-extrabold text-slate-900">สำหรับร้านสะดวกซัก</h3>
              </div>
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                "เพิ่มยอดขายเฉลี่ย 30-40%",
                "ลดต้นทุนการตลาดและการจัดการลูกค้า",
                "ระบบเดลิเวอรี่รับ-ส่งผ้าถึงที่",
                "Dashboard วิเคราะห์ข้อมูลเชิงลึก"
              ].map((txt, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm font-medium">{txt}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => window.open(LAUNDRY_FORM_URL, "_blank")}
              className="w-full py-4 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all"
            >
              สมัครเป็นร้านค้าพาร์ทเนอร์
            </button>
          </div>

          {/* RIDER CARD */}
          <div className="group relative bg-white rounded-[2.5rem] p-10 border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 group-hover:bg-orange-100 transition-colors"></div>

            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[#ff2500] font-bold tracking-wider text-xs uppercase mb-2">Logistics Partner</p>
                <h3 className="text-3xl font-extrabold text-slate-900">สำหรับไรเดอร์</h3>
              </div>
              <div className="w-16 h-16 rounded-full bg-orange-50 text-[#ff2500] flex items-center justify-center text-3xl">
                🛵
              </div>
            </div>

            <ul className="space-y-4 mb-10">
              {[
                "รายได้เฉลี่ย 10,000-20,000 บาท/เดือน",
                "เลือกพื้นที่และเวลาทำงานได้อิสระ",
                "งานมั่นคง มีออเดอร์ต่อเนื่อง",
                "สวัสดิการและประกันอุบัติเหตุ"
              ].map((txt, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-600">
                  <svg className="w-5 h-5 text-[#ff2500] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-sm font-medium">{txt}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => window.open(RIDER_FORM_URL, "_blank")}
              className="w-full py-4 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-[#ff2500] hover:text-white hover:border-transparent transition-all"
            >
              สมัครเป็นไรเดอร์
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#1a1a1a] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff2500] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 relative z-10">พร้อมเริ่มต้นความสำเร็จกับเรา?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto relative z-10">
            มาร่วมเป็นส่วนหนึ่งของเครือข่ายบริการสะดวกซักที่ใหญ่ที่สุดในไทย <br />
            สมัครเลยวันนี้เพื่อสิทธิพิเศษมากมาย
          </p>
          <button
            onClick={() => setOpen(true)}
            className="relative z-10 px-10 py-5 bg-white text-black rounded-2xl font-bold text-xl hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
          >
            สมัครเลย ➜
          </button>
        </div>

        {/* MODAL POPUP */}
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ff2500] to-[#fe3d00]"></div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">เลือกประเภทการสมัคร</h2>
                  <p className="text-slate-500 mt-2">กรุณาเลือกประเภทพาร์ทเนอร์ที่คุณต้องการ</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <a
                    href={LAUNDRY_FORM_URL}
                    target="_blank"
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <div className="mb-3 group-hover:scale-110 transition-transform text-blue-600">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-blue-700">ร้านสะดวกซัก</span>
                  </a>
                  <a
                    href={RIDER_FORM_URL}
                    target="_blank"
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-slate-100 hover:border2-[#ff2500] hover:bg-orange-50 transition-all group hover:border-orange-500"
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🛵</div>
                    <span className="font-bold text-slate-700 group-hover:text-[#ff2500]">ไรเดอร์</span>
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default PartnerPage;
