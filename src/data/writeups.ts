import type { Category } from "./content";

/* ----------------------------------------------------------------------------
   Project write-ups.

   One structured document per project. The reusable page at
   /project/[slug] renders any of these, in this order, so the "next project"
   link at the bottom of each write-up cycles through the list below.

   Body text supports inline links written as markdown: [label](https://url).
   Everything else is plain prose, split into paragraphs.
---------------------------------------------------------------------------- */

export interface WriteupLink {
  label: string;
  href: string;
  /** the one filled button in the hero; the rest render as outlines */
  primary?: boolean;
}

export interface WriteupSection {
  /** rendered with a markdown marker, e.g. "## how-i-built-it" */
  heading: string;
  /** one entry per paragraph */
  body: string[];
}

export interface StackGroup {
  label: string;
  items: string[];
}

export interface Writeup {
  slug: string;
  title: string;
  tagline: string;
  category: Category;
  year: string;
  /** human-friendly date range */
  date: string;
  /** who else built it; empty means solo */
  collaborators: string[];
  /** Donald's role when the credit calls it out */
  role?: string;
  award?: string;
  /** screenshot in /public; also the poster for heroVideo, the OG image, and the next-project card */
  hero: string;
  /** optional silent demo loop (mp4) that plays in the hero frame instead of the still */
  heroVideo?: string;
  /** youtube embed url, when there's a demo reel */
  video?: string;
  links: WriteupLink[];
  /** the lead paragraph(s); shown up top, before the narrative */
  summary: string[];
  sections: WriteupSection[];
  stack: StackGroup[];
}

