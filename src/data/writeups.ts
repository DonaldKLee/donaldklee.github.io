import { allProjects, type Category } from "./content";

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

export interface WriteupMedia {
  /** image in /public */
  src: string;
  width: number;
  height: number;
  caption?: string;
  /** defaults to the caption */
  alt?: string;
}

export interface WriteupSection {
  /**
   * the small eyebrow above the headline, rendered as a markdown marker
   * ("The problem" → "## the-problem"). When omitted, the heading doubles
   * as the marker.
   */
  label?: string;
  /** the headline; with a label, write it as the claim the section makes */
  heading: string;
  /** one entry per paragraph */
  body: string[];
  /** optional short list under the prose */
  points?: string[];
  /** one full-width screenshot, or two side by side */
  media?: WriteupMedia[];
}

export interface WriteupStat {
  value: string;
  label: string;
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
  /** a single award line, or an event with several prizes (the event name becomes the label) */
  award?: string | { event: string; prizes: string[] };
  /** screenshot in /public; also the poster for heroVideo, the OG image, and the next-project card */
  hero: string;
  /** optional silent demo loop (mp4) that plays in the hero frame instead of the still */
  heroVideo?: string;
  /** youtube embed url, when there's a demo reel */
  video?: string;
  links: WriteupLink[];
  /** the lead paragraph(s); shown up top, before the narrative */
  summary: string[];
  /** up to three headline numbers shown under the overview */
  stats?: WriteupStat[];
  sections: WriteupSection[];
  /** closing takeaways, rendered as a numbered list */
  learnings?: string[];
  stack: StackGroup[];
}

