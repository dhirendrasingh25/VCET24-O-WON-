"use client";
import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "../ui/aurora-background";
import {
    Modal,
    ModalTrigger,
  } from "../ui/animated-modal";
import Link from "next/link";

export default function Home() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col items-center justify-center px-4"
      >
        <div className="text-3xl bg-gradient-to-r py-2 from-indigo-400 to-cyan-400 bg-clip-text  text-transparent  md:text-7xl font-bold dark:text-white text-center">
          Smart bachat, bright future!
        </div>
        <div className="  font-semibold text-base md:text-4xl dark:text-neutral-200 py-4">
            Bachat ka naya funda!
        </div>
        <Modal>
        <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
          <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
            Take a Quiz Now !
          </span>
          <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
          <Link href="#quiz">
          🏦
          </Link>
          </div>
        </ModalTrigger>
        </Modal>
      </motion.div>
    </AuroraBackground>
  );
}
