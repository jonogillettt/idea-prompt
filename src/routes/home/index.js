import { h } from "preact";
import { useState, useCallback } from "preact/hooks";

import style from "./style";
import {
  randomWordPrompts,
  randomWordOfType,
} from "../../services/wordFetcher";
import { startWord, asSentence } from "../../services/wordHelpers";
import { useLocalHistory } from "../../hooks/localHistory";
import { useWordDefinition } from "../../hooks/wordDefinition";
import WordButton from "../../components/WordButton";

const Home = () => {
  const [parts, setParts] = useState({
    adjective: null,
    noun: null,
    verb: null,
    adverb: null,
  });
  const hasSentence = Object.values(parts).some(Boolean);

  const generate = useCallback(() => setParts(randomWordPrompts()), [setParts]);
  const regenerate = useCallback(
    (type) =>
      setParts({
        ...parts,
        [type]: randomWordOfType(type),
      }),
    [parts, setParts]
  );

  const [sentences, saveSentence, clearHistory] = useLocalHistory(parts);
  const [
    show,
    definition,
    showDefinition,
    hideDefinition,
  ] = useWordDefinition();

  const wordButtonProps = {
    parts,
    showDefinition,
    onClick: regenerate,
    showing: show,
  };

  return (
    <div class={style.home}>
      {hasSentence && (
        <div class={style.generated}>
          {startWord(parts)}{" "}
          <WordButton {...wordButtonProps} type="adjective" />
          <WordButton {...wordButtonProps} type="noun" />
          that's <WordButton {...wordButtonProps} type="verb" />
          <WordButton {...wordButtonProps} type="adverb" />
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
      <div class={style.actions}>
        {hasSentence && (
          <button class={style.linkButton} onClick={saveSentence}>
            That's a keeper
          </button>
        )}
        <button class={style.generateButton} onClick={generate}>
          Prompt me
        </button>
      </div>

      <div class={style.extraInfo}>
        <ul class={style.instructions}>
          <li>Tap 'Prompt me' to get a new random sentence</li>
          <li>Tap a word to replace it but keep the rest of the sentence</li>
          <li>Long press a word to read its definition</li>
        </ul>

        {Boolean(sentences.length) && (
          <div class={style.history}>
            <strong>Saved sentences</strong>
            <ul class={style.instructions}>
              {sentences.map((s) => {
                const str = asSentence(s);
                return <li key={str}>{str}</li>;
              })}
            </ul>
            <button
              class={`${style.linkButton} ${style.right}`}
              onClick={clearHistory}
            >
              Clear history
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
