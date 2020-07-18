import { useState, useCallback } from "preact/hooks";

export const useLocalHistory = (parts) => {
  const [sentences, setSentences] = useState(
    JSON.parse(localStorage.getItem("idea-prompt-sentences") || "[]")
  );
  const saveSentence = useCallback(() => {
    localStorage.setItem(
      "idea-prompt-sentences",
      JSON.stringify([...sentences, parts])
    );
    setSentences([...sentences, parts]);
  }, [sentences, parts]);
  const clearHistory = useCallback(() => {
    localStorage.removeItem("idea-prompt-sentences");
    setSentences([]);
  }, [setSentences]);

  return [sentences, saveSentence, clearHistory];
};
