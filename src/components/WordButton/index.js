import { h } from "preact";
import { useCallback } from "preact/hooks";

import { useLongPress } from "../../hooks/longPress";
import style from "./style";

function WordButton({ parts, type, onClick, showing, showDefinition }) {
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
}

export default WordButton;
