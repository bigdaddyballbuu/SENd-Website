import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   FAQ DATA
========================= */
const faqs = [
  {
    category: "การใช้งานแอป",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
    ),
    items: [
      {
        q: "ใช้งาน SENd อย่างไร?",
        a: "ง่ายๆ เพียง 3 ขั้นตอน: 1. เลือกร้านซักที่คุณถูกใจในแอป 2. ระบุขนาดถังซักที่คุณต้องการและบริการต่างๆ 3. รอไรเดอร์มารับผ้าถึงหน้าบ้าน โดยเราจะมีทีมงานดูแลซัก อบ พับ ให้เรียบร้อยพร้อมส่งคืน",
      },
      {
        q: "ให้บริการในพื้นที่ไหนบ้าง?",
        a: "ปัจจุบัน SENd ให้บริการครอบคลุมในอำเภอเมืองเมือง จังหวัดศรีสะเกษ และกำลังขยายตัวสู่จังหวัดอุบลราชธานี, มหาสารคาม, ร้อยเอ็ด, ขอนแก่น, กาฬสินธุ์ เร็วๆ นี้",
      },
      {
        q: "ใช้เวลาซักนานเท่าไหร่?",
        a: "โดยปกติรอบการทำงาน (Turnaround time) จะอยู่ที่ 1-3 ชั่วโมง ขึ้นอยู่กับคิวของแต่ละร้านซัก คุณสามารถเช็คเวลาโดยประมาณได้ก่อนยืนยันออเดอร์ครับ",
      },
    ],
  },
  {
    category: "บริการและการดูแลผ้า",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
    ),
    items: [
      {
        q: "รับซักอะไรบ้าง?",
        a: "เรารับซักเสื้อผ้าทั่วไป, ชุดเครื่องนอน, ผ้านวม, ผ้าเช็ดตัว และผ้าม่าน (ขนาดเล็ก) *ไม่รับซักพรม, รองเท้า, หรือสินค้าแบรนด์เนมที่ต้องดูแลพิเศษ และผ้าที่ใช้สำหรับสัตว์เลี้ยง*",
      },
      {
        q: "มีการแยกผ้าขาว/ผ้าสี หรือไม่?",
        a: "แน่นอนครับ! มาตรฐานของพาร์ทเนอร์ร้านซักของเราจะทำการแยกผ้าสีและผ้าขาวออกจากกันเพื่อป้องกันสีตก และใช้อุณหภูมิน้ำที่เหมาะสมกับชนิดผ้า",
      },
      {
        q: "ใช้น้ำยาซักผ้าอะไร?",
        a: "ร้านค้าพาร์ทเนอร์ของเราใช้น้ำยาซักผ้าและน้ำยาปรับผ้านุ่มเกรดอุตสาหกรรมมาตรฐานโรงแรม หรือคุณสามารถเลือกสูตร 'Hypoallergenic' สำหรับผิวแพ้ง่ายได้ (ในร้านที่ร่วมรายการ)",
      },
    ],
  },
  {
    category: "ราคาและการชำระเงิน",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
    ),
    items: [
      {
        q: "คิดค่าบริการอย่างไร?",
        a: "ค่าบริการคิดตามขนาดถังซัก (กิโลกรัม) ขึ้นอยู่กับร้านที่คุณเลือก โดยราคาเริ่มต้นภายใน 4 กิโลเมตร 49 บาท ถ้าเกินระยะทาง + เพิ่มกิโลเมตรละ 10 บาท",
      },
      {
        q: "ชำระเงินช่องทางไหนได้บ้าง?",
        a: "รองรับการสแกน QR Code (PromptPay), Mobile Banking ทุกธนาคาร และบัตรเครดิต/เดบิต (Visa/Mastercard) ผ่านแอปพลิเคชันได้อย่างปลอดภัย",
      },
      {
        q: "ขอใบกำกับภาษีได้ไหม?",
        a: "ได้ครับ สามารถระบุข้อมูลสำหรับออกใบกำกับภาษี (E-Tax Invoice) ได้ในขั้นตอนการชำระเงิน โดยเอกสารจะส่งเข้าอีเมลของคุณภายใน 24 ชม.",
      },
    ],
  },
  {
    category: "ปัญหาที่พบบ่อย (Common Issues)",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
    ),
    items: [
      {
        q: "เข้าสู่ระบบไม่ได้ ทำอย่างไร?",
        a: "ลองตรวจสอบเบอร์โทรศัพท์ที่ลงทะเบียนว่าถูกต้องหรือไม่ หากลืมรหัสผ่าน สามารถกดที่เมนู 'ลืมรหัสผ่าน' ที่หน้า Login เพื่อทำการตั้งรหัสใหม่ผ่าน SMS OTP ได้เลยครับ",
      },
      {
        q: "ปักหมุดแผนที่ไม่ได้ / หมุดไม่ตรง",
        a: "แนะนำให้เปิด GPS (Location Service) ก่อนใช้งาน หากหมุดยังไม่ตรง สามารถใช้นิ้วเลื่อนที่แผนที่เพื่อปักหมุดตำแหน่งที่ถูกต้องด้วยตัวเอง หรือระบุ 'จุดสังเกต' เพิ่มเติมให้ไรเดอร์ทราบ",
      },
      {
        q: "ชำระเงินไม่สำเร็จ ตัดบัตรไม่ได้?",
        a: "กรุณาตรวจสอบยอดเงินคงเหลือ หรือวงเงินบัตรของท่าน หากยังไม่สำเร็จ แนะนำให้ลองเปลี่ยนช่องทางการชำระเงินเป็น QR PromptPay หรือติดต่อธนาคารเจ้าของบัตร",
      },
      {
        q: "ไรเดอร์ไม่มารับผ้าตามนัด",
        a: "หากเลยเวลานัดหมายเกิน 15 นาที ระบบจะแจ้งเตือนทีมงานทันที หรือคุณสามารถกดปุ่ม 'ติดตามงาน' ในหน้า Order Detail หรือทัก LINE หาเราได้เลยครับ",
      }
    ],
  },
  {
    category: "ความปลอดภัยและการรับประกัน",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
    ),
    items: [
      {
        q: "ผ้าหายหรือเสียหาย รับผิดชอบไหม?",
        a: "เรามีประกันความเสียหายวงเงินสูงสุด 2,000 บาทต่อออเดอร์ หากเกิดกรณีผ้าสูญหายหรือเสียหายจากการซัก (ตามเงื่อนไขที่กำหนด) ติดต่อเคลมได้ทันที",
      },
      {
        q: "ข้อมูลส่วนตัวปลอดภัยแค่ไหน?",
        a: "SENd ให้ความสำคัญกับข้อมูลส่วนบุคคล (PDPA) สูงสุด ข้อมูลที่อยู่และเบอร์โทรของคุณจะถูกเปิดเผยเฉพาะกับไรเดอร์ที่รับงานเท่านั้น และจะถูกปิดกั้นเมื่อออเดอร์จบ",
      },
    ],
  },
];

