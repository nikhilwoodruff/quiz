export interface Question {
  question: string;
  answer: string;
  options?: string[];
  image?: string;
  images?: { url: string; label: string }[];
  coordinates?: { lat: number; lng: number };
}

export interface Round {
  name: string;
  questions: Question[];
  isInteractive?: boolean;
}

export const rounds: Round[] = [
  {
    name: "General knowledge & current affairs",
    questions: [
      {
        question: "Which country won the most gold medals at the 2024 Paris Olympics?",
        answer: "USA — they won 40 golds, ahead of China (40) on silver count and GB (14)",
      },
      {
        question: "Which pharmaceutical company developed Ozempic and Wegovy?",
        answer: "Novo Nordisk — the Danish company became Europe's most valuable firm in 2024",
      },
      {
        question: "In January 2024, which country became the fifth nation to soft-land a spacecraft on the Moon?",
        answer: "Japan — JAXA's SLIM lander touched down, after USA, USSR, China, and India",
      },
      {
        question: "What is the name of OpenAI's text-to-video AI model announced in February 2024?",
        answer: "Sora — it can generate up to 60 seconds of video from text prompts",
      },
      {
        question: "Which film won Best Picture at the 2024 Oscars?",
        answer: "Oppenheimer — it won 7 Oscars including Best Director for Christopher Nolan",
      },
    ],
  },
  {
    name: "Geography",
    questions: [
      {
        question: "The Kaliningrad Oblast is an exclave of which country?",
        answer: "Russia — it's sandwiched between Poland and Lithuania on the Baltic Sea",
      },
      {
        question: "What is the deepest point in the world's oceans?",
        answer: "Challenger Deep — 10,935m deep in the Mariana Trench, Pacific Ocean",
      },
      {
        question: "The Khyber Pass connects which two countries?",
        answer: "Afghanistan and Pakistan — a historic trade route through the Hindu Kush",
      },
      {
        question: "What is the only landlocked country in Southeast Asia?",
        answer: "Laos — bordered by Thailand, Vietnam, Cambodia, China, and Myanmar",
      },
      {
        question: "Lake Titicaca lies on the border of which two countries?",
        answer: "Peru and Bolivia — at 3,812m elevation, it's the highest navigable lake",
      },
    ],
  },
  {
    name: "GCSE maths & english",
    questions: [
      {
        question: "Factorise: x² + 5x + 6",
        answer: "(x + 2)(x + 3) — find two numbers that multiply to 6 and add to 5",
      },
      {
        question: "A car depreciates by 15% per year. After 2 years, what percentage of its original value remains?",
        answer: "72.25% — multiply 0.85 × 0.85 = 0.7225",
      },
      {
        question: "In 'An Inspector Calls', what is the name of the Inspector?",
        answer: "Inspector Goole — his name is a pun on 'ghoul', hinting at his supernatural nature",
      },
      {
        question: "What rhetorical technique uses three parallel elements, like 'veni, vidi, vici'?",
        answer: "Tricolon — also called the 'rule of three', used for emphasis and rhythm",
      },
      {
        question: "In 'A Christmas Carol', what is the name of Scrooge's former fiancée?",
        answer: "Belle — she broke off their engagement because Scrooge loved money more than her",
      },
    ],
  },
  {
    name: "Christopher Nolan",
    questions: [
      {
        question: "What was Christopher Nolan's first feature film?",
        answer: "Following (1998) — a neo-noir thriller made for just $6,000 in black and white",
      },
      {
        question: "In Inception, what object does Cobb use as his totem?",
        answer: "A spinning top — originally his wife Mal's totem; if it keeps spinning, he's dreaming",
      },
      {
        question: "In Interstellar, one hour on Miller's planet equals how many years on Earth?",
        answer: "7 years — due to time dilation from the nearby black hole Gargantua",
      },
      {
        question: "In The Prestige, what are the three parts of a magic trick called?",
        answer: "The Pledge, The Turn, The Prestige — setup, performance, and payoff",
      },
      {
        question: "Who won Best Supporting Actor for playing Lewis Strauss in Oppenheimer?",
        answer: "Robert Downey Jr. — his first Oscar after nominations for Chaplin and Tropic Thunder",
      },
    ],
  },
  {
    name: "GeoGuessr",
    isInteractive: true,
    questions: [
      {
        question: "Where in the world is this?",
        answer: "Madrid Road, Guildford, UK — a residential street named after the Spanish capital",
        image: "/images/guildford.png",
        coordinates: { lat: 51.2362, lng: -0.5704 },
      },
      {
        question: "Where in the world is this?",
        answer: "Noisy-le-Grand, France — famous for its brutalist Espaces d'Abraxas, used in Hunger Games",
        image: "/images/noisy-le-grand.png",
        coordinates: { lat: 48.8481, lng: 2.5522 },
      },
      {
        question: "Where in the world is this?",
        answer: "Newcastle, Australia — not the UK one! A coastal city in New South Wales",
        image: "/images/newcastle-australia.png",
        coordinates: { lat: -32.9283, lng: 151.7817 },
      },
      {
        question: "Where in the world is this?",
        answer: "San Antonio, Texas — home of the Alamo and the famous River Walk",
        image: "/images/san-antonio.png",
        coordinates: { lat: 29.4241, lng: -98.4936 },
      },
      {
        question: "Where in the world is this?",
        answer: "Downing Street, London — home of the Prime Minister at No. 10",
        image: "/images/no10.webp",
        coordinates: { lat: 51.5034, lng: -0.1276 },
      },
    ],
  },
  {
    name: "Odd one out",
    isInteractive: true,
    questions: [
      {
        question: "Which scientist is the odd one out: Marie Curie, Albert Einstein, Charles Darwin, Niels Bohr?",
        answer: "Charles Darwin — died 1882, before the Nobel Prize started in 1901",
        options: ["Marie Curie", "Albert Einstein", "Charles Darwin", "Niels Bohr"],
      },
      {
        question: "Which country is the odd one out: Germany, Switzerland, France, Italy?",
        answer: "Switzerland — not in the EU (the others are members)",
        options: ["Germany", "Switzerland", "France", "Italy"],
      },
      {
        question: "Which film is the odd one out: A Clockwork Orange, Full Metal Jacket, Blade Runner, The Shining?",
        answer: "Blade Runner — Ridley Scott; the others are Stanley Kubrick films",
        options: ["A Clockwork Orange", "Full Metal Jacket", "Blade Runner", "The Shining"],
      },
      {
        question: "Which politician is the odd one out: Theresa May, Nigel Farage, Liz Truss, Boris Johnson?",
        answer: "Nigel Farage — never been PM (the others all served)",
        options: ["Theresa May", "Nigel Farage", "Liz Truss", "Boris Johnson"],
      },
      {
        question: "Which musician is the odd one out: John Lennon, Mick Jagger, Paul McCartney, Ringo Starr?",
        answer: "Mick Jagger — Rolling Stones; the others are Beatles",
        options: ["John Lennon", "Mick Jagger", "Paul McCartney", "Ringo Starr"],
      },
    ],
  },
];
