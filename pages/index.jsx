import Head from "next/head";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import { NextSeo } from "next-seo";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DevSoul",
  url: "https://www.devsoulit.com/",
  logo: "https://www.devsoulit.com/img/logos/isotipo 1.png",
  description:
    "DevSoul desarrolla software a medida para empresas: sistemas de gestión, apps web y mobile, integraciones y automatización con IA.",
  sameAs: [
    "https://www.instagram.com/dev.soul.it",
    "https://www.linkedin.com/company/104109828",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@devsoul.it",
    contactType: "customer service",
    areaServed: "LATAM",
    availableLanguage: "Spanish",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Miguel de Tucumán",
    addressCountry: "AR",
  },
  knowsAbout: [
    "Desarrollo de software a medida",
    "Sistemas de gestión",
    "Aplicaciones web y mobile",
    "Integraciones de sistemas",
    "Automatización con inteligencia artificial",
  ],
};

export default function Home() {
  return (
    <div className="bg-[#FAFAF7] text-zinc-900">
      <NextSeo
        title="DevSoul | Desarrollo de Software a Medida para Empresas"
        description="Convertimos planillas, procesos manuales y pedidos por WhatsApp en sistemas hechos para tu empresa. Sistemas de gestión, apps web y mobile, integraciones y automatización con IA."
        canonical="https://www.devsoulit.com/"
        openGraph={{
          url: "https://www.devsoulit.com/",
          title: "DevSoul | Software a medida para empresas",
          description:
            "Sistemas de gestión, apps web y mobile, integraciones y automatización con IA, diseñados alrededor de cómo trabaja tu empresa.",
          images: [
            {
              url: "https://www.devsoulit.com/img/logos/isotipo 1.png",
              width: 1200,
              height: 630,
              alt: "DevSoul — Software a medida para empresas",
            },
          ],
          site_name: "DevSoul",
          type: "website",
          locale: "es_AR",
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "desarrollo de software a medida, software para empresas, sistemas de gestión, desarrollo de apps, aplicaciones web, integraciones, automatización con IA, software factory Tucumán, desarrollo de software Argentina",
          },
          { name: "author", content: "DevSoul" },
          { name: "robots", content: "index, follow" },
          { name: "theme-color", content: "#FAFAF7" },
        ]}
      />
      <Head>
        <title>DevSoul | Software a medida para empresas</title>
        <link rel="icon" href="/img/logos/isotipo 1.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
