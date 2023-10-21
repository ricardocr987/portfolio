"use client";

import React from "react";
import SectionHeading from "./section-heading";
import { motion } from "framer-motion";
import { useSectionInView } from "@/lib/hooks";
import Link from "next/link";

export default function About() {
  const { ref } = useSectionInView("About");

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] text-center leading-8 sm:mb-40 scroll-mt-28"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>About me</SectionHeading>
      <p className="mb-3">
        During my Erasmus experience in Germany, I made the decision to follow my passion for programming on the Solana Blockchain. Since that moment,
        I've actively engaged in various open-source projects and initiatives{"  "}
        <Link className="underline text-orange-600 hover:text-orange-800" href="https://www.brickprotocol.xyz/">Brick</Link>{"  "}
        <Link className="underline text-orange-600 hover:text-orange-800" href="https://fishnet.tech/">Fishnet</Link>{"  "}
        <Link className="underline text-orange-600 hover:text-orange-800" href="https://aleph.im/">Aleph.im</Link>{"  "}
        <Link className="underline text-orange-600 hover:text-orange-800" href="https://bekon.town/">BekonTown</Link>
      </p>

      <p className="mb-3">
        Best thing about these two years of attending events non-stop is that I've had the chance to meet an amazing group of people{" "}
        <Link className="underline text-orange-600 hover:text-orange-800" href="https://heavyduty.builders/">Heavy Duty</Link>{"  "}
        <Link className="underline text-orange-600 hover:text-orange-800" href="https://robotter.ai/">Robotter.ai</Link>
      </p>
      <p>My favorite part of programming is the problem-solving aspect.</p>
    </motion.section>
  );
}
