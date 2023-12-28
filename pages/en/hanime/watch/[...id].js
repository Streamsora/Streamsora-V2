// pages/watch/[...id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import React from "react";
import Image from "next/image";
import Footer from "@/components/shared/footer";
import { NewNavbar } from "@/components/shared/NavBar";
import MobileNav from "@/components/shared/MobileNav";
import Modal from "@/components/modal";
import { signIn } from "next-auth/react";
import AniList from "@/components/media/aniList";
import BugReportForm from "@/components/shared/bugReport";
import { FlagIcon, ShareIcon } from "@heroicons/react/24/solid";

export default function WatchPage({ video }) {
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  function handleOpen() {
    setOpen(true);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setOpen(false);
    document.body.style.overflow = "auto";
  }

  const handleShareClick = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Watch Now - ${video?.name}`,
          url: window.location.href,
        });
      } else {
        // Web Share API is not supported, provide a fallback or show a message
        alert("Web Share API is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center p-8 lg:p-20">
      <BugReportForm isOpen={isOpen} setIsOpen={setIsOpen} />
      <NewNavbar
        scrollP={20}
        withNav={true}
        shrink={true}
      />
      <MobileNav hideProfile={true}/>

      {/* Video Player Section on the left */}
      <div className="w-full lg:w-[70%] mb-8 lg:mb-0">
        <MediaPlayer title={video.name} src={video.streams[1].url} className="w-full h-full top-[2vh]">
          <MediaProvider />
          <DefaultVideoLayout thumbnails={video.cover_url} icons={defaultLayoutIcons} />
        </MediaPlayer>
      </div>


      {/* Right Section containing Video Information and Episode List */}
      <div className="lg:w-[40%] lg:ml-10">

        <div className={"items-end justify-between pt-2 pb-2"}>
          <div>
            <div className="flex gap-2 text-sm">
              <button
                type="button"
                onClick={handleShareClick}
                className="flex items-center gap-2 px-3 py-1 ring-[1px] ring-white/20 rounded overflow-hidden"
              >
                <ShareIcon className="w-5 h-5" />
                share
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-3 py-1 ring-[1px] ring-white/20 rounded overflow-hidden"
              >
                <FlagIcon className="w-5 h-5" />
                report
              </button>
            </div>
          </div>
        </div>

        {/* Video Information Section */}
        <div className="mb-8">
            <Image src={video.cover_url} alt={video.name} width={200} height={100} className="rounded mb- pb-top-2" />
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{video.name}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {video.tags.map((tag, index) => (
              <a key={index} className="border border-[#66ccff] p-1 border-3498db rounded-md text-3498db">
                {tag.name}
              </a>
            ))}
          </div>
          <div className={`bg-secondary rounded-md mt-3`}>
            {isClient && video && (
              <p
                dangerouslySetInnerHTML={{ __html: video.description }}
                className={`p-5 text-sm font-light font-roboto text-[#e4e4e4] `}
              />
            )}
          </div>
        </div>

        {/* Episode List Section */}
        <div className="max-w-800 mx-auto p-1s shadow-md">

          <h2 className="text-3xl font-bold mb-3">Episode List</h2>

          {/* Episode List Grid */}
          <div className="grid gap-4 grid-cols-repeat-auto-fill-minmax-150">
            {/* Individual Episode Cards */}
            {video.episodes.map((episode) => (
              <div key={episode.id} className="rounded bg-secondary p-4 overflow-hidden transition-transform transform hover:scale-105">
                <div className="text-center">

                  {/* Episode Details */}
                  <h3 className="text-lg lg:text-xl font-semibold mb-2">{episode.name}</h3>
                  <p className="text-gray-600 text-sm lg:text-base mb-2">Views: {episode.views}</p>

                  {/* Watch Episode Link */}
                  <a href={`/en/hanime/watch/${episode.id}`} className="font-semibold text-[#66ccff] text-sm lg:text-base">Watch Episode</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const response = await fetch(`https://hanime-api-five.vercel.app/watch/${id}`, {
    headers: {
      'Access-Control-Allow-Origin': true,
    },
  });
  const data = await response.json();
  return {
    props: {
      video: data.results[0],
    },
  };
}

/*
export default function WatchPage({ video }) {
  return (
    <div className="flex flex-col items-center p-8 lg:p-20">

      {/!* Video Player Section *!/}
      <div className="w-full lg:w-[60%] mb-10">
        <MediaPlayer title={video.name} src={video.streams[1].url} className="w-full h-full">
          <MediaProvider />
          <DefaultVideoLayout thumbnails={video.cover_url} icons={defaultLayoutIcons} />
        </MediaPlayer>
      </div>

      {/!* Episode Information and List Section *!/}
      <div className="flex w-full lg:w-[60%]">

        {/!* Episode Information Section *!/}
        <div className="flex-shrink-0 mr-8">
          <Image src={video.cover_url} alt={video.name} width={250} height={100} className="rounded mb-4" />
        </div>

        <div className="flex flex-col justify-center w-full">

          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{video.name}</h1>

          {/!* Episode Tags *!/}
          <div className="flex gap-2 mb-4">
            {video.tags.map((tag, index) => (
              <a key={index} href={tag.link} className="border border-[#66ccff] p-1 border-3498db rounded-md text-3498db">
                {tag.name}
              </a>
            ))}
          </div>
          <div className={`bg-secondary rounded-md mt-5`}>
            {video && (
              <p
                dangerouslySetInnerHTML={{ __html: video.description }}
                className={`p-5 text-sm font-light font-roboto text-[#e4e4e4] `}
              />
            )}
          </div>
        </div>

        {/!* Episode List Section *!/}
        <div className="max-w-800 mx-auto p-8 rounded-lg shadow-md">

          <h2 className="text-3xl font-bold mb-4">Episode List</h2>

          {/!* Episode List Grid *!/}
          <div className="grid gap-5 grid-cols-repeat-auto-fill-minmax-150">
            {/!* Individual Episode Cards *!/}
            {video.episodes.map((episode) => (
              <div key={episode.id} className="episode-card border p-4 border-3498db rounded-md overflow-hidden transition-transform transform hover:scale-105">
                <div className="text-center">

                  {/!* Episode Details *!/}
                  <h3 className="text-lg lg:text-xl font-semibold mb-2">{episode.name}</h3>

                  {/!* Watch Episode Link *!/}
                  <a href={episode.link} className="font-semibold text-[#66ccff] text-sm lg:text-base">Watch Episode</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}*/
