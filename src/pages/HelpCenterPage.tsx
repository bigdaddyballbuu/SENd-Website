import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import bgAnnouncement from "../assets/bg/bg-help2.png";
import { useTranslation } from "react-i18next";

/* =========================
   FAQ DATA CONFIG (icons & gradients only)
========================= */
const faqConfig = [
  { categoryKey: "category1", icon: "📱", gradient: "from-blue-500 to-cyan-400", questionKeys: ["question1", "question2", "question3"], answerKeys: ["answer1", "answer2", "answer3"] },
  { categoryKey: "category2", icon: "👕", gradient: "from-purple-500 to-pink-400", questionKeys: ["question4", "question5", "question6"], answerKeys: ["answer4", "answer5", "answer6"] },
  { categoryKey: "category3", icon: "💳", gradient: "from-emerald-500 to-teal-400", questionKeys: ["question7", "question8", "question9"], answerKeys: ["answer7", "answer8", "answer9"] },
  { categoryKey: "category4", icon: "⚠️", gradient: "from-amber-500 to-orange-400", questionKeys: ["question10", "question11", "question12", "question13"], answerKeys: ["answer10", "answer11", "answer12", "answer13"] },
  { categoryKey: "category5", icon: "🛡️", gradient: "from-slate-600 to-slate-500", questionKeys: ["question14", "question15"], answerKeys: ["answer14", "answer15"] },
];

