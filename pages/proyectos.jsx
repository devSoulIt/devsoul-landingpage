import Head from "next/head";
import Header from "../components/Header";
import Main from "../components/MainCasoDeExito";
import Footer from "../components/Footer";
import { NextSeo } from "next-seo";

export default function Home() {
    return (
        <div className="text-default-900">
            <NextSeo
                title="DevSoul | Proyectos"
                description="Algunos de los proyectos de software que desarrollamos para empresas."
                canonical="https://www.devsoulit.com/proyectos"
                openGraph={{
                    url: "https://www.devsoulit.com/proyectos",
                }}
            />
            <Head>
                <title>DevSoul | Proyectos</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Main />
            <Footer />
        </div>
    );
}
