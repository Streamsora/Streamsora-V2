import MobileNav from "@/components/shared/MobileNav";
import { NewNavbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";
import Head from "next/head";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Status() {
  const servers = [
    { url: 'https://api.streamsora.live', altName: 'API' },
    { url: 'https://m3u8.streamsora.live', altName: 'M3U8' },
    { url: 'https://streamsora.live', altName: 'Website' },
    // Add more servers as needed
  ];
  const [serverStatusList, setServerStatusList] = useState([]);

  useEffect(() => {
    const checkServerStatus = async () => {
      const promises = servers.map(async ({ url, altName }) => {
        try {
          const response = await fetch(url);
          const status = response.ok ? 'Up' : 'Down';
          return { altName, status };
        } catch (error) {
          console.error(`Error checking server status for ${altName}:`, error);
          return { altName, status: 'Error' };
        }
      });

      Promise.all(promises)
        .then((results) => {
          setServerStatusList(results);
        })
        .catch((error) => {
          console.error("Error checking server statuses:", error);
        });
    };

    checkServerStatus();
  }, [servers]);

  const pageVariants = {
    initial: {
      opacity: 0,
      x: -100,
    },
    animate: {
      opacity: 1,
      x: 0,
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={{ duration: 1 }}
      className="min-h-screen flex items-center justify-center text-white"
    >
      <Head>
        <title>Streamsora - Status</title>
        <meta name="Status" content="Status" />
      </Head>
      <>
        <NewNavbar withNav={true} scrollP={5} shrink={true} />
        <MobileNav hideProfile={true} />

        <motion.div
          className="w-full max-w-screen-lg p-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-center mb-6">Status</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-[#ccc]">
            {/* Server Status Table */}
            {serverStatusList.map(({ altName, status }, index) => (
              <div
                key={index}
                className={`stat-box p-4 border rounded-lg flex items-center ${status === 'Up' ? 'border-green-500' : (status === 'Error' ? 'border-yellow-500' : 'border-red-500')}`}
              >
                <p className="text-lg">{altName}</p>
                <p className={`text-2xl font-semibold ml-auto ${status === 'Up' ? 'text-green-500' : (status === 'Error' ? 'text-yellow-500' : 'text-red-500')}`}>
                  {status || 'Checking...'}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </>
    </motion.div>
  );
}
