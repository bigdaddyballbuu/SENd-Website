import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

const TermsPage = () => {
  const { t } = useTranslation();

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
              {t('termsPage.title')}
            </h1>
            
            <div className="prose prose-lg text-slate-600">
              <p className="text-sm text-slate-400 mb-8">{t('termsPage.lastUpdated')}</p>
              
              <p className="mb-6">
                {t('termsPage.intro')}
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">{t('termsPage.section1Title')}</h3>
              <p className="mb-4">
                {t('termsPage.section1Text')}
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">{t('termsPage.section2Title')}</h3>
              <p className="mb-4">
                {t('termsPage.section2Text')}
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">{t('termsPage.section3Title')}</h3>
              <p className="mb-4">
                {t('termsPage.section3Text')}
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