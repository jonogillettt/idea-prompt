export const vowels = ["a", "e", "i", "o", "u"];

export const firstCharacter = ({ adjective, noun }) =>
  [adjective, noun].filter(Boolean).join("").charAt(0);

export const startWord = (parts) =>
  vowels.includes(firstCharacter(parts)) ? "an" : "a";

export const asSentence = (parts) =>
  [
    startWord(parts),
    parts.adjective,
    parts.noun,
    "that's",
    parts.verb,
    parts.adverb,
  ]
    .filter(Boolean)
    .join(" ");
