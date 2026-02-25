import type { BgMode } from "../types/design";

// Type definitions for all slide types
export type SlideType = "title" | "section" | "statement" | "question" | "answers" | "content" | "closing";

export interface BaseSlide {
  id: number;
  type: SlideType;
  bgMode: BgMode;
  pill?: string;
}

export interface TitleSlide extends BaseSlide {
  type: "title";
  heading: string;
  subheading: string;
  subtitle: string;
  footer: string;
}

export interface SectionSlide extends BaseSlide {
  type: "section";
  number: string;
  heading: string;
  body: string;
}

export interface StatementSlide extends BaseSlide {
  type: "statement";
  heading: string;
  note?: string;
}

export interface QuestionSlide extends BaseSlide {
  type: "question";
  question: string;
  notes?: string;
  theme?: "identity" | "reality" | "meaning";
  followup?: string;
  isInteractive?: boolean;
}

export interface AnswersSlide extends BaseSlide {
  type: "answers";
  questionNumber: 1 | 2 | 3;
  theme: "identity" | "reality" | "meaning";
}

export interface Card {
  title?: string;
  content: string;
  accent?: boolean;
}

export interface ContentSlide extends BaseSlide {
  type: "content";
  heading?: string;
  heading1?: string;
  heading2?: string;
  subheading?: string;
  body?: string;
  bodyItems?: string[];
  cards?: Card[];
  columns?: {
    title: string;
    items: string[];
    note?: string;
  }[];
  note?: string;
  twoColumn?: {
    left: {
      title: string;
      items: string[];
      note?: string;
    };
    right: {
      title: string;
      items: string[];
      note?: string;
    };
  };
  quoteCards?: string[];
  topics?: {
    title: string;
    description: string;
  }[];
}

export interface ClosingSlide extends BaseSlide {
  type: "closing";
  heading: string;
  subtitle: string;
  body: string;
  footer: string;
}

export type Slide = TitleSlide | SectionSlide | StatementSlide | QuestionSlide | AnswersSlide | ContentSlide | ClosingSlide;

// Question mapping for easy reference
export const QUESTIONS = {
  q1: "If you had to explain your job to a child, what would you say you do?",
  q2: "What do you actually spend most of your time doing in a normal week?",
  q3: "At the end of a really good week, what makes you feel 'that was good work'?",
  q4: "Think about a recent project. What was one moment where something didn't make sense, but you didn't push on it?",
} as const;

