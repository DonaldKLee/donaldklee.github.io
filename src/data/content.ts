export type Category = "Startup" | "Hackathon" | "Side-Project";

export interface Project {
  name: string;
  tagline: string;
  description: string;
  category: Category;
  href: string;
  image: string;
  award?: string;
}

/* The headliners — flow one into the next */
export const featuredProjects: Project[] = [
  {
    name: "Globe with Data",
    tagline: "Climate change, in 3D",
    description:
      "A web app that maps decades of climate data onto an interactive 3D globe. Spin the planet, scrub through time, and watch the numbers move.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/Global-Climate-Change-Visualization",
    image: "/images/projects/home/global.png",
  },
  {
    name: "Fragments",
    tagline: "Capture the moment that inspired you",
    description:
      "A browser extension and platform that clips the exact second of any video that caught your eye, then turns those fragments into something you can revisit.",
    category: "Hackathon",
    href: "https://devpost.com/software/fragments-gmleoj",
    image: "/images/projects/home/fragments.png",
  },
  {
    name: "HonkHonkHire",
    tagline: "Interview practice that watches back",
    description:
      "AI mock interviews tailored to your story. It reads your facial expressions, transcribes your answers, and hands back the kind of feedback that actually builds confidence.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/honkhonkhire.html",
    image: "/images/projects/home/honkhonkhire.png",
  },
  {
    name: "TravoAI",
    tagline: "Trip planning without the tabs",
    description:
      "67% of travelers think planning a trip takes too long. TravoAI builds you a tailored itinerary in minutes, solo or with the whole group.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/travoai.html",
    award: "StormHacks 2023",
    image: "/images/projects/home/travoai.jpg",
  },
  {
    name: "Provent",
    tagline: "A calmer new tab",
    description:
      "A customizable Chrome extension that replaces your new-tab chaos with a clean workspace, a pomodoro timer, and a site blocker for when you need to focus.",
    category: "Startup",
    href: "https://provent-extension.github.io/links.html",
    image: "/images/projects/home/provent3.jpg",
  },
  {
    name: "GiftDex",
    tagline: "The perfect gift, found for you",
    description:
      "Gift-hunting is hard. GiftDex uses AI to match a person to a present, so the guesswork is somebody else's problem.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/giftdex.html",
    image: "/images/projects/home/giftdex.png",
  },
];

/* The rest of the shelf */
export const moreProjects: Project[] = [
  {
    name: "RickGPT",
    tagline: "ChatGPT, but Rick",
    description: "A ChatGPT look-alike built for April Fools. Try it.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/rickgpt",
    image: "/images/projects/home/rickgpt.jpg",
  },
  {
    name: "Google Memes",
    tagline: "Gravity-defying search",
    description:
      "A playful April Fools toy inspired by Google Gravity and Google Underwater.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/google.html",
    image: "/images/projects/home/googlememes.jpg",
  },
  {
    name: "Hakoten Fruits",
    tagline: "Fruit Ninja, no headset",
    description:
      "A computer-vision game that turns your hand into a sword. Slice the fruit, skip the $400 VR headset.",
    category: "Side-Project",
    href: "https://github.com/DonaldKLee/Hakoten-Fruits",
    image: "/images/projects/home/hakotenfruits.png",
  },
  {
    name: "VidNotes",
    tagline: "Notes that ride along with the video",
    description:
      "Take notes beside any YouTube video, or send someone a link with the notes baked in. Email them to yourself for later.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/vidnotes.html",
    image: "/images/projects/home/vidnotes.png",
  },
  {
    name: "Shark Cult",
    tagline: "Tame sharks for points",
    description:
      "A browser game where you click sharks as they breach. Start a cult, sharpen your aim, your call.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/sharkcult.html",
    image: "/images/projects/home/sharkcult.png",
  },
  {
    name: "Focomend",
    tagline: "YouTube, minus the rabbit hole",
    description:
      "A Chrome extension that hides recommendations and comments so a quick watch stays a quick watch.",
    category: "Side-Project",
    href: "https://github.com/DonaldKLee/Focomend",
    image: "/images/projects/home/focomend.png",
  },
  {
    name: "COVID-19 Info Bot",
    tagline: "Daily case counts in Discord",
    description:
      "A Discord bot built with friends that delivered daily COVID-19 updates without leaving your server.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/thecovid19infobot.html",
    image: "/images/projects/home/covidbot.png",
  },
  {
    name: "CarePackages4U",
    tagline: "2nd place at XDHacks Mini",
    description:
      "A web app built over one weekend hackathon to coordinate care packages. Took 2nd of 21 teams.",
    category: "Hackathon",
    href: "https://donaldklee.github.io/carepackages4u.html",
    image: "/images/projects/home/carepackages4u.png",
  },
  {
    name: "Ardio",
    tagline: "News articles you can listen to",
    description:
      "A Flask app that turns CTV News articles into MP3s for the days you'd rather listen than read.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/ardio.html",
    image: "/images/projects/home/ardio.png",
  },
  {
    name: "StudyHawk",
    tagline: "A timer that nudges you to rest",
    description:
      "A productivity timer that notifies you when it's time for a break and when the break is over.",
    category: "Side-Project",
    href: "https://donaldklee.github.io/studyhawk.html",
    image: "/images/projects/home/studyhawk.png",
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
    logo: "/images/logos/amazon.svg",
    roles: [
      {
        org: "Amazon",
        title: "Software Development Intern",
        period: "May 2026 – Present",
        points: [
          "Financial Foundation Services (AFFS) team.",
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
    logo: "/images/logos/boeing.svg",
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
    short: "nw",
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
    title: "Boeing intern crew",
    tag: "Boeing",
    emoji: "✈️",
    slug: "boeing",
    blurb: "The data-science team that put up with all my questions.",
  },
  {
    title: "Amazon intern crew",
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

/* Rotating "currently" lines for the hero */
export const currentlyDoing = [
  "interning at Amazon",
  "building AI tools for accountants",
  "shipping 2am side projects",
  "studying at UBC",
  "chasing the next fun problem",
];
