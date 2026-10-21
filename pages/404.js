import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NextSeo } from "next-seo";

export default function Contact() {
  return (
    <div className="text-default-900 bg-black">
      <NextSeo
        title="Home: devsoul"
        description="Welcome to devsoul homepage."
        canonical="https://www.devsoulit.com/"
        openGraph={{
          url: "https://www.devsoulit.com/",
        }}
      />
      <Head>
        <title>No disponible</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <div className="flex flex-col justify-center mx-auto mt-8 mb-16 text-center max-w-2x1">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-default-900 md:text-5xl">
          404 – No disponible
        </h1>
        <a
          className="w-64 p-1 mx-auto font-bold text-center text-default-900 border border-gray-500 rounded-lg sm:p-4"
          href="/"
        >
          Volver al inicio
        </a>
      </div>
      <div className="mt-96">
        <br></br>
        <div className="mt-52">
          <br></br>
        </div>
      </div>
      <Footer />
    </div>
  );
}
