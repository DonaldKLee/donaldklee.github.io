export type Category = "Startup" | "Hackathon" | "Side-Project" | "Website";

export interface Project {
  name: string;
  tagline: string;
  description: string;
  category: Category;
  href: string;
  image: string;
  award?: string;
  /** when set, the card opens the internal write-up at /work/<slug> */
  slug?: string;
  /**
   * Optional zoom for the card image. 1 = no zoom (default). Use >1 to crop
   * into media that has baked-in borders/letterboxing (e.g. a screen recording
   * with bars). Pair with `focus` to nudge which part stays in frame.
   */
  zoom?: number;
  /** object-position for the card image, e.g. "center", "top", "50% 40%" */
  focus?: string;
}

/* The headliners — flow one into the next */
export const featuredProjects: Project[] = [
  {
    name: "Climate Change visualized",
    tagline: "Climate change, in 3D",
    description:
      "A web app that maps decades of climate data onto an interactive 3D globe. Spin the planet, scrub through time, and watch the numbers move.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/Global-Climate-Change-Visualization",
    image: "/images/projects/home/GlobeDemo.mp4",
  },
  {
    name: "Fragments",
    tagline: "Capture the moment that inspired you",
    description:
      "A browser extension and platform that clips the exact second of any video that caught your eye, then turns those fragments into something you can revisit.",
    category: "Hackathon",
    href: "https://devpost.com/software/fragments-gmleoj",
    image: "/images/projects/home/FragmentsDemo.mp4",
  },
  {
    name: "nwPlus.io",
    tagline: "The club behind Western Canada's Largest hackathons",
    description:
      "Built the website for nwPlus, the UBC club that ran nwHacks, HackCamp, and cmd-f.",
    category: "Website",
    href: "https://www.nwplus.io/",
    image: "/images/projects/home/nwPluswwwDemo.mp4",
  },
  { 
    name: "HonkHonkHire",
    tagline: "AI mock interviewer",
    description:
      "AI mock interviews tailored to your experiences. It reads your facial expressions, transcribes your answers, and hands back feedback.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/honkhonkhire.html",
    image: "/images/projects/home/HonkHonkHireDemo.mp4",
    slug: "honkhonkhire",
  },
  {
    name: "Provent",
    tagline: "A productivity chrome extension",
    description:
      "A customizable Chrome extension that replaces your new-tab with a modern workspace, a pomodoro timer, and a site blocker for when you need to focus.",
    category: "Startup",
    href: "https://provent-extension.github.io/links.html",
    image: "/images/projects/home/ProventDemo.mp4",
  },
];

/* The rest of the shelf */
export const moreProjects: Project[] = [
  {
    name: "RickGPT",
    tagline: "ChatGPT UI with a Rick roll",
    description: "A ChatGPT look-alike built for April Fools.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/rickgpt",
    image: "/images/projects/home/rickgpt.png",
  },
  {
    name: "TravoAI",
    tagline: "Trip planning without the tabs",
    description:
      "67% of travelers think planning a trip takes too long. TravoAI builds you a tailored itinerary in minutes, solo or with the whole group.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/travoai.html",
    image: "/images/projects/home/travoai.png",
    slug: "travoai",
  },
  {
    name: "Google Memes",
    tagline: "Google UI with a Rick roll",
    description:
      "An April Fools website inspired by Google Gravity and Google Underwater.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/GoogleMemes",
    image: "/images/projects/home/googlememes.png",
  },
  {
    name: "Hakoten Fruits",
    tagline: "VR fruit ninja on budget",
    description:
      "A computer-vision game that turns your hand into a sword to slice fruits.",
    category: "Side-Project",
    href: "https://github.com/DonaldKLee/Hakoten-Fruits",
    image: "/images/projects/home/hakotenfruits.png",
    slug: "hakotenfruits",
  },
  {
    name: "VidNotes",
    tagline: "YouTube note taking simplified on the go",
    description:
      "A web app to take notes beside any YouTube video on the go. Notes can be shared via email or by copying the URL.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/vidnotes.html",
    image: "/images/projects/home/vidnotes.png",
    slug: "vidnotes",
  },
  {
    name: "Shark Cult",
    tagline: "Tame sharks for points",
    description:
      "A browser game where you click to tame sharks as they breach. Built for a shark themed hackathon.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/sharkcult.html",
    image: "/images/projects/home/sharkcult.png",
    slug: "sharkcult",
  },
  {
    name: "GiftDex",
    tagline: "Find the perfect tailored gift",
    description:
      "Gift-hunting is hard. GiftDex uses AI to match a person to a present.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/giftdex.html",
    image: "/images/projects/home/giftdex.png",
    slug: "giftdex",
  },
  {
    name: "Focomend",
    tagline: "YouTube, minus the rabbit hole",
    description:
      "A Chrome extension that hides recommendations and comments so a quick watch stays a quick watch.",
    category: "Side-Project",
    href: "https://github.com/DonaldKLee/Focomend",
    image: "/images/projects/home/focomend.png",
    slug: "focomend",
  },
  {
    name: "COVID-19 Info Bot",
    tagline: "Daily case counts in Discord",
    description:
      "A Discord bot built with friends that delivered daily COVID-19 updates to your server.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/thecovid19infobot.html",
    image: "/images/projects/home/covidbot.png",
    slug: "thecovid19infobot",
  },
  {
    name: "Ardio",
    tagline: "News articles you can listen to",
    description:
      "A Flask app that turns CTV News articles into MP3s for the days you'd rather listen than read.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/ardio.html",
    image: "/images/projects/home/ardio.png",
    slug: "ardio",
  },
  {
    name: "StudyHawk",
    tagline: "A pomodoro study timer desktop app",
    description:
      "A productivity timer that notifies you when it's time for a break and when the break is over.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/studyhawk.html",
    image: "/images/projects/home/studyhawk.png",
    slug: "studyhawk",
  },
  {
    name: "CarePackages4U",
    tagline: "Finding donors made easy",
    description:
      "A web app built over one weekend to coordinate care packages during COVID-19.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/carepackages4u.html",
    image: "/images/projects/home/carepackages4u.png",
    slug: "carepackages4u",
  },
];

