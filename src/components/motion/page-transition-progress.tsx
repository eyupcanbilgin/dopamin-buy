"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransitionProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 650);

    return () => window.clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key={pathname}
          className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-primary"
          initial={{ scaleX: 0, opacity: 0.8 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        />
      ) : null}
    </AnimatePresence>
  );
}
