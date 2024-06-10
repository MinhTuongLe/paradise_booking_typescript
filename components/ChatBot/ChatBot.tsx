"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { chatBotAvatar, emptyAvatar } from "@/const";
import ChatBotDialog from "./ChatBotDialog";
import { MdCancel } from "react-icons/md";

const ChatBot = () => {
  const chatBotDialogSection = useRef<HTMLDivElement>(null);
  const chatBotDialogPickerSection = useRef<HTMLDivElement>(null);
  const chatBotRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isShowChatBotDialog, setIsShowChatBotDialog] = useState(false);

  const scrollToChatBotDialogSection = () => {
    if (chatBotDialogSection.current) {
      const windowHeight = window.innerHeight;
      const offset = 0.1 * windowHeight; // 10vh
      const topPosition =
        chatBotDialogSection.current.getBoundingClientRect().top - offset;
      window.scrollTo({
        top: topPosition,
        behavior: "smooth",
      });
      setIsShowChatBotDialog((prev) => !prev);
    }
  };

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

  return (
    <div className="absolute bottom-14 right-10" ref={chatBotRef}>
      <div
        className="flex items-center justify-between cursor-pointer relative"
        onClick={scrollToChatBotDialogSection}
        ref={chatBotDialogSection}
      >
        <div className="p-1 rounded-full bg-rose-500 flex justify-center items-center cursor-pointer relative">
          {isShowChatBotDialog ? (
            <MdCancel size={48} color="white" />
          ) : (
            <Image
              width={48}
              height={48}
              src={chatBotAvatar || emptyAvatar}
              alt="Avatar"
              className="rounded-full h-[48px] w-[48px] aspect-square"
              priority
            />
          )}
        </div>
        <AnimatePresence>
          {isShowChatBotDialog && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                transformOrigin: "bottom right",
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              onClick={(e) => e.stopPropagation()}
              ref={chatBotDialogPickerSection}
              className="absolute bottom-[120%] right-0 z-10 bg-white shadow-xl rounded-xl max-w-[500px] h-[50vh] w-[35vw]"
            >
              <ChatBotDialog textareaRef={textareaRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatBot;
