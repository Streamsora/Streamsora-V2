import React, { useEffect, useState } from "react";

export default function GetMedia(session, stats) {
  const [media, setMedia] = useState([]);
  const accessToken = session?.user?.token;
  const username = session?.user?.name;
  const status = stats || null;

  const fetchGraphQL = async (query, variables) => {
    const response = await fetch("https://graphql.anilist.co/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
      },
      body: JSON.stringify({ query, variables }),
    });
    return response.json();
  };

  useEffect(() => {
    if (!username || !accessToken) return;
    const queryMedia = `
      query ($username: String, $status: MediaListStatus) {
        MediaListCollection(userName: $username, type: ANIME, status: $status) {
          lists {
            status
            name
            entries {
              id
              mediaId
              status
              progress
              score
              media {
                id
                status
                nextAiringEpisode {
                  timeUntilAiring
                  episode
                }
                title {
                  english
                  romaji
                }
                episodes
                coverImage {
                  large
                }
              }
            }
          }
        }
      }
    `;
    fetchGraphQL(queryMedia, { username, status: status?.stats }).then((data) =>
      setMedia(data.data.MediaListCollection.lists)
    );
  }, [username, accessToken, status?.stats]);

  return { media };
}
