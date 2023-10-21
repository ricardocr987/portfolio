import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import ownBlog from "@/public/ownBlog.png";
import brickProtocol from "@/public/brickProtocol.png";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "robotter.ai & aleph.im",
    location: "",
    description:
      "I made contributions to Fishnet monetization system and the aleph indexer framework.",
    icon: React.createElement(CgWorkAlt),
    date: "2022 - 2023",
  },
  {
    title: "Degree in CS and BM",
    location: "Alicante, Spain",
    description: "Studying two careers and trying to be an entrepreneur at the same time has been difficult but it has forged me.",
    icon: React.createElement(LuGraduationCap),
    date: "2023",
  },
  {
    title: "Full-Stack Developer",
    location: "",
    description:
      "I'm now a full-stack developer working as a freelancer. I'm open to part-time opportunities.",
    icon: React.createElement(FaReact),
    date: "present",
  },
] as const;

export const projectsData = [
  {
    title: "Brick Protocol",
    description:
      "Solana payment gateway, a Solana program, and a server for webhook responses and transaction handling",
    tags: ["Solana", "Rust", "Bun", "Firebase", "Helius"],
    imageUrl: brickProtocol,
    url: "https://www.brickprotocol.xyz/"
  },
  {
    title: "Own Blog",
    description:
      "Solana monetizable article platform, using aleph as a database. Presented this project as my final thesis at university.",
    tags: ["React", "TypeScript", "Next.js", "Aleph", "Tailwind"],
    imageUrl: ownBlog,
    url: "https://www.ownblog.xyz/"
  }
] as const;

export const skillsData = [
  "Solana",
  "Anchor",
  "Rust",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Bun.js",
  "Git",
  "Tailwind",
  "Firebase",
  "Redux",
  "GraphQL",
  "Express",
] as const;
