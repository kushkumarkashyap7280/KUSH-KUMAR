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


const counterItems = [
  { value: 15, suffix: "+", label: "Years of Experience" },
  { value: 200, suffix: "+", label: "Satisfied Clients" },
  { value: 108, suffix: "+", label: "Completed Projects" },
  { value: 90, suffix: "%", label: "Client Retention Rate" },
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

const techStackImgs = [
  {
    name: "React Developer",
    imgPath: "/images/logos/react.png",
  },
  {
    name: "Python Developer",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "Backend Developer",
    imgPath: "/images/logos/node.png",
  },
  {
    name: "Interactive Developer",
    imgPath: "/images/logos/three.png",
  },
  {
    name: "Project Manager",
    imgPath: "/images/logos/git.svg",
  },
];

const techStackIcons = [
  {
    name: "React Developer",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
    color: "#61DAFB",
    glow: 0.6,
    hover: { scale: 1.08, rotate: [0, 0.6, 0] },
    canvas: { enabled: true, bloom: 0.35, float: true, floatIntensity: 1.2 },
  },
  {
    name: "Python Developer",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
    color: "#3776AB",
    glow: 0.5,
    hover: { scale: 1.06, rotate: [0, -0.5, 0] },
    canvas: { enabled: true, bloom: 0.3, float: true, floatIntensity: 0.9 },
  },
  {
    name: "Backend Developer",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
    color: "#3C873A",
    glow: 0.4,
    hover: { scale: 1.04, rotate: [0, 0.4, 0] },
    canvas: { enabled: true, bloom: 0.25, float: false },
  },
  {
    name: "Interactive Developer",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
    color: "#FFFFFF",
    glow: 0.55,
    hover: { scale: 1.07, rotate: [0.2, 0.6, 0] },
    canvas: { enabled: true, bloom: 0.4, float: true, floatIntensity: 1.4 },
  },
  {
    name: "Project Manager",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
    color: "#F1502F",
    glow: 0.45,
    hover: { scale: 1.05, rotate: [0, 0.5, 0] },
    canvas: { enabled: false },
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

const expCards = [
  {
    review: "Adrian brought creativity and technical expertise to the team, significantly improving our frontend performance. His work has been invaluable in delivering faster experiences.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/logo1.png",
    title: "Frontend Developer",
    date: "January 2023 - Present",
    responsibilities: [
      "Developed and maintained user-facing features for the Hostinger website.",
      "Collaborated closely with UI/UX designers to ensure seamless user experiences.",
      "Optimized web applications for maximum speed and scalability.",
    ],
  },
  {
    review: "Adrian’s contributions to Docker's web applications have been outstanding. He approaches challenges with a problem-solving mindset.",
    imgPath: "/images/exp2.png",
    logoPath: "/images/logo2.png",
    title: "Full Stack Developer",
    date: "June 2020 - December 2023",
    responsibilities: [
      "Led the development of Docker's web applications, focusing on scalability.",
      "Worked with backend engineers to integrate APIs seamlessly with the frontend.",
      "Contributed to open-source projects that were used with the Docker ecosystem.",
    ],
  },
  {
    review: "Adrian’s work on Appwrite’s mobile app brought a high level of quality and efficiency. He delivered solutions that enhanced our mobile experience & meet our product goals.",
    imgPath: "/images/exp3.png",
    logoPath: "/images/logo3.png",
    title: "React Native Developer",
    date: "March 2019 - May 2020",
    responsibilities: [
      "Built cross-platform mobile apps using React Native, integrating with Appwrite's backend services.",
      "Improved app performance and user experience through code optimization and testing.",
      "Coordinated with the product team to implement features based on feedback.",
    ],
  },
];

const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];

const testimonials = [
  {
    name: "Esther Howard",
    mentions: "@estherhoward",
    review:
      "I can’t say enough good things about Adrian. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
    imgPath: "/images/client1.png",
  },
  {
    name: "Wade Warren",
    mentions: "@wadewarren",
    review:
      "Working with Adrian was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
    imgPath: "/images/client3.png",
  },
  {
    name: "Guy Hawkins",
    mentions: "@guyhawkins",
    review:
      "Collaborating with Adrian was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Adrian's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Adrian is the ideal partner.",
    imgPath: "/images/client2.png",
  },
  {
    name: "Marvin McKinney",
    mentions: "@marvinmckinney",
    review:
      "Adrian was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
    imgPath: "/images/client5.png",
  },
  {
    name: "Floyd Miles",
    mentions: "@floydmiles",
    review:
      "Adrian’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
    imgPath: "/images/client4.png",
  },
  {
    name: "Albert Flores",
    mentions: "@albertflores",
    review:
      "Adrian was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
    imgPath: "/images/client6.png",
  },
];

const socialImgs = [
  {
    name: "insta",
    imgPath: "/images/insta.png",
  },
  {
    name: "fb",
    imgPath: "/images/fb.png",
  },
  {
    name: "x",
    imgPath: "/images/x.png",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  skillsGroups,
  navLinks,
};
