import { motion } from "framer-motion";
import Footer from "../components/Footer";

const TermsPage = () => {
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
              เงื่อนไขการให้บริการ (Terms of Service)
            </h1>
            
            <div className="prose prose-lg text-slate-600">
              <p className="text-sm text-slate-400 mb-8">แก้ไขล่าสุดเมื่อ: 1 มกราคม 2024</p>
              
              <p className="mb-6">
                ยินดีต้อนรับสู่ SENd การใช้งานเว็บไซต์และแอปพลิเคชันของเราอยู่ภายใต้เงื่อนไขและข้อตกลงดังต่อไปนี้ 
                โปรดอ่านอย่างละเอียดก่อนใช้บริการ
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">1. การยอมรับเงื่อนไข</h3>
              <p className="mb-4">
                เมื่อท่านเข้าใช้บริการของเรา ถือว่าท่านตกลงและยอมรับที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขเหล่านี้ทุกประการ
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">2. ขอบเขตการให้บริการ</h3>
              <p className="mb-4">
                SENd เป็นตัวกลางในการเชื่อมโยงผู้ใช้กับร้านซักอบรีดพาร์ทเนอร์ เราไม่ได้เป็นผู้ให้บริการซักอบรีดโดยตรง 
                แต่เราดูแลในส่วนของการรับ-ส่งและการประสานงาน
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">3. ความรับผิดชอบ</h3>
              <p className="mb-4">
                ในกรณีที่เกิดความเสียหายต่อทรัพย์สินระหว่างการใช้บริการ บริษัทจะชดเชยตามเงื่อนไขที่กำหนดไว้ในนโยบายการประกันสินค้าเสียหาย
              </p>

            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default TermsPage;
