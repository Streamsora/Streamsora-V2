import { aniListData } from "@/lib/anilist/AniList";
import { useState, useEffect, Fragment } from "react";
import Head from "next/head";
import Link from "next/link";
import Footer from "@/components/shared/footer";
import Image from "next/image";
import Content from "@/components/home/hentaicontent";
import { isMobile } from 'react-device-detect';
import { motion } from "framer-motion";

import { signOut, useSession } from "next-auth/react";
import getUpcomingAnime from "@/lib/anilist/getUpcomingAnime";

import GetMedia from "@/lib/anilist/getMedia";
// import UserRecommendation from "../../components/home/recommendation";
import MobileNav from "@/components/shared/MobileNav";
import { getGreetings } from "@/utils/getGreetings";
import { redis } from "@/lib/redis";
import { NewNavbar } from "@/components/shared/NavBar";
import { checkAdBlock } from "adblock-checker";
import { toast } from "sonner";
import { unixTimestampToRelativeTime } from "@/utils/getTimes";
import AgeVerificationModal from "@/components/Modals/AgeRequirements";

export async function getServerSideProps() {
  let cachedData;

  if (redis) {
    cachedData = await redis.get("index_server");
  }

  if (cachedData) {
    const { genre, detail, populars } = JSON.parse(cachedData);
    const upComing = await getUpcomingAnime();
    return {
      props: {
        genre,
        detail,
        populars,
        upComing,
      },
    };
  } else {
    const trendingDetail = await aniListData({
      sort: "TRENDING_DESC",
      page: 1,
    });
    const popularDetail = await aniListData({
      sort: "POPULARITY_DESC",
      page: 1,
    });
    const genreDetail = await aniListData({ sort: "TYPE", page: 1 });

    if (redis) {
      await redis.set(
        "index_server",
        JSON.stringify({
          genre: genreDetail.props,
          detail: trendingDetail.props,
          populars: popularDetail.props,
        }), // set cache for 2 hours
        "EX",
        60 * 60 * 2
      );
    }

    const upComing = await getUpcomingAnime();

    return {
      props: {
        genre: genreDetail.props,
        detail: trendingDetail.props,
        populars: popularDetail.props,
        upComing,
      },
    };
  }
}

