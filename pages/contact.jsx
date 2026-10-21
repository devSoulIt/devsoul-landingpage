import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { NextSeo } from "next-seo";

export default function Contact() {
  return (
    <div className="bg-black  text-default-900 h-screen  overflow-y-scroll flex flex-col justify-between">
      <NextSeo
        title="Home: devsoul"
        description="Welcome to devsoul homepage."
        canonical="https://www.devsoulit.com/"
        openGraph={{
          url: "https://www.devsoulit.com/",
        }}
      />
      <Head>
        <title>Contactanos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className="text-default-900 body-font relative">
        <div className="container px-5 pt-24 pb-16 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-5xl text-2xl font-semibold title-font mb-4 text-default-900">
              Contactanos
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base font-semibold">
              ¡Contáctanos para resolver tus dudas!
            </p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-1/2 flex flex-col">
                <label
                  for="name"
                  className="leading-7 text-sm text-default-900 font-semibold"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-default-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white-500"
                ></input>
              </div>

              <div className="p-2 w-1/2 flex flex-col">
                <label
                  for="email"
                  className="leading-7 text-sm text-default-900 font-semibold"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-default-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white-500"
                ></input>
              </div>

              <div className="p-2 w-full flex flex-col">
                <label
                  for="message"
                  className="leading-7 text-sm text-default-900 font-semibold"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-default-900 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white-500"
                ></textarea>
              </div>

              <div className="p-2 w-full flex justify-center">
                <div className="p-2 w-60">
                  <button className="group w-full relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-red-500 px-6 font-medium text-neutral-200 duration-500">
                    <div className="translate-x-0 opacity-100 transition group-hover:-translate-x-[150%] group-hover:opacity-0">
                      Enviar
                    </div>
                    <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6"><path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
                <a className="text-red-500">info@devsoul.com</a>
                <p className="leading-normal my-5">
                  Tucuman, Argentina
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