export const writeups: Writeup[] = [
  {
    slug: "ember",
    title: "Ember",
    tagline: "A wildfire-prevention rover with a phone for its brain",
    category: "Hackathon",
    year: "2026",
    date: "October 23rd - 25th, 2026",
    collaborators: ["Leon Si", "Parth Jairam", "Matthew Sakhno"],
    role: "Leaf detection, the autopilot simulator, and live tracking on the dashboard",
    award: {
      event: "SOON Fall'26",
      prizes: ["Best Startup"],
    },
    hero: "/images/projects/home/ember.jpg",
    heroVideo: "/images/projects/home/EmberDemo.mp4",
    video: "https://www.youtube.com/embed/L76hCrbjPUI",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/soon-2026", primary: true },
      { label: "GitHub", href: "https://github.com/SOON-2026/soon2026" },
    ],
    summary: [
      "Ember is a small rover that finds dry leaves on the ground and gathers them into a pile. Dry leaves are what lets a small spark turn into a wildfire, and clearing them is a chore most people don't keep up with.",
      "We used an iPhone as the rover's brain. A phone already has a camera, motion tracking, and LiDAR, so we didn't need to build any of that ourselves. Four of us built it over a weekend at SOON, and we won Best Startup!",
    ],
    sections: [
      {
        heading: "Why we built it",
        body: [
          "We were inspired by this summer's wildfires. Most wildfire tech starts working once there's already smoke. We wanted to work on what happens before that, which is the dry fuel that builds up around forests and homes. A lot of that is just fallen leaves.",
          "Clearing them isn't hard. It's just repetitive, and the leaves keep falling. That seemed like a good job to hand off to a robot.",
        ],
      },
      {
        heading: "What I worked on",
        body: [
          "The leaf detection model, the autopilot and the 3D simulator we tested it in, and the live rover and leaf tracking on our dashboard.",
          "The leaf detection runs on the iPhone mounted on the rover. A computer vision model finds leaves in the camera feed, and the phone's LiDAR tells us how far away they are and which things are obstacles instead of leaves. The dashboard shows where the rover is and every leaf it has found as it happens, so you can watch what the rover is thinking from a laptop and drive it from the browser.",
        ],
      },
      {
        heading: "Picking a leaf detector",
        body: [
          "My initial plan was to train our own leaf detection model. But there was no good public datasets for dead leaves on the ground. The closest one I found was made for spotting disease on crop leaves. The model I trained on it scored 0.54 mAP50 on green leaves but only 0.04 on dead ones, because none of its photos were of leaves on the ground. I also trained a model to spot obstacles like water, rocks, and trees, and it barely picked up water or rocks. Training a model also takes hours, and for hackathon, our biggest problem was time.",
          "So I switched to Google's OWL-ViT. Instead of training it, you describe what you want in plain text, like \"a dry brown leaf\" or \"a pile of autumn leaves\", and it finds it in the image. No dataset and no training needed. It isn't perfect on its own, since it also picks up brown things that aren't leaves. So I paired it with LiDAR. Anything more than 25 cm off the ground or wider than 1.5 m gets thrown out, which removed most of the bark, fences, and furniture. LiDAR also covered obstacles, so we dropped the obstacle model completely.",
        ],
      },
      {
        heading: "Getting the rover to a leaf",
        body: [
          "Drawing a box around a leaf on screen was the easy part. The detections flicker between frames, anything brown looks like a leaf, and once the rover gets close, the leaf drops out of view under the camera.",
          "So I saved every leaf as a spot on the ground instead of a box on the screen, using the phone's motion tracking. If two sightings are within 25 cm of each other, they count as the same leaf. A leaf only becomes a target after it's been seen three times. Until then, it gets forgotten if it isn't seen again within four seconds. Since the rover is driving to a spot on the ground, it can keep going even after the leaf is out of view.",
        ],
      },
      {
        heading: "Bugs from the rover's own body",
        body: [
          "The rover can't see under itself, so when the scoop missed, it had no idea. I made it notice a miss later instead. If it drives away and sees the same leaf still sitting there, that leaf goes back on the list. After three tries it gives up so it doesn't get stuck on one leaf.",
        ],
      },
      {
        heading: "Testing without the rover",
        body: [
          "Our hardware wasn't ready until the morning of submissions, so I couldn't wait for the rover to test the autopilot. I built a 3D simulator in the browser instead. It puts the rover on a fake lawn with leaves, obstacles, and noisy detections, and runs the same autopilot code the phone runs. That let me watch the whole job play out: find the leaves, drive to each one, scoop, bring them back to the pile, and retry the ones it missed.",
          "The simulator can't tell you how the real camera behaves, so I also took the phone outside. I held it where it would sit on the rover and walked around, acting as the rover myself. That let me test the leaf detection on real leaves and check that the autopilot was steering me the right way, all before the rover could drive.",
        ],
      },
    ],
    learnings: [
      "Training our own model wasn't worth it without good data. A model we could just describe leaves to, checked with LiDAR, got us further in less time.",
      "Detecting a leaf and driving to it are two different problems. Most of the work was remembering where things are and knowing when to give up.",
      "Building the simulator first felt slow, but it let us test everything before the hardware was ready.",
      "For hardware projects, you need to plan ahead really early so you have the right parts. We had to 3D print some parts at the last minute or drive out to get them.",
    ],
    stack: [
      { label: "Mobile", items: ["Expo", "React Native", "TypeScript", "Swift", "ARKit", "LiDAR"] },
      { label: "Leaf detection", items: ["OWL-ViT", "ExecuTorch", "Core ML"] },
      { label: "Hardware", items: ["ESP32", "C++", "Wi-Fi", "Bluetooth Low Energy"] },
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
    date: "August - October 2026",
    collaborators: [],
    hero: "/images/projects/home/sifter.jpg",
    heroVideo: "/images/projects/home/SifterDemo.mp4",
    links: [
      { label: "Try Sifter", href: "https://checksifter.com/", primary: true },
      {
        label: "Chrome extension",
        href: "https://chromewebstore.google.com/detail/sifter-stocks-explained-s/apofafalfajdodcfpdfcjhhiidpmjpld",
      },
    ],
    summary: [
      "Sifter explains how your stocks are doing in plain English. It looks at the stocks you own or follow, tells you what changed and why, and skips the finance jargon.",
    ],
    sections: [
      {
        heading: "Why I built it",
        body: [
          "I used to swing trade a lot. As a student, though, I didn't have time to dig into a company's financials and figure out what they meant. I just wanted a quick recap of how my stocks were doing.",
          "A lot of people my age are in the same spot. They buy a couple of index funds and a few companies they've heard of, then see red and green numbers every morning that they don't really understand. Free tools give you a chart and leave you to figure it out. The ones that explain things cost $25 to $120 a month, and a lot of them don't cover Canadian stocks well.",
          "I built Sifter to lower the barrier for new investors.",
        ],
        media: [
          {
            src: "/images/projects/writeups/sifter-app-dashboard.jpg",
            width: 1600,
            height: 900,
            caption: "The dashboard. It starts with what the market did today, in one sentence.",
          },
        ],
      },
      {
        heading: "The first two versions",
        body: [
          "The first version was a scanner for crypto and stocks, mostly memecoins. When I looked into it more, that space was already full of funded teams with faster data and one-click trading. I didn't think I could win there, so I dropped crypto completely.",
          "The second version was a free tool for swing trading. Seven indicators would vote on each stock, the votes became a score, and the score became a trade plan with an entry, a stop, and a target. Every call would get checked 5, 10, and 20 days later so the app had a public track record.",
        ],
      },
      {
        heading: "Using it like a real user",
        body: [
          "Before launching, I used Sifter the way my target user would: a student with no finance background, checking stocks on their phone between classes. But I didn't like it.",
        ],
        points: [
          "The landing page asked me to sign in before showing a single stock.",
          "The dashboard was overwhelming. It was cluttered with numbers and terms I didn't truly understand.",
          "I had too many features. Paper trading, a MCP, a track record, etc. I didn't end up using any of these, and it overcomplicated the product.",
          "The BUY, SELL, and HOLD labels sounded more certain than the data behind them. To a beginner, BUY reads like a sure thing, even when the indicators only lean one way.",
        ],
      },
      {
        heading: "Revamping the product",
        body: [
          "At the end of September, I completely revamped the product. Removed the track record and the paper trading. The dashboard is now a simple recap of what changed in the stocks you follow, and every number is explained in plain English. The BUY, SELL, and HOLD labels are gone, replaced with a neutral \"what it means\" explanation.",
        ],
      },
      {
        heading: "Two features I built, then paused",
        body: [
          "I added brokerage syncing with the SnapTrade API, so you could connect your brokerage and have your holdings show up on their own instead of typing them in. It worked, but I paused it in October for two reasons. SnapTrade charges per connected user, and Sifter is free and makes no money, so the cost would grow with every new user. It also asked too much too early. Connecting your brokerage to an app you just found looks sketchy, and I wouldn't do it either. Now you just tap the stocks you own, with no account and no share counts. Anyone who already linked a brokerage still has it working.",
          "I also built a morning recap email, sent through Resend. I paused that too. A daily email from a new app can easily feel like spam, and in Canada and the US, every marketing email has to include a mailing address. Sifter isn't incorporated, so I don't have a business address I can publish. The code is still there, and I can turn both features back on with a switch once those problems are solved.",
        ],
      },
      {
        heading: "Onboarding",
        body: [
          "I thought a lot about the first minute someone spends on Sifter. The first version opened on a full-screen \"Connect Brokerage\" page you had to get past before you could see anything. Most people would leave right there.",
          "Now the dashboard is the first thing you see, with the market already on it. Instead of asking you to sign up, it asks you to tap 3 to 5 stocks you own or care about. Each tap adds the stock to your watchlist right away and saves it in your browser, so you're reading about your own stocks within seconds, without an account.",
          "You only need an account when you want more. If you try to follow a sixth stock, Sifter asks you to sign in, and everything you already picked moves over to your account. By then you've already seen what the app does, so signing up feels like a fair trade instead of a wall.",
        ],
      },
      {
        heading: "Making it quick to read",
        body: [
          "Most people don't want to read a full page about their stocks. They want to open the app, get the gist, and get on with their day. So I rebuilt the dashboard around a daily recap that works like Instagram Reels. You scroll through it one card at a time, and each card covers one thing, like what the market did today or why one of your stocks moved.",
          "The recap opens by itself the first time you visit each trading day, and once you close it, it doesn't come back until tomorrow. A fast flick only moves one card, so you can't skip past something about your own money by accident. Unlike Reels, it doesn't move on by itself, since everyone reads at a different speed.",
        ],
        media: [
          {
            src: "/images/projects/writeups/sifter-app-recap.jpg",
            width: 1600,
            height: 766,
            caption: "Today's recap, one card at a time.",
          },
        ],
      },
      {
        heading: "What it does now",
        body: [
          "You get a short recap of what changed in the stocks you follow, a watchlist, what's moving today, and a plain-English version of every number on the screen. For example, a P/E ratio of 20 becomes \"you're paying $20 for every $1 the company earns in a year.\"",
        ],
        media: [
          {
            src: "/images/projects/writeups/sifter-app-ticker.jpg",
            width: 1600,
            height: 900,
            caption: "Opening a stock. It even tells you when the price hasn't been updated yet today.",
          },
          {
            src: "/images/projects/writeups/sifter-app-readings.jpg",
            width: 1600,
            height: 900,
            caption: "Each reading is a question, an answer, and a \"why\" you can open.",
          },
        ],
      },
      {
        heading: "Technical challenges",
        body: [
          "Sifter gets its prices from Yahoo Finance, which is free but limits how often you can call it. If every visitor made their own calls, a few people opening stocks at the same time could get us blocked, and the cost would grow with every new user.",
          "So nothing is calculated when you open a page. One scheduled Cloud Function checks the market every 2 minutes while it's open, every 15 minutes before and after hours, and not at all when it's closed. It saves the results, and every page just reads the latest saved copy and shows how old it is. Whether 1 person or 1,000 people open a stock, it's the same number of calls, so pages load fast and the cost doesn't change.",
          "Each check covers 60 of the 180 stocks Sifter tracks. It always includes the big market funds, anything someone owns or follows, and anything with a strong signal, then rotates through the rest so every stock gets covered in about a week.",
          "Charts had the same problem. Minute-by-minute prices are a lot of data, so every chart starts on 3 months of daily prices, which the scheduled job already has saved. The 1 day and 1 week charts only load when you tap them, and those are saved for a few minutes per stock too. A hundred people opening the same chart cost one request instead of a hundred.",
        ],
        media: [
          {
            src: "/images/projects/writeups/sifter-app-trending.jpg",
            width: 1600,
            height: 900,
            caption: "Trending: what's moving most today, and why.",
          },
        ],
      },
      {
        heading: "The Chrome extension",
        body: [
          "I also built a Chrome extension, so you can check your stocks from a side panel on any website without opening a new tab.",
        ],
        media: [
          {
            src: "/images/projects/writeups/sifter-ext-today.jpg",
            width: 800,
            height: 1350,
            caption: "Today's recap, about the stocks you own.",
          },
          {
            src: "/images/projects/writeups/sifter-ext-holdings.jpg",
            width: 800,
            height: 1350,
            caption: "Your stocks, Canadian and US, each in one line.",
          },
          {
            src: "/images/projects/writeups/sifter-ext-stock.jpg",
            width: 800,
            height: 1350,
            caption: "Any stock, explained in the same panel.",
          },
        ],
      },
    ],
    learnings: [
      "Building is the easy part now. With AI, anyone can build an app. Knowing what makes a product good, and getting it in front of people, is the hard part.",
      "Simple is better. I wanted too many features, and it made the app overwhelming. In the end, I focused on the recap and made that one thing really good.",
      "Think about scale early. If I were the only user, Sifter would be free to run and fast. The real work was keeping it cheap and fast with a lot of people using it at once.",
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
    tagline: "Your plus one for meetings that matter",
    category: "Hackathon",
    year: "2026",
    date: "September 18th - 20th, 2026",
    collaborators: ["Vaibhav Sharma", "Kevin Gu", "Manav Joshi"],
    role: "Agent that joins meetings, transcription & tool calling",
    award: {
      event: "Hack the North 2026",
      prizes: ["Best Use of Browserbase"],
    },
    hero: "/images/projects/home/plus1.jpg",
    heroVideo: "/images/projects/home/plus1Demo.mp4",
    video: "https://www.youtube.com/embed/0zWkyvdc30Y",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/plus1-1imlbz", primary: true },
      { label: "GitHub", href: "https://github.com/DonaldKLee/plus1" },
    ],
    summary: [
      "plus1 is the plus one you bring to meetings that matter. It joins your Google Meet as a real participant with a face and a voice, listens to the conversation, speaks up when you talk to it, and takes on action items while everyone is still in the room so you can focus on the discussion.",
      "Four of us built it at Hack the North 2026, and we won Best Use of Browserbase!",
    ],
    sections: [
      {
        heading: "Why we built it",
        body: [
          "Most AI meeting assistants just record. They transcribe the call and send you a summary after everyone has left. By then, you've probably already done the follow-up work yourself.",
          "We thought about the meetings where you wish you had one more person. A client call where you're talking and also trying to pull up numbers. A team sync where someone says \"can someone file that?\" and nobody does. plus1 is that extra person you invite along: it sits in the call, listens, and picks up the work so you don't have to context-switch away from the conversation.",
        ],
      },
      {
        heading: "What I worked on",
        body: [
          "I worked on getting plus1 into the meeting and on everything between it hearing something and doing something:",
        ],
        points: [
          "The Playwright automation that joins a Google Meet as a signed-in profile, with the avatar on its camera and mic.",
          "The live transcription with speaker attribution, streamed over the OpenAI Realtime API.",
          "The agent brain: the decision layer that sorts every line into ignore, answer, or act, then chains the right tools.",
          "The Intact insurance quoting tools, the deterministic pricing engine, VIN lookup, PDF generation, and the email flow.",
          "A chat mode for talking to plus1 outside of a meeting, with the same tools and personality.",
          "Most of the dashboard that shows what it's thinking and why.",
        ],
      },
      {
        heading: "Working backwards from the user",
        body: [
          "The first version of the agent brain was eager. It would jump in on anything that sounded like a question. In our first test call, it kept interrupting people mid-sentence. We needed to figure out how to get the AI to talk only at the right moments.",
          "So I rewrote the decision layer around a simple question: what would a thoughtful colleague do right now? Most of the time, the answer is nothing. Listen, hold the context, and wait. The confidence gate I built reflects that: every utterance gets classified with a confidence score, and the default is to stay quiet. The agent only speaks when it's clearly been addressed, or when it finishes a task someone asked for.",
        ],
      },
      {
        heading: "The rules we discovered by testing",
        body: [
          "After several trials, we created these rules:",
        ],
        points: [
          "If someone says three words while it's talking, it stops. We tried two words first, but every \"mhm\" and \"yeah\" cut it off. Three was the threshold where natural back-channel noises get ignored but a real interruption gets caught.",
          "It doesn't listen to its own voice, so it can't get stuck in a loop replying to itself.",
          "Anything irreversible, like sending an email or submitting a form, needs someone to say \"yes\" out loud first. This one came from a test where it almost emailed a draft quote to a person we made up.",
          "If it's not sure, it asks instead of guessing. A wrong answer from an AI in a live meeting is worse than no answer, because people might act on it before anyone checks.",
        ],
      },
      {
        heading: "One-on-one calls",
        body: [
          "The \"only speak when someone talks to you\" rule worked well in a group, but in a call with just one other person, plus1 felt broken. That person is always talking to plus1, but they don't say its name every time. So plus1 checks how many people are in the call, and if it's just one person, it treats everything as directed at it unless it's filler like \"one sec.\" This was a small fix, but it completely changed how the product felt in the most common use case.",
        ],
      },
      {
        heading: "Tool calling and making it extensible",
        body: [
          "plus1 doesn't just answer questions. It does things. The agent brain decides what tool to call, and a single executor runs it. Every tool namespace, whether it's insurance quoting, document generation, browser automation, or email, plugs into the same interface. The brain picks the tool and passes a query; the executor routes it and returns a result the agent can narrate back to the room.",
          "This matters because it means adding a new capability doesn't touch the decision layer at all. You write the tool, register it, and plus1 can use it in its next meeting. It's the same idea behind [MCP](https://modelcontextprotocol.io/introduction): tools are separate from the model, and you can swap them in and out without changing how the agent thinks. That's what made it possible for four people to add tools in parallel without stepping on each other.",
          "For the demo, we built tools for insurance quoting (with a deterministic pricing engine, so every number is auditable and explainable), VIN lookup through a real NHTSA API, PDF generation, email, underwriting, and browser automation. But the point was never the insurance. It was that plus1 could pick up any job you give it, as long as someone writes the tool.",
        ],
      },
      {
        heading: "Showing its work",
        body: [
          "The dashboard shows a live transcript, how plus1 sorted each line, the tools it called, and cards for anything it made. This was one of the first things I built, before most of the tools. If you can't see why an AI did something, it's hard to trust it, and trust matters a lot more when the AI is talking out loud in a room with your client.",
          "Behind it, Playwright runs a Chrome window that joins the Meet. A HeyGen avatar and an ElevenLabs voice act as its camera and mic, OpenAI Realtime handles the speech-to-speech path, Gemini handles the decision classification, and Browserbase runs a cloud browser it can share with the call.",
        ],
      },
    ],
    learnings: [
      "The best agents are not chatbots with tools. They need boundaries, observable reasoning, and graceful behavior when data is incomplete.",
      "Most of the hard design questions were about holding back: what it does on its own, what it asks about first, and when it says nothing.",
      "AI should own the ambiguous, conversational half of a workflow. Deterministic systems should own the consequential calculations.",
      "Trial and error is how you find product-market fit. You have to put it in front of people, find out what annoys them, and shape the product around that.",
    ],
    stack: [
      { label: "App", items: ["Next.js", "TypeScript", "Node.js", "zod"] },
      { label: "Meeting", items: ["Playwright", "Google Meet", "Browserbase", "Stagehand"] },
      {
        label: "AI & voice",
        items: ["OpenAI Realtime API", "Gemini", "HeyGen LiveAvatar", "ElevenLabs"],
      },
      { label: "Data", items: ["MongoDB Atlas", "Federato API", "NHTSA vPIC"] },
    ],
  },
  {
    slug: "fragments",
    title: "Fragments",
    tagline: "Capture the moment that inspired you",
    category: "Hackathon",
    year: "2025",
    date: "September 12th - 14th, 2025",
    collaborators: ["Charity Grey", "Paul Tiberghien", "Rayna Lai"],
    role: "The Chrome extension that records clips, and the AI that watches each clip to describe and tag it",
    award: {
      event: "Hack the North 2025",
      prizes: ["Best Use of DynamoDB Streams (AWS)", "Best Use of Cohere API"],
    },
    hero: "/images/projects/home/fragments.jpg",
    heroVideo: "/images/projects/home/FragmentsDemo.mp4",
    video: "https://www.youtube.com/embed/rs7uaWL67tQ",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/fragments-gmleoj", primary: true },
      { label: "GitHub", href: "https://github.com/charity-g/fragment-HTN2025" },
    ],
    summary: [
      "Fragments is a second brain for videos. A Chrome extension lets you clip the exact moment that inspired you on YouTube, TikTok, or Instagram, and a web app keeps all your clips tagged, searchable, and in one place.",
      "We built it at Hack the North 2025 and won two prizes, one from AWS and one from Cohere. I built the Chrome extension and the AI that describes and tags each clip.",
    ],
    sections: [
      {
        heading: "Why we built it",
        body: [
          "Anything you make is built on everything you've watched and learned from. Whether it's video editing, frontend development, or dance, being a better creator starts with paying attention to great work.",
          "But there's no good way to save the moment that actually mattered. A bookmark saves a 20-minute video. What you wanted was the eight seconds where you thought \"oh, that's how they did it.\" A month later, you're scrubbing through the whole thing trying to find that part again, if you even remember which video it was.",
          "In most creative fields, a video shows you a lot more than words can. So we built a tool that captures the exact moment, right where you found it.",
        ],
      },
      {
        heading: "What I worked on",
        body: [
          "I built the Chrome extension and the AI that describes and tags each clip. The extension is the core of the product. If saving a clip means opening another app, switching tabs, or uploading a file, people won't do it. The button has to be right there, on the video, at the moment you feel something is worth keeping.",
          "With the extension installed, a record button shows up on any video. Click it, and a dark overlay shows a timer with stop and delete buttons. When you stop, a short form lets you add the clip to a collection with tags and notes so you remember why you saved it.",
        ],
        media: [
          {
            src: "/images/projects/writeups/fragments-clip.jpg",
            width: 1280,
            height: 582,
            caption: "Saving a clip from YouTube with a collection, tags, and notes.",
          },
        ],
      },
      {
        heading: "Recording across three platforms",
        body: [
          "The extension records by calling captureStream() on the video element, which gives you a clean clip of just the player. It works on YouTube, TikTok, and Instagram.",
        ],
      },
      {
        heading: "Handling infinite feeds",
        body: [
          "YouTube loads all its videos when the page opens. TikTok and Instagram don't. They load new videos as you scroll, which means buttons added when the page first loads miss everything after the first few.",
          "I used a MutationObserver to watch the DOM for new video elements and inject a record button on each one as it appears. The observer runs continuously, so no matter how far you scroll, every video gets a button. It also skips videos that already have one, so you don't end up with duplicates.",
        ],
      },
      {
        heading: "Making clips searchable with AI",
        body: [
          "When someone saves a clip, they don't always add good tags or notes. A lot of people just hit save and move on. But a month later, they need to find that clip, and all they remember is what was in it.",
          "So I built a pipeline that takes a frame from the clip every 2 seconds and sends them to Cohere's Aya Vision model. The model writes a summary of what's happening in the clip and suggests tags, like \"stop motion,\" \"floating UI,\" or \"whip pan.\" Those descriptions and tags get indexed in OpenSearch alongside the user's own notes, so you can find a clip by what's in it and not just what you called it.",
          "The prompt I wrote asks the model to describe the clip as if explaining to a video creator, and to suggest editing instructions for recreating it. That way, the AI output doubles as a reference. You don't just find the clip, you get a starting point for how to do it yourself.",
        ],
      },
      {
        heading: "The result",
        body: [
          "The AI descriptions and tags I generate feed into the search. A query like \"dolly zoom\" finds the right clip even if you never typed those words, because the vision model saw it and described it. That's what makes the second brain work: you don't have to be organized when you save something, because the AI organizes it for you.",
        ],
        media: [
          {
            src: "/images/projects/writeups/fragments-gallery.jpg",
            width: 1280,
            height: 582,
            caption: "All your clips as looping previews.",
          },
        ],
      },
    ],
    learnings: [
      "Saving something has to take almost no effort. Every extra step is a reason not to bother, which is why the record button sits right on the video.",
      "Plan for the platforms that don't play nice. TikTok and Instagram needed a different recording path than YouTube, and finding that out early kept it from becoming a demo-day surprise.",
      "AI descriptions are only useful if they're searchable. Generating a summary nobody can find is wasted compute.",
    ],
    stack: [
      {
        label: "Frontend",
        items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Chrome Extension", "MediaRecorder API"],
      },
      { label: "Backend", items: ["Python", "FastAPI", "OpenCV", "FFmpeg", "Boto3"] },
      {
        label: "AWS",
        items: ["S3", "Lambda", "DynamoDB Streams", "OpenSearch"],
      },
      { label: "AI & auth", items: ["Cohere Aya Vision", "Auth0", "Vercel"] },
    ],
  },
  {
    slug: "provent",
    title: "Provent",
    tagline: "A productivity Chrome extension",
    category: "Startup",
    year: "2022",
    date: "January 2022 - April 2024",
    collaborators: ["Grace Zhou"],
    role: "Technical Co-founder",
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
      "Provent is a Chrome extension that replaces your new tab with a clean workspace, adds a pomodoro timer, and blocks distracting websites while you're supposed to be working.",
    ],
    stats: [
      { value: "700+", label: "downloads on the Chrome Web Store" },
      { value: "75", label: "beta testers" },
      { value: "2", label: "extensions: Provent, and Provent Zero for people who like their new tab" },
    ],
    sections: [
      {
        heading: "Why I built it",
        body: [
          "During the pandemic, school moved online, so I was on my laptop all day. That made it really easy to end up on YouTube or Reddit when I was supposed to be doing homework.",
          "I installed Momentum, which makes your new tab look nicer, and Forest, which blocks sites while a timer runs. Neither really worked for me. The pomodoro timer on Momentum was paid, and I was usually too lazy to turn Forest on in the first place. A year earlier I'd also built Focomend, an extension that hid YouTube recommendations, but it was laggy and hard to maintain, so I never released it.",
          "So I decided to combine the two into one extension that fit how I actually studied, with a blocker that turns itself on when you start working. I started building this in my last semester of high school, and it became my capstone project.",
        ],
      },
      {
        heading: "Finding a co-founder",
        body: [
          "I started by designing the extension myself, because I'd learned from past projects that coding without a design means recoding everything later. I got feedback from designer friends I met volunteering at Youth Helping Youth, applied it, and started building. A few weeks in, I realized the design still wasn't good.",
          "Design and marketing aren't my strengths, and I didn't want to spend months getting good at them. So I reached out to a friend, who I also met through Youth Helping Youth and who was studying Business and Computer Science at Western. After I explained the idea, she joined as my co-founder. She designed the extension and the website in Figma, and led branding and marketing. I wrote all the code.",
          "One of the first things we changed was the look. My first version looked a lot like Momentum, so we rebranded to make Provent its own thing instead of a copy of something people already had.",
        ],
      },
      {
        heading: "What it does",
        body: [
          "When you open a new tab, you get a calm background, the time, a search bar, and widgets for things you actually need: a to-do list, notes, your Google Calendar, and Spotify and YouTube for your study playlist. The pomodoro timer is one click away in the toolbar.",
          "The site blocker only works while the timer is running. Most blockers are always on, so you end up turning them off and forgetting to turn them back on. I tied the blocker to the timer so it turns itself on when you start focusing and off when your break starts. If you open a blocked site during a focus session, you see how much time is left, with your own custom message if you want one.",
        ],
        media: [
          {
            src: "/images/projects/writeups/provent-newtab.jpg",
            width: 1280,
            height: 720,
            caption: "The new tab, with widgets one click away.",
          },
          {
            src: "/images/projects/writeups/provent-timer.jpg",
            width: 1280,
            height: 720,
            caption: "The pomodoro timer in the toolbar.",
          },
        ],
      },
      {
        heading: "Keeping the timer in sync",
        body: [
          "Even with Focomend behind me, I had to relearn a lot. Google had just moved new extensions to Manifest V3, which changed how they're set up for security reasons, so I spent a lot of time in the docs and on Stack Overflow.",
          "The hardest part was keeping data the same everywhere. The timer lives in a lot of places at once: the toolbar popup, every new tab, and every website you have open, since that's where the blocker runs. If you start a session in one place, all of them need to agree on how much time is left. The to-do list had the same problem between the new tab and the popup. At first, they kept getting out of sync.",
          "There wasn't a clean built-in way to do this in Chrome extensions, so I changed what each page keeps track of. Instead of every page running its own countdown, Provent saves one thing when you start a session: the time it ends. Every page reads that one value from Chrome's storage and works out the time left by itself. Closing the popup, opening a new tab halfway through, or switching windows doesn't matter, because they're all doing the same math from the same number.",
        ],
        media: [
          {
            src: "/images/projects/writeups/provent-blocked.jpg",
            width: 1280,
            height: 720,
            caption: "What Instagram looks like during a focus session.",
          },
        ],
      },
      {
        heading: "A blocker that gets out of the way",
        body: [
          "My first blocker wiped the page. During a focus session, it deleted everything on a distracting site. That worked, but when your break started, the site was still broken until you reloaded it, and anything you had open there, like a half-watched video, was gone.",
          "So I rebuilt it as a layer on top of the page instead. A small script on each site checks every two seconds whether you're focusing. If you are, the layer covers the page. When your break starts, the layer goes away and the site is right where you left it. Being strict during focus is only half the job. The break has to feel like a break too.",
        ],
      },
      {
        heading: "Keeping the new tab fast",
        body: [
          "A new tab page gets opened dozens of times a day, so it can't feel slow. The Google Calendar widget was the heaviest part, because it loads a full calendar from Google. I changed it so the calendar only loads when you actually open that widget, instead of on every new tab. Most new tabs never need it, so most new tabs got faster.",
        ],
      },
      {
        heading: "Launching it",
        body: [
          "Halfway through, I realized that no matter how good the extension was, not many people would find it if we didn't spend time marketing it. So we pushed the launch back from June, and I paused the extension to build our website from Grace's designs.",
          "This was the first project I treated like a real product. We ran a beta with 75 testers, then I kept releasing updates on the Chrome Web Store based on what people asked for: timer notifications, a pre-made block list, offline backgrounds for when the internet goes down, a walkthrough for new users, and seasonal themes. Provent was also part of LOI Accelerator Labs Batch 11. Along with the extension, we made:",
        ],
        points: [
          "A landing page, a changelog, a tutorial, and terms of service.",
          "An email list for launch updates.",
          "An uninstall survey, because it's hard to know why people leave unless you ask them.",
        ],
      },
      {
        heading: "Provent Zero",
        body: [
          "Feedback told me something I didn't expect. A lot of people already had a new tab they liked, and replacing it was a reason to leave, even if they liked the timer and the blocker.",
          "So I made Provent Zero, which is just the pomodoro timer and the site blocker, with a short tour for first-time users. Same product, just without the new tab.",
        ],
      },
    ],
    learnings: [
      "Building features is the fun part. Getting people to find it, learn it, and stick with it is where most of the work is.",
      "I don't have to be good at everything. Finding a co-founder who was great at design and marketing let me spend my time on the code.",
      "Small teams move fast. With two of us, we both always knew what was going on, and new ideas didn't have to go through a bunch of people before we tried them.",
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
    date: "October - December 2025",
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
      "A 3D globe you can spin and move through time. Pick a dataset, drag the slider, and watch each country change colour month by month as land temperatures, CO₂ emissions, and sea levels change. You can also hit play and watch the whole thing animate.",
    ],
    sections: [
      {
        heading: "Why I built it",
        body: [
          "Everyone has seen a climate change chart. A line goes up, people nod, and then they forget about it. I wanted to see what it would feel like to put the numbers back on the planet, where you can find your own country and watch it change.",
        ],
      },
      {
        heading: "What it does",
        body: [
          "It uses three public datasets: Berkeley Earth's land temperatures by country, Our World in Data's CO₂ emissions, and a global sea level dataset. A side panel shows the global numbers while you explore, like the average temperature for that month and how much sea levels have risen.",
        ],
        media: [
          {
            src: "/images/projects/writeups/globe-temperature.jpg",
            width: 1280,
            height: 620,
            caption: "Land temperature by country, with the global numbers on the side.",
          },
        ],
      },
      {
        heading: "577,000 rows in the browser",
        body: [
          "The site has no backend. It's hosted on GitHub Pages, so everything happens in your browser. The temperature file alone is 22 MB and about 577,000 rows, one for every country and every month going back to the 1700s, plus 14 MB of CO₂ data.",
          "I read each file once when the page loads and keep only the columns the globe needs. I also cut everything before 1880. Those early records only cover a few countries and come with huge uncertainty, so they made the map look emptier and less accurate, and they were a lot of extra rows to load.",
          "It's still not as fast as it could be. Every time you move the slider, the app goes through all the rows to find that month. If I did it again, I'd group the rows by month once when the page loads, so each slider move is a single lookup.",
        ],
      },
      {
        heading: "Getting countries to show up",
        body: [
          "The hardest part wasn't the 3D. It was country names. The temperature dataset says \"United States\" but the map says \"United States of America.\" One says \"Burma\" and the other says \"Myanmar.\" Every mismatch meant a country stayed grey with no data. I wrote a table for each dataset that matches its country names to the ones the map uses.",
          "The CO₂ data had the opposite problem. It also has rows for regions like \"World,\" \"Africa,\" and \"Europe (excl. EU-27),\" and some of those were being drawn over real countries. So I added a list of regions to skip. None of this is exciting code, but without it the map only looked finished.",
        ],
      },
      {
        heading: "Adding context",
        body: [
          "Once the globe worked, I kept thinking about the next question someone would have, which is \"okay, so what can we do about it?\" So I added an insights panel that explains what you're looking at, what drives emissions (population, wealth, energy use, and how clean that energy is), and what helps slow it down. On mobile, the menu and insights hide behind buttons so the globe gets the whole screen.",
        ],
        media: [
          {
            src: "/images/projects/writeups/globe-co2.jpg",
            width: 1280,
            height: 620,
            caption: "CO₂ emissions per person, with the insights panel on the right.",
          },
        ],
      },
      {
        heading: "What's next",
        body: [
          "Sea level is still just a number in the side panel. I'd like to show it on the oceans too. I'd also clean the data ahead of time, so the page loads a small file instead of the full datasets.",
        ],
      },
    ],
    learnings: [
      "Most of data visualization is cleaning data. The pretty part is maybe the last 20%.",
      "Bad data doesn't throw errors. It just leaves a country grey or paints the wrong colour, so you have to go looking for it.",
      "A visualization keeps people around when it answers the next question they have.",
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
    date: "September 2022 - March 2025",
    collaborators: ["nwPlus dev and design team"],
    role: "Developer, then Dev Director",
    hero: "/images/projects/home/nwplus.jpg",
    heroVideo: "/images/projects/home/nwPluswwwDemo.mp4",
    links: [
      { label: "nwplus.io", href: "https://www.nwplus.io/", primary: true },
      { label: "GitHub", href: "https://github.com/nwplus/www" },
    ],
    summary: [
      "nwPlus is the UBC club that runs nwHacks, HackCamp, and cmd-f. nwplus.io is where students find out what we do, which hackathon is coming up, who's on the team, and how to join. It's also where sponsors look before they decide to support us.",
      "I worked on it as a developer, then as Dev Director I suggested a full revamp and led the dev team through it.",
    ],
    stats: [
      { value: "12+", label: "hackathons developed for" },
      { value: "1000+", label: "hackers per year" },
      { value: "9", label: "developers led" },
    ],
    sections: [
      {
        heading: "Keeping it up to date",
        body: [
          "Club websites get passed down from team to team. Nothing changes for months, then a lot changes at once: a new hackathon opens, new teams are hired and announced, applications open and close. If updating the site is a pain, it falls behind, and that's not a good look for sponsors or hackers.",
          "As a developer, most of my work was keeping up with those updates. Looking back at my commits, a lot of them are the same few changes, every season, and each one meant editing the code, getting it reviewed, and redeploying the site:",
        ],
        points: [
          "Updating the team section with everyone's profile, role, and socials every year.",
          "Opening and closing application statuses for HackCamp, nwHacks, and cmd-f.",
        ],
      },
      {
        heading: "Why a revamp?",
        body: [
          "When I became Dev Director, I wanted to make our site easier to update and easier for visitors find information and get a sense of what our club is like",
        ],
        points: [
          "It wasn't the most modern (last revamp was years ago).",
          "The stats sponsors care about, like how many hackers and projects we've had, were hard to find.",
          "We had a lot of nice features, but they were hidden where most people would never see them.",
        ],
      },
      {
        heading: "The revamp",
        body: [
          "So I suggested a revamp. I wanted the site to feel more modern and actually show our club culture. The site has three main visitors: hackers looking for the next event, students who might want to join, and sponsors deciding whether to support us. I wanted each of them to find what they came for quickly.",
          "For students thinking about joining, photos from our socials, like our events and team hangouts show the people behind the hackathons. A club website is also our hiring page. When we're looking for new execs, seeing that we actually have fun together makes people want to apply.",
          "We moved the stats to the top where sponsors would see them right away. I built a new hero section, a hackathons section where each event gets its own planet, a mobile navbar, a newsletter signup with a confirmation step, and a section for sponsors. Before it went live in fall 2024, we went through a few rounds of testing as a team.",
        ],
        media: [
          {
            src: "/images/projects/writeups/nwplus-stats.jpg",
            width: 788,
            height: 386,
            caption: "The stats, now right near the top.",
          },
          {
            src: "/images/projects/writeups/nwplus-team.jpg",
            width: 788,
            height: 386,
            caption: "The team section, which gets updated every year.",
          },
        ],
      },
      {
        heading: "Opening applications without a developer",
        body: [
          "Opening applications shouldn't need a developer. The organizers running each hackathon know when applications open, and they shouldn't have to wait on a code change to tell people.",
          "So right after the revamp, I moved each hackathon's dates and whether applications are open into Firebase. The site reads them when it loads. It also sorts the hackathons on its own: the next one shows first, an event stays up for three days after it starts, and past events move to the back. Since our admin portal already writes to Firebase, organizers can open or close applications and change dates from there, and the site updates right away, with no pull request and no deploy.",
        ],
      },
    ],
    learnings: [
      "People come to a hackathon website to find something specific, like when the event is or whether applications are open. They want it fast, so that information should be the easiest thing to find.",
      "A website should be easy to keep up to date. Letting organizers change things through our admin portal, instead of asking a developer every time reduces a lot of friction.",
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
    tagline: "AI mock interviews tailored to you",
    category: "Hackathon",
    year: "2023",
    date: "September 15th - 17th, 2023",
    collaborators: ["Vaibhav Sharma", "Michelle Kim", "Maureen Luo"],
    role: "Full-stack. I connected the front end and back end and got Cohere working.",
    award: {
      event: "Hack the North 2023",
      prizes: ["Best Use of MongoDB Atlas"],
    },
    hero: "/images/projects/home/honkhonkhire.png",
    video: "https://www.youtube.com/embed/cNEsCzRvzqo",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/honkhonkhire", primary: true },
      { label: "GitHub", href: "https://github.com/DonaldKLee/HonkHonkHire" },
    ],
    summary: [
      "It's job search season (again)! One of the most nerve-wracking parts of applying for a job is the behavioural interview, and there isn't a great way to practice for it.",
      "HonkHonkHire is an AI interview practice app. It reads your experience from your resume, LinkedIn, or portfolio, asks you questions about your own experiences, and gives you feedback based on your answers and facial expressions. We built it at Hack the North 2023 and won Best Use of MongoDB Atlas!",
    ],
    sections: [
      {
        heading: "Why we built it",
        body: [
          "Most practice tools can't really recreate an interview because their questions are generic. A real interviewer asks about the project on your resume, not a random question from a list. Interviewers also rarely give useful feedback, so you leave confused and without a plan to improve.",
          "So we focused on two things: questions about your own experience, and feedback you can actually use.",
        ],
      },
      {
        heading: "What it does",
        body: [
          "You upload your resume or link your LinkedIn or portfolio. OCR Space pulls the text out, and Cohere uses it to write interview questions about your experiences. While you answer on camera, MediaPipe tracks your facial expressions and your answer gets transcribed. Cohere then uses both to give you feedback on what went well and what to work on.",
        ],
      },
      {
        heading: "What I worked on",
        body: [
          "I was the full-stack developer on the team. I connected the front end and back end, passed data between them with Node.js, and got Cohere generating the questions and feedback. We stored resumes in Firebase and account settings in MongoDB.",
          "It was my first time using Cohere and OCR Space, so I spent a lot of the weekend reading docs.",
        ],
      },
      {
        heading: "Getting useful questions out of Cohere",
        body: [
          "My first prompts gave back generic questions, the same kind you'd find on any list online. That was the exact problem we were trying to fix. So I gave Cohere more context. Along with your resume, the prompt includes what you told us during onboarding: your industry, the role and level you're applying for, and what you want to get better at. The questions started sounding like they came from someone who had actually read your resume.",
          "The other problem was the format. Cohere's answers came back in a slightly different format every time, and the app would break trying to read them. So I asked for exactly seven questions in a fixed JSON format, which the app could read every time. Generating them still took a few seconds, so I added a loading page so the wait didn't look like the app had frozen.",
        ],
      },
      {
        heading: "Challenges",
        body: [
          "We had a lot of ideas and not much time, so we limited brainstorming and looked at the sponsor prizes to help us choose. We also picked a backup idea in case we couldn't decide within a couple of hours.",
          "The project was ambitious for a weekend, and we'd never worked together before, so we spent some time figuring out each other's strengths and how we liked to communicate. We only slept around three hours and planned our sleep so the right people were awake at the same time.",
        ],
      },
    ],
    learnings: [
      "The quality of an AI feature depends on the context you give it. Generic input gets generic questions.",
      "If code is going to read the model's answer, ask for a strict format. Treat it like an API, not a chat.",
      "On a new team, figuring out each other's strengths early saved us more time than any shortcut.",
    ],
    stack: [
      { label: "Languages", items: ["Node.js", "JavaScript", "HTML", "CSS"] },
      {
        label: "Tools & libraries",
        items: [
          "Cohere API",
          "OCR Space",
          "Google MediaPipe",
          "MongoDB Atlas",
          "Firebase",
          "Figma",
        ],
      },
    ],
  },
  {
    slug: "travoai",
    title: "TravoAI",
    tagline: "AI trip planner for you and your friends",
    category: "Hackathon",
    year: "2023",
    date: "May 20th - 21st, 2023",
    collaborators: ["Vaibhav Sharma", "Pranav Karthik", "Rosa Chen"],
    role: "The itinerary prompt, the trip form, showing the itinerary, and the chatbot",
    hero: "/images/projects/home/travoai.png",
    video: "https://www.youtube.com/embed/78VAqvWSsDg",
    links: [
      { label: "Devpost", href: "https://devpost.com/software/travoai", primary: true },
      { label: "GitHub", href: "https://github.com/DonaldKLee/TravoAI" },
      {
        label: "Pitch deck",
        href: "/images/projects/StormHacks%202023%20TravoAI%20Pitch%20Deck.pdf",
      },
    ],
    summary: [
      "Travelling is fun, but 67% of travelers think planning a trip takes too long, and it usually means a lot of tabs and guessing. Whether you're travelling solo, with friends, or with family, TravoAI plans an itinerary for your group.",
      "We built it over a weekend at StormHacks 2023.",
    ],
    sections: [
      {
        heading: "Why we built it",
        body: [
          "Planning a trip for yourself is already a lot of work. Planning for a group is even harder, because you have to think about a shared budget and everyone's interests. Usually one person ends up doing it all in a spreadsheet. We wanted to replace that with a few simple questions.",
        ],
      },
      {
        heading: "What it does",
        body: [
          "You log in with Google and fill out a short form about the trip: where you're going, how many days, how many people, your budget, and what the group is interested in.",
          "TravoAI turns your answers into a prompt for OpenAI's text-davinci model, which returns a full itinerary based on the group's interests, budget, and size. You can view it day by day, send a link to a friend, add every event to Google Calendar, or ask the chatbot questions about the trip.",
        ],
      },
      {
        heading: "What I worked on",
        body: [
          "I wrote the prompt that turns the group's answers into an itinerary, built the trip form, rendered the itinerary on the page, and added the loading screen and the chatbot. Vaibhav connected the OpenAI API, added transit directions between activities with Google Maps, and built the shareable links.",
        ],
      },
      {
        heading: "Turning a paragraph into a plan",
        body: [
          "A paragraph about a city reads well, but you can't follow it. A plan needs times, places, and costs, and the app needed to be able to read it.",
          "So I rewrote the prompt to include everything from the form: where you're going, the dates, how many people, the budget, and the group's interests. Then I asked for the answer as JSON, with a date, start time, end time, location, duration, cost, and rating for every activity, and multiple activities per day. That let us show the trip day by day, add each event to Google Calendar, and look up how to get from one activity to the next. Generating a whole trip took a while, so I added a loading screen so people knew it was working.",
        ],
      },
      {
        heading: "Dropping React halfway through",
        body: [
          "We started with React, but about six hours in, passing data between the React front end and our Node back end was slowing everyone down. It also meant running two servers. I switched us to plain HTML, CSS, and JavaScript with EJS templates, so the server could send pages with the data already in them. Refactoring cost us time on the first night, but everything after that was faster to build. It was also my first time using EJS.",
          "Even with the time crunch and the last-minute changes, we finished, with not much sleep.",
        ],
      },
      {
        heading: "What's next",
        body: [
          "If we had more time, we'd want a business model. For example, a place like Science World could show up as a top suggestion for people planning a Vancouver trip, and pay a small amount for each visitor TravoAI sends them.",
          "We also wanted to add bus routes, costs, reviews, photos, weather, eco-friendly places to stay, booking, a way to give feedback on itineraries, and a way for solo travelers going to the same place to meet each other.",
        ],
      },
    ],
    learnings: [
      "If code needs to use what an AI gives back, ask for structured data. A nice paragraph is hard to build on.",
      "Changing direction early is cheaper than fighting your setup all weekend.",
      "Deciding what not to build in a weekend matters as much as what you build.",
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
    tagline: "Fruit Ninja with your hand, no headset needed",
    category: "Side-Project",
    year: "2022",
    date: "December 2021 - January 2022",
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
      "VR games like Beat Saber are a great way to get exercise, but VR headsets can be expensive. Hakoten Fruits is a game inspired by Fruit Ninja that uses your webcam to track your hand, so your hand becomes the sword you use to slice fruit.",
    ],
    sections: [
      {
        heading: "How it works",
        body: [
          "MediaPipe finds 21 points on your hand in each frame from the webcam. I take two of them, your wrist and the base of your middle finger, and use the point halfway between them as the centre of your palm. That point moves the mouse, and the sword follows the mouse. So the game itself is just a normal Pygame game, and it doesn't need to know a hand is controlling it.",
          "I picked the palm on purpose. Fingertips move a lot and disappear when you close your hand, so a sword tied to a fingertip shakes around. The palm stays steady while you swing.",
          "A couple of small details made it feel right. The camera image gets flipped first, otherwise moving your hand right would move the sword left. The game window is also the same size as your camera, so the edges of the screen match what the camera can see.",
        ],
      },
      {
        heading: "When it loses your hand",
        body: [
          "Your hand leaves the camera a lot when you're swinging at fruit. Instead of letting fruit fall while the sword is stuck, the game shows a message that it can't find your hand and pauses for half a second so you can bring it back.",
          "There's also a small window that shows what the camera sees, but only as the outline of your hand on a black background, shrunk to a quarter of the size. You can tell right away if it's tracking you, without it covering the game.",
        ],
      },
      {
        heading: "The game",
        body: [
          "Fruit falls in waves, and each time you clear a wave, the next one has more fruit. Each fruit is rotated randomly so they don't all look the same, and once in a while a coconut shows up and falls faster than the rest. I drew all the art in Pixilart.",
        ],
      },
    ],
    learnings: [
      "Picking the right point to track mattered more than the model. The palm made the same model feel a lot steadier.",
      "Plan for the model losing track. A short pause and a clear message felt better than a stuck sword.",
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
    date: "August 6th - 8th, 2021",
    collaborators: ["Ricky Zhao", "Rosa Chen", "Henry Zhou"],
    award: {
      event: "RoboHacks",
      prizes: ["Best Domain Name"],
    },
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
    date: "August 27th - 29th, 2021",
    collaborators: ["Henry Zhou", "Matthew Quock"],
    award: {
      event: "SharkHacks3",
      prizes: ["Best Domain Name"],
    },
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
    date: "August - September 2021",
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
    date: "August - December 2020",
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
      "It ended up in 140+ Discord servers, including some with 10,000+ members.",
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
    date: "November 4th - 17th, 2020",
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
    date: "August 4th - 7th, 2020",
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
    date: "June 6th - 7th, 2020",
    collaborators: ["Team Ambition"],
    award: {
      event: "XDHacks Mini",
      prizes: ["2nd Place"],
    },
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

/* archived is set on the project card (content.ts); write-ups follow it */
const archivedSlugs = new Set(
  allProjects.filter((p) => p.archived && p.slug).map((p) => p.slug!)
);

export function isArchived(slug: string): boolean {
  return archivedSlugs.has(slug);
}

/* every write-up still builds, so old links keep working */
export const writeupSlugs = writeups.map((w) => w.slug);

/* the ones the site actually points people to */
const listedWriteups = writeups.filter((w) => !isArchived(w.slug));

export function getWriteup(slug: string): Writeup | undefined {
  return writeups.find((w) => w.slug === slug);
}

/**
 * The next listed write-up, wrapping around at the end. Archived write-ups
 * are skipped; landing on one directly sends "next" to the first listed one.
 */
export function getNextWriteup(slug: string): Writeup {
  const i = listedWriteups.findIndex((w) => w.slug === slug);
  return listedWriteups[(i + 1) % listedWriteups.length];
}
