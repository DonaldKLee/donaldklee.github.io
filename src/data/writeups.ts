import type { Category } from "./content";

/* ----------------------------------------------------------------------------
   Project write-ups.

   One structured document per project. The reusable page at
   /work/[slug] renders any of these, in this order, so the "next project"
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
  /** screenshot in /public */
  hero: string;
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
    award: "StormHacks 2023",
    hero: "/images/projects/home/travoai.jpg",
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
          "Nothing planned for now, but there's room to optimize the game and give the graphics a pass down the road.",
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
      { label: "Try it out", href: "https://giftdex.tech/", primary: true },
      { label: "Devpost", href: "https://devpost.com/software/giftbase" },
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
      { label: "Try it out", href: "https://sharkcult.tech/", primary: true },
      { label: "Devpost", href: "https://devpost.com/software/shark-snatcher" },
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
      {
        label: "Try it out",
        href: "https://usevidnotes.herokuapp.com/",
        primary: true,
      },
      { label: "GitHub", href: "https://github.com/DonaldKLee/VidNotes" },
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
