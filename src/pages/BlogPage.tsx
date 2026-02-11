import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

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

// Static config (non-translatable data)
const postConfig = [
  { id: 1, image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=2070&auto=format&fit=crop", categoryKey: "post1Category", titleKey: "post1Title", excerptKey: "post1Excerpt", dateKey: "post1Date", readTimeKey: "post1ReadTime", contentKey: "post1Content" },
  { id: 2, image: "https://i0.wp.com/thanaplus.com/wp-content/uploads/2025/09/%E0%B8%9B%E0%B9%89%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B9%80%E0%B8%AA%E0%B8%B7%E0%B9%89%E0%B8%AD-%E0%B8%AA%E0%B8%B3%E0%B8%84%E0%B8%B1%E0%B8%8D%E0%B8%81%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%84%E0%B8%B4%E0%B8%94-%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%A5%E0%B9%87%E0%B8%81%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%81%E0%B8%9A%E0%B8%A3%E0%B8%99%E0%B8%94%E0%B9%8C%E0%B8%A1%E0%B8%B1%E0%B8%81%E0%B8%A1%E0%B8%AD%E0%B8%87%E0%B8%82%E0%B9%89%E0%B8%B2%E0%B8%A1-1.jpg?w=1281&ssl=1", categoryKey: "post2Category", titleKey: "post2Title", excerptKey: "post2Excerpt", dateKey: "post2Date", readTimeKey: "post2ReadTime", contentKey: "post2Content" },
  { id: 3, image: "https://images.unsplash.com/photo-1567113463300-102a7eb3cb26?q=80&w=2070&auto=format&fit=crop", categoryKey: "post3Category", titleKey: "post3Title", excerptKey: "post3Excerpt", dateKey: "post3Date", readTimeKey: "post3ReadTime", contentKey: "post3Content" },
  { id: 4, image: "https://images.unsplash.com/photo-1489659639091-8b687bc4386e?q=80&w=2072&auto=format&fit=crop", categoryKey: "post4Category", titleKey: "post4Title", excerptKey: "post4Excerpt", dateKey: "post4Date", readTimeKey: "post4ReadTime", contentKey: "post4Content" },
  { id: 5, image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop", categoryKey: "post5Category", titleKey: "post5Title", excerptKey: "post5Excerpt", dateKey: "post5Date", readTimeKey: "post5ReadTime", contentKey: "post5Content" },
];

const BlogPage = () => {
    const { t } = useTranslation();
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [filterIdx, setFilterIdx] = useState(0);
    const [search, setSearch] = useState("");

    // Build translated posts from config
    const BLOG_POSTS: BlogPost[] = postConfig.map(cfg => ({
      id: cfg.id,
      image: cfg.image,
      category: t(`blog.${cfg.categoryKey}`),
      title: t(`blog.${cfg.titleKey}`),
      excerpt: t(`blog.${cfg.excerptKey}`),
      date: t(`blog.${cfg.dateKey}`),
      readTime: t(`blog.${cfg.readTimeKey}`),
      content: t(`blog.${cfg.contentKey}`),
    }));

    const categories = [
      t('blog.filterAll'),
      t('blog.filterBasic'),
      t('blog.filterGeneral'),
      t('blog.filterTrouble'),
      t('blog.filterAdvanced'),
    ];

    // Filter Logic
    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesCategory = filterIdx === 0 || post.category === categories[filterIdx];
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
                <span className="text-[#ff2500] font-bold tracking-wider text-sm uppercase mb-2 block">{t('blog.category1')}</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6"
                    dangerouslySetInnerHTML={{ __html: t('blog.title') }}
                />
                <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                  {t('blog.description')}
                </p>
            </motion.div>
          </div>

          {/* SEARCH & FILTER SECTION */}
          <div className="flex flex-col items-center gap-6 mb-12">
            
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
                <input 
                    type="text" 
                    placeholder={t('blog.searchPlaceholder')} 
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
                {categories.map((cat, idx) => (
                    <button
                        key={cat}
                        onClick={() => setFilterIdx(idx)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                            filterIdx === idx 
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
                            {t('blog.readMore')} <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                    </div>
                </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                  <p className="text-slate-400 text-lg">{t('blog.noResults')}</p>
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
                    {t('blog.ctaTitle')} <br />
                    <span className="text-[#ff2500]">{t('blog.ctaHighlight')}</span>
                </h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                    {t('blog.ctaDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/laundry" className="px-8 py-4 bg-[#ff2500] hover:bg-[#d92000] text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 text-lg">
                        {t('blog.ctaFindShop')}
                    </Link>
                    <Link to="/partner" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all backdrop-blur text-lg">
                        {t('blog.ctaFranchise')}
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
                     <p className="text-slate-400 text-sm mb-4">{t('blog.shareText')}</p>
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
