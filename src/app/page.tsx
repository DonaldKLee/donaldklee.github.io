"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import CursorWii from "@/components/CursorWii";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import SideQuests from "@/components/SideQuests";
import Footer from "@/components/Footer";
import SideRails from "@/components/SideRails";

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setReady(true)} />
      <CursorWii />
      <Nav />
      <SideRails />
      <main id="main">
        <Hero ready={ready} />
        <About />
        <Experience />
        <Projects />
        <SideQuests />
        <Footer />
      </main>
    </>
  );
}
