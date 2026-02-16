/* Emotion keys map to emoji indices: 0=calm, 1=hopeful, 2=neutral, 3=uncertain, 4=discouraged, 5=overwhelmed, 6=frustrated */

const EMOTION_KEYS = ["calm", "hopeful", "neutral", "uncertain", "discouraged", "overwhelmed", "frustrated"] as const;

export type CategoryKey = "school" | "internships" | "career" | "life";
export type EmotionKey = (typeof EMOTION_KEYS)[number];

export function getEmotionKey(index: number): EmotionKey {
  const key = EMOTION_KEYS[Math.max(0, Math.min(index, 6))];
  return key || "neutral";
}

const SOMETHING_ELSE = "Something else…";

const reflectionOptions: Record<CategoryKey, Partial<Record<EmotionKey, string[]>>> = {
  school: {
    calm: ["I'm in a good place and want to build on it.", "I feel steady but unsure what to do next.", "I want to stay balanced as things get busier.", "I'm curious about what's possible.", SOMETHING_ELSE],
    hopeful: ["I see a path forward.", "I need help staying motivated.", "I'm excited but nervous.", "I want to make the most of this energy.", SOMETHING_ELSE],
    neutral: ["I'm not sure what I want yet.", "I need more clarity about my path.", "I'm stuck in the middle.", "I'm open but waiting for direction.", SOMETHING_ELSE],
    uncertain: ["I don't know which direction to take.", "I'm worried about making the wrong choice.", "I feel lost compared to others.", "I need reassurance.", SOMETHING_ELSE],
    discouraged: ["I feel behind.", "Nothing seems to be working.", "I'm losing motivation.", "I'm doubting myself.", SOMETHING_ELSE],
    overwhelmed: ["I have too much on my plate.", "I don't know where to start.", "I feel behind others.", "I'm burnt out.", SOMETHING_ELSE],
    frustrated: ["I feel stuck.", "Things aren't fair.", "I'm tired of the same patterns.", "I need to be heard.", SOMETHING_ELSE],
  },
  internships: {
    calm: ["I'm ready to explore but not rushing.", "I want to find a good fit.", "I feel steady in my search.", "I'm taking it one step at a time.", SOMETHING_ELSE],
    hopeful: ["I'm excited about possibilities.", "I want to make progress this week.", "I feel ready to put myself out there.", "I'm trusting the process.", SOMETHING_ELSE],
    neutral: ["I'm not sure what I'm looking for.", "I need to narrow down my options.", "I'm curious but unmotivated.", "I'm waiting for the right opportunity.", SOMETHING_ELSE],
    uncertain: ["I don't know where to start.", "I'm not sure I'm qualified.", "I feel lost in the process.", "I'm scared of rejection.", SOMETHING_ELSE],
    discouraged: ["I've been rejected too many times.", "I feel behind my peers.", "I'm doubting myself.", "I don't know what I'm doing wrong.", SOMETHING_ELSE],
    overwhelmed: ["I feel behind others.", "I don't know where to start.", "I'm doubting myself.", "There are too many moving parts.", SOMETHING_ELSE],
    frustrated: ["The process feels unfair.", "I'm tired of applying.", "I don't feel seen.", "I need a break.", SOMETHING_ELSE],
  },
  career: {
    calm: ["I'm in a good place and reflecting.", "I want to make intentional choices.", "I'm taking my time.", "I'm building toward something.", SOMETHING_ELSE],
    hopeful: ["I see new possibilities.", "I'm ready for a change.", "I feel aligned with my values.", "I want to take the next step.", SOMETHING_ELSE],
    neutral: ["I'm not sure what I want.", "I'm exploring options.", "I feel stuck in the middle.", "I need more information.", SOMETHING_ELSE],
    uncertain: ["I'm considering a pivot.", "I don't know if I'm on the right path.", "I'm afraid of making a mistake.", "I need clarity.", SOMETHING_ELSE],
    discouraged: ["I feel stuck.", "Nothing is working out.", "I'm losing hope.", "I'm comparing myself to others.", SOMETHING_ELSE],
    overwhelmed: ["I have too many options.", "I don't know where to start.", "I'm burnt out.", "Everything feels urgent.", SOMETHING_ELSE],
    frustrated: ["I feel undervalued.", "I'm tired of the same cycle.", "I need change.", "I don't feel in control.", SOMETHING_ELSE],
  },
  life: {
    calm: ["I'm in a good place.", "I want to maintain this balance.", "I'm reflecting on what matters.", "I'm taking things day by day.", SOMETHING_ELSE],
    hopeful: ["I'm excited about what's next.", "I want to grow.", "I feel ready for change.", "I'm building something new.", SOMETHING_ELSE],
    neutral: ["I'm in between.", "I need more direction.", "I'm not sure what I want.", "I'm waiting for clarity.", SOMETHING_ELSE],
    uncertain: ["I don't know what's next.", "I feel lost.", "I'm in transition.", "I need support.", SOMETHING_ELSE],
    discouraged: ["I feel stuck.", "Things aren't going well.", "I'm losing hope.", "I'm tired.", SOMETHING_ELSE],
    overwhelmed: ["I have too much going on.", "I don't know where to start.", "I need to slow down.", "I'm spread too thin.", SOMETHING_ELSE],
    frustrated: ["I feel out of control.", "Things aren't working.", "I'm tired of the same patterns.", "I need a change.", SOMETHING_ELSE],
  },
};

const FALLBACK_OPTIONS: string[] = [
  "I'm not sure how to put it into words.",
  "I need some space to figure this out.",
  "I'm feeling stuck.",
  "I want to see things differently.",
  SOMETHING_ELSE,
];

export function getReflectionOptions(category: string, emotionIndex: number): string[] {
  const cat = (["school", "internships", "career", "life"].includes(category)
    ? category
    : "life") as CategoryKey;
  const emotionKey = getEmotionKey(emotionIndex);
  const opts = reflectionOptions[cat]?.[emotionKey];
  return opts && opts.length > 0 ? [...opts] : FALLBACK_OPTIONS;
}

export const SOMETHING_ELSE_VALUE = SOMETHING_ELSE;
