"use client";

import { useRef, useCallback, useEffect } from "react";

type CallbackProps = {
  _id: string;
  title?: string | undefined;
  content?: string | undefined;
  coverImage?: string | undefined;
  icon?: string | undefined;
  isPublished?: boolean | undefined;
};

export default function useThrottle(
  callback: (value: CallbackProps) => void,
  delay = 1000
) {
  const shouldWaitRef = useRef(false);
  const waitingArgsRef = useRef<CallbackProps | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | number>();

  const timeoutFunc = useCallback(() => {
    if (waitingArgsRef.current === null) {
      shouldWaitRef.current = false;
    } else {
      callback(waitingArgsRef.current);
      waitingArgsRef.current = null;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current as number);
      }
      timeoutRef.current = setTimeout(timeoutFunc, delay);
    }
  }, [callback, delay]);

  const throttledCallback = useCallback(
    (args: CallbackProps) => {
      if (shouldWaitRef.current) {
        waitingArgsRef.current = args;
      } else {
        callback(args);
        shouldWaitRef.current = true;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current as number);
        }

        timeoutRef.current = setTimeout(timeoutFunc, delay);
      }
    },
    [callback, delay, timeoutFunc]
  );

  useEffect(() => {
    return () => {
      // Cleanup function to clear the timeout on component unmount
      clearTimeout(timeoutRef.current as number);
    };
  }, []);

  return throttledCallback;
}
