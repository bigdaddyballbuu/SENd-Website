import { motion } from "framer-motion";
import Footer from "../components/Footer";

const PrivacyPage = () => {
  return (
    <>
      <section className="min-h-screen bg-[#F8F9FB] pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100"
          >
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1F2933] mb-8">
              นโยบายความเป็นส่วนตัว (Privacy Policy)
            </h1>
            
            <div className="prose prose-lg text-slate-600">
              <p className="text-sm text-slate-400 mb-8">แก้ไขล่าสุดเมื่อ: 1 มกราคม 2024</p>
              
              <p className="mb-6">
                บริษัท SENd (ต่อไปนี้เรียกว่า "เรา") ให้ความสำคัญกับความเป็นส่วนตัวของคุณ 
                นโยบายนี้อธิบายถึงวิธีที่เราเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของคุณเมื่อคุณใช้บริการของเรา
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">1. ข้อมูลที่เราเก็บรวบรวม</h3>
              <p className="mb-4">
                เราอาจเก็บรวบรวมข้อมูลต่อไปนี้:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                   <li>ข้อมูลระบุตัวตน (เช่น ชื่อ, เบอร์โทรศัพท์)</li>
                   <li>ข้อมูลที่อยู่สำหรับการรับ-ส่งผ้า</li>
                   <li>ข้อมูลการใช้งานแอปพลิเคชันและเว็บไซต์</li>
                </ul>
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">2. การใช้ข้อมูล</h3>
              <p className="mb-4">
                เราใช้ข้อมูลของคุณเพื่อ:
                <ul className="list-disc pl-6 mt-2 space-y-2">
                   <li>ให้บริการรับ-ส่งซักอบผ้าตามคำสั่งซื้อ</li>
                   <li>ปรับปรุงและพัฒนาคุณภาพการบริการ</li>
                   <li>ติดต่อสื่อสารเกี่ยวกับสถานะการสั่งซื้อหรือโปรโมชั่น</li>
                </ul>
              </p>

              <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-500">
                  หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเราได้ที่ sendgood1990@gmail.com
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default PrivacyPage;
