import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

export default function Footer({ name }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 500);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <>
      <footer className="footer">
        <div className="wrap">
          <span>© {new Date().getFullYear()} Developer Portfolio by <b>{name}</b></span>
          <span>All rights reserved</span>
        </div>
      </footer>
      <AnimatePresence>
        {show && (
          <motion.button className="to-top" aria-label="Back to top" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} whileHover={{ y: -4 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <FaArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
