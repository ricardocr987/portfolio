"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";

export default function Intro() {
  const { ref } = useSectionInView("Home", 0.5);
  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();

  return (
    <section
      ref={ref}
      id="home"
      className="mb-28 max-w-[50rem] text-center sm:mb-40 scroll-mt-[100rem]"
    >
      <div className="flex items-center justify-center">
        <div className="flex flex-row items-center justify-center gap-2 px-4 pb-5 text-lg font-medium">
          <div>
            <motion.h1
              className="mb-10 mt-8 px-4 font-medium !leading-[1.5] text-2xl"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="font-bold">Hello, I'm Ricardo.</span> I'm a{" "}
              <span className="font-bold">full-stack developer</span> with{" "}
              <span className="font-bold">2 years</span> of experience, currently 
              living in Spain. I specialize in building on Solana.
            </motion.h1>
          </div>
          <Image
            src="/pfpHacker.png"
            alt="Ricardo builder mode"
            width="192"
            height="192"
            quality="95"
            priority={true}
            className="h-52 w-52 rounded-lg object-cover clip-y-1"
          />
        </div>
      </div>
    
      <motion.div
        className="flex flex-row items-center justify-center gap-2 px-4 text-lg font-medium"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <Link
          href="#contact"
          className="group bg-gray-900 text-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
          onClick={() => {
            setActiveSection("Contact");
            setTimeOfLastClick(Date.now());
          }}
        >
          Contact here{" "}
        </Link>
    
        {/*<a
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
          href="/CV.pdf"
          download
        >
          Download CV{" "}
          <HiDownload className="opacity-60 group-hover:translate-y-1 transition" />
        </a>*/}
        
        <a
          className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-950 active:scale-105 transition cursor-pointer borderBlack dark/bg-white/10 dark/text-white/60"
          href="https://github.com/ricardocr987"
          target="_blank"
        >
          <FaGithubSquare />
        </a>
      </motion.div>
    </section>  
  );
}