const HelpCenterPage = () => {
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState("");
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

  const filteredFaqs = faqs.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <section className="min-h-screen bg-[#F8F9FB] text-slate-900 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-[#ff2500] text-xs font-bold tracking-wider mb-4 border border-orange-100">
              SUPPORT CENTER
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 relative inline-block">
              ศูนย์ช่วยเหลือ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2500] to-[#fe3d00]">SENd</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              ติดขัดตรงไหน? ค้นหาคำตอบหรือติดต่อเราได้ทันที <br className="hidden md:block" />
              เราพร้อมดูแลคุณทุกขั้นตอน
            </p>
          </motion.div>
        </div>

        {/* CLAIM BUTTON - ENHANCED */}
        <div className="mb-16 max-w-2xl mx-auto relative z-10">
          {/* Pulsing Background */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ff2500] to-[#ff8800] rounded-3xl blur opacity-30 animate-pulse transition duration-1000 group-hover:duration-200"></div>
          
          <Link to="/claim" className="group relative block w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff2500] to-[#ff4000] p-1 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/50">
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
            
            <div className="relative flex h-full items-center justify-between bg-white/5 px-6 py-8 sm:px-10 backdrop-blur-sm transition-colors group-hover:bg-white/10">
              <div className="flex items-center gap-6">
                
                {/* Icon Box */}
                <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-2xl blur-lg animate-pulse" />
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-[#ff2500] shadow-lg relative z-10 group-hover:rotate-12 transition-transform duration-300">
                        <svg className="w-10 h-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    </div>
                </div>

                <div className="text-white relative z-10">
                  <h3 className="text-2xl font-black sm:text-3xl tracking-tight drop-shadow-md flex items-center gap-2">
                    แจ้งเคลมสินค้า
                  </h3>
                  <p className="mt-2 text-sm font-medium text-orange-50/90 sm:text-lg leading-relaxed max-w-[280px] sm:max-w-none">
                    พบปัญหาการใช้งาน? สินค้าเสียหาย? <br/>
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden rounded-full bg-white/20 p-3 text-white sm:block group-hover:bg-white group-hover:text-[#ff2500] transition-all duration-300 group-hover:translate-x-1">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>

            {/* Decor */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none group-hover:bg-white/20 transition-all duration-500"></div>
          </Link>
        </div>

        {/* SEARCH BAR */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="relative max-w-2xl mx-auto mb-16"
        >
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input
            type="text"
            placeholder="ค้นหาปัญหา เช่น 'การชำระเงิน', 'ลืมรหัสผ่าน'..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
                    block w-full pl-12 pr-4 py-5 
                    bg-white
                    rounded-2xl 
                    text-base 
                    text-slate-900 
                    placeholder-slate-400
                    shadow-[0_4px_20px_rgb(0,0,0,0.03)] 
                    border border-slate-100
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-[#ff2500]/20 
                    focus:border-[#ff2500] 
                    transition-all
                    duration-300
                "
          />
        </motion.div>

        {/* FAQ LIST */}
        <div className="space-y-10">
          {filteredFaqs.map((group, groupIndex) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (groupIndex * 0.1) }}
              key={group.category}
            >
              <div className="flex items-center gap-3 mb-5 px-2">
                <div className="p-2 bg-orange-50 text-[#ff2500] rounded-lg">
                  {group.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  {group.category}
                </h2>
              </div>

              <div className="space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.q}
                    className={`
                        group
                        bg-white 
                        rounded-2xl 
                        border 
                        border-slate-100
                        overflow-hidden
                        transition-all
                        duration-300
                        ${open === item.q ? "shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-orange-100 ring-1 ring-orange-50" : "hover:border-slate-300 hover:shadow-sm"}
                      `}
                  >
                    <button
                      onClick={() => setOpen(open === item.q ? null : item.q)}
                      className="w-full flex justify-between items-center p-5 text-left"
                    >
                      <span className={`font-semibold text-lg transition-colors ${open === item.q ? "text-[#ff2500]" : "text-slate-700 group-hover:text-slate-900"}`}>
                        {item.q}
                      </span>

                      <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                            ${open === item.q ? "bg-orange-100 text-[#ff2500] rotate-180" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}
                        `}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </button>

                    <AnimatePresence>
                      {open === item.q && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-5 pb-6">
                            <div className="h-px w-full bg-slate-50 mb-4"></div>
                            <div className="text-slate-600 leading-relaxed pl-1">
                              {item.a}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p>ไม่พบข้อมูลที่ค้นหา</p>
            </div>
          )}
        </div>

        {/* CONTACT FOOTER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 border-t border-slate-200 pt-16 text-center"
        >
          <h3 className="text-2xl font-bold mb-3 text-slate-900">
            ยังไม่พบคำตอบที่คุณต้องการ?
          </h3>
          <p className="text-slate-500 mb-10">
            ทีมงานของเราพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <a
              href={
                isMobile 
                  ? "mailto:sendgood1990@gmail.com" 
                  : "https://mail.google.com/mail/?view=cm&fs=1&to=sendgood1990@gmail.com"
              }
              target={isMobile ? undefined : "_blank"}
              rel={isMobile ? undefined : "noopener noreferrer"}
              className="
                        group
                        flex items-center justify-center gap-3 
                        p-4 rounded-xl 
                        bg-white border border-slate-200 
                        hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 hover:-translate-y-1
                        transition-all duration-300
                    "
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Email Support</p>
                <p className="font-bold text-slate-800">sendgood1990@gmail.com</p>
              </div>
            </a>

            <a
              href="#"
              className="
                        group
                        flex items-center justify-center gap-3 
                        p-4 rounded-xl 
                        bg-[#06C755] text-white
                        hover:bg-[#05b64d] hover:shadow-lg hover:shadow-[#06C755]/20 hover:-translate-y-1
                        transition-all duration-300
                    "
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                {/* LINE ICON */}
                
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 10.3c0-4.6-4.5-8.3-10-8.3S2 5.7 2 10.3c0 4.1 3.6 7.5 8.9 8.2.3.1.8.2.8.5 0 0 0 .1-.1.4-.2.5-.9 1.8-1 2.2-.1.6.3 1.1 1.1.6 4.7-2.7 6.4-4.5 9-6.9 1-1.3 1.3-2.9 1.3-4.6z"/></svg>
              </div>
              <div className="text-left">
                <a href="https://line.me/R/ti/p/@098neegh">
                <p className="text-xs text-white/90 font-semibold uppercase tracking-wide">LINE Official</p>
                <p className="font-bold text-white">SENd ส่งซักอบแห้ง</p>
                </a>
              </div>
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HelpCenterPage;