export default function Home({ detail, populars, upComing }) {
  const [isAgeVerificationModalOpen, setIsAgeVerificationModalOpen] = useState(true);
  const { data: sessions } = useSession();
  const [ data1, setData] = useState(null);
  const { anime: currentAnime, manga: currentManga } = GetMedia(sessions, {
    stats: "CURRENT",
  });
  const { anime: plan } = GetMedia(sessions, { stats: "PLANNING" });
  const { anime: release } = GetMedia(sessions);

  const [schedules, setSchedules] = useState(null);
  const [anime, setAnime] = useState([]);

  const [recentAdded, setRecentAdded] = useState([]);

  useEffect(() => {
    // Check if the device is mobile, and if it is, redirect or handle accordingly
    if (isMobile) {
      // Redirect or show a message to the user indicating that mobile devices are not supported
      // For example, you can redirect to a dedicated mobile page or display a message
      // window.location.href = '/mobile-not-supported';
      setIsAgeVerificationModalOpen(false); // Close the age verification modal
    }
  }, []);

  useEffect(() => {
    async function adBlock() {
      const ad = await checkAdBlock();
      if (ad) {
        toast.message(
          `Please disable your adblock for better experience, we don't have any ads on our site.`,
          {
            position: "bottom-right",
            important: true,
            duration: 100000,
            className: "flex-center font-karla text-white",
          }
        );
      }
    }
    adBlock();
  }, []);


  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("https://hanime-api-five.vercel.app/trending/day/2");
        const result = await response.json();
        setData(result.results[0]); // Assuming you want to display the first result
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [setData]);  // Make sure to include setData in the dependency array

  async function getRecent() {
    const data = await fetch(`/api/v2/etc/recent/1`)
      .then((res) => res.json())
      .catch((err) => console.log(err));

    setRecentAdded(data?.results);
  }

  useEffect(() => {
    if (sessions?.user?.version) {
      if (sessions.user.version !== "1.0.1") {
        signOut("AniListProvider");
      }
    }
  }, [sessions?.user?.version]);

  useEffect(() => {
    getRecent();
  }, []);

  const update = () => {
    setAnime((prevAnime) => prevAnime.slice(1));
  };

  useEffect(() => {
    if (upComing && upComing.length > 0) {
      setAnime(upComing);
    }
  }, [upComing]);

  const [releaseData, setReleaseData] = useState([]);

  useEffect(() => {
    function getRelease() {
      let releasingAnime = [];
      let progress = [];
      let seenIds = new Set(); // Create a Set to store the IDs of seen anime
      release.map((list) => {
        list.entries.map((entry) => {
          if (
            entry.media.status === "RELEASING" &&
            !seenIds.has(entry.media.id)
          ) {
            releasingAnime.push(entry.media);
            seenIds.add(entry.media.id); // Add the ID to the Set
          }
          progress.push(entry);
        });
      });
      setReleaseData(releasingAnime);
      setProg(progress);
    }
    getRelease();
  }, [release]);

  const [listAnime, setListAnime] = useState(null);
  const [listManga, setListManga] = useState(null);
  const [planned, setPlanned] = useState(null);
  const [user, setUser] = useState(null);
  const [removed, setRemoved] = useState();

  const [prog, setProg] = useState(null);

  const popular = populars?.data;
  const data = detail.data[0];

  useEffect(() => {
    async function userData() {
      try {
        if (sessions?.user?.name) {
          await fetch(`/api/user/profile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: sessions.user.name,
            }),
          });
        }
      } catch (error) {
        console.log(error);
      }
      let data;
      try {
        if (sessions?.user?.name) {
          const res = await fetch(
            `/api/user/profile?name=${sessions.user.name}`
          );
          if (!res.ok) {
            switch (res.status) {
              case 404: {
                console.log("user not found");
                break;
              }
              case 500: {
                console.log("server error");
                break;
              }
              default: {
                console.log("unknown error");
                break;
              }
            }
          } else {
            data = await res.json();
            // Do something with the data
          }
        }
      } catch (error) {
        console.error(error);
        // Handle the error here
      }
      if (!data) {
        const dat = JSON.parse(localStorage.getItem("artplayer_settings"));
        if (dat) {
          const arr = Object.keys(dat).map((key) => dat[key]);
          const newFirst = arr?.sort((a, b) => {
            return new Date(b?.createdAt) - new Date(a?.createdAt);
          });

          const uniqueTitles = new Set();

          // Filter out duplicates and store unique entries
          const filteredData = newFirst.filter((entry) => {
            if (uniqueTitles.has(entry.aniTitle)) {
              return false;
            }
            uniqueTitles.add(entry.aniTitle);
            return true;
          });

          setUser(filteredData);
        }
      } else {
        // Create a Set to store unique aniTitles
        const uniqueTitles = new Set();

        // Filter out duplicates and store unique entries
        const filteredData = data?.WatchListEpisode.filter((entry) => {
          if (uniqueTitles.has(entry.aniTitle)) {
            return false;
          }
          uniqueTitles.add(entry.aniTitle);
          return true;
        });
        setUser(filteredData);
      }
      // const data = await res.json();
    }
    userData();
  }, [sessions?.user?.name, removed]);

  useEffect(() => {
    async function userData() {
      if (!sessions?.user?.name) return;

      const getMedia =
        currentAnime.find((item) => item.status === "CURRENT") || null;
      const listAnime = getMedia?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      const getManga =
        currentManga?.find((item) => item.status === "CURRENT") || null;
      const listManga = getManga?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      const planned = plan?.[0]?.entries
        .map(({ media }) => media)
        .filter((media) => media);

      if (listManga) {
        setListManga(listManga);
      }
      if (listAnime) {
        setListAnime(listAnime);
      }
      if (planned) {
        setPlanned(planned);
      }
    }
    userData();
  }, [sessions?.user?.name, currentAnime, plan]);

  // console.log({ recentAdded });

  return (
    <Fragment>
      <Head>
        <title>Streamsora</title>
        <meta charSet="UTF-8"></meta>
        <link rel="icon" href="/streamsora.png" />
        <link rel="canonical" href="https://streamsora.live/en/" /><meta name="twitter:card" content="summary_large_image" />
        {/* Write the best SEO for this homepage */}
        <meta
          name="description"
          content="Unveil your next cherished anime or manga obsession! Streamsora presents an expansive vault of premium content, conveniently available across various devices, guaranteeing uninterrupted enjoyment. Dive into the Streamsora experience today and commence your journey into a world of limitless entertainment!"
        />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://streamsora.live/" />
        <meta
          name="twitter:title"
          content="StreamSora: Your Gateway to Free Anime and Manga Streaming Delight"
        />
        <meta property="og:image" content="/streamsora.png" />
        <meta property="og:site_name" content="Streamsora" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Streamsora - Free Anime and Manga Streaming"
        />
        <meta
          name="twitter:description"
          content="Embark on a journey to discover your next beloved anime or manga series! Streamsora boasts an extensive collection of top-tier content, easily accessible across various devices, ensuring a seamless streaming experience devoid of any disruptions. Begin your Streamsora adventure today and immerse yourself in the world of limitless entertainment!"
        />
        <meta name="twitter:image" content="/streamsora.png" />
      </Head>
      <MobileNav sessions={sessions} hideProfile={true} />

      <NewNavbar paddingY="pt-2 lg:pt-10" withNav={true} home={true} />
      {/* Render AgeVerificationModal if it's open */}
      {isAgeVerificationModalOpen && (
        <AgeVerificationModal isOpen={isAgeVerificationModalOpen} setIsOpen={setIsAgeVerificationModalOpen} />
      )}
      <div className="h-auto w-screen bg-[#141519] text-[#dbdcdd]">
        {/* PC / TABLET */}
        <div className=" hidden justify-center lg:flex my-16">
          <div className="relative grid grid-rows-2 items-center lg:flex lg:h-[467px] lg:w-[80%] lg:justify-between">
            <div className="row-start-2 flex h-full flex-col gap-7 lg:w-[55%] lg:justify-center">
              <h1 className="w-[85%] font-outfit font-extrabold lg:text-[34px] line-clamp-2">
                {data1?.name}
              </h1>
              <p
                className="font-roboto font-light lg:text-[18px] line-clamp-5"
                dangerouslySetInnerHTML={{ __html: data1?.slug }}
              />

              <div className="lg:pt-5 flex">
                <Link
                  href={`/en/anime/${data1?.id}`}
                  className="rounded-sm rounded-tl-[4px] rounded-tr-[4px] rounded-bl-[4px] rounded-br-[4px] p-3 text-[#66ccff] border border-[#66ccff] hover:bg-[#66ccff] hover:text-white hover:ring-2 hover:ring-[#66ccff] transition-all duration-300 text-md font-karla font-light m-3"
                >
                  START WATCHING
                </Link>
              </div>
            </div>
            <div className="z-10 row-start-1 flex justify-center ">
              <div className="relative  lg:h-[467px] lg:w-[322px] lg:scale-100">
                <div className="absolute bg-gradient-to-t from-[#141519] to-transparent lg:h-[467px] lg:w-[322px]" />
                <Image
                  src={data1?.cover_url}
                  alt={data1?.name}
                  width={1200}
                  height={1200}
                  priority
                  className="rounded-tl-xl rounded-tr-xl object-cover bg-blend-overlay lg:h-[467px] lg:w-[322px]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:mt-16 mt-5 flex flex-col items-center">
          <motion.div
            className="w-screen flex-none lg:w-[87%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.2 }} // Add staggerChildren prop
          >
            {/* SECTION 3 */}
            {recentAdded?.length > 0 && (
              <motion.section // Add motion.div to each child component
                key="recentAdded"
                initial={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                <Content
                  ids="recentAdded"
                  section="Trending Today"
                  data={recentAdded}
                />
              </motion.section>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
}
