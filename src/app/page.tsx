"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import SmoothScroll from "@/components/SmoothScroll";
import CursorWii from "@/components/CursorWii";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import SideQuests from "@/components/SideQuests";
import Footer from "@/components/Footer";

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setReady(true)} />
      <SmoothScroll />
      <CursorWii />
      <Nav />
      <main>
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
