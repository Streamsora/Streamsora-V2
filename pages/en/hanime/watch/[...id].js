// pages/watch/[...id].js
import { useRouter } from 'next/router';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import React from "react";
import Image from "next/image";

export default function WatchPage({ video }) {
  return (
    <div className="flex flex-col items-center p-20">
      <MediaPlayer title={video.name} src={video.streams[0].url} className="w-full h-full">
        <MediaProvider />
        <DefaultVideoLayout thumbnails={video.cover_url} icons={defaultLayoutIcons} />
      </MediaPlayer>
      <div className="mt-20">
        <Image
          src={video?.cover_url}
          alt={video?.name}
          width={1200}
          height={1200}
          priority
          className="rounded-tl-xl rounded-tr-xl object-cover bg-blend-overlay lg:h-[467px] lg:w-[322px]"
        />
      </div>
      <div className="mt-20 text-center">
        <h1>{video.name}</h1>
        <p>{video.description}</p>
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
