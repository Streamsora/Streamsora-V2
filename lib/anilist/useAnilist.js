import { toast } from "react-toastify";

export const useAniList = (session) => {
  const accessToken = session?.user?.token;

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

  const markComplete = async (mediaId) => {
    if (!accessToken) return;
    const completeQuery = `
      mutation($mediaId: Int) {
        SaveMediaListEntry(mediaId: $mediaId, status: COMPLETED) {
          id
          mediaId
          status
        }
      }
    `;
    const data = await fetchGraphQL(completeQuery, { mediaId });
    console.log({ Complete: data });
  };

  const markPlanning = async (mediaId) => {
    if (!accessToken) return;
    const planningQuery = `
      mutation($mediaId: Int ) {
        SaveMediaListEntry(mediaId: $mediaId, status: PLANNING) {
          id
          mediaId
          status
        }
      }
    `;
    const data = await fetchGraphQL(planningQuery, { mediaId });
    console.log({ added_to_list: data });
  };

  const getUserLists = async (id) => {
    const getLists = `
      query ($id: Int) {
        Media(id: $id) {
          mediaListEntry {
            progress
            status
            customLists
            repeat
          }
          id
          type
          title {
            romaji
            english
            native
          }
          format
          episodes
          nextAiringEpisode {
              episode
          }
        }
      }
    `;
    const data = await fetchGraphQL(getLists, { id });
    return data;
  };

  const customLists = async (lists) => {
    const setList = `
      mutation($lists: [String]){
        UpdateUser(animeListOptions: { customLists: $lists }){
          id
        }
      }
    `;
    const data = await fetchGraphQL(setList, { lists });
    return data;
  };

  const markProgress = async (mediaId, progress, stats, volumeProgress) => {
    if (!accessToken) return;
    const progressWatched = `
    mutation($mediaId: Int, $progress: Int, $status: MediaListStatus, $progressVolumes: Int, $lists: [String], $repeat: Int) {
      SaveMediaListEntry(mediaId: $mediaId, progress: $progress, status: $status, progressVolumes: $progressVolumes, customLists: $lists, repeat: $repeat) {
        id
        mediaId
        progress
        status
      }
    }
  `;

    const user = await getUserLists(mediaId);
    const media = user?.data?.Media;
    if (media && media.type !== "MANGA") {
      let checkList =
        Object.entries(media.mediaListEntry?.customLists)
          .filter(([key, value]) => value === true)
          .map(([key, value]) => key) || [];

      if (!checkList?.includes("Watched using Moopa")) {
        checkList.push("Watched using Moopa");
        await customLists(checkList);
      }

      let lists =
        Object.entries(media.mediaListEntry?.customLists)
          .filter(([key, value]) => value === true)
          .map(([key, value]) => key) || [];

      if (!lists?.includes("Watched using Moopa")) {
        lists.push("Watched using Moopa");
      }

      const singleEpisode =
        (!media.episodes ||
          (media.format === "MOVIE" && media.episodes === 1)) &&
        1;
      const videoEpisode = Number(progress) || singleEpisode;
      const mediaEpisode =
        media.nextAiringEpisode?.episode || media.episodes || singleEpisode;
      const status =
        media.mediaListEntry?.status === "REPEATING" ? "REPEATING" : "CURRENT";

      let variables = {
        mediaId,
        progress,
        status,
        progressVolumes: volumeProgress,
        lists,
      };

      if (videoEpisode === mediaEpisode) {
        variables.status = "COMPLETED";
        if (media.mediaListEntry?.status === "REPEATING")
          variables.repeat = media.mediaListEntry.repeat + 1;
      }

      if (lists.length > 0) {
        await fetchGraphQL(progressWatched, variables);
        console.log(`Progress Updated: ${progress}`, status);
        // toast.success(`Progress Updated: ${progress}`, {
        //   position: "bottom-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   draggable: true,
        //   theme: "dark",
        // });
      }
    } else if (media && media.type === "MANGA") {
      let variables = {
        mediaId,
        progress,
        status: stats,
        progressVolumes: volumeProgress,
      };

      await fetchGraphQL(progressWatched, variables);
      console.log(`Progress Updated: ${progress}`, status);
      toast.success(`Progress Updated: ${progress}`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return { markComplete, markProgress, markPlanning, getUserLists };
};
