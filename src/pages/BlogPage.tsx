
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

// Types
interface BlogPost {
  id: number;
  category: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  content: string; // HTML-like string
}

// Static Data: Knowledge from Basic to Advanced
const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    category: "พื้นฐานการซัก",
    title: "มือใหม่หัดซัก: แยกผ้าอย่างไรไม่ให้สีตกและผ้าไม่พัง",
    excerpt: "จุดเริ่มต้นของการซักผ้าที่ถูกต้องคือการ 'แยก' มาดูกันว่าเราควรแยกผ้าแบบไหนบ้างเพื่อยืดอายุเสื้อผ้าตัวโปรดของคุณ",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2070&auto=format&fit=crop",
    date: "28 ธ.ค. 2024",
    readTime: "อ่าน 3 นาที",
    content: `
      <h3 class="text-xl font-bold mb-4">ทำไมต้องแยกผ้า?</h3>
      <p class="mb-4">การโยนผ้าทุกชิ้นลงในเครื่องซักผ้าทีเดียวอาจดูสะดวกและประหยัดเวลา แต่ผลลัพธ์ที่ได้อาจคือเสื้อขาวกลายเป็นสีชมพู หรือเสื้อไหมพรมย้วยจนใส่ไม่ได้ การแยกผ้าคือหัวใจสำคัญที่สุดของการซักผ้าครับ</p>
      
      <h4 class="text-lg font-bold mb-2">1. แยกตามสี (Color)</h4>
      <ul class="list-disc pl-5 mb-4 space-y-1">
        <li><strong>ผ้าขาว:</strong> เสื้อนักเรียน เสื้อเชิ้ตขาว ถุงเท้าขาว ควรซักแยกต่างหากเสมอ เพราะไวต่อการดูดซับสีอื่น</li>
        <li><strong>ผ้าสีอ่อน:</strong> สีพาสเทล สีฟ้าอ่อน ชมพูอ่อน ซักรวมกันได้</li>
        <li><strong>ผ้าสีเข้ม:</strong> กรมท่า ดำ น้ำตาล แดงสด สีเหล่านี้มักจะมีสีตกในการซักครั้งแรกๆ</li>
      </ul>

      <h4 class="text-lg font-bold mb-2">2. แยกตามเนื้อผ้า (Fabric Weight)</h4>
      <p class="mb-4">อย่าซักกางเกงยีนส์รวมกับเสื้อยืดบางๆ เพราะซิปหรือกระดุมยีนส์อาจไปเกี่ยวเสื้อยืดจนขาด และน้ำหนักของยีนส์ตอนเปียกจะดึงรั้งผ้าบางให้เสียทรง</p>

      <h4 class="text-lg font-bold mb-2">3. แยกตามความสกปรก (Dirtiness)</h4>
      <p class="mb-4">เสื้อผ้าใส่ทำงานออฟฟิศเหงื่ออกน้อย ไม่ควรซักรวมกับชุดกีฬาชุ่มเหงื่อ หรือผ้าขี้ริ้ว เพราะแบคทีเรียและกลิ่นจะไปติดเสื้อผ้าที่สะอาดกว่า</p>

      <div class="bg-orange-50 p-4 rounded-xl border border-orange-100 my-6 text-slate-700">
        <strong class="text-[#ff2500]">Pro Tip:</strong> กลับตะเข็บผ้าก่อนซักเสมอ ช่วยรักษาลายสกรีนและลดการเสียดสีหน้าผ้าได้ดีมากครับ
      </div>
    `
  },
  {
    id: 2,
    category: "ความรู้ทั่วไป",
    title: "รหัสลับหลังเสื้อ: อ่านสัญลักษณ์บนป้าย Care Label ให้เป็น",
    excerpt: "เลิกเดาว่ารูปสามเหลี่ยมหรือวงกลมบนป้ายเสื้อคืออะไร เข้าใจความหมายที่แท้จริงเพื่อการดูแลผ้าที่ถูกต้องตามหลักสากล",
    image: "https://i0.wp.com/thanaplus.com/wp-content/uploads/2025/09/%E0%B8%9B%E0%B9%89%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD-%E0%B8%AA%E0%B8%B3%E0%B8%84%E0%B8%B1%E0%B8%8D%E0%B8%81%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%84%E0%B8%B4%E0%B8%94-%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B9%87%E0%B8%81%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%81%E0%B8%9A%E0%B8%A3%E0%B8%99%E0%B8%94%E0%B9%8C%E0%B8%A1%E0%B8%B1%E0%B8%81%E0%B8%A1%E0%B8%AD%E0%B8%87%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A1-1.jpg?w=1281&ssl=1",
    date: "27 ธ.ค. 2024",
    readTime: "อ่าน 4 นาที",
    content: `
      <p class="mb-4">เคยสังเกตป้ายเล็กๆ ด้านในเสื้อไหมครับ? นั่นคือคู่มือการใช้งานเสื้อตัวนั้นเลยนะ วันนี้ SENd จะพามาถอดรหัสกันครับ</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-slate-50 p-4 rounded-lg">
          <strong class="block mb-1 text-slate-800">1. รูปกะละมัง (Washing)</strong>
          <span class="text-sm text-slate-600">บอกวิธีซัก ถ้ามีมือจุ่มในน้ำแปลว่า "ซักมือเท่านั้น" ถ้ามีตัวเลข 30, 40 คืออุณหภูมิน้ำสูงสุดที่ซักได้</span>
        </div>
        <div class="bg-slate-50 p-4 rounded-lg">
          <strong class="block mb-1 text-slate-800">2. รูปสามเหลี่ยม (Bleaching)</strong>
          <span class="text-sm text-slate-600">เกี่ยวกับน้ำยาฟอกขาว สามเหลี่ยมเปล่า = ใช้ได้, สามเหลี่ยมมีกากบาท = ห้ามใช้เด็ดขาด</span>
        </div>
        <div class="bg-slate-50 p-4 rounded-lg">
          <strong class="block mb-1 text-slate-800">3. รูปสี่เหลี่ยม (Drying)</strong>
          <span class="text-sm text-slate-600">การอบแห้ง วงกลมในสี่เหลี่ยม = อบได้, จุดตรงกลางบอกความร้อน (จุดเดียว=ต่ำ, สองจุด=กลาง)</span>
        </div>
        <div class="bg-slate-50 p-4 rounded-lg">
          <strong class="block mb-1 text-slate-800">4. รูปเตารีด (Ironing)</strong>
          <span class="text-sm text-slate-600">บอกระดับไฟ จุดเยอะคือไฟแรง ถ้ามีกากบาทคือห้ามรีด (มักเจอในผ้าใยสังเคราะห์)</span>
        </div>
      </div>

      <p class="mb-4">การปฏิบัติตามป้าย Care Label จะช่วยให้เสื้อผ้าอยู่กับเราได้นานคุ้มราคาที่สุดครับ</p>
    `
  },
  {
    id: 3,
    category: "แก้ปัญหาหนักใจ",
    title: "ผ้าเหม็นอับแก้ได้! เทคนิคลดกลิ่นช่วงหน้าฝนหรือตากในที่ร่ม",
    excerpt: "ปัญหาระดับชาติของคนอยู่หอหรือคอนโด ซักผ้าแล้วไม่หอม เหม็นเปรี้ยวเหมือนผ้าเน่า แก้ได้ง่ายๆ ด้วยวิธีเหล่านี้",
    image: "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?q=80&w=2070&auto=format&fit=crop",
    date: "25 ธ.ค. 2024",
    readTime: "อ่าน 3 นาที",
    content: `
      <h3 class="text-xl font-bold mb-4">สาเหตุของกลิ่นอับ?</h3>
      <p class="mb-4">กลิ่นอับเกิดจากเชื้อแบคทีเรียและเชื้อราที่เติบโตได้ดีในความชื้น ยิ่งผ้าแห้งช้า แบคทีเรียยิ่งชอบครับ</p>

      <h4 class="text-lg font-bold mb-2">วิธีแก้ปัญหาเบื้องต้น</h4>
      <ol class="list-decimal pl-5 mb-6 space-y-2">
        <li><strong>อย่าแช่ผ้าข้ามคืน:</strong> การแช่ผ้านานเกินไปทำให้น้ำเน่าบูด เป็นบ่อเกิดของแบคทีเรีย</li>
        <li><strong>ใช้น้ำยาปรับผ้านุ่มสูตรเข้มข้น:</strong> หรือสูตรสำหรับตากในที่ร่มโดยเฉพาะ</li>
        <li><strong>เว้นระยะห่างตอนตาก:</strong> อย่าตากผ้าชิดกันเกินไป ลมต้องผ่านได้สะดวก</li>
        <li><strong>น้ำส้มสายชูช่วยได้:</strong> เทน้ำส้มสายชู 1 ถ้วยลงในช่องน้ำยาปรับผ้านุ่มในน้ำสุดท้าย ช่วยฆ่าเชื้อราและดับกลิ่นได้ชะงัด (กลิ่นน้ำส้มจะหายไปเองตอนผ้าแห้ง)</li>
      </ol>

      <p>แต่ถ้าทำทุกวิธีแล้วยังไม่หาย แนะนำให้ใช้บริการ <strong>เครื่องอบผ้าอุณหภูมิสูง</strong> ครับ ความร้อนระดับ 60-70 องศา จะฆ่าเชื้อโรคได้เกลี้ยงและผ้าหอมฟูนแน่นอน</p>
    `
  },
  {
    id: 4,
    category: "เทคนิคขั้นสูง",
    title: "กู้ชีพเสื้อขาวหมองให้กลับมาโอโม่ ด้วยของก้นครัว",
    excerpt: "เสื้อขาวที่เริ่มเหลืองตามคอเสื้อ หรือหมองจนเป็นสีเทา อย่าเพิ่งทิ้ง! เรามีสูตรลับกู้ชีพผ้าขาวมาบอก",
    image: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?q=80&w=2072&auto=format&fit=crop",
    date: "20 ธ.ค. 2024",
    readTime: "อ่าน 5 นาที",
    content: `
      <p class="mb-4">เสื้อนักเรียนหรือเสื้อทำงานพอใช้ไปนานๆ มักจะหมองคล้ำจากฝุ่นและเหงื่อไคล ลองสูตรนี้ดูครับ</p>

      <h4 class="text-lg font-bold mb-3">สูตร 1: เบกกิ้งโซดา + มะนาว</h4>
      <p class="mb-4">ผสมเบกกิ้งโซดา 1 ถ้วยเข้ากับน้ำมะนาว แช่ผ้าทิ้งไว้ 1 ชั่วโมงก่อนนำไปซักปกติ กรดธรรมชาติจะช่วยกัดคราบเหลืองออกได้</p>

      <h4 class="text-lg font-bold mb-3">สูตร 2: น้ำซาวข้าว</h4>
      <p class="mb-4">วิธีภูมิปัญญาไทย นำผ้าขาวไปแช่ในน้ำซาวข้าว (น้ำที่ 2 หรือ 3) ทิ้งไว้ 1-2 ชั่วโมงแล้วซัก วิตามินในข้าวจะช่วยเคลือบเส้นใยให้ดูขาวนวลขึ้น</p>

      <div class="bg-red-50 p-4 rounded-xl border border-red-100 mb-4 text-slate-700">
        <strong class="text-red-600 block mb-1">ข้อควรระวัง!</strong>
        อย่าใช้น้ำยาฟอกขาว (Bleach/ไฮเตอร์) กับผ้าที่มีส่วนผสมของสแปนเด็กซ์หรือผ้ายืด เพราะจะทำให้ยางยืดเสื่อมสภาพและเปลี่ยนเป็นสีเหลืองถาวรได้ครับ
      </div>
    `
  },
  {
    id: 5,
    category: "งานยาก (Pro)",
    title: "ซักผ้านวม 6 ฟุตอย่างไรให้สะอาดถึงไส้ใน",
    excerpt: "งานปราบเซียนของการซักผ้าคือ 'ผ้านวม' ถ้าเครื่องไม่ใหญ่พอก็ซักไม่สะอาด แถมตากไม่แห้งก็เหม็นเน่า",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop",
    date: "15 ธ.ค. 2024",
    readTime: "อ่าน 6 นาที",
    content: `
      <p class="mb-4">ผ้านวมเป็นแหล่งสะสมไรฝุ่นชั้นดี ควรซักอย่างน้อยเดือนละ 2 ครั้ง แต่การซักเองที่บ้านมักเจอปัญหาเครื่องเล็กเกินไป</p>

      <h4 class="text-lg font-bold mb-2">เทคนิคซักผ้านวม</h4>
      <ul class="list-disc pl-5 mb-6 space-y-2">
        <li><strong>ม้วนผ้าก่อนใส่:</strong> อย่า ยัด ผ้าลงไปเฉยๆ ให้ม้วนเป็นก้อนกลมเพื่อให้พื้นที่ถังซักกระจายตัวสมดุล</li>
        <li><strong>ใช้ลูกเทนนิส:</strong> ใส่ลูกเทนนิสสะอาด 2-3 ลูกลงไปในเครื่องอบผ้า จะช่วยตีผ้านวมให้ฟูไม่จับตัวเป็นก้อน</li>
        <li><strong>ตากแดดจัด 2 วัน:</strong> ถ้าไม่มีเครื่องอบ ต้องตากแดดจัดอย่างน้อย 2 วันเต็มๆ กลับด้านทุก 4 ชั่วโมง</li>
      </ul>

      <div class="p-6 bg-slate-900 text-white rounded-2xl mt-8 text-center">
        <h3 class="text-xl font-bold mb-2">เหนื่อยไหม? ถ้าต้องซักเอง</h3>
        <p class="mb-4 text-slate-300 text-sm">เครื่องซักผ้าบ้านทั่วไปขนาด 8-10 kg ไม่เหมาะกับผ้านวมหนาๆ ครับ</p>
        <p>แนะนำให้ใช้บริการ <strong>SENd ร้านสะดวกซัก</strong> เรามีเครื่องอุตสาหกรรมขนาด 20kg+ ที่ซักผ้านวมสะอาดลึกถึงใยผ้า พร้อมเครื่องอบแก๊สที่ฆ่าไรฝุ่นได้ 100%</p>
      </div>
    `
  }
];

