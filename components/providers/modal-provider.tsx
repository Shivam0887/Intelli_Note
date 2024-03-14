"use client";

import { useState, useEffect } from "react";
import SettingsModal from "@/components/modals/settings-modal";
import ChatModal from "@/components/modals/chat-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <SettingsModal />
      <ChatModal />
    </>
  );
};

export default ModalProvider;
