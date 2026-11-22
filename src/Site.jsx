import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { api } from "./lib/api";
import { Background, Cursor, Preloader, ScrollProgress } from "./components/Effects";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import SideHud from "./components/SideHud";
import CommandPalette from "./components/CommandPalette";

export default function Site() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loaderGone, setLoaderGone] = useState(false);
  const [palette, setPalette] = useState(false);

  const load = useCallback(() => {
    setError("");
    api.portfolio().then(setData).catch((e) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const done = useCallback(() => setLoaderGone(true), []);

  const ids = useMemo(() => {
    if (!data) return [];
    const list = ["home"];
    if (data.profile?.aboutParagraphs?.length || data.profile?.photo) list.push("about");
    if (data.education.length) list.push("education");
    if (data.experience.length) list.push("experience");
    if (data.skills.length) list.push("skills");
    if (data.projects.length) list.push("projects");
    if (data.certifications.length) list.push("certification");
    list.push("contact");
    return list;
  }, [data]);

  return (
    <>
      <Background />
      <Cursor />
      <AnimatePresence>
        {!loaderGone && !error && <Preloader ready={!!data} onDone={done} name={data?.profile?.name || "Portfolio"} />}
      </AnimatePresence>

      {error && (
        <div className="state-screen">
          <div>
            <h2>Could not load the portfolio</h2>
            <p>{error}</p>
            <button className="btn btn-fill" onClick={load}>Try again</button>
          </div>
        </div>
      )}

      {data && !error && (
        <>
          <ScrollProgress />
          <Navbar ids={ids} brand={(data.profile.name || "Portfolio").split(" ")[0]} onPalette={() => setPalette(true)} />
          <SideHud ids={ids} />
          <CommandPalette open={palette} setOpen={setPalette} ids={ids} profile={data.profile} />
          <main>
            <Hero data={data} />
            {ids.includes("about") && <About profile={data.profile} education={data.education} />}
            {ids.includes("education") && <Education items={data.education} />}
            {ids.includes("experience") && <Experience items={data.experience} />}
            {ids.includes("skills") && <Skills items={data.skills} />}
            {ids.includes("projects") && <Projects items={data.projects} />}
            {ids.includes("certification") && <Certifications items={data.certifications} />}
            <Contact profile={data.profile} />
          </main>
          <Footer name={data.profile.name || ""} />
        </>
      )}
    </>
  );
}
