"use client";

import { useEffect, useState } from "react";

const useOrigin = () => {
  const [mounted, setMounted] = useState(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  console.log(origin);
  if (!mounted) return <></>;

  return origin;
};

export default useOrigin;
