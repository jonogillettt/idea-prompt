import { useState, useCallback } from "preact/hooks";
import { defineWord } from "../services/definitionFetcher";

export const useWordDefinition = () => {
  const [definition, setDefinition] = useState(null);
  const [show, setShow] = useState(null);
  const showDefinition = useCallback(
    async (word) => {
      if (word) {
        const text = await defineWord(word);
        setDefinition(text);
      }
      setShow(word);
    },
    [setShow, setDefinition]
  );
  const hideDefinition = useCallback(() => setShow(null), [setShow]);

  return [show, definition, showDefinition, hideDefinition];
};
