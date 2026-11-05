import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedModalProps {
  children: ReactNode;
  role?: "dialog" | "alertdialog";
  ariaLabelledBy?: string;
  maxWidthClassName?: string;
  zIndexClassName?: string;
}

export function AnimatedModal({
  children,
  role = "dialog",
  ariaLabelledBy,
  maxWidthClassName = "max-w-md",
  zIndexClassName = "z-50",
}: AnimatedModalProps) {
  return (
    <motion.div
      className={`fixed inset-0 ${zIndexClassName} flex items-center justify-center bg-black/40 px-4`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        role={role}
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className={`w-full ${maxWidthClassName} rounded-xl bg-white p-6 shadow-lg`}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
