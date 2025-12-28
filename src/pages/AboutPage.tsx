import { motion } from "framer-motion";
import Footer from "../components/Footer";

const AboutPage = () => {
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
              เกี่ยวกับ SENd
            </h1>
            
            <div className="prose prose-lg text-slate-600">
              <p className="mb-6">
                SENd คือแพลตฟอร์มบริการรับ-ส่งซักอบผ้าที่มุ่งมั่นจะคืนเวลาความสุขให้กับคุณ 
                เราเข้าใจดีว่าในชีวิตประจำวันที่เร่งรีบ การจัดการงานบ้านโดยเฉพาะการซักผ้า 
                อาจเป็นเรื่องที่กินเวลาและน่าเบื่อหน่าย
              </p>
              
              <p className="mb-6">
                ด้วยเหตุนี้ เราจึงสร้างสรรค์บริการที่เชื่อมโยงผู้ใช้งานเข้ากับร้านสะดวกซักที่ได้มาตรฐาน 
                พร้อมทีมงานรับ-ส่งมืออาชีพ เพื่อให้คุณมั่นใจได้ว่าเสื้อผ้าของคุณจะได้รับการดูแลอย่างดีที่สุด 
                สะอาด หอม และส่งตรงถึงมือคุณตรงเวลา
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">วิสัยทัศน์ของเรา</h3>
              <p className="mb-6">
                มุ่งสู่การเป็นผู้นำด้านบริการช่วยเหลืองานบ้านแบบครบวงจร ที่ทันสมัยและเข้าถึงง่ายที่สุดในไทย
              </p>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutPage;
