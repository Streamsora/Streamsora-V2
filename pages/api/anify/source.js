import axios from "axios";
import cacheData from "memory-cache";

const API_KEY = process.env.API_KEY;

// Function to fetch new data
export async function fetchInfo(providerId, watchId, episode, id, sub) {
  try {
    const { data } = await axios.get(
      `https://api.anify.tv/sources?providerId=${providerId}&watchId=${encodeURIComponent(
        watchId
      )}&episode=${episode}&id=${id}&subType=${sub}&apikey=${API_KEY}`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { providerId, watchId, episode, id, sub = "sub" } = req.body;

      const cached = cacheData.get(watchId + sub);
      if (cached) {
        return res.status(200).json(cached);
      } else {
        const data = await fetchInfo(providerId, watchId, episode, id, sub);
        if (data) {
          cacheData.put(watchId + sub, data, 1000 * 60 * 10);
          return res.status(200).json(data);
        } else {
          return res.status(404).json({ message: "Source not found" });
        }
      }
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}
