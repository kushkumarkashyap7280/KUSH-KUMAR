import { FaLightbulb, FaCogs, FaPalette, FaCode, FaLaptopCode, FaProjectDiagram, FaReact, FaRocket, FaServer, FaMobileAlt, FaBrain, FaShieldAlt, FaKey, FaDatabase } from "react-icons/fa";
import {
  SiReact,
  SiNodedotjs,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiPython,
  SiDjango,
  SiGithub,
  SiGit,
  SiDocker,
  SiVite
} from "react-icons/si";
import { SiCloudinary, SiMysql, SiExpress, SiJsonwebtokens } from "react-icons/si";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaXTwitter,
  FaGithub as FaGithubFa6,
} from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

const navLinks = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Qualifications",
    link: "#qualifications",
  },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "Posts",
    link: "#posts",
  },
];


const words = [
  { text: "Developer", icon: FaLaptopCode, color: "text-sky-400" },
  { text: "Problem-Solver", icon: FaCogs, color: "text-emerald-400" },
  { text: "Innovator", icon: FaLightbulb, color: "text-yellow-400" },
  { text: "Algorithmist", icon: FaProjectDiagram, color: "text-purple-400" },
  { text: "Optimizer", icon: FaRocket, color: "text-orange-400" },
  { text: "Full-Stacker", icon: FaServer, color: "text-indigo-400" },
  { text: "Thinker", icon: FaBrain, color: "text-lime-400" },

];



const logoIconsList = [
  { name: "React", Icon: SiReact, color: "#61DAFB" },
  { name: "Node.js", Icon: SiNodedotjs, color: "#3C873A" },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
  { name: "TailwindCSS", Icon: SiTailwindcss, color: "#38BDF8" },
  { name: "MongoDB", Icon: SiMongodb, color: "#10AA50" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#336791" },
  { name: "Python", Icon: SiPython, color: "#3776AB" },
  { name: "Django", Icon: SiDjango, color: "#092E20" },
  { name: "Git", Icon: SiGit, color: "#F1502F" },
  { name: "GitHub", Icon: SiGithub, color: "#FFFFFF" },
  { name: "Docker", Icon: SiDocker, color: "#2496ED" },
  { name: "Vite", Icon: SiVite, color: "#646CFF" },
];

const abilities = [
  {
    Icon: FaCogs,
    color: "#34D399", // emerald
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    Icon: FaMobileAlt,
    color: "#38BDF8", // sky
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },

  {
    Icon: SiDocker,
    color: "#2496ED",
    title: "Cloud‑Native & Containers",
    desc: "Docker/Kubernetes workflows for portable, scalable deployments.",
  },
  {
    Icon: FaServer,
    color: "#6366F1",
    title: "Infrastructure as Code (IaC)",
    desc: "Declarative environments with Terraform and automated provisioning.",
  },
 
  {
    Icon: FaCogs,
    color: "#10B981",
    title: "Resilience & Reliability (SRE)",
    desc: "Graceful degradation, error budgets, and robust rollback strategies.",
  },
  {
    Icon: FaRocket,
    color: "#F59E0B",
    title: "Scalability & Performance",
    desc: "Horizontal scaling, caching, and load testing for peak traffic.",
  },

];



// Structured skills (non-capsule) grouped lists for TechStack section
const skillsGroups = [
  {
    title: "Programming Languages",
    headerIcon: { Icon: FaCode, color: "#38BDF8" },
    items: [
      "C++",
      "Python ",
      "JavaScript ",
      "TypeScript ",
    ],
  },
  {
    title: "Frontend",
    headerIcon: { Icon: FaReact, color: "#61DAFB" },
    items: [
      "HTML5, CSS3",
      "React.js ",
      "TailwindCSS ",
      "Bootstrap",
    ],
  },
  {
    title: "Backend ",
    headerIcon: { Icon: FaServer, color: "#6366F1" },
    items: [
      { label: "Node.js", Icon: SiNodedotjs, color: "#3C873A" },
      { label: "Express.js", Icon: SiExpress, color: "#FFFFFF" },
      { label: "JWT", Icon: SiJsonwebtokens, color: "#000000" },
      { label: "bcrypt", Icon: FaKey, color: "#EAB308" },
      { label: "CORS", Icon: FaShieldAlt, color: "#60A5FA" },
      { label: "Cloudinary", Icon: SiCloudinary, color: "#3448C5" },
    ],
  },
  {
    title: "Databases",
    headerIcon: { Icon: FaDatabase, color: "#F59E0B" },
    items: [
      { label: "MongoDB", Icon: SiMongodb, color: "#10AA50" },
      { label: "Mongoose", Icon: SiMongodb, color: "#10B981" },
      { label: "MySQL", Icon: SiMysql, color: "#00758F" },
    ],
  },
  {
    title: "Tools & Workflow",
    headerIcon: { Icon: FaCogs, color: "#10B981" },
    items: [
      { label: "Git", Icon: SiGit, color: "#F1502F" },
      { label: "GitHub", Icon: SiGithub, color: "#FFFFFF" },
      { label: "VS Code", Icon: FaLaptopCode, color: "#3B82F6" },
      { label: "npm", Icon: SiVite, color: "#CC3534" },
      { label: "Vite", Icon: SiVite, color: "#646CFF" },
    ],
  },
];




// Social links for Footer (react-icons)
const socialLinks = [
  {
    name: "Facebook",
    Icon: FaFacebook,
    color: "#1877F2",
    link: "https://www.facebook.com/people/Call-of-Coders/61566491841146/?sk=about",
  },
  {
    name: "Instagram",
    Icon: FaInstagram,
    color: "#E4405F",
    link: "https://www.instagram.com/callofcoders/",
  },
  {
    name: "YouTube",
    Icon: FaYoutube,
    color: "#FF0000",
    link: "https://www.youtube.com/@callofcoders",
  },
  {
    name: "LinkedIn",
    Icon: FaLinkedin,
    color: "#0A66C2",
    link: "https://www.linkedin.com/in/kush-kumar-b10020302/",
  },
  {
    name: "X",
    Icon: FaXTwitter,
    color: "#000000",
    link: "https://x.com/CallOfCoders",
  },
  {
    name: "GitHub",
    Icon: FaGithubFa6,
    color: "#333333",
    link: "https://github.com/kushkumarkashyap7280",
  },
  {
    name: "LeetCode",
    Icon: SiLeetcode,
    color: "#FFA116",
    link:"https://leetcode.com/kushkumarkashyap7280",
   
  },
];

export {
  words,
  abilities,
  logoIconsList,
  socialLinks,
  skillsGroups,
  navLinks,
};
