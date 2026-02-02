"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const moveNoButton = () => {
    if (!noButtonRef.current) return;
    
    const padding = 100; // Keep away from edges
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Get current button rect to calculate initial center
    const rect = noButtonRef.current.getBoundingClientRect();
    const currentAbsoluteX = rect.left + rect.width / 2;
    const currentAbsoluteY = rect.top + rect.height / 2;

    // Calculate a new random position in absolute coordinates
    let newAbsoluteX = Math.random() * (viewportWidth - padding * 2) + padding;
    let newAbsoluteY = Math.random() * (viewportHeight - padding * 2) + padding;

    // Relative change from the current animated position
    // noButtonPos is relative to the button's layout position
    // We want to update noButtonPos such that the button moves to (newAbsoluteX, newAbsoluteY)
    
    // Layout position (where it would be if noButtonPos was 0,0)
    const layoutX = currentAbsoluteX - noButtonPos.x;
    const layoutY = currentAbsoluteY - noButtonPos.y;

    setNoButtonPos({
      x: newAbsoluteX - layoutX,
      y: newAbsoluteY - layoutY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!noButtonRef.current || isAccepted) return;

      const rect = noButtonRef.current.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - buttonCenterX, 2) +
        Math.pow(e.clientY - buttonCenterY, 2)
      );

      // 5mm is roughly 19px on standard displays (96 DPI)
      // Adding button radius to threshold to detect proximity to edges
      const threshold = 19 + rect.width / 2;

      if (distance < threshold) {
        moveNoButton();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isAccepted]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 via-white to-blue-100 p-6 font-sans dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800">
      <AnimatePresence mode="wait">
        {!isAccepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.4 }}
            className="z-10 flex flex-col items-center gap-12 text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight text-purple-900 dark:text-purple-100 sm:text-7xl">
              Hey Precious, <br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                will you be my valentine?
              </span>
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-8">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAccepted(true)}
                className="rounded-2xl bg-purple-600 px-12 py-5 text-2xl font-bold text-white shadow-xl shadow-purple-200 transition-all hover:bg-purple-700 hover:shadow-purple-400 dark:shadow-none"
              >
                Yes
              </motion.button>

              <motion.button
                ref={noButtonRef}
                animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                className="rounded-2xl bg-blue-500 px-12 py-5 text-2xl font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-600 hover:shadow-blue-400 dark:shadow-none"
              >
                No
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-9xl drop-shadow-2xl"
            >
              💐
            </motion.div>
            <h1 className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-8xl font-black text-transparent">
              Yaay!
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl dark:bg-purple-900/20" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-900/20" />
    </div>
  );
}