export const writeups: Writeup[] = [
  {
    slug: "ember",
    title: "Ember",
    tagline: "A wildfire-prevention rover with a phone for its brain",
    category: "Hackathon",
    year: "2026",
    date: "October 24–25, 2026",
    collaborators: ["Leon Si", "Parth Jairam", "Matthew"],
    hero: "/images/projects/home/ember.jpg",
    heroVideo: "/images/projects/home/EmberDemo.mp4",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/soon-2026", primary: true },
      { label: "GitHub", href: "https://github.com/ParthJairam07/Ember" },
    ],
    summary: [
      "Most wildfire tech kicks in once there's already smoke. We wanted to work on the part before that: the dry leaves and pine needles that pile up around homes and turn a small spark into a big fire. Keeping that ground clear isn't hard, it's just repetitive, and the leaves keep falling.",
      "Ember is a small rover that finds fallen leaves and gathers them into a pile. The twist is that its brain is an iPhone. A phone already has a camera, motion tracking, a fast on-device chip, and (on some models) LiDAR, so instead of building a perception system from scratch, we strapped one to the rover and put those sensors to work together.",
    ],
    sections: [
      {
        heading: "My part",
        body: [
          "We were a team of four over one weekend. Matthew owned the hardware, and Leon and Parth built out the phone app, the 3D reconstruction, and the wildfire map alongside me. My piece was the rover's brain: the navigation code that decides where to drive, the simulator we tested it in, and the link that lets the laptop see what the phone sees.",
        ],
      },
      {
        heading: "The problem with seeing a leaf",
        body: [
          "Getting a box around a leaf on screen was the easy part. Driving to it was not. Detections flicker from frame to frame, anything brown looks like a leaf, and the moment the rover gets close, the leaf drops out of the bottom of the camera.",
          "So I split perception from driving. A leaf only becomes a target after it's been seen a few times, and once it is, it gets pinned to a spot in the world (using the phone's AR tracking) instead of a spot on the screen. That way the rover can keep steering toward a leaf it can't see anymore. LiDAR added one more sanity check: if a \"leaf\" is floating three feet off the ground, it's probably a couch.",
        ],
      },
      {
        heading: "One brain, two bodies",
        body: [
          "The biggest call I made was writing the brain in plain TypeScript and sharing the exact same code between the phone and a browser simulator. The sim drops the rover on a virtual lawn with a work circle around a pile, throws noisy detections, obstacles, and missed scoops at it, and lets you watch it plan in 3D and from the top down.",
          "That meant we could test the full collect cycle (line up, scoop, drive back, dump, retry the ones it missed) hours before the hardware was ready. When something broke, it broke on my laptop instead of on the rover. It also meant the control dashboard could show a live top-down map of what the phone's brain was thinking.",
        ],
      },
      {
        heading: "What broke",
        body: [
          "Hardware, mostly. Matthew flew in from Paris with the parts and tools, and a few pieces still went missing. We ended up 3D-printing replacements at the Aurora Public Library and calling a teammate's parent who lived nearby to grab RC wheels right before the store closed. Hardware has a way of making your critical path very literal.",
        ],
      },
      {
        heading: "Where it landed",
        body: [
          "By the end of the weekend the phone could detect and map leaves on-device, the rover could be driven from the browser, the autopilot could run its full cycle in simulation, and captures could be turned into explorable 3D Gaussian splats. The one piece we didn't close was wiring the autonomous scoop-and-dump sequence into the rover's firmware. That's next, along with real runs on uneven ground outside.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "A detector is not a navigation system. Remembering where you saw something, checking that it makes physical sense, and knowing when to stop are the parts that turn a prediction into movement. And building the simulator first felt slow, but it meant we could test the whole cycle before the hardware even existed.",
        ],
      },
    ],
    stack: [
      { label: "Mobile", items: ["Expo", "React Native", "TypeScript", "Swift", "ARKit", "LiDAR"] },
      { label: "Perception", items: ["OWL-ViT", "ExecuTorch", "Core ML"] },
      { label: "Hardware", items: ["ESP32", "Bluetooth Low Energy"] },
      {
        label: "Web & 3D",
        items: ["Next.js", "Three.js", "MapLibre", "Gaussian splats", "Vercel", "Bun"],
      },
    ],
  },
  {
    slug: "sifter",
    title: "Sifter",
    tagline: "Canadian and US stocks, in plain English",
    category: "Side-Project",
    year: "2026",
    date: "August–October 2026",
    collaborators: [],
    hero: "/images/projects/home/sifter.jpg",
    heroVideo: "/images/projects/home/SifterDemo.mp4",
    links: [{ label: "Try Sifter", href: "https://checksifter.com/", primary: true }],
    summary: [
      "A lot of people my age start investing the same way: buy a couple of index funds and a few companies they've heard of, then open the app every morning and stare at red and green numbers they don't really understand.",
      "Sifter explains how your stocks are doing in plain English. It reads the market data for what you own and what you're watching, tells you what changed and why, and skips the jargon. A P/E ratio of 20 becomes \"you're paying $20 for every $1 the company earns in a year.\" It works for both Canadian and US stocks, because a lot of tools quietly forget the TSX exists.",
    ],
    sections: [
      {
        heading: "It didn't start here",
        body: [
          "Sifter went through three versions before it became this one, and honestly the pivots are the most interesting part.",
          "It started as a memecoin scanner. When I sat down and looked at the market, that space was already full of funded teams with real-time data and one-click trading. I wasn't going to win there.",
          "Version two was a free swing-trade co-pilot. Seven technical indicators (RSI, MACD, Bollinger Bands, and friends) would vote on every stock, the votes added up to a score, and the score turned into a trade plan with an entry, a stop, a target, and a position size. Every call would get graded 5, 10, and 20 days later so the app had a public track record. The pitch was \"it grades its own homework.\"",
        ],
      },
      {
        heading: "Then I tested it like a real user",
        body: [
          "I walked through the live app as the person it was supposedly for: a second-year student with no finance background, checking their phone between classes. It went badly.",
          "The landing page asked me to sign in before showing a single stock. The first thing on the scanner was a warning that the data was six hours old (it was actually two minutes old, the stale cache just painted first). And then there was this row: NFLX, BUY, 1 of 7 indicators agreeing. One heavily weighted indicator could push the score over the line while the other six said nothing.",
          "The fix was a rule I still like: recommending something should be a higher bar than labelling it. Before Sifter would put a stock forward as an idea, most of the indicators had to actually agree. On a live snapshot that held back 12 of the 17 stocks labelled BUY. If nothing passed, Sifter said nothing, which is often the right answer.",
        ],
      },
      {
        heading: "The audit that changed the product",
        body: [
          "Before launch I audited every page against the Terms of Service, and the verdict was: not ready. The Terms said Sifter explains data and doesn't give advice. The UI said things like \"What To Do Now\" and \"Think about selling AAPL.\" In Canada, that's the line between a tool and something that needs securities registration. I also found real bugs, like Canadian and US dollar holdings getting added together as if they were the same currency.",
          "So I rewrote every screen from \"what you should do\" to \"what the numbers mean.\" \"Sell / Exit\" became \"Readings turned down.\" \"Today's Top Pick\" became \"Strongest reading today.\" And at the end of September I cut the track record and paper trading entirely. They were the original pitch, but they pulled the product toward being an advice machine, and they weren't what beginners actually needed.",
        ],
      },
      {
        heading: "How it works now",
        body: [
          "A scheduled Cloud Function sweeps the market every 2 minutes while it's open, every 15 in pre- and after-hours, and not at all when it's closed. Nothing is calculated when you load a page; you read the latest snapshot and see how old it is. Each sweep covers 60 of 180 tracked symbols: the core market funds, anything you hold or watch, anything with a live signal, and a rotating slice of the rest that cycles through everything in about a trading week.",
          "On top of that sits the part people actually see: a short daily recap of what changed in your holdings, a watchlist, trending stocks, and plain-English explanations for every number on screen. There's a Chrome extension in the works too.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "Building the thing was the easy part. Deciding what it should not say was the hard part. I also learned to write down the weak spots before someone else finds them. The indicator weights are hand-picked, not fitted from a backtest, and I'd rather say that up front than defend it badly in a room.",
          "And the biggest one: the version of the product I was most excited about (signals, conviction scores, trade plans) was built for someone like me. The version that's live is built for someone just starting out.",
        ],
      },
    ],
    stack: [
      { label: "Frontend", items: ["React", "Vite", "Chrome Extension"] },
      { label: "Backend", items: ["Python", "FastAPI", "Cloud Functions"] },
      {
        label: "Data & services",
        items: ["Firebase Auth", "Firestore", "yfinance", "SnapTrade"],
      },
    ],
  },
  {
    slug: "plus1",
    title: "plus1",
    tagline: "An AI teammate that joins your Google Meet",
    category: "Hackathon",
    year: "2026",
    date: "September 18–20, 2026",
    collaborators: [],
    role: "Team of four · Hack the North 2026",
    hero: "/images/projects/home/plus1.jpg",
    heroVideo: "/images/projects/home/plus1Demo.mp4",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/plus1-1imlbz", primary: true },
      { label: "GitHub", href: "https://github.com/DonaldKLee/plus1" },
    ],
    summary: [
      "Most AI meeting assistants are recorders. It sits outside the call, transcribes everything, and hands you a summary after everyone has left. By then, whatever it could have done for you, you've already done yourself.",
      "plus1 is a participant instead. It joins your Google Meet as a guest with a face and a voice, hears the conversation in real time, answers out loud when you talk to it, and does the work (drafts the email, reviews the doc you pasted, pulls up the data) while the meeting is still happening. You're bringing a plus one, not sending a replacement.",
    ],
    sections: [
      {
        heading: "The hard part is knowing when to shut up",
        body: [
          "An AI that can talk in a meeting is easy. An AI that talks at the right time is not. If it chimes in on everything, it's exhausting within five minutes.",
          "So the core of plus1 is a gate: a fast classifier that looks at every line someone says and decides whether to ignore it, answer it, or act on it. Most of the time the answer is ignore. It just listens and keeps context.",
          "We wrote down a few rules early and stuck to them. It never speaks unless it's addressed or it just finished something. If a human starts talking while it's mid-sentence, it stops immediately. Anything irreversible (sending, publishing, deleting) needs an explicit spoken \"yes.\" And if it isn't confident, it says so and asks instead of guessing.",
        ],
      },
      {
        heading: "Why a cartoon",
        body: [
          "The original design was a 3D goose in a business suit (we were in Waterloo, after all). It sounds like a joke, but it was doing real design work: a cartoon dodges the uncanny valley, a beak synced to audio volume is way easier than lip-syncing a human face, and nobody in the call is confused about whether they're talking to a person. It also honks when people disagree or someone monologues past three minutes.",
        ],
      },
      {
        heading: "The underwriting demo",
        body: [
          "For Federato's challenge, we gave plus1 an insurance underwriting job. In a meeting, you can ask it about a property policy and it pulls the data, ranks it against the 2025 appetite rules, enriches it with real-world risk data (FEMA disaster history, flood claims, earthquakes, weather extremes), and answers like an underwriter: decision, the factor driving it, and what to ask the broker for next.",
          "Then it opens the address in a cloud browser on Google Maps and FEMA's risk maps, joins your Meet, and screenshares it to the room. Our demo case was a retail property in Tampa that it declines, and walks everyone through why.",
        ],
      },
      {
        heading: "How we built it",
        body: [
          "A Next.js dashboard is the operator's console: a live transcript, a \"mind\" column showing what plus1 heard, how it classified it, and what it retrieved, and cards for anything it creates. The backend drives a signed-in Chrome with Playwright to join the Meet, pipes a HeyGen LiveAvatar face and an ElevenLabs voice in as the camera and mic, and runs the cloud browser work through Browserbase.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "The interesting design problems in agents are mostly about restraint. What the agent is allowed to do on its own, what it needs to ask about, and how it shows its reasoning so the people in the room can trust it. Getting it to do things was the easy part.",
        ],
      },
    ],
    stack: [
      { label: "App", items: ["Next.js", "TypeScript", "Node.js", "zod"] },
      { label: "Meeting", items: ["Playwright", "Google Meet", "Browserbase"] },
      {
        label: "AI & voice",
        items: ["OpenAI Realtime", "HeyGen LiveAvatar", "ElevenLabs"],
      },
      { label: "Data", items: ["MongoDB", "Appwrite", "Federato API"] },
    ],
  },
  {
    slug: "provent",
    title: "Provent",
    tagline: "A productivity Chrome extension",
    category: "Startup",
    year: "2022",
    date: "March 2022 – June 2023",
    collaborators: [],
    role: "Donald Lee · founder, design, and code",
    hero: "/images/projects/home/provent.png",
    heroVideo: "/images/projects/home/ProventDemo.mp4",
    links: [
      {
        label: "Chrome Web Store",
        href: "https://chrome.google.com/webstore/detail/provent/cnilpijpbkkefelbjobbfgdhpcdfpilg",
        primary: true,
      },
      { label: "Website", href: "https://provent-extension.github.io/" },
      {
        label: "Provent Zero",
        href: "https://chrome.google.com/webstore/detail/provent-zero-pomodoro-sit/mdkafpakfmfighaiblggaeabfckpbaee",
      },
    ],
    summary: [
      "Around 20% of adults chronically procrastinate. I'm not saying I'm one of them, but I've built two Chrome extensions to stop myself from opening YouTube, so draw your own conclusions.",
      "Provent replaces your new tab with a clean workspace, adds a pomodoro timer, and blocks distracting sites while you're supposed to be working. It went from a scrappy beta to a v1.1 on the Chrome Web Store, with a website, a changelog, an email list, and a spin-off on Product Hunt.",
    ],
    sections: [
      {
        heading: "Where it came from",
        body: [
          "Provent is basically the sequel to [Focomend](/project/focomend/). Back then I was toggling a site blocker on and off every time I needed YouTube for a class, and the fix was an extension that only hid the distracting parts.",
          "But hiding recommendations only solved one site. What I really wanted was one place that handled the whole loop: a new tab that pointed me at my to-do list instead of my feeds, a timer for focused sessions, and a blocker that only kicks in during those sessions, so I don't have to remember to turn it off.",
        ],
      },
      {
        heading: "What it does",
        body: [
          "Open a new tab and you get a calm background, the date and time, a search bar, and widgets for the stuff you actually need: a to-do list, notes, your Google Calendar, plus Spotify and YouTube embeds for the study playlist.",
          "Start a pomodoro from the popup, and every site on your block list is off-limits until the session ends. Try to open one and you get a block screen (with your own custom message, if you want to guilt-trip yourself).",
        ],
      },
      {
        heading: "Shipping it like a product",
        body: [
          "This was the first thing I treated like a real product instead of a project. I shipped a beta (v0.031), then iterated in public: pop-up notifications when the timer ends, a pre-made list of blocked sites, fixes for the calendar and Spotify widgets, offline backgrounds for when the internet drops. Then v1.0, then v1.1 with a walkthrough tour, seasonal backgrounds, and widgets that stay open.",
          "Around the extension I built a landing page, a changelog, a tutorial, terms of service, an email list for launch updates, and an uninstall survey. That last one is the one I'd recommend to anyone shipping something: it's hard to find out why people leave unless you ask them on the way out.",
        ],
      },
      {
        heading: "Provent Zero",
        body: [
          "Not everyone wants their new tab replaced. Plenty of people already have one they love. So I split the product. Provent Zero is just the pomodoro timer and the site blocker, no new tab. It launched on Product Hunt.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "Building features is the fun part. Distribution, onboarding, and figuring out why people uninstall are where most of the work actually is. And sometimes the best product decision is offering less.",
        ],
      },
    ],
    stack: [
      { label: "Languages", items: ["JavaScript", "HTML", "CSS"] },
      {
        label: "Platform",
        items: ["Chrome Extensions (Manifest V3)", "chrome.storage"],
      },
      {
        label: "Launch",
        items: ["GitHub Pages", "Google Analytics", "Google Forms", "Product Hunt"],
      },
    ],
  },
  {
    slug: "climate",
    title: "Climate Change, Visualized",
    tagline: "Climate change, in 3D",
    category: "Side-Project",
    year: "2025",
    date: "2025",
    collaborators: [],
    hero: "/images/projects/home/global.png",
    heroVideo: "/images/projects/home/GlobeDemo.mp4",
    links: [
      {
        label: "Try it",
        href: "https://donaldklee.github.io/Global-Climate-Change-Visualization",
        primary: true,
      },
      {
        label: "GitHub",
        href: "https://github.com/DonaldKLee/Global-Climate-Change-Visualization",
      },
    ],
    summary: [
      "Everyone has seen a climate change chart. A line goes up, everyone nods, nobody remembers it. I wanted to see what happens if you put the numbers back on the planet.",
      "This is a 3D globe you can spin and scrub through time. Pick a dataset, drag the slider, and watch every country recolour month by month as land temperatures, CO2 emissions, and sea levels move. Hit animate and it plays the whole thing back.",
    ],
    sections: [
      {
        heading: "The data",
        body: [
          "Three public datasets do the heavy lifting: Berkeley Earth's land temperatures by country (back to the 1700s, though I start rendering at 1880), Our World in Data's CO2 and greenhouse gas emissions, and a global sea level rise series. A side panel keeps the global numbers in view while you explore: the average temperature for the selected month with a small chart, and how far sea levels have moved.",
        ],
      },
      {
        heading: "The unglamorous challenge",
        body: [
          "The hardest bug wasn't 3D at all. It was country names. The temperature dataset says \"United States,\" the map says \"United States of America.\" One says \"Burma,\" the other says \"Myanmar.\" \"Bosnia And Herzegovina\" versus \"Bosnia and Herz.\" Every mismatch is a country that silently stays grey.",
          "I ended up writing a mapping table for each dataset, translating its names into the ones the globe knows. Not the most exciting code I've written, but it's the difference between a map that looks done and one that is.",
        ],
      },
      {
        heading: "Making it more than pretty",
        body: [
          "A spinning globe is cool for about ten seconds. To make it worth staying on, I added an insights panel that explains what you're looking at and what actually helps: why temperatures keep climbing, how emissions break down (population, wealth, energy use, and how clean that energy is), and what slows it down.",
          "On mobile, the menu and insights panels fold away behind buttons so the globe gets the whole screen.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "Colouring the oceans for sea level instead of showing it as a number, splitting the code into cleaner components, and maybe a chatbot you can ask about what you're seeing.",
        ],
      },
    ],
    stack: [
      { label: "Frontend", items: ["React", "Vite", "Tailwind CSS"] },
      { label: "3D & maps", items: ["react-globe.gl", "Three.js", "TopoJSON"] },
      {
        label: "Data",
        items: ["Berkeley Earth", "Our World in Data", "Sea level rise (Kaggle)"],
      },
    ],
  },
  {
    slug: "nwplus",
    title: "nwPlus.io",
    tagline: "The club behind Western Canada's largest hackathons",
    category: "Website",
    year: "2022",
    date: "2022 – 2026",
    collaborators: [],
    role: "Developer → Dev Director → Co-President, with the nwPlus dev team",
    hero: "/images/projects/home/nwplus.jpg",
    heroVideo: "/images/projects/home/nwPluswwwDemo.mp4",
    links: [
      { label: "nwplus.io", href: "https://www.nwplus.io/", primary: true },
      { label: "GitHub", href: "https://github.com/nwplus/www" },
    ],
    summary: [
      "nwPlus is the UBC club that runs nwHacks, HackCamp, and cmd-f. nwplus.io is the front door: it's where students find out what we do, which hackathon is coming up next, who's on the team, and how to join.",
      "I didn't build it from a blank page. It was started by the devs before me, and like most club websites, it gets passed down from team to team. My job over four years was to keep it alive, keep it current, and leave it better than I found it, first as a developer, then leading the dev team, then as co-president.",
    ],
    sections: [
      {
        heading: "A website that changes every season",
        body: [
          "A club site has a weird lifecycle. Nothing changes for months, then everything changes at once: a new hackathon goes live, a new exec team gets announced, applications open and close. If updating it is painful, it goes stale, and a stale hackathon site is how you lose sponsors and hackers.",
          "So most of the work was making those updates routine: the hackathon cards for HackCamp, nwHacks, and cmd-f each season, banners for big announcements, the team section with everyone's profile, role, and socials, the interest form for new members, and a land acknowledgement.",
        ],
      },
      {
        heading: "Under the hood",
        body: [
          "The site is a Next.js static export with styled-components. Content like FAQs and each hackathon's details lives in Firestore, so the rest of the team can update it without a code change. It deploys to Firebase Hosting through GitHub Actions: pushes to main go to production, and pull requests get their own preview link, so anyone on the team can see a change before it goes live.",
          "I spent some time getting that pipeline working again when it broke, because when deploys break on a volunteer team, people just stop shipping.",
        ],
      },
      {
        heading: "From writing code to running the team",
        body: [
          "The bigger change wasn't technical. As Dev Director I went from writing most of the updates myself to leading a team of nine developers, which meant code review, QA passes before launches, and making sure the next person could pick the site up without me. As co-president I zoomed out further, to 9 teams and 53 execs running three hackathons.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "Maintaining something is a different skill than building it. The best thing you can do for a codebase that outlives you is make the boring changes easy, document how it deploys, and trust the next team with it.",
        ],
      },
    ],
    stack: [
      { label: "Frontend", items: ["Next.js", "React", "styled-components", "Lottie"] },
      {
        label: "Backend & deploy",
        items: ["Firebase", "Firestore", "Firebase Hosting", "GitHub Actions"],
      },
    ],
  },
  {
    slug: "honkhonkhire",
    title: "HonkHonkHire",
    tagline: "Interview practice that watches back",
    category: "Hackathon",
    year: "2023",
    date: "September 2023",
    collaborators: ["Vaibhav Sharma", "Michelle Kim", "Maureen Luo"],
    hero: "/images/projects/home/honkhonkhire.png",
    video: "https://www.youtube.com/embed/cNEsCzRvzqo",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/honkhonkhire", primary: true },
      { label: "GitHub", href: "https://github.com/DonaldKLee/HonkHonkHire" },
    ],
    summary: [
      "It's job search season (again). The behavioural interview is the most nerve-wracking part of applying, and there's no good way to practice for it. Most tools can't emulate a real interview because they don't know anything about you, and real interviewers rarely give the kind of feedback that tells you what to fix.",
      "HonkHonkHire is an AI interview coach. It reads your experience from your LinkedIn, resume, or portfolio, generates questions tailored to your story, then evaluates your facial expressions and transcribes your answers to hand back feedback you can actually act on.",
    ],
    sections: [
      {
        heading: "Challenges",
        body: [
          "The project was ambitious for the time we had: a lot of unfamiliar technology to learn and apply in a weekend. We had never worked together as a team before, so part of the weekend was just figuring out each other's strengths, weaknesses, and communication styles.",
        ],
      },
      {
        heading: "What we're proud of",
        body: [
          "We shipped most of the MVP, and we built something all four of us would genuinely use for our own job searches. Picking up [Cohere's API](https://cohere.com/) and OCR Space mid-hackathon and actually getting them into the app was the rewarding part.",
        ],
      },
      {
        heading: "What we learned",
        body: [
          "Everyone stretched. Our designer wrote her first lines of HTML and CSS. Our front-end developer stuck to vanilla JS to drill the fundamentals instead of reaching for a framework. One developer learned new APIs from their docs and moved data between front and back end with Node.js. And I took on facial and emotional expression detection for the first time.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "We'd love to add richer metrics: talking pace, response length, tone of voice. With those, users could track their progress over a whole job search instead of a single mock interview.",
        ],
      },
    ],
    stack: [
      { label: "Languages", items: ["Node.js", "JavaScript", "HTML", "CSS"] },
      {
        label: "Tools & libraries",
        items: [
          "MongoDB Atlas",
          "Firebase",
          "Google MediaPipe",
          "Cohere API",
          "Figma",
        ],
      },
    ],
  },
  {
    slug: "travoai",
    title: "TravoAI",
    tagline: "Trip planning without the tabs",
    category: "Hackathon",
    year: "2023",
    date: "May 2023",
    collaborators: ["Vaibhav Sharma", "Pranav Karthik", "Rosa Chen"],
    hero: "/images/projects/home/travoai.png",
    video: "https://www.youtube.com/embed/78VAqvWSsDg",
    links: [
      { label: "GitHub", href: "https://github.com/DonaldKLee/TravoAI", primary: true },
      {
        label: "Pitch deck",
        href: "/images/projects/StormHacks%202023%20TravoAI%20Pitch%20Deck.pdf",
      },
    ],
    summary: [
      "Travelling is fun. Planning a trip is not: 67% of travelers think it takes too long, and it usually means juggling a dozen tabs and a lot of guessing. TravoAI takes that off your plate and hands you a tailored itinerary, whether you're going solo, with friends, or with family.",
    ],
    sections: [
      {
        heading: "How it works",
        body: [
          "You log in with Google and fill out a short, Typeform-style questionnaire about the trip: where, how many days, the budget, how many people, and the group's interests.",
          "TravoAI turns that into a prompt for OpenAI's text-davinci model, which returns a full itinerary as JSON, balanced against the group's interests, budget, and size.",
          "The itinerary renders day by day. From there you can grab a shareable link to send a friend, export every event straight to Google Calendar, or ask the built-in chatbot anything about the trip.",
        ],
      },
      {
        heading: "Challenges",
        body: [
          "Deciding what actually belonged in the MVP was the first hurdle. We spent real time brainstorming features only to find some weren't feasible in the time we had, or didn't fit the product.",
          "Working with text-davinci was the next one. We had to tune our prompts to keep itinerary generation fast. We also started on React, then realized plain HTML, CSS, and JavaScript would simplify passing data between front and back end. The switch dropped us from two servers to one, but cost us some time refactoring. It was also my first time with EJS, so rendering backend data took some learning.",
          "Despite the time crunch and the last-minute changes, we shipped, on not a lot of sleep. Building it together was the fun part, and we're proud of what we made.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "With more time, a business model: a destination like Science World could surface as a top suggestion for people planning a Vancouver trip, and pay a small cut for each visitor TravoAI sends their way.",
          "We also wanted bus routes, costs, reviews, and images in the itinerary, plus weather, eco-friendly stays, a booking system, a feedback loop, and a way to connect solo travelers heading to the same place.",
        ],
      },
    ],
    stack: [
      {
        label: "Languages & libraries",
        items: ["Node.js", "JavaScript", "EJS", "HTML", "CSS"],
      },
      {
        label: "APIs",
        items: [
          "OpenAI text-davinci",
          "Google Calendar",
          "Google Maps Directions",
          "Google Auth",
        ],
      },
      { label: "Tools", items: ["VS Code", "Figma"] },
    ],
  },
  {
    slug: "hakotenfruits",
    title: "Hakoten Fruits",
    tagline: "Fruit Ninja, no headset",
    category: "Side-Project",
    year: "2022",
    date: "January 2022",
    collaborators: [],
    hero: "/images/projects/home/hakotenfruits.png",
    video: "https://www.youtube.com/embed/6Ot51jTfYWE",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/DonaldKLee/Hakoten-Fruits",
        primary: true,
      },
    ],
    summary: [
      "VR games like Beat Saber are a great way to get moving, but the headset costs a few hundred dollars. Hakoten Fruits is a Fruit Ninja-style game that uses computer vision to track your hand and turn it into the sword you slice fruit with. No headset required.",
    ],
    sections: [
      {
        heading: "What's next",
        body: [
          "There are no current plans for Hakoten Fruits, but the game can be further optimized and the graphics in the game may be improved on in the future.",
        ],
      },
    ],
    stack: [
      {
        label: "Languages & libraries",
        items: ["Python", "Pygame", "OpenCV", "MediaPipe", "NumPy"],
      },
      { label: "Tools", items: ["VS Code", "Pixilart"] },
    ],
  },
  {
    slug: "giftdex",
    title: "GiftDex",
    tagline: "The perfect gift, found for you",
    category: "Hackathon",
    year: "2021",
    date: "August 6–8, 2021",
    collaborators: ["Ricky Zhao", "Rosa Chen", "Henry Zhou"],
    award: "Best Domain Name · RoboHacks",
    hero: "/images/projects/home/giftdex.png",
    video: "https://www.youtube.com/embed/3uVRyXzff60",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/giftbase", primary: true },
      { label: "GitHub", href: "https://github.com/DonaldKLee/GiftDex" },
    ],
    summary: [
      "Built for [RoboHacks](https://robo-hacks.devpost.com/), an MLH hackathon over August 6–8, 2021, where it won Best Domain Name from Domain.com.",
      "Friend, family member, or someone you just met: finding the right gift is hard. GiftDex uses machine learning to do the guessing for you.",
    ],
    sections: [
      {
        heading: "Inspiration",
        body: [
          "Every problem deserves a solution, big or small; the small fixes are the ones that make you appreciate the little things. Around the holidays we all struggle to match the people we love with the right gift, so we used machine learning to predict what they'd want and web scraping to go find it.",
        ],
      },
      {
        heading: "What it does",
        body: [
          "From the recipient's age, gender, and interests, GiftDex predicts the top three gift categories they'd want. It then searches the web within those categories, drops anything over budget, and shows you three products. Don't love them? Reroll.",
        ],
      },
      {
        heading: "How we built it",
        body: [
          "We surveyed people across different age groups to build a diverse, accurate dataset, then trained a model on it to predict the three most popular gift categories for a given age and gender.",
          "We scraped the web for items in those categories. To sharpen the results, users can add the recipient's interests, so an anime fan gets products that match both the predicted category and the interest.",
          "After scraping prices, names, and purchase links, we rendered everything on a Flask site, with JavaScript driving the reroll and the search animation. Then we grabbed a domain from Domain.com and pointed it at the site.",
        ],
      },
      {
        heading: "Challenges",
        body: [
          "To predict the perfect gift we needed to understand what people want by gender, age, and interest, and datasets combining all three were nowhere to be found on sites like Kaggle. After hours of searching we built our own survey instead. It was also our first ML project, so training and testing the model was its own learning curve.",
          "Web scraping in Python was another hurdle: getting an element within an element, and scraping pages that change on every load. And on the design side, making the page look good while fitting in every feature we wanted took real work.",
        ],
      },
      {
        heading: "What we learned",
        body: [
          "Beyond ML, scraping, and UI design, we learned how much teamwork and organization matter. Once we knew each other's strengths we could split work accordingly, and we taught each other through our weak spots so the next hackathon would go smoother.",
        ],
      },
    ],
    stack: [
      { label: "Languages", items: ["Python", "JavaScript", "HTML", "CSS"] },
      {
        label: "Libraries",
        items: ["Flask", "Beautiful Soup 4", "pandas", "scikit-learn"],
      },
      { label: "Tools", items: ["Figma", "Replit", "Domain.com"] },
    ],
  },
  {
    slug: "sharkcult",
    title: "Shark Cult",
    tagline: "Tame sharks for points",
    category: "Hackathon",
    year: "2021",
    date: "August 27–29, 2021",
    collaborators: ["Henry Zhou", "Matthew Quock"],
    award: "Best Domain Name · SharkHacks3",
    hero: "/images/projects/home/sharkcult.png",
    video: "https://www.youtube.com/embed/Z_-SByZKyVs",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/shark-snatcher", primary: true },
      { label: "GitHub", href: "https://github.com/DonaldKLee/SharkCult" },
    ],
    summary: [
      "Built for [SharkHacks3](https://sharkhacks3.devpost.com/), an MLH hackathon over August 27–29, 2021, where it won Best Domain Name from Domain.com.",
      "Ever wanted to start a cult of sharks, or just sharpen your aim? Shark Cult is a browser game: tame sharks for points by clicking them as they leap out of the water.",
    ],
    sections: [
      {
        heading: "Inspiration",
        body: [
          "The shark theme came from the hackathon. The gameplay borrows from Fruit Ninja, and the collect-them-all loop is straight out of gacha games. We threw Blåhaj in too, because it's a huge meme within MLH.",
        ],
      },
      {
        heading: "What it does",
        body: [
          "Wild sharks jump out of the water and you tame them by clicking before they get away. You don't have to catch every one, but miss ten and the game ends. Faster sharks are worth more points.",
          "Click a shark and it shrinks, turns cute, and swims back and forth. The more you tame, the higher your score. Fast sharks need quick reactions and careful aim. Don't have that yet? Play more.",
        ],
      },
      {
        heading: "How we built it",
        body: [
          "HTML, CSS, and JavaScript drive the front end. JS spawns the sharks, sends them off in random directions, detects clicks, clears the ones you miss, and tracks failed attempts. CSS handles the shark and wave animations along with layout.",
          "When the game ends you can add your score to the leaderboard. That data runs through Python into a MongoDB database on Google Cloud.",
          "The sharks, clouds, and water were hand-drawn in ArtRage Lite, animated with CSS to give the ocean some life, and the whole UI was designed in Figma.",
        ],
      },
      {
        heading: "Challenges",
        body: [
          "Moving and formatting objects on the front end gave us trouble, especially animating the waves and sharks. We don't reach for JavaScript often, so dynamically creating elements and wiring up listeners like onclick and animationend was tricky, and the syntax gap from Python meant a lot of Googling, picking a random list item is just simpler in Python.",
          "The leaderboard was the big one: it wouldn't sort correctly. After hours stuck, we asked an MLH mentor, who pointed us to the fix in minutes.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "We're keeping it up for a year and collecting feedback from friends. If the reviews are good, we may add new features.",
        ],
      },
    ],
    stack: [
      { label: "Languages", items: ["Python", "JavaScript", "HTML", "CSS"] },
      { label: "Libraries", items: ["Flask", "PyMongo"] },
      { label: "Tools", items: ["Figma", "Replit", "ArtRage Lite", "Domain.com"] },
    ],
  },
  {
    slug: "vidnotes",
    title: "VidNotes",
    tagline: "Notes that ride along with the video",
    category: "Side-Project",
    year: "2021",
    date: "August–September 2021",
    collaborators: ["Nikole Hu"],
    role: "Programmer, with Nikole Hu on design",
    hero: "/images/projects/home/vidnotes.png",
    links: [
      { label: "GitHub", href: "https://github.com/DonaldKLee/VidNotes", primary: true },
    ],
    summary: [
      "Ever wanted to take notes on a YouTube video without splitting your screen? Or send a video to a friend with instructions attached? Or take notes on someone else's device without logging into anything?",
      "VidNotes is a free web app that pairs a YouTube video with notes side by side. Send a link with the notes baked in, or, if you're on a borrowed device, email the notes straight to yourself for later.",
    ],
    sections: [
      {
        heading: "How I built it",
        body: [
          "I set up a Flask server and built the site from our Figma design with HTML and CSS. JavaScript pre-validates the forms before Python checks them on the backend. Submitted data is captured with WTForms, processed in Python, and stored in MongoDB. The smtplib module lets users email notes to themselves, and the whole thing is hosted on Heroku.",
        ],
      },
      {
        heading: "Challenges",
        body: [
          "Embedding the video was harder than expected: YouTube has multiple domains and URL formats, and a link copied from a playlist won't embed as-is. I fixed it by normalizing the string. The bigger challenge was deploying to Heroku, my first time hosting a Flask server, so I had to learn what extra files the app needed for Heroku to build it.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "Working with a designer sharpened my teamwork, building the site sharpened my front end, and standing up the Flask server sharpened my backend. Along the way I picked up environment variables, sending email from Python, MongoDB, and deploying to Heroku, all things I've carried into later projects.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "A login system, so people can keep all their notes without emailing them or holding onto a link.",
        ],
      },
    ],
    stack: [
      { label: "Languages", items: ["Python", "JavaScript", "HTML", "CSS"] },
      {
        label: "Libraries",
        items: ["Flask", "WTForms", "MongoDB", "smtplib", "APScheduler", "gunicorn"],
      },
      { label: "Tools", items: ["Heroku", "Figma"] },
    ],
  },
  {
    slug: "focomend",
    title: "Focomend",
    tagline: "YouTube, minus the rabbit hole",
    category: "Side-Project",
    year: "2021",
    date: "February 2021",
    collaborators: [],
    hero: "/images/projects/home/focomend.png",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/DonaldKLee/Focomend",
        primary: true,
      },
    ],
    summary: [
      "YouTube is addicting, and the recommendations are the worst of it. Focomend is a Chrome extension that strips out recommended videos and hides comments, so a quick watch stays a quick watch.",
    ],
    sections: [
      {
        heading: "Inspiration",
        body: [
          "When the pandemic moved school, volunteering, and work online, my screen time, and my distractions, went up with it. One educational video would surface a recommendation, I'd click it, then another, and an hour was gone. I tried [Forest's extension](https://chrome.google.com/webstore/detail/forest-stay-focused-be-pr/kjacjjdnoddnpbbcjilcajfhhbdhkpgk) to block unproductive sites, but I needed YouTube for coursework, so I was constantly toggling it on and off. So I built my own extension instead, despite not knowing how.",
        ],
      },
      {
        heading: "Challenges",
        body: [
          "The original plan was to blur unproductive videos, but that made YouTube painfully laggy to browse. Removing the videos entirely was both faster and better: even a blurred thumbnail can spark enough curiosity to make someone disable the extension. As my first Chrome extension, storing user preferences in local storage tripped me up too, but I worked through it.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "I learned to build a Chrome extension with HTML, CSS, and JavaScript by reading the [official docs](https://developer.chrome.com/docs/extensions/) and other articles online.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "Maybe a launch on the Chrome Web Store, with a polish pass on the UX and the UI.",
        ],
      },
    ],
    stack: [{ label: "Languages", items: ["JavaScript", "HTML", "CSS"] }],
  },
  {
    slug: "thecovid19infobot",
    title: "The COVID-19 Info Bot",
    tagline: "Daily case counts in Discord",
    category: "Side-Project",
    year: "2020",
    date: "August–December 2020",
    collaborators: ["Rosa Chen", "Matthew Quock", "Kenny Kwan", "Samuel Wu"],
    hero: "/images/projects/home/covidbot.png",
    video: "https://www.youtube.com/embed/AYMbxRRWwDA?si=3UEUgUlmuA8d0wKA",
    links: [
      {
        label: "Add to Discord",
        href: "https://discord.com/oauth2/authorize?client_id=744391461113561228&permissions=18432&scope=bot",
        primary: true,
      },
      { label: "Website", href: "https://thecovid19infobot.github.io/" },
      { label: "GitHub", href: "https://github.com/TheCOVID19InfoBot" },
    ],
    summary: [
      "The COVID-19 Info Bot delivers daily updates and quick, reliable answers to COVID-19 questions right inside Discord, so you can stay informed without switching apps mid-conversation.",
    ],
    sections: [
      {
        heading: "Inspiration",
        body: [
          "I wanted to do something fun and productive over a quarantine summer, and I wanted COVID to end so I could see friends again. After a webinar on building Discord bots in Python, I remembered the WHO had launched a Messenger bot to fight COVID misinformation. A Discord version felt worth a shot: the more people stay informed, the more cases might drop.",
        ],
      },
      {
        heading: "Challenges",
        body: [
          "To run the bot reliably I pulled in a few friends to build it with me. As my first Discord bot, plenty of things were new, the trickiest being a feature that pushes daily COVID updates to every server automatically, with no command needed.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "I got a taste of being a project manager and leading a project. I learned to build a Discord bot, picked up customer service experience helping users in our support server, and discovered bot directories like [top.gg](https://top.gg/bot/744391461113561228) along the way.",
        ],
      },
    ],
    stack: [
      { label: "Bot", items: ["Python", "discord.py", "covid"] },
      { label: "Website", items: ["HTML", "CSS", "JavaScript", "Figma"] },
    ],
  },
  {
    slug: "ardio",
    title: "Ardio",
    tagline: "News articles you can listen to",
    category: "Side-Project",
    year: "2020",
    date: "November 4–17, 2020",
    collaborators: [],
    hero: "/images/projects/home/ardio.png",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/DonaldKLee/Ardio",
        primary: true,
      },
    ],
    summary: [
      "Ardio is a web app that turns CTV News articles into MP3s for the days you'd rather listen than read. It works with CTV today, with plans to add sources like Global News and CNN.",
    ],
    sections: [
      {
        heading: "How it works",
        body: [
          "Paste in a link and Ardio reads the page's source, pulling out the article text while filtering the noise: ads, recommended articles, footer junk. It then converts the clean text to an MP3 with Google Text-to-Speech and drops it on the page with a player, so you can listen right there without downloading anything.",
        ],
      },
      {
        heading: "Challenges",
        body: [
          "I designed Ardio to handle several users at once, which meant the conversion functions had to run concurrently, so I dug into threading. I also added error handling: paste an incompatible link and instead of crashing, the site re-renders with a message so you can try again.",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "I learned how to run functions concurrently, stand up a Flask server, and collect input from text fields.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "Down the road: a language switcher, support for more outlets like Global News and CNN, and a voice that sounds less robotic and more human.",
        ],
      },
    ],
    stack: [
      { label: "Languages", items: ["Python", "JavaScript", "HTML", "CSS"] },
      {
        label: "Libraries",
        items: ["Flask", "Beautiful Soup 4", "gTTS"],
      },
    ],
  },
  {
    slug: "studyhawk",
    title: "StudyHawk",
    tagline: "A timer that nudges you to rest",
    category: "Side-Project",
    year: "2020",
    date: "August 4–7, 2020",
    collaborators: [],
    hero: "/images/projects/home/studyhawk.png",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/DonaldKLee/StudyHawk",
        primary: true,
      },
    ],
    summary: [
      "With school and work moving home, procrastination got easier. StudyHawk is a productivity timer that pings you when it's time for a break and when the break is over, with a couple of friendly nudges in between: one halfway through your work session, in case you've drifted, and one when your break is about 75% done.",
    ],
    sections: [
      {
        heading: "Inspiration",
        body: [
          "Pomodoro timers, and the study timers at [Leading Learners](https://www.leadlearners.ca/).",
        ],
      },
      {
        heading: "What I learned",
        body: [
          "I planned to build the GUI with tkinter, but PyQt5 looked far more modern, so I switched even though it was harder to learn. As my first Python program with a GUI, wiring my functions to the interface objects was the tricky part, and a good learning experience.",
        ],
      },
    ],
    stack: [
      { label: "Languages & libraries", items: ["Python", "PyQt5", "win10toast"] },
    ],
  },
  {
    slug: "carepackages4u",
    title: "CarePackages4U",
    tagline: "Care packages, coordinated",
    category: "Hackathon",
    year: "2020",
    date: "June 6–7, 2020",
    collaborators: ["Team Ambition"],
    award: "2nd of 21 teams · XDHacks Mini",
    hero: "/images/projects/home/carepackages4u.png",
    video: "https://www.youtube.com/embed/zyt20a6v2qw",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/DonaldKLee/CarePackages4U",
        primary: true,
      },
      { label: "Demo", href: "https://www.youtube.com/watch?v=zyt20a6v2qw" },
      {
        label: "Slides",
        href: "https://docs.google.com/presentation/d/e/2PACX-1vT1LJSLl0Z23vlOB85TWzxkdg2SoNmK6iAD0qhNeztc8oaRX2forELng5JmbBCLlNxqIqWITkGGG1l1/pub?start=true&loop=false&delayms=15000&slide=id.g35f391192_00",
      },
    ],
    summary: [
      "Built for [XDHacks Mini-Covid](https://mini.xdhacks.com/), an online hackathon on June 6–7, 2020, where it placed 2nd of 21 teams.",
      "CarePackages4U lets anyone who can't leave home post a list of what they need. Local volunteers, donors, food banks, and charities browse those lists, get in touch, and arrange a delivery.",
    ],
    sections: [
      {
        heading: "Why it matters",
        body: [
          "With self-quarantine mandated for many, people most vulnerable to COVID shouldn't have to risk a trip outside. A donor only needs to add the requested items to their own shopping list, which cuts the number of people out and the total trips made.",
          "A contactless drop-off at the door keeps transmission risk low for both sides, and the whole thing builds a small sense of community and dependability when it's needed most.",
        ],
      },
      {
        heading: "The idea",
        body: [
          "Make basic living supplies more accessible to people who are vulnerable or in need during the pandemic, and make it easy for anyone in a position to help to give aid with a no-contact delivery.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "A login system to separate volunteers from requesters, post expiry and renewal, image uploads, location-based listings to surface the nearest requests, a verification step for volunteers, and better responsive layouts for phones and tablets.",
        ],
      },
    ],
    stack: [
      { label: "Languages", items: ["Python", "HTML", "CSS"] },
      {
        label: "Libraries",
        items: ["Flask", "WTForms", "Flask-SQLAlchemy", "pytz"],
      },
      { label: "Tools", items: ["Figma", "Replit", "Google Slides"] },
    ],
  },
];

export const writeupSlugs = writeups.map((w) => w.slug);

export function getWriteup(slug: string): Writeup | undefined {
  return writeups.find((w) => w.slug === slug);
}

/** the next write-up in the list, wrapping around at the end */
export function getNextWriteup(slug: string): Writeup {
  const i = writeups.findIndex((w) => w.slug === slug);
  return writeups[(i + 1) % writeups.length];
}
