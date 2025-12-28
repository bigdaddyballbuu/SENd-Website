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
            <h1 className="text-sm md:text-base font-bold tracking-[0.2em] text-red-500 mb-2">
              เกี่ยวกับ SENd
            </h1>

            <h3 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient mb-6">
              SENd "เพิ่มเวลาความสุข ให้คุณมากขึ้น"
            </h3>

            <div className="space-y-4 text-red-600 leading-relaxed font-light text-base md:text-lg">
              <p>
                ไม่เพียงแค่สะท้อนถึงการให้บริการที่เป็นเลิศเท่านั้น 
                แต่ยังสะท้อนถึงการรักษาวัฒนธรรมไทยและการต้อนรับผู้คนจากทุกสารทิศที่มายังแดนสยาม ด้วยการบริการที่อบอุ่นและเป็นมิตร 
                ทำให้ทุกคนที่ใช้ SENd รู้สึกถึงความสะดวกสบายและความเอื้ออารีจากชาวไทย
              </p>

              <p>
                โดยมุ่งมั่นเชื่อมต่อร้านสะดวกซักกับลูกค้าในประเทศผ่านระบบที่ใช้งานง่ายและสะดวก ซึ่งไม่เพียงแต่เป็นประโยชน์ต่อการดำเนินชีวิต
                ชาวไทยเท่านั้น แต่ยังรวมถึงนักท่องเที่ยวต่างชาติที่มาเยือนและต้องการบริการซักผ้าที่เชื่อถือได้ 
                ด้วยความสะดวกในการใช้บริการรับส่งเสื้อผ้า ทำให้ SENd 
                กลายเป็นที่นิยมอย่างรวดเร็วในหมู่ผู้ใช้บริการทั่วประเทศ
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
