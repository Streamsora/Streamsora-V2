export const GET_MEDIA_INFO = `
query ($id: Int) {
    Media(id: $id) {
        id
        type
        title {
            romaji
            english
            native
        }
        coverImage {
            extraLarge
            large
            color
        }
        bannerImage
        description
        episodes
        nextAiringEpisode {
            episode
            airingAt
            timeUntilAiring
        }
        averageScore
        popularity
        status
        startDate {
            year
        }
        duration
        relations {
            edges {
                id
                relationType(version: 2)
                node {
                  id
                  title {
                    userPreferred
                  }
                  format
                  type
                  status(version: 2)
                  bannerImage
                  coverImage {
                    extraLarge
                    color
                  }
                }
            }
        }
        recommendations {
                nodes {
                    mediaRecommendation {
                        id
                        title {
                            romaji
                        }
                        coverImage {
                            extraLarge
                            large
                        }
                    }
            }
        }
    }
}
`;