export interface Role {
  org: string;
  title: string;
  period: string;
  points: string[];
}

export interface ExperienceGroup {
  org: string;
  emoji: string;
  /** short lettermark shown when there's no brand logo */
  short: string;
  /** path to a real brand logo in /public/images/logos (optional) */
  logo?: string;
  roles: Role[];
}

export const experience: ExperienceGroup[] = [
  {
    org: "Amazon",
    emoji: "📦",
    short: "AMZ",
    logo: "/images/logos/amazon.jpeg",
    roles: [
      {
        org: "Amazon",
        title: "Software Development Intern",
        period: "May 2026 – Present",
        points: [
          "Building a desktop app that lets accountants run local MCP servers to work faster.",
        ],
      },
      {
        org: "Amazon",
        title: "Software Development Intern",
        period: "May 2025 – Aug 2025",
        points: [
          "Built a Gen-AI internal accounting assistant that speeds up the hunt for missing transactions.",
        ],
      },
    ],
  },
  {
    org: "Boeing",
    emoji: "✈️",
    short: "BA",
    logo: "/images/logos/boeing.jpeg",
    roles: [
      {
        org: "Boeing",
        title: "DevOps Engineering Intern · FlightOps Data Science",
        period: "Jan 2025 – May 2025",
        points: ["Worked on projects supporting commercial airlines."],
      },
      {
        org: "Boeing",
        title: "DevOps Engineering Intern · TechOps Data Science",
        period: "Sept 2024 – Dec 2024",
        points: [
          "Built infrastructure and Python tooling for AI/ML and defense projects.",
          "2nd of 121 teams worldwide at the Q4 DAS AI hackathon, shipping an AI assistant for mechanics.",
        ],
      },
    ],
  },
  {
    org: "nwPlus",
    emoji: "🚀",
    short: "NW",
    logo: "/images/logos/nwplus.jpeg",
    roles: [
      {
        org: "nwPlus",
        title: "Co-President",
        period: "Mar 2025 – Apr 2026",
        points: [
          "Led 9 teams (53 execs) to run three hackathons: HackCamp, nwHacks, and cmd-f.",
          "Awarded best SUS Club Dynamic.",
        ],
      },
      {
        org: "nwPlus",
        title: "Dev Director",
        period: "Apr 2024 – Mar 2025",
        points: ["Built and led a team of 9 developers."],
      },
      {
        org: "nwPlus",
        title: "Developer",
        period: "May 2022 – Mar 2024",
        points: [
          "Built websites and tooling for the team and hackers, and taught hackers to code.",
        ],
      },
    ],
  },
  {
    org: "UBC Startups",
    emoji: "💡",
    short: "US",
    logo: "/images/logos/ubcstartups.jpeg",
    roles: [
      {
        org: "UBC Startups",
        title: "President",
        period: "May 2024 – Dec 2024",
        points: [
          "Led a team of 11 running events to inspire the next generation of founders.",
        ],
      },
      {
        org: "UBC Startups",
        title: "Co-founder & Technology Lead",
        period: "Aug 2022 – Apr 2024",
        points: [
          "Co-founded with four students to run startup events, and built the website.",
        ],
      },
    ],
  },
  {
    org: "Population Data BC",
    emoji: "🔐",
    short: "PD",
    logo: "/images/logos/ubc_department_of_medicine.jpeg",
    roles: [
      {
        org: "Population Data BC",
        title: "Student Programmer · Systems & Security",
        period: "May 2024 – Aug 2024",
        points: ["Built internal and external tooling for researchers and staff."],
      },
    ],
  },
  {
    org: "UBC LFS",
    emoji: "👷",
    short: "LFS",
    logo: "/images/logos/ubc_lfs.jpeg",
    roles: [
      {
        org: "UBC LFS Learning Centre",
        title: "Software Developer Assistant",
        period: "May 2023 – Apr 2024",
        points: [
          "Built full-stack web apps, automated workflows, and picked up a pile of new languages.",
        ],
      },
    ],
  },
];

