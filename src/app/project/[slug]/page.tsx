import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WriteupView from "@/components/Writeup";
import { getWriteup, getNextWriteup, writeupSlugs } from "@/data/writeups";

export function generateStaticParams() {
  return writeupSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = getWriteup(slug);
  if (!w) return {};
  // strip inline markdown links from the lead so the meta description is clean
  const lead = w.summary[0].replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  const description = `${w.tagline}. ${lead}`;
  return {
    title: `${w.title} — Donald Lee`,
    description,
    openGraph: {
      title: `${w.title} — Donald Lee`,
      description,
      type: "article",
      images: [{ url: w.hero }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${w.title} — Donald Lee`,
      description,
      images: [w.hero],
    },
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writeup = getWriteup(slug);
  if (!writeup) notFound();
  const next = getNextWriteup(slug);

  return (
    <>
      <Nav />
      <main id="main">
        <WriteupView writeup={writeup} next={next} />
      </main>
      <Footer />
    </>
  );
}
