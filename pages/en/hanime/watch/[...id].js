// pages/watch/[...id].js
import React, { useEffect, useState } from 'react';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import Image from "next/image";
import { FlagIcon, ShareIcon, Flaglink } from "@heroicons/react/24/solid";
import _debounce from 'lodash.debounce';
import { NewNavbar } from "@/components/shared/NavBar";
import MobileNav from "@/components/shared/MobileNav"; // Import lodash debounce

export default function WatchPage({ video }) {
  const [isClient, setIsClient] = useState(false);
  const [isClient1, setIsClient1] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showURL, setShowURL] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsClient1(true);
  }, []);

  function handleOpen() {
    setOpen(true);
    document.body.style.overflow = "hidden";
  }

  function handleClose() {
    setOpen(false);
    document.body.style.overflow = "auto";
  }

  const handleShowURL = () => {
    setShowURL(!showURL);
  };


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
      <NewNavbar
        scrollP={20}
        withNav={true}
        shrink={true}
        paddingY={`py-2 : "lg:py-4"}`}
      />
      <MobileNav hideProfile={true} />
      <div className="w-full lg:w-[70%] mb-8 lg:mb-0">
        {/* Conditional rendering of MediaPlayer */}
        {video && video.streams && Array.isArray(video.streams) && video.streams.length > 0 && (
          <MediaPlayer title={video.name} src={video.streams[1].url} className="w-full h-full top-[2vh]">
            <MediaProvider />
            <DefaultVideoLayout thumbnails={video.cover_url} icons={defaultLayoutIcons} />
          </MediaPlayer>
        )}
      </div>

      {/* Right Section containing Video Information and Episode List */}
      <div className="lg:w-[40%] lg:ml-10">
        {video && (
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
                <button
                  type="button"
                  onClick={handleShowURL}
                  className="flex items-center gap-2 px-3 py-1 ring-[1px] ring-white/20 rounded overflow-hidden"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z" clipRule="evenodd" />
                  </svg>
                  Video Url
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Information Section */}
        {video && video.name && video.cover_url && (
          <div className="mb-8">
            <Image src={video.cover_url} alt={video.name} width={200} height={100} className="rounded mb- pb-top-2" />
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{video.name}</h1>
            {video.tags && Array.isArray(video.tags) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {video.tags.map((tag, index) => (
                  <a key={index} className="border border-[#66ccff] p-1 border-3498db rounded-md text-3498db">
                    {tag.name}
                  </a>
                ))}
              </div>
            )}
            {isClient && video.description && (
              <div className={`bg-secondary rounded-md mt-3`}>
                <p dangerouslySetInnerHTML={{ __html: video.description }} className={`p-5 text-sm font-light font-roboto text-[#e4e4e4]`} />
              </div>
            )}
            {isClient1 && showURL && video.streams[1].url && video.streams[1].size_mbs && (
              <div className={`bg-secondary rounded-md mt-2.5`}>
                <p className={`p-2 text-sm font-light font-roboto text-[#e4e4e4] w-[50vh] break-all`}>
                  {video.streams[1].url}
                </p>
                <p className="p-2 text-sm font-light font-roboto text-[#e4e4e4]">Video Size: {video.streams[1].size_mbs}Mbs</p>
              </div>
            )}
          </div>
        )}

        {/* Episode List Section */}
        {video && video.episodes && Array.isArray(video.episodes) && (
          <div className="max-w-800 mx-auto p-1s shadow-md">
            <h2 className="text-3xl font-bold mb-3">Episode List</h2>
            {/* Episode List Grid */}
            <div className="grid gap-4 grid-cols-repeat-auto-fill-minmax-150">
              {/* Individual Episode Cards */}
              {video.episodes.map((episode) => (
                <div key={episode.id} className="rounded bg-secondary p-4 overflow-hidden transition-transform transform hover:scale-105">
                  <div className="text-center">
                    <h3 className="text-lg lg:text-xl font-semibold mb-2">{episode.name}</h3>
                    <p className="text-gray-600 text-sm lg:text-base mb-2">Views: {episode.views}</p>
                    <a href={`/en/hanime/watch/${episode.id}`} className="font-semibold text-[#66ccff] text-sm lg:text-base">
                      Watch Episode
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const corsProxy = "https://m3u8-proxy-cors-lac-rho.vercel.app/cors?url="; // Replace with your actual CORS proxy server URL

  try {
    const response = await fetch(`https://hanime-api-five.vercel.app/watch/${id}`);
    const data = await response.json();

    if (!data.results || !data.results[0]) {
      return {
        props: {
          video: null,
        },
      };
    }

    // Apply the CORS proxy to the streams. Note the use of encodeURIComponent to
    // encode the URL parameters.
    const streamsWithCorsProxy = data.results[0].streams.map(stream => ({
      ...stream,
      url: `${corsProxy}${encodeURIComponent(stream.url)}` // Updated to match proxy usage instructions
    }));

    const video = {
      ...data.results[0],
      streams: streamsWithCorsProxy
    };

    return {
      props: {
        video,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        video: null,
      },
    };
  }
}
