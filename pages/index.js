import Head from "next/head";
import { parseCookies } from "nookies";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="twitter:title"
          content="StreamSora: Your Gateway to Free Anime and Manga Streaming Delight"
        />
        <meta
          name="twitter:description"
          content="Embark on a journey to discover your next beloved anime or manga series! Streamsora boasts an extensive collection of top-tier content, easily accessible across various devices, ensuring a seamless streaming experience devoid of any disruptions. Begin your Streamsora adventure today and immerse yourself in the world of limitless entertainment!"
        />
        <meta
          name="description"
          content="Unveil your next cherished anime or manga obsession! Streamsora presents an expansive vault of premium content, conveniently available across various devices, guaranteeing uninterrupted enjoyment. Dive into the Streamsora experience today and commence your journey into a world of limitless entertainment!"
        />
      </Head>
    </>
  );
}


export async function getServerSideProps(context) {
  const cookie = parseCookies(context);

  if (cookie.lang === "en") {
    return {
      redirect: {
        destination: "/en",
        permanent: false,
      },
    };
  } else if (cookie.lang === "jp") {
    return {
      redirect: {
        destination: "/jp",
        permanent: false,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/en",
        permanent: false,
      },
    };
  }
}
