"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getUserName } from "@/utils/getUserInfo";

const ChatBot = () => {
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

  const chatBotDialogSection = useRef<HTMLDivElement>(null);
  const chatBotDialogPickerSection = useRef<HTMLDivElement>(null);
  const chatBotRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isShowChatBotDialog, setIsShowChatBotDialog] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatBotRef.current &&
        !chatBotRef.current.contains(event.target as Node) &&
        chatBotDialogSection.current &&
        !chatBotDialogSection.current.contains(event.target as Node) &&
        chatBotDialogPickerSection.current &&
        !chatBotDialogPickerSection.current.contains(event.target as Node)
      ) {
        setIsShowChatBotDialog(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chatBotRef, chatBotDialogSection, chatBotDialogPickerSection]);

  useEffect(() => {
    if (isShowChatBotDialog && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isShowChatBotDialog]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.cronbot.ai/v1/widgets/app/app_3j75a26mhg7x";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (typeof (window as any)?.cronbot !== undefined && loggedUser) {
      const cronbot = (window as any)?.cronbot;
      cronbot?.user.setUser({
        name: getUserName(loggedUser),
        email: loggedUser?.email,
      });
    }
  }, [loggedUser]);

  return (
    <script
      async
      src="https://api.cronbot.ai/v1/widgets/app/app_3j75a26mhg7x"
    ></script>
  );
};

export default ChatBot;
