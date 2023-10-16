import { NewNavbar } from "@/components/shared/NavBar";
import Footer from "@/components/shared/footer";
import { motion } from "framer-motion"; // Import Framer Motion

const Contact = () => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: -20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      className=" text-white min-h-screen flex flex-col items-center justify-center"
    >
      <NewNavbar withNav={true} scrollP={5} shrink={true} />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold font-karla mb-4">Contact Us</h1>
        <p className="text-lg mb-2">
          If you have any questions or comments, please email us at:
        </p>
        <a
          href="mailto:contact@streamsora.live?subject=[Streamsora]%20-%20Your%20Subject"
          className="text-blue-400 text-xl hover:underline"
        >
          contact@streamsora.live
        </a>
      </motion.div>
    </motion.div>
  );
};

export default Contact;