const BlogPage = () => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [filter, setFilter] = useState("ทั้งหมด");
    const [search, setSearch] = useState("");
    const categories = ["ทั้งหมด", "พื้นฐานการซัก", "ความรู้ทั่วไป", "แก้ปัญหาหนักใจ", "เทคนิคขั้นสูง"];

    // Filter Logic
    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesCategory = filter === "ทั้งหมด" || post.category === filter;
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                              post.excerpt.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

  return (
    <>
      <section className="min-h-screen bg-[#F8F9FB] pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* HEADER */}
          <div className="text-center mb-16">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <span className="text-[#ff2500] font-bold tracking-wider text-sm uppercase mb-2 block">บทความของเรา</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                  เคล็ดลับ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff2500] to-[#fe3d00]">การดูแลผ้า</span>
                </h1>
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                  รวมเทคนิคและวิธีการดูแลเสื้อผ้าที่คุณรัก ให้สะอาด หอม และยาวนานยิ่งขึ้น
                </p>
            </motion.div>
          </div>

          {/* SEARCH & FILTER SECTION */}
          <div className="flex flex-col items-center gap-6 mb-12">
            
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
                <input 
                    type="text" 
                    placeholder="ค้นหาบทความ (เช่น คราบกาแฟ, ผ้านวม)" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ff2500]/20 focus:border-orange-300 transition-all shadow-sm"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                            filter === cat 
                            ? "bg-[#ff2500] text-white shadow-lg shadow-orange-500/30" 
                            : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {filteredPosts.map((post, index) => (
                <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedPost(post)}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 group cursor-pointer hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                >
                    {/* Image */}
                    <div className="h-56 overflow-hidden relative shrink-0">
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-[#ff2500]">
                                {post.category}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-[#ff2500] transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">
                            {post.excerpt}
                        </p>
                        <div className="flex items-center text-[#ff2500] font-bold text-sm mt-auto">
                            อ่านบทความ <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                    </div>
                </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                  <p className="text-slate-400 text-lg">ไม่พบบทความที่คุณค้นหา</p>
              </div>
          )}

          {/* SERVICE CTA SECTION */}
          <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#1F2933] to-[#0f172a] text-white p-8 md:p-16 text-center">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 0 C 50 100 80 100 100 0 Z" fill="white" />
                 </svg>
            </div>
            
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-2xl mx-auto"
            >
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/80 text-xs font-bold tracking-wider mb-6 border border-white/20">
                    LAUNDRY SERVICE
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                    ไม่อยากเสียเวลาซักผ้าเอง? <br />
                    <span className="text-[#ff2500]">ให้เราดูแลแทนคุณ</span>
                </h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                    พบกับบริการซัก-อบมาตรฐานมืออาชีพ สะอาด หอม ไร้กังวล 
                    พร้อมบริการรับ-ส่งถึงที่ ให้คุณมีเวลาไปทำอย่างอื่นได้มากขึ้น
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/laundry" className="px-8 py-4 bg-[#ff2500] hover:bg-[#d92000] text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 text-lg">
                        ค้นหาร้านสะดวกซัก
                    </Link>
                    <Link to="/partner" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all backdrop-blur text-lg">
                        สนใจแฟรนไชส์
                    </Link>
                </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* READING MODAL */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
               {/* Close Button */}
               <button 
                onClick={() => setSelectedPost(null)} 
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/50 hover:bg-white text-slate-900 rounded-full flex items-center justify-center backdrop-blur transition-all border border-slate-200"
              >
                ✕
              </button>

              {/* Cover Image */}
              <div className="h-64 sm:h-80 shrink-0 relative">
                  <img src={selectedPost.image} className="w-full h-full object-cover" alt={selectedPost.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="bg-[#ff2500] text-xs font-bold px-3 py-1 rounded-lg mb-3 inline-block">
                          {selectedPost.category}
                      </span>
                      <h2 className="text-2xl sm:text-4xl font-bold leading-tight shadow-sm">
                          {selectedPost.title}
                      </h2>
                  </div>
              </div>

              {/* Content Body */}
              <div className="p-8 sm:p-10 overflow-y-auto custom-scrollbar bg-white">
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-8 border-b border-slate-100 pb-4">
                      <span>{selectedPost.date}</span>
                      <span>•</span>
                      <span>{selectedPost.readTime}</span>
                  </div>
                  
                  <div 
                    className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }} 
                  />

                  <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                     <p className="text-slate-400 text-sm mb-4">ชอบบทความนี้ไหม? แชร์ให้เพื่อนรู้สิ</p>
                     <div className="flex justify-center gap-2">
                        {/* Placeholder Share Buttons */}
                        <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition">F</button>
                        <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:scale-110 transition">L</button>
                        <button className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center hover:scale-110 transition" onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied!");
                        }}>🔗</button>
                     </div>
                  </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default BlogPage;
