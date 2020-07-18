import words from "../assets/wordlist.json";
import * as EnglishVerbs from "english-verbs-helper";
import Irregular from "english-verbs-irregular";
import Gerunds from "english-verbs-gerunds";

const VerbsData = EnglishVerbs.mergeVerbsData(Irregular, Gerunds);

const conjugate = (w) =>
  EnglishVerbs.getConjugation(VerbsData, w, "PROGRESSIVE_PRESENT", "S").replace(
    /.*\s/,
    ""
  );

export const randomWordOfType = (type) => {
  if (!(type in words)) return null;

  const idx = Math.floor(Math.random() * words[type].length);
  const word = words[type][idx];
  if (word.includes(" ")) return randomWordOfType(type);
  if (type === "verb") {
    return conjugate(word);
  }
  return word;
};

const types = ["adjective", "noun", "adverb", "verb"];

export const randomWordPrompts = () => {
  const includeAdjective = Math.random() > 0.5;
  // const includeAdverb = Math.random() > 0.5;

  const typesToFetch = types.filter(
    (t) => includeAdjective || t !== "adjective"
  );

  return typesToFetch.reduce(
    (agg, type) => ({
      ...agg,
      [type]: randomWordOfType(type),
    }),
    {}
  );
};
