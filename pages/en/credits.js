import MobileNav from "@/components/shared/MobileNav";
import { NewNavbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";
import Head from "next/head";
import { motion } from "framer-motion";

export default function Credits() {
  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={{ duration: 1 }}
    >
      <Head>
        <title>Streamsora - Credits</title>
        <meta name="Credits" content="Credits" />
      </Head>
      <>
        <NewNavbar withNav={true} scrollP={5} shrink={true} />

        <MobileNav hideProfile={true} />
        <motion.div
          className="min-h-screen z-20 flex w-screen justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="px-5 lg:px-0 lg:w-[75%] text-2xl gap-7 flex flex-col my-[10rem]"
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="flex"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h1 className="text-4xl font-bold font-karla rounded-md bg-secondary p-3">
                Credits Page
              </h1>
            </motion.div>
            <motion.div
              className="flex flex-col gap-10"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <motion.div
                className="flex flex-col gap-3 text-[#cdcdcd]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
              >
                <p>
                  <strong>Website Developers:</strong> Factiven, Araxyso
                </p>
                <p>
                  <strong>Design and Graphics:</strong> Factiven, Araxyso
                </p>
              </motion.div>
              <motion.p
                className="text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
              >
                We would like to express our gratitude to the following
                resources and contributors:
              </motion.p>
              <motion.div
                className="text-xl ml-5 text-[#cdcdcd]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.5 }}
              >
                <ul className="flex flex-col gap-1">
                  <li>
                    <strong>Icons:</strong> Icons made by Araxyso
                  </li>
                  <li>
                    <strong>Background Image Services:</strong> <a href="https://anilsit.co" target="_blank">Anilist</a>
                  </li>
                  <li>
                    <strong>Font:</strong> Karla font by Google Fonts
                  </li>
                  <li>
                    <strong>Animations:</strong> Framer Motion
                  </li>
                  <li>
                    <strong>Backend Services:</strong> <a href="https://consumet.org" target="_blank">Consumet</a>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
        <Footer />
      </>
    </motion.div>
  );
}