// All slides in order (41 total)
export const SLIDES: Slide[] = [
  // Slide 0 (Index 0) - Slide 1 in presentation
  {
    id: 0,
    type: "title",
    bgMode: "dark",
    pill: "Techativity",
    heading: "The Why\nBehind\nthe Work.",
    subheading: "The Why\nBehind\nthe Work.",
    subtitle: "A session about meaning, not machines.",
    footer: "Feels Like Studio — 2026",
  } as TitleSlide,

  // Slide 1 (Index 1) - Slide 2 in presentation
  {
    id: 1,
    type: "content",
    bgMode: "dark",
    pill: "Before we start",
    heading: "This is not an\nAI presentation.",
    body: "This is about how we work, how we think,\nand how we lost clarity between\ntasks and purpose.",
    note: "AI is just a mirror.",
  } as ContentSlide,

  // Slide 2 (Index 2) - SECTION 1 "The Experiment"
  {
    id: 3,
    type: "section",
    bgMode: "dark",
    number: "01",
    heading: "The\nExperiment",
    body: "No theory. No AI. No philosophy.\nJust three questions and your honest answers.",
  } as SectionSlide,

  // Slide 4 (Index 4) - Slide 5 in presentation
  {
    id: 4,
    type: "content",
    bgMode: "cream",
    pill: "Live exercise",
    heading: "Let's start with you.",
    body: "I'm going to ask you three simple questions.\nTake a moment with each one. Write your answer down.\nDon't overthink it — there are no wrong answers.",
    note: "The goal: surface the gap between identity, daily tasks, and meaning.",
  } as ContentSlide,

  // Slide 5 (Index 5) - Slide 6 in presentation - QUESTION 1
  {
    id: 5,
    type: "question",
    bgMode: "cream",
    question: QUESTIONS.q1,
    notes: "Forces plain language · Reveals perceived role identity · Almost always collapses into tasks",
    theme: "identity",
    isInteractive: true,
  } as QuestionSlide,

  // Slide 6 (Index 6) - NEW SLIDE - Q1 Answers visualization
  {
    id: 6,
    type: "answers",
    bgMode: "cream",
    questionNumber: 1,
    theme: "identity",
  } as AnswersSlide,

  // Slide 7 (Index 7) - Slide 7 in presentation - QUESTION 2
  {
    id: 7,
    type: "question",
    bgMode: "cream",
    question: QUESTIONS.q2,
    notes: "Exposes operational gravity · Makes automation visible · Highlights task overload",
    theme: "reality",
    isInteractive: true,
  } as QuestionSlide,

  // Slide 8 (Index 8) - NEW SLIDE - Q2 Answers visualization
  {
    id: 8,
    type: "answers",
    bgMode: "cream",
    questionNumber: 2,
    theme: "reality",
  } as AnswersSlide,

  // Slide 9 (Index 9) - Slide 8 in presentation - QUESTION 3
  {
    id: 9,
    type: "question",
    bgMode: "cream",
    question: QUESTIONS.q3,
    notes: "Shifts from tasks to emotion · Reveals what people truly value · Rarely overlaps with Q2",
    theme: "meaning",
    isInteractive: true,
  } as QuestionSlide,

  // Slide 10 (Index 10) - NEW SLIDE - Q3 Answers visualization
  {
    id: 10,
    type: "answers",
    bgMode: "cream",
    questionNumber: 3,
    theme: "meaning",
  } as AnswersSlide,

  // Slide 10 (Index 10) - "AI helps us see clearly" (moved from before Section 1)
  {
    id: 2,
    type: "content",
    bgMode: "cream",
    pill: "The mirror",
    heading: "AI helps us see clearly.",
    cards: [
      {
        title: "Expose",
        content: "What is operational vs what is essential",
      },
      {
        title: "Reveal",
        content: "Where meaning actually lives",
      },
      {
        title: "Force",
        content: "Better questions, not faster answers",
      },
    ],
  } as ContentSlide,

  // Slide 11 (Index 11) - "Notice the gap"
  {
    id: 11,
    type: "content",
    bgMode: "cream",
    pill: "Reflection",
    heading: "Notice the gap.",
    columns: [
      {
        title: "What you say you do",
        items: ["Identity. The story we tell about our role."],
      },
      {
        title: "What fills your time",
        items: ["Operations. The tasks that define the week."],
      },
      {
        title: "What feels meaningful",
        items: ["Purpose. The moments that matter."],
      },
    ],
  } as ContentSlide,

  // Slide 12 (Index 12) - Slide 10 in presentation
  {
    id: 12,
    type: "content",
    bgMode: "dark",
    heading: "Tasks dominate time.\nMeaning lives elsewhere.",
    body: "And that gap?\nThat's the space AI is about to walk into.",
  } as ContentSlide,

  // Slide 13 (Index 13) - Slide 11 in presentation - SECTION 2
  {
    id: 13,
    type: "section",
    bgMode: "dark",
    number: "02",
    heading: "The\nMirror",
    body: "Where AI enters — and what it actually reveals.",
  } as SectionSlide,

  // Slide 14 (Index 14) - Slide 12 in presentation
  {
    id: 14,
    type: "content",
    bgMode: "cream",
    pill: "The hypothesis",
    heading: "Over time, we confuse what we do every day with who we are.",
    cards: [
      {
        title: "01",
        content: "Operational tasks start to define identity",
      },
      {
        title: "02",
        content: "Roles become narrower, defensive, execution-driven",
      },
      {
        title: "03",
        content: "We stop asking why and just keep doing",
      },
    ],
  } as ContentSlide,

  // Slide 15 (Index 15) - Slide 13 in presentation
  {
    id: 15,
    type: "content",
    bgMode: "dark",
    heading: "AI does not\nthreaten creativity.",
    body: "AI threatens\nunquestioned execution.",
    note: "If a task can be automated, it was probably never the core of your role.",
  } as ContentSlide,

  // Slide 16 (Index 16) - Slide 14 in presentation
  {
    id: 16,
    type: "content",
    bgMode: "cream",
    pill: "Reframe",
    heading: "AI doesn't remove value.\nIt removes noise.",
    cards: [
      {
        title: "A pressure test",
        content: "For the strength of your thinking",
      },
      {
        title: "A filter",
        content: "For what is essential vs habitual",
      },
      {
        title: "A space-creator",
        content: "For the work that actually matters",
      },
    ],
  } as ContentSlide,

  // Slide 17 (Index 17) - Slide 15 in presentation
  {
    id: 17,
    type: "content",
    bgMode: "cream",
    twoColumn: {
      left: {
        title: "What fills your time",
        items: [
          "Status updates & reports",
          "Asset resizing & exports",
          "Ticket management",
          "Formatting & cleanup",
          "Email chains",
          "Documentation",
        ],
        note: "Most of this can be assisted or automated.",
      },
      right: {
        title: "What feels meaningful",
        items: [
          "Solving a real problem",
          "Making someone understand",
          "A moment of clarity",
          "Craft that you're proud of",
          "Pushing an idea forward",
          "Genuine collaboration",
        ],
        note: "Almost none of this can.",
      },
    },
  } as ContentSlide,

  // Slide 18 (Index 18) - Slide 16 in presentation
  {
    id: 18,
    type: "content",
    bgMode: "dark",
    pill: "The deeper layer",
    heading: "People don't work badly because they're lazy.",
    body: "They work badly because they confuse tasks with purpose.",
    note: "Systems slowly redefine identity through repetition. AI accelerates this moment of truth.",
  } as ContentSlide,

  // Slide 19 (Index 19) - Slide 17 in presentation
  {
    id: 19,
    type: "content",
    bgMode: "cream",
    pill: "Across roles",
    heading: "Designers, producers, developers, creatives, managers:",
    body: "Are not chasing different things.",
    note: "Everyone is chasing the same outcome: To make something that people actually like, understand, and care about.",
  } as ContentSlide,

  // Slide 20 (Index 20) - Slide 18 in presentation
  {
    id: 20,
    type: "content",
    bgMode: "cream",
    heading: "Good work is the sum of all roles questioning together.",
    body: "When it feels like 'design decisions win', it's often because we mistake visible output for collective decision-making.",
    note: "Creativity is shared responsibility, not role hierarchy.",
  } as ContentSlide,

  // Slide 21 (Index 21) - Slide 19 in presentation - SECTION 3
  {
    id: 21,
    type: "section",
    bgMode: "dark",
    number: "03",
    heading: "The\nCulture\nProblem",
    body: "Why questioning feels personal, and why that's dangerous with AI.",
  } as SectionSlide,

  // Slide 22 (Index 22) - Slide 20 in presentation
  {
    id: 22,
    type: "content",
    bgMode: "cream",
    pill: "The modern problem",
    heading: "We live in a culture of support, safety, and positive reinforcement.",
    body: "These are good things. But they created a side effect.",
    cards: [
      {
        title: "≈",
        content: "Agreement gets confused with care",
      },
      {
        title: "↯",
        content: "Critique feels personal",
      },
      {
        title: "?",
        content: "Questioning feels negative",
      },
    ],
  } as ContentSlide,

  // Slide 23 (Index 23) - Slide 21 in presentation - STATEMENT
  {
    id: 23,
    type: "statement",
    bgMode: "sage",
    heading: "Harmony\nreplaces\nthinking.",
    note: "And nobody notices, because it feels so polite.",
  } as StatementSlide,

  // Slide 24 (Index 24) - Slide 22 in presentation
  {
    id: 24,
    type: "content",
    bgMode: "cream",
    pill: "Psychology",
    heading: "Why critique feels personal.",
    cards: [
      {
        title: "01",
        content: "Creative work is identity-adjacent: Ideas come from judgment and taste, not facts. Questioning the work feels like questioning the person.",
      },
      {
        title: "02",
        content: "Creative work is future-oriented: No objective truth yet. Higher ego sensitivity. Everything feels like opinion.",
      },
      {
        title: "03",
        content: "Culture rewards affirmation: Disagreement feels unsafe even when it's necessary. We're trained to agree.",
      },
    ],
    note: "This is not weakness. It's human psychology.",
  } as ContentSlide,

  // Slide 25 (Index 25) - Slide 23 in presentation
  {
    id: 25,
    type: "content",
    bgMode: "dark",
    pill: "The danger",
    heading: "AI is optimized for yes.",
    cards: [
      {
        content: "Execute bad questions perfectly",
      },
      {
        content: "Polish weak ideas beautifully",
      },
      {
        content: "Scale wrong assumptions faster than humans ever could",
      },
      {
        content: "If AI is good at saying yes, humans must be good at asking why.",
        accent: true,
      },
    ],
  } as ContentSlide,

  // Slide 26 (Index 26) - Slide 24 in presentation - SECTION 4
  {
    id: 26,
    type: "section",
    bgMode: "dark",
    number: "04",
    heading: "The\nReframe",
    body: "Turning critique into a cultural strength.",
  } as SectionSlide,

  // Slide 27 (Index 27) - Slide 25 in presentation
  {
    id: 27,
    type: "content",
    bgMode: "cream",
    pill: "Key shift",
    heading: "Critique is not about judging people.",
    body: "Critique is about protecting the project.",
    note: "When we don't question early, the project pays later.",
  } as ContentSlide,

  // Slide 28 (Index 28) - Slide 26 in presentation
  {
    id: 28,
    type: "content",
    bgMode: "cream",
    pill: "Behavior shift",
    heading: "Replace opinions with questions.",
    twoColumn: {
      left: {
        title: "Instead of:",
        items: ["'I don't like this.' Feels personal. Shuts conversation down."],
      },
      right: {
        title: "Try:",
        items: [
          "'What problem is this solving?'",
          "'What assumption are we making?'",
          "'What would break if this was wrong?'",
          "Questions feel collaborative, not personal.",
        ],
      },
    },
  } as ContentSlide,

  // Slide 29 (Index 29) - Slide 27 in presentation
  {
    id: 29,
    type: "content",
    bgMode: "cream",
    pill: "Permission",
    heading: "Normalize unfinished thinking.",
    body: "Perfectionism is often self-defense. When something feels too finished, it's harder to help.",
    note: "Anchor critique to alignment, not taste. Shift from 'Is this good or bad?' to 'Is this aligned with what we're trying to achieve?'",
  } as ContentSlide,

  // Slide 30 (Index 30) - Slide 28 in presentation - QUESTION 4
  {
    id: 30,
    type: "question",
    bgMode: "cream",
    question: QUESTIONS.q4,
    followup: "What stopped you from asking why?",
    notes: "Fear of friction · Time pressure · Desire to be helpful · Avoidance of conflict",
    isInteractive: false,
  } as QuestionSlide,

  // Slide 31 (Index 31) - Slide 29 in presentation - SECTION 5
  {
    id: 31,
    type: "section",
    bgMode: "dark",
    number: "05",
    heading: "The\nUpgrade",
    body: "What roles look like when we stop executing and start questioning.",
  } as SectionSlide,

  // Slide 32 (Index 32) - Slide 30 in presentation
  {
    id: 32,
    type: "content",
    bgMode: "cream",
    pill: "Roles evolve",
    heading: "Roles are moving upstream.",
    cards: [
      {
        content: "Executing briefs → Shaping questions",
      },
      {
        content: "Being helpful → Being responsible",
      },
      {
        content: "Agreement → Thoughtful disagreement",
      },
    ],
    note: "We are not execution machines. We are stewards of clarity.",
  } as ContentSlide,

  // Slide 33 (Index 33) - Slide 31 in presentation - STATEMENT
  {
    id: 33,
    type: "statement",
    bgMode: "sage",
    heading: "Stewards\nof clarity.",
    note: "That's the real job description. For all of us.",
  } as StatementSlide,

  // Slide 34 (Index 34) - Slide 32 in presentation - SECTION 6
  {
    id: 34,
    type: "section",
    bgMode: "dark",
    number: "06",
    heading: "A Thinking\nPartner",
    body: "How Claude fits — after all of this.",
  } as SectionSlide,

  // Slide 35 (Index 35) - Slide 33 in presentation
  {
    id: 35,
    type: "content",
    bgMode: "cream",
    pill: "Claude",
    heading1: "Not introduced as a tool. Not a productivity hack.",
    heading2: "But as a thinking partner.",
    cards: [
      {
        title: "Time for thinking",
        content: "By handling the operational drag",
      },
      {
        title: "Space for questioning",
        content: "By challenging your assumptions",
      },
      {
        title: "Energy for meaning",
        content: "By freeing you for real work",
      },
    ],
  } as ContentSlide,

  // Slide 36 (Index 36) - Slide 34 in presentation
  {
    id: 36,
    type: "content",
    bgMode: "dark",
    heading: "If AI is optimized for yes, then our human responsibility is why.",
    body: "And if we confuse kindness with agreement, we lose the tension that makes ideas strong.",
  } as ContentSlide,

  // Slide 37 (Index 37) - Slide 35 in presentation
  {
    id: 37,
    type: "content",
    bgMode: "cream",
    pill: "Leave thinking",
    heading: "What we hope you take with you.",
    quoteCards: [
      "I'm more than my task list.",
      "My value lives in judgment and care.",
      "Questioning is not conflict — it's contribution.",
      "AI might help me do my real job better.",
    ],
  } as ContentSlide,

  // Slide 38 (Index 38) - Slide 36 in presentation - STATEMENT
  {
    id: 38,
    type: "statement",
    bgMode: "sage",
    heading: "No fear.\nNo hype.",
    note: "Clarity\nand permission.",
  } as StatementSlide,

  // Slide 39 (Index 39) - Slide 37 in presentation
  {
    id: 39,
    type: "content",
    bgMode: "cream",
    pill: "Research",
    heading: "Ideas worth exploring further.",
    topics: [
      {
        title: "Creativity",
        description: "Novel + useful ideas. Includes problem finding and question framing.",
      },
      {
        title: "Question-asking",
        description: "Deeper questions correlate with higher creative thinking.",
      },
      {
        title: "Critical thinking",
        description: "Constructive critique improves creative outcomes.",
      },
      {
        title: "Feedback psychology",
        description: "Creative work as identity extension. Why critique feels personal.",
      },
      {
        title: "AI agreement bias",
        description: "Why AI reinforces rather than challenges by default.",
      },
    ],
  } as ContentSlide,

  // Slide 40 (Index 40) - Slide 38 in presentation - CLOSING
  {
    id: 40,
    type: "closing",
    bgMode: "dark",
    heading: "Thank you.",
    subtitle: "The why behind the work.",
    body: "Now let's talk.",
    footer: "Feels Like Studio — Techativity — 2026",
  } as ClosingSlide,
];

// Utility function to get slide by ID
export function getSlideById(id: number): Slide | undefined {
  return SLIDES.find((slide) => slide.id === id);
}

// Utility function to get all slides of a specific type
export function getSlidesByType(type: SlideType): Slide[] {
  return SLIDES.filter((slide) => slide.type === type);
}

// Utility function to get question slides
export function getQuestionSlides(): QuestionSlide[] {
  return SLIDES.filter((slide) => slide.type === "question") as QuestionSlide[];
}

// Utility function to get answer slides
export function getAnswerSlides(): AnswersSlide[] {
  return SLIDES.filter((slide) => slide.type === "answers") as AnswersSlide[];
}
