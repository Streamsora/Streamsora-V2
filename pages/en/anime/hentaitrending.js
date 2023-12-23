import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Footer from "@/components/shared/footer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Head from "next/head";
import MobileNav from "@/components/shared/MobileNav";

export default function TrendingHentai({ sessions, trendingData }) {
  const [data, setData] = useState({ results: [] });
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (page > 5 || !nextPage) {
        window.removeEventListener("scroll", handleScroll);
        return;
      }

      if (
        window.innerHeight + window.pageYOffset >=
        document.body.offsetHeight - 3
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, nextPage]);

  useEffect(() => {
    const fetchTrendingData = async () => {
      setLoading(true);
      const res = await fetch(
        `https://hanime-api-five.vercel.app/trending/day/${page}`
      );
      const newTrendingData = await res.json();

      if (newTrendingData?.results?.length === 0) {
        setNextPage(false);
      } else {
        setData((prevData) => {
          return { results: [...prevData?.results, ...newTrendingData?.results] };
        });
        setNextPage(newTrendingData?.next_page !== null);
      }

      setLoading(false);
    };

    fetchTrendingData();
  }, [page]);


  return (
    <Fragment>
      <Head>
        <title>Streamsora - Trending Anime</title>
        <meta name="title" content="Trending Anime" />
        <meta
          name="description"
          content="Explore Top Trending Anime - Dive into the latest and most popular anime series on Streamsora. From thrilling action to heartwarming romance, discover the buzzworthy shows that have everyone talking. Stream now and stay up-to-date with the hottest anime trends!"
        />
      </Head>
      <MobileNav sessions={sessions} />
      <main className="flex flex-col gap-2 items-center min-h-screen w-screen px-2 relative pb-10">
        <div className="z-50 bg-primary pt-5 pb-3 shadow-md shadow-primary w-full fixed px-3">
          <Link href="/en" className="flex gap-2 items-center font-karla">
            <ChevronLeftIcon className="w-5 h-5" />
            <h1 className="text-xl">Trending Now</h1>
          </Link>
        </div>
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-3 max-w-6xl pt-16">
          {data?.results.map((i, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-[150px] lg:w-[180px]"
            >
              <Link
                href={`/en/anime/${i.slug}`}
                className="p-2"
                title={i.name}
              >
                <Image
                  src={i.cover_url}
                  alt={i.name}
                  width={500}
                  height={500}
                  className="w-[140px] h-[190px] lg:w-[170px] lg:h-[230px] object-cover rounded hover:scale-105 scale-100 transition-all duration-200 ease-out"
                />
              </Link>
              <Link
                href={`/en/anime/${i.slug}`}
                className="w-full px-2"
                title={i.name}
              >
                <h1 className="font-karla font-bold xl:text-base text-[15px] line-clamp-2">
                  {i.name}
                </h1>
              </Link>
            </div>
          ))}

          {loading && (
            <>
              {[1, 2, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="flex flex-col items-center w-[150px] lg:w-[180px]"
                >
                  <div className="w-full p-2">
                    <Skeleton className="w-[140px] h-[190px] lg:w-[170px] lg:h-[230px] rounded" />
                  </div>
                  <div className="w-full px-2">
                    <Skeleton width={80} height={20} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        {!loading && nextPage && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="bg-secondary xl:w-[30%] w-[80%] h-10 rounded-md mt-5"
          >
            Load More
          </button>
        )}
      </main>
      <Footer />
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Fetch trending anime data from the API endpoint
  const res = await fetch("https://hanime-api-five.vercel.app/trending/day/1");
  const trendingData = await res.json();

  return {
    props: {
      sessions: session,
      trendingData,
    },
  };
}
