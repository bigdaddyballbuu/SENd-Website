import logo from "../assets/logos/SENd_Logo_1.png";

const About = () => {
  return (
    <section className="py-16 bg-white transition-colors">
      <div className="max-w-[1000px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative group perspective-1000">
              <div className="absolute -inset-4 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
              <img
                src={logo}
                alt="SENd Logo"
                className="relative w-[220px] h-auto object-contain transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 drop-shadow-md group-hover:drop-shadow-2xl"
              />
            </div>
          </div>

          {/* TEXT */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-md md:text-base font-bold tracking-[0.2em] text-red-500 mb-2">
              เกี่ยวกับ SENd
            </h1>

            <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient mb-6">
              SENd "เพิ่มเวลาความสุข ให้คุณมากขึ้น"
            </h3>

            <div className="space-y-4 text-red-600 leading-relaxed font-light text-base md:text-lg">
              <p>
                SENd คือแพลตฟอร์มที่เชื่อมต่อร้านสะดวกซักกับลูกค้าในประเทศไทย
                เพื่อช่วยให้การดูแลเสื้อผ้าเป็นเรื่องง่าย สะดวก และเข้าถึงได้มากขึ้น
                เราออกแบบระบบให้ใช้งานไม่ซับซ้อน พร้อมบริการรับ–ส่งเสื้อผ้า
                ที่ช่วยประหยัดเวลาและตอบโจทย์ไลฟ์สไตล์ของคนไทยในชีวิตประจำวัน
              </p>

              <p>
                SENd ให้ความสำคัญกับคุณภาพของบริการและประสบการณ์ของผู้ใช้งาน
                ด้วยแนวคิดการพัฒนาแพลตฟอร์มที่เข้าใจทั้งลูกค้าและร้านค้า
                เพื่อสร้างระบบที่เชื่อถือได้ ใช้งานง่าย และเติบโตไปพร้อมกับร้านสะดวกซักทั่วประเทศ
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
