import {
  FaHtml5, FaCss3Alt, FaJs, FaBootstrap, FaPhp, FaReact, FaGitAlt, FaGithub, FaNodeJs,
  FaPython, FaJava, FaDatabase, FaCode, FaDocker, FaFigma, FaAws, FaLinux, FaSass, FaNpm,
} from "react-icons/fa";
import {
  SiTailwindcss, SiMysql, SiJquery, SiC, SiCplusplus, SiMongodb, SiExpress, SiTypescript,
  SiNextdotjs, SiPostgresql, SiFirebase, SiRedux, SiVite, SiPostman, SiVercel,
} from "react-icons/si";

// key -> [component, brand colour]. Admin picks one of these keys when adding a skill.
export const SKILL_ICONS = {
  html: [FaHtml5, "#ff6a3d"],
  css: [FaCss3Alt, "#3aa0ff"],
  js: [FaJs, "#ffd23f"],
  typescript: [SiTypescript, "#4b9bff"],
  react: [FaReact, "#61dafb"],
  nextjs: [SiNextdotjs, "#e8ecf5"],
  redux: [SiRedux, "#a58bff"],
  bootstrap: [FaBootstrap, "#9b6bff"],
  tailwind: [SiTailwindcss, "#38bdf8"],
  sass: [FaSass, "#ff6fb5"],
  jquery: [SiJquery, "#4d9bff"],
  node: [FaNodeJs, "#6fd36f"],
  express: [SiExpress, "#e8ecf5"],
  mongodb: [SiMongodb, "#4fd35f"],
  mysql: [SiMysql, "#5fb4ff"],
  postgresql: [SiPostgresql, "#6c9bd6"],
  firebase: [SiFirebase, "#ffb22e"],
  php: [FaPhp, "#8c9eff"],
  python: [FaPython, "#ffd447"],
  java: [FaJava, "#ff7a59"],
  c: [SiC, "#7aa7ff"],
  cpp: [SiCplusplus, "#5b9dff"],
  git: [FaGitAlt, "#ff6a3d"],
  github: [FaGithub, "#e8ecf5"],
  docker: [FaDocker, "#3aa0ff"],
  aws: [FaAws, "#ffb22e"],
  linux: [FaLinux, "#ffd23f"],
  figma: [FaFigma, "#ff7a8a"],
  postman: [SiPostman, "#ff7a45"],
  vite: [SiVite, "#b78bff"],
  vercel: [SiVercel, "#e8ecf5"],
  npm: [FaNpm, "#ff5555"],
  database: [FaDatabase, "#2de2c8"],
  code: [FaCode, "#2de2c8"],
};

export const SKILL_ICON_KEYS = Object.keys(SKILL_ICONS);

export function SkillIcon({ name, size = 34 }) {
  const [Icon, color] = SKILL_ICONS[name] || SKILL_ICONS.code;
  return <Icon size={size} color={color} />;
}
export const skillColor = (name) => (SKILL_ICONS[name] || SKILL_ICONS.code)[1];
