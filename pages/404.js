import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";
import Image from "next/image";
import Footer from "@/components/shared/footer";

export default function Custom404() {
  const [lang, setLang] = useState("en");
  const [cookie, setCookies] = useState(null);

  useEffect(() => {
    let lang = null;
    if (!cookie) {
      const cookie = parseCookies();
      lang = cookie.lang || null;
      setCookies(cookie);
    }
    if (lang === "en" || lang === null) {
      setLang("en");
    } else if (lang === "jp") {
      setLang("jp");
    }
  }, []);
  return (
    <>
      <Head>
        <title>Streamsora - Not Found</title>
        <meta name="about" content="About this web" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/streamsora.png" />
      </Head>
      <div className="min-h-screen w-screen flex flex-col items-center justify-center ">
        <Image
          width={500}
          height={500}
          src="/svg/404.svg"
          alt="404"
          className="w-[26vw] md:w-[15vw]"
        />
        <h1 className="text-2xl sm:text-4xl xl:text-6xl font-bold my-4">
          Oops! Page not found
        </h1>
        <p className="text-base sm:text-lg xl:text-xl text-gray-300 mb-6 text-center">
          The page you're looking for doesn't seem to exist.
        </p>
        <Link href={`/${lang}/`}>
          <div className="rounded-sm rounded-tl-[4px] rounded-tr-[4px] rounded-bl-[4px] rounded-br-[4px] border border-[#66ccff] hover:text-white hover:ring-2 hover:ring-[#66ccff] transition-all duration-300  bg-transparent xl:text-xl text-white font-bold py-2 px-4 hover:bg-[#66ccff]">
            Go back home
          </div>
        </Link>
      </div>
      <Footer />
    </>
  );
}
