import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

const PrivacyPage = () => {
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
              {t("privacyPage.title")}
            </h1>
            
            <div className="prose prose-lg text-slate-600">
              <p className="text-sm text-slate-400 mb-8">{t("privacyPage.lastUpdated")}</p>
              
              <p className="mb-6">
                {t("privacyPage.intro")}
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">{t("privacyPage.section1Title")}</h3>
              <p className="mb-4">
                {t("privacyPage.section1Desc")}
                <ul className="list-disc pl-6 mt-2 space-y-2">
                   <li>{t("privacyPage.section1List1")}</li>
                   <li>{t("privacyPage.section1List2")}</li>
                   <li>{t("privacyPage.section1List3")}</li>
                </ul>
              </p>

              <h3 className="text-xl font-bold text-[#1F2933] mt-8 mb-4">{t("privacyPage.section2Title")}</h3>
              <p className="mb-4">
                {t("privacyPage.section2Desc")}
                <ul className="list-disc pl-6 mt-2 space-y-2">
                   <li>{t("privacyPage.section2List1")}</li>
                   <li>{t("privacyPage.section2List2")}</li>
                   <li>{t("privacyPage.section2List3")}</li>
                </ul>
              </p>

              <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-500">
                  {t("privacyPage.contact")}
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