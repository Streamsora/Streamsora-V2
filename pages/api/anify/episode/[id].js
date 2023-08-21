import axios from "axios";
import cacheData from "memory-cache";

const API_KEY = process.env.API_KEY;

// Function to fetch new data
export async function fetchInfo(id) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/episodes/${id}?apikey=${API_KEY}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const id = req.query.id;
    const dub = req.query.dub || false;
    const refresh = req.query.refresh || false;

    const cached = cacheData.get(id);

    if (refresh) {
      cacheData.del(id);
    }

    if (!refresh && cached) {
      if (dub) {
        const filtered = cached.filter((item) =>
          item.episodes.some((epi) => epi.hasDub === true)
        );
        res.status(200).json(filtered);
      } else {
        res.status(200).json(cached);
      }
    } else {
      const data = await fetchInfo(id);
      if (data) {
        const filtered = data.filter((item) => item.providerId !== "animepahe");
        const modifiedData = filtered.map((provider) => {
          if (provider.providerId === "gogoanime") {
            const reversedEpisodes = [...provider.episodes].reverse();
            return { ...provider, episodes: reversedEpisodes };
          }
          return provider;
        });

        cacheData.put(id, modifiedData, 1000 * 60 * 10);
        res.status(200).json(modifiedData);
      } else {
        res.status(404).json({ message: "Episode not found" });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
