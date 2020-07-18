import { h } from "preact";
import { useState, useCallback, useRef } from "preact/hooks";

import style from "./style";
import {
  randomWordPrompts,
  randomWordOfType,
} from "../../services/wordFetcher";
import { defineWord } from "../../services/definitionFetcher";

const vowels = ["a", "e", "i", "o", "u"];

const useLongPress = (replace, handleShowDefinition, label = "press") => {
  const [timer, setTimer] = useState(null);
  const startPress = useCallback(
    (e) => {
      console.log(label, "start");
      e.preventDefault();

      clearTimeout(timer);
      setTimer(
        setTimeout(() => {
          console.log(label, "trigger long press");
          handleShowDefinition();
          setTimer(null);
        }, 600)
      );
    },
    [timer, handleShowDefinition]
  );
  const finishPress = useCallback(
    (e) => {
      e.preventDefault();

      if (timer) {
        console.log(label, "trigger short press");
        clearTimeout(timer);
        setTimer(null);
        replace();
      } else {
        console.log(label, "ignore finish press");
      }
    },
    [timer, replace]
  );

  return [startPress, finishPress];
};

const FilledBlock = ({ parts, type, onClick, showing, showDefinition }) => {
  const replace = useCallback(() => onClick(type), [onClick, type]);
  const handleShowDefinition = useCallback(() => {
    showDefinition(showing === parts[type] ? null : parts[type]);
  }, [showDefinition, showing, parts, type]);
  const [mouseDown, mouseUp] = useLongPress(
    replace,
    handleShowDefinition,
    "mouse"
  );
  const [touchStart, touchEnd] = useLongPress(
    replace,
    handleShowDefinition,
    "touch"
  );

  if (!parts[type]) return null;
  return (
    <>
      <button
        class={style.filled}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
      >
        {parts[type]}
      </button>{" "}
    </>
  );
};
const firstCharacter = ({ adjective, noun }) =>
  [adjective, noun].filter(Boolean).join("").charAt(0);
const startWord = (parts) =>
  vowels.includes(firstCharacter(parts)) ? "an" : "a";

const asSentence = (parts) =>
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

const Home = () => {
  const [sentences, setSentences] = useState(
    JSON.parse(localStorage.getItem("idea-prompt-sentences") || "[]")
  );

  const [parts, setParts] = useState({
    adjective: null,
    noun: null,
    verb: null,
    adverb: null,
  });
  const hasParts = Object.values(parts).some(Boolean);
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
  const generate = useCallback(() => setParts(randomWordPrompts()), [setParts]);
  const regenerate = useCallback(
    (type) =>
      setParts({
        ...parts,
        [type]: randomWordOfType(type),
      }),
    [parts, setParts]
  );
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

  const sharedProps = {
    parts,
    showDefinition,
    onClick: regenerate,
    showing: show,
  };

  return (
    <div class={style.home}>
      {hasParts && (
        <div class={style.generated}>
          {startWord(parts)} <FilledBlock {...sharedProps} type="adjective" />
          <FilledBlock {...sharedProps} type="noun" /> that's{" "}
          <FilledBlock {...sharedProps} type="verb" />
          <FilledBlock {...sharedProps} type="adverb" />
          {show && (
            <div class={style.definitionWrapper}>
              <div
                class={style.definition}
                dangerouslySetInnerHTML={{ __html: definition }}
              ></div>
              <button
                class={`${style.linkButton} ${style.closeButton}`}
                onClick={hideDefinition}
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}
      <div class={style.generator}>
        {hasParts && (
          <button class={style.linkButton} onClick={saveSentence}>
            That's a keeper
          </button>
        )}
        <button class={style.generateButton} onClick={generate}>
          Prompt me
        </button>
      </div>
      <ul class={style.instructions}>
        <li>Tap 'Prompt me' to get a new random sentence</li>
        <li>Tap a word to replace it but keep the rest of the sentence</li>
        <li>Long press a word to read its definition</li>
      </ul>

      <ul class={style.instructions}>
        {sentences.map((s) => {
          const str = asSentence(s);
          return <li key={str}>{str}</li>;
        })}
      </ul>
      {Boolean(sentences.length) && (
        <button class={style.linkButton} onClick={clearHistory}>
          Clear history
        </button>
      )}
    </div>
  );
};

export default Home;
