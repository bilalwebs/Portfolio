import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <div className="flex flex-col items-center">
            <div className="relative grid h-32 w-32 place-items-center">
              {/* soft glow */}
              <span className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
              {/* static faint ring */}
              <span className="absolute inset-0 rounded-full border border-primary/25" />
              {/* spinning arc */}
              <span
                className="absolute inset-0 rounded-full border-2 border-transparent border-b-primary"
                style={{ animation: "spin 1.2s linear infinite" }}
              />
              {/* initials */}
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative text-3xl font-bold tracking-widest text-primary text-glow"
              >
                BH
              </motion.span>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-8 text-[10px] font-semibold uppercase tracking-[0.5em] text-primary"
            >
              ✦ Welcome ✦
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.55 }}
              className="mt-3 text-3xl font-bold gradient-text sm:text-4xl"
            >
             Bilal Hussain
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-1 text-sm font-semibold text-foreground/80"
            >
              Agentic AI & Full-Stack Portfolio
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
