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
    title: "Junior dev - Robotter",
    location: "",
    description:
      "I participated in the aleph indexer framework, building some indexers and a code generator as a developer productivity tool.",
    icon: React.createElement(CgWorkAlt),
    date: "2021 - 2022",
  },
  {
    title: "Double degree in IT and Business Management",
    location: "Alicante, Spain",
    description: "Has been a rich learning experience, cultivating my interdisciplinary skills and discipline for the future.",
    icon: React.createElement(LuGraduationCap),
    date: "2023",
  },
  {
    title: "Full-Stack Developer",
    location: "",
    description:
      "I'm now a full-stack developer working as a freelancer. I'm open to part-time opportunities.",
    icon: React.createElement(FaReact),
    date: "2021 - present",
  },
] as const;

export const projectsData = [
  {
    title: "Brick Protocol",
    description:
      "Solana payment gateway, built a Solana program and server for webhook responses and transaction server builder.",
    tags: ["Solana", "Rust", "Bun", "Firebase", "Helius"],
    imageUrl: brickProtocol,
  },
  {
    title: "Own Blog",
    description:
      "Solana monetizable article platform, using aleph as a database. Presented this project as my final thesis at university.",
    tags: ["React", "TypeScript", "Next.js", "Aleph", "Tailwind"],
    imageUrl: ownBlog,
  }
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Bun.js",
  "Git",
  "Tailwind",
  "MongoDB",
  "Redux",
  "GraphQL",
  "Express",
] as const;
