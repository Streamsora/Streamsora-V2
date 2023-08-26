import Head from "next/head";
import { useEffect, useState } from "react";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]";

import dotenv from "dotenv";
import Navigasi from "../../../../components/home/staticNav";
import PrimarySide from "../../../../components/anime/watch/primarySide";
import SecondarySide from "../../../../components/anime/watch/secondarySide";
import { createList, createUser, getEpisode } from "../../../../prisma/user";
import { useAniList } from "../../../../lib/anilist/useAnilist";
// import { updateUser } from "../../../../prisma/user";

export default function Info({
  sessions,
  aniId,
  watchId,
  provider,
  epiNumber,
  dub,
  data,
  userData,
  proxy,
  disqus,
}) {
  const [info] = useState(data.data.Media);
  const { getUserLists } = useAniList(sessions);

  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [artStorage, setArtStorage] = useState(null);
  const [episodesList, setepisodesList] = useState();
  const [mapProviders, setMapProviders] = useState(null);

  const [onList, setOnList] = useState(false);
  const [origin, setOrigin] = useState(null);

  useEffect(() => {
    setLoading(true);
    setOrigin(window.location.origin);
    async function getInfo() {
      if (sessions?.user?.name) {
        const res = await getUserLists(info.id);
        const user = res?.data?.Media;

        if (user?.mediaListEntry) {
          const lists = user.mediaListEntry;

          if (lists) {
            setProgress(lists.progress);
            setLoading(false);

            setOnList(true);
          }
        }
      }

      const [map, anify] = await Promise.allSettled([
        fetch(`/api/consumet/episode/${info.id}`).then((res) => res.json()),
        fetch(`/api/anify/episode/${info.id}${dub ? "?dub=true" : ""}`).then(
          (res) => res.json()
        ),
      ]);

      const firstResponseValue = map.status === "fulfilled" ? map.value : [];
      const anifyValue =
        anify.status === "fulfilled"
          ? firstResponseValue.length > 0
            ? anify.value.filter((i) => i.providerId !== "gogoanime")
            : anify.value
          : [];

      const episodes = dub
        ? anifyValue
        : firstResponseValue.length > 0
        ? [...firstResponseValue, ...anifyValue]
        : anifyValue;

      setMapProviders(firstResponseValue[0]?.episodes || null);

      if (episodes) {
        const getProvider = episodes?.find((i) => i.providerId === provider);
        const episodeList = dub
          ? getProvider?.episodes?.filter((x) => x.hasDub === true)
          : getProvider?.episodes.slice(
              0,
              firstResponseValue[0]?.episodes.length
            );
        const playingData = firstResponseValue[0]?.episodes.find(
          (i) => i.number === Number(epiNumber)
        );

        if (getProvider) {
          setepisodesList(episodeList);
          const currentEpisode = episodeList?.find(
            (i) => i.number === parseInt(epiNumber)
          );
          const nextEpisode = episodeList?.find(
            (i) => i.number === parseInt(epiNumber) + 1
          );
          const previousEpisode = episodeList?.find(
            (i) => i.number === parseInt(epiNumber) - 1
          );
          setCurrentEpisode({
            prev: previousEpisode,
            playing: {
              id: currentEpisode.id,
              title: playingData?.title,
              description: playingData?.description,
              image: playingData?.image,
              number: currentEpisode.number,
            },
            next: nextEpisode,
          });
        } else {
          setLoading(false);
        }
      }

      setArtStorage(JSON.parse(localStorage.getItem("artplayer_settings")));
      // setEpiData(episodes);
      setLoading(false);
    }
    getInfo();

    return () => {
      setCurrentEpisode(null);
    };
  }, [sessions?.user?.name, epiNumber, dub]);

  return (
    <>
      <Head>
        <title>{info?.title?.romaji || "Retrieving data..."}</title>
        <meta
          name="title"
          data-title-romaji={info?.title?.romaji}
          data-title-english={info?.title?.english}
          data-title-native={info?.title?.native}
        />
        <meta
          name="description"
          content={currentEpisode?.playing?.description || info?.description}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Episode ${epiNumber} - ${
            info.title.romaji || info.title.english
          }`}
        />
        <meta
          name="twitter:description"
          content={`${
            currentEpisode?.playing?.description?.slice(0, 180) ||
            info?.description?.slice(0, 180)
          }...`}
        />
        <meta
          name="twitter:image"
          content={`${origin}/api/og?title=${
            info.title.romaji || info.title.english
          }&image=${info.bannerImage || info.coverImage.extraLarge}`}
        />
      </Head>

      <Navigasi />
      <div className="w-screen flex justify-center my-3 lg:my-10">
        <div className="lg:w-[95%] flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between">
          <PrimarySide
            info={info}
            navigation={currentEpisode}
            episodeList={episodesList}
            session={sessions}
            epiNumber={epiNumber}
            providerId={provider}
            watchId={watchId}
            onList={onList}
            proxy={proxy}
            disqus={disqus}
            setOnList={setOnList}
            setLoading={setLoading}
            loading={loading}
            timeWatched={userData?.timeWatched}
            dub={dub}
          />
          <SecondarySide
            info={info}
            map={mapProviders}
            providerId={provider}
            watchId={watchId}
            episode={episodesList}
            progress={progress}
            artStorage={artStorage}
            dub={dub}
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  dotenv.config();

  const session = await getServerSession(context.req, context.res, authOptions);

  const query = context.query;
  if (!query) {
    return {
      notFound: true,
    };
  }

  const proxy = process.env.PROXY_URI;
  const disqus = process.env.DISQUS_SHORTNAME;

  const [aniId, provider] = query.info;
  const watchId = query.id;
  const epiNumber = query.num;
  const dub = query.dub;

  let userData = null;

  const ress = await fetch(`https://graphql.anilist.co`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query ($id: Int) {
              Media (id: $id) {
                id
                idMal
                title {
                  romaji
                  english
                  native
                }
                status
                genres
                episodes
                studios {
                  edges {
                    node {
                      id
                      name
                    }
                  }
                }
                bannerImage
                description
                coverImage {
                  extraLarge
                  color
                }
                synonyms
                  
              }
            }
          `,
      variables: {
        id: aniId,
      },
    }),
  });
  const data = await ress.json();

  try {
    if (session) {
      await createUser(session.user.name);
      await createList(session.user.name, watchId);
      const data = await getEpisode(session.user.name, watchId);
      userData = JSON.parse(
        JSON.stringify(data, (key, value) => {
          if (key === "createdDate") {
            return String(value);
          }
          return value;
        })
      );
    }
  } catch (error) {
    console.error(error);
    // Handle the error here
  }

  return {
    props: {
      sessions: session,
      aniId: aniId || null,
      provider: provider || null,
      watchId: watchId || null,
      epiNumber: epiNumber || null,
      dub: dub || null,
      userData: userData?.[0] || null,
      data: data || null,
      proxy,
      disqus,
    },
  };
}
