import { SKILL_ICON_KEYS } from "../lib/icons";

const order = { name: "order", label: "Display order", type: "number", hint: "Smaller number shows first (0, 1, 2...)" };

export const CONFIGS = {
  experience: {
    title: "Experience", single: "experience", subtitle: "Jobs, internships and training shown on the timeline.", endpoint: "experience",
    fields: [
      { name: "title", label: "Role / Title", type: "text", required: true },
      { name: "company", label: "Company / Organisation", type: "text", required: true },
      { name: "period", label: "Period", type: "text", placeholder: "Jan 2025 - Mar 2025" },
      { name: "description", label: "Description (optional)", type: "textarea" },
      order,
    ],
    summary: (i) => ({ title: i.title, sub: `${i.company}${i.period ? " · " + i.period : ""}` }),
  },
  education: {
    title: "Education", single: "education", subtitle: "Your academic background.", endpoint: "education",
    fields: [
      { name: "course", label: "Course / Degree", type: "text", required: true },
      { name: "college", label: "College / School", type: "text", required: true },
      { name: "address", label: "Location", type: "text" },
      { name: "year", label: "Year", type: "text", placeholder: "2022 - 2025" },
      { name: "status", label: "Status", type: "select", options: ["Complete", "Pursuing", "Dropped"] },
      { name: "percent", label: "Percentage / Grade", type: "text", placeholder: "76%", hint: "Use a % value (e.g. 76%) to show the animated ring" },
      order,
    ],
    empty: { status: "Complete" },
    summary: (i) => ({ title: i.course, sub: `${i.college}${i.year ? " · " + i.year : ""}` }),
  },
  skills: {
    title: "Skills", single: "skill", subtitle: "Technologies shown in the animated skill marquee.", endpoint: "skills",
    fields: [
      { name: "name", label: "Skill name", type: "text", required: true },
      { name: "icon", label: "Icon", type: "select", options: SKILL_ICON_KEYS },
      { name: "level", label: "Level (0-100)", type: "number", min: 0, max: 100 },
      order,
    ],
    empty: { icon: "code", level: 80 },
    summary: (i) => ({ title: i.name, sub: `Icon: ${i.icon} · Level ${i.level}%` }),
  },
  projects: {
    title: "Projects", single: "project", subtitle: "Projects with their live and GitHub links.", endpoint: "projects",
    fields: [
      { name: "title", label: "Project title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "technologies", label: "Technologies", type: "tags", hint: "Separate with commas: React, Node, MongoDB" },
      { name: "url", label: "Live link", type: "text", placeholder: "https://..." },
      { name: "githubUrl", label: "GitHub link", type: "text", placeholder: "https://github.com/..." },
      { name: "image", label: "Project image / screenshot", type: "image" },
      order,
    ],
    summary: (i) => ({ title: i.title, sub: i.url || "No live link", image: i.image }),
  },
  certifications: {
    title: "Certifications", single: "certification", subtitle: "Certificates with photo (visitors can click to enlarge).", endpoint: "certifications",
    fields: [
      { name: "title", label: "Certificate title", type: "text", required: true },
      { name: "platform", label: "Issued by / Platform", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "certificateNumber", label: "Certificate number", type: "text" },
      { name: "verifyUrl", label: "Verification link", type: "text", placeholder: "https://..." },
      { name: "image", label: "Certificate photo", type: "image" },
      order,
    ],
    summary: (i) => ({ title: i.title, sub: i.platform || "", image: i.image }),
  },
};