export interface SideQuest {
  title: string;
  blurb: string;
  tag: string;
  emoji: string;
  /**
   * Photo slot. Drop a file at /public/images/sidequests/<slug>.jpg and it
   * appears automatically; until then the stylized polaroid shows.
   */
  slug: string;
}

/**
 * The roadside memories. Each has a swap-ready photo slot keyed by `slug`:
 * add /public/images/sidequests/<slug>.jpg and it shows in place of the
 * stylized stand-in.
 */
export const sideQuests: SideQuest[] = [
  {
    title: "nwPlus",
    tag: "Hackathons",
    emoji: "🚀",
    slug: "presntres.jpeg",
    blurb: "Pres and Tres",
  },
  {
    title: "Boeing intern cohort",
    tag: "Boeing",
    emoji: "✈️",
    slug: "boeing",
    blurb: "The data-science team that put up with all my questions.",
  },
  {
    title: "Amazon intern cohort",
    tag: "Amazon",
    emoji: "📦",
    slug: "amazon",
    blurb: "Summers of free lunches and surprisingly good coffee.",
  },
  {
    title: "Victoria with friends",
    tag: "Victoria",
    emoji: "⛵",
    slug: "victoria",
    blurb: "Ferries, tide pools, and far too many photos of the water.",
  },
  {
    title: "Competing at CalHacks",
    tag: "CalHacks",
    emoji: "🐻",
    slug: "calhacks",
    blurb: "Berkeley, 36 hours, and a demo held together with hope.",
  },
  {
    title: "Competing at StormHacks",
    tag: "StormHacks",
    emoji: "⛈️",
    slug: "stormhacks",
    blurb: "Where TravoAI came to life over one very long weekend.",
  },
  {
    title: "On the mic",
    tag: "Workshops",
    emoji: "🎤",
    slug: "workshops",
    blurb: "Teaching workshops and hyping up rooms full of first-time hackers.",
  },
  {
    title: "My coding club",
    tag: "nwPlus",
    emoji: "🚀",
    slug: "codingclub",
    blurb: "53 execs, three hackathons a year, one chaotic group chat.",
  },
  {
    title: "Storm the Wall",
    tag: "UBC",
    emoji: "🌌",
    slug: "storm-the-wall",
    blurb: "...",
  },
  {
    title: "Northern lights",
    tag: "Iceland",
    emoji: "🌌",
    slug: "iceland",
    blurb: "Stood under a green sky in the middle of nowhere. Worth the cold.",
  },
  {
    title: "Off the map in Asia",
    tag: "Asia",
    emoji: "🏯",
    slug: "asia",
    blurb: "Saying yes to the adventurous option, every single time.",
  },
  {
    title: "Good eats in Japan",
    tag: "Japan",
    emoji: "🍜",
    slug: "japan",
    blurb: "On a lifelong mission to find the perfect bowl of ramen.",
  },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/DonaldKLee" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/donald-k-lee/" },
  { label: "Instagram", href: "https://www.instagram.com/donald.k.lee/" },
  { label: "Twitter", href: "https://twitter.com/HiDonaldLee" },
];

export const EMAIL = "donaldkevlee@gmail.com";
export const EMAIL_TEMPLATE = "?subject=[Subject Goes Here] - Sent From Donald Lee's Portfolio Site&body=Sent from Donald Lee's Portfolio Site"

/* Rotating "currently" lines for the hero */
export const currentlyDoing = [
  "interning at Amazon",
  "playing around with new AI tools",
  "shipping 2am side projects",
  "trying new things"
];