const HelpCenterPage = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      return /android|iPad|iPhone|iPod/i.test(userAgent);
    };
    setIsMobile(checkIfMobile());
  }, []);

  // Build translated faqs from config
  const faqs = faqConfig.map(cfg => ({
    category: t(`helpCenter.${cfg.categoryKey}`),
    icon: cfg.icon,
    gradient: cfg.gradient,
    items: cfg.questionKeys.map((qKey, i) => ({
      q: t(`helpCenter.${qKey}`),
      a: t(`helpCenter.${cfg.answerKeys[i]}`),
    })),
  }));

  const filteredFaqs = faqs
    .filter(group => !selectedCategory || group.category === selectedCategory)
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
      )
    }))
    .filter(group => group.items.length > 0);

  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* ==================== HERO SECTION ==================== */}
      <div className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgAnnouncement})` }}
        />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff2500]/10 to-purple-600/10" />
        
        {/* Floating Blobs */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-[#ff2500]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Content */}
        <div className="relative z-10 pt-28 pb-16 px-4">
          <div className="max-w-4xl mx-auto">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('helpCenter.badge')}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-center text-white mb-4"
            >
              {t('helpCenter.heroTitle')}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 text-center mb-10 max-w-xl mx-auto"
            >
              {t('helpCenter.heroDescription')}
            </motion.p>

            {/* Search Bar - Glass Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto mb-10"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#ff2500] to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
                  <div className="pl-5">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder={t('helpCenter.searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-5 bg-transparent text-white placeholder-white/50 focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>

            {/* Report Issue Card - In Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <Link 
                to="/claim"
                className="group relative block overflow-hidden rounded-3xl bg-gradient-to-r from-[#ff2500] to-[#ff6b35] p-6 md:p-8 shadow-2xl shadow-orange-500/30"
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <svg className="w-8 h-8 md:w-10 md:h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {/* T-shirt shape */}
                        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.47a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.47a2 2 0 00-1.34-2.23z" />
                        {/* Exclamation mark */}
                        <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2.5" />
                        <circle cx="12" cy="16" r="0.5" fill="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">{t('helpCenter.reportTitle')}</h3>
                      <p className="text-white/80 text-sm md:text-base mt-1">{t('helpCenter.reportDescription')}</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white flex items-center justify-center text-[#ff2500] shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="relative bg-white rounded-t-[3rem] -mt-8 pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Category Cards - Centered Horizontal Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-3 overflow-x-auto pb-6 scrollbar-hide"
          >
            {faqs.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(selectedCategory === cat.category ? null : cat.category)}
                className={`
                  flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[90px]
                  transition-all duration-300 border-2
                  ${selectedCategory === cat.category 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                    : 'bg-white text-slate-700 border-slate-100 hover:border-slate-200 hover:shadow-md'}
                `}
              >
                <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-xl shadow-md`}>
                  {cat.icon}
                </span>
                <span className="text-xs font-medium text-center leading-tight max-w-[70px]">{cat.category}</span>
              </button>
            ))}
          </motion.div>

          {/* Active Filter */}
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 mb-6"
            >
              <span className="text-slate-500">{t('helpCenter.viewing')}</span>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white font-medium">
                {faqs.find(f => f.category === selectedCategory)?.icon}
                {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            </motion.div>
          )}

          {/* FAQ List */}
          {filteredFaqs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{t('helpCenter.noResults')}</h3>
              <p className="text-slate-500">{t('helpCenter.noResultsDescription')}</p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {filteredFaqs.map((group, idx) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${group.gradient} flex items-center justify-center text-xl shadow-lg`}>
                      {group.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{group.category}</h2>
                      <p className="text-sm text-slate-500">{group.items.length} {t('helpCenter.questionsCount')}</p>
                    </div>
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div 
                        key={item.q}
                        className={`
                          rounded-2xl border-2 overflow-hidden transition-all duration-300
                          ${openQuestion === item.q 
                            ? 'border-slate-200 shadow-xl' 
                            : 'border-slate-100 hover:border-slate-200 hover:shadow-md'}
                        `}
                      >
                        <button
                          onClick={() => setOpenQuestion(openQuestion === item.q ? null : item.q)}
                          className="w-full p-5 flex items-center justify-between text-left bg-white"
                        >
                          <span className="font-semibold text-slate-800 pr-4">{item.q}</span>
                          <motion.div
                            animate={{ rotate: openQuestion === item.q ? 45 : 0 }}
                            className={`
                              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                              ${openQuestion === item.q ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}
                            `}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </motion.div>
                        </button>
                        
                        <AnimatePresence>
                          {openQuestion === item.q && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-0 bg-slate-50 border-t border-slate-100">
                                <p className="text-slate-600 leading-relaxed pt-4">
                                  {item.a}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ==================== CONTACT SECTION ==================== */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-24">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
          
          {/* Floating Blobs */}
          <motion.div 
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-80 h-80 bg-[#06C755]/20 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              x: [0, -40, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              x: [0, 20, 0],
              y: [0, 40, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-[80px]" 
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              {t('helpCenter.contactBadge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              {t('helpCenter.contactTitle')}
            </h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              {t('helpCenter.contactDescription')}
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-14">
            
            {/* LINE Card */}
            <motion.a
              href="https://line.me/R/ti/p/@098neegh"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative overflow-hidden rounded-3xl"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#06C755] to-[#00E676] rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 border border-white/10 hover:border-[#06C755]/50 transition-all duration-500">
                <div className="flex items-start gap-5">
                  <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#06C755] to-[#00E676] flex items-center justify-center shadow-xl shadow-[#06C755]/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 10.3c0-4.6-4.5-8.3-10-8.3S2 5.7 2 10.3c0 4.1 3.6 7.5 8.9 8.2.3.1.8.2.8.5 0 0 0 .1-.1.4-.2.5-.9 1.8-1 2.2-.1.6.3 1.1 1.1.6 4.7-2.7 6.4-4.5 9-6.9 1-1.3 1.3-2.9 1.3-4.6z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">LINE Official</h3>
                    <p className="text-slate-400 mb-4">{t('helpCenter.lineSubtitle')}</p>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#06C755] text-white font-semibold shadow-lg shadow-[#06C755]/30 group-hover:shadow-[#06C755]/50 group-hover:gap-3 transition-all duration-300">
                      <span>{t('helpCenter.lineButton')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#06C755]/20 to-transparent rounded-bl-full" />
              </div>
            </motion.a>

            {/* Email Card */}
            <motion.a
              href={isMobile ? "mailto:sendgood1990@gmail.com" : "https://mail.google.com/mail/?view=cm&fs=1&to=sendgood1990@gmail.com"}
              target={isMobile ? undefined : "_blank"}
              rel={isMobile ? undefined : "noopener noreferrer"}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-3xl blur-lg opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-7 border border-white/10 hover:border-blue-500/50 transition-all duration-500">
                <div className="flex items-start gap-5">
                  <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{t('helpCenter.emailTitle')}</h3>
                    <p className="text-slate-400 mb-4">sendgood1990@gmail.com</p>
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:gap-3 transition-all duration-300">
                      <span>{t('helpCenter.emailButton')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full" />
              </div>
            </motion.a>
          </div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 md:gap-6"
          >
            {[
              { icon: "⚡", label: t('helpCenter.stat1'), gradient: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", glow: "shadow-amber-500/20" },
              { icon: "🕐", label: t('helpCenter.stat2'), gradient: "from-blue-500/20 to-cyan-500/20", border: "border-blue-500/30", glow: "shadow-blue-500/20" },
              { icon: "🇹🇭", label: t('helpCenter.stat3'), gradient: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30", glow: "shadow-emerald-500/20" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r ${stat.gradient} backdrop-blur-lg border ${stat.border} shadow-lg ${stat.glow} text-white font-medium`}
              >
                <span className="text-xl">{stat.icon}</span>
                <span>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

    </div>
  );
};

export default HelpCenterPage;