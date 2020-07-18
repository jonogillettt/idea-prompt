import { useState, useCallback } from "preact/hooks";

export const useLongPress = (
  replace,
  handleShowDefinition,
  label = "press"
) => {
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
