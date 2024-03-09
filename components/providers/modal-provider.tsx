"use client";

import { useState, useEffect } from "react";
import SettingsModal from "@/components/modals/settings-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SettingsModal />
    </>
  );
};

export default ModalProvider;
