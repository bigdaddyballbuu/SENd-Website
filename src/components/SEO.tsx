import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

const SITE_NAME = "SENd ส่ง-ซัก";
const BASE_URL = "https://www.sendgooddelivery.com";

const SEO = ({ title, description, path = "", image }: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME}`;
  const desc = description || "SENd บริการซัก-อบ ส่งถึงบ้าน สะดวก รวดเร็ว ปลอดภัย";
  const url = `${BASE_URL}${path}`;
  const imgUrl = image || "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1200&auto=format&fit=crop";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imgUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={imgUrl} />
    </Helmet>
  );
};

export default SEO;
