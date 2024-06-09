/* eslint-disable react/no-children-prop */
"use client";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoMdSend } from "react-icons/io";

import i18n from "@/i18n/i18n";
import EmptyState from "@/components/EmptyState";
import { RootState } from "@/store/store";
import TypingAnimation from "@/components/TypingAnimation";
import { RequestStatus, ViolentCode } from "@/enum";
import {
  authentication,
  chatBotAvatar,
  client,
  deploymentName,
  emptyAvatar,
  searchEndpoint,
  searchIndexName,
} from "@/const";
import { filterReferenceFromResponse } from "@/utils/aiResponse";

function ChatBotDialog() {
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const { t } = useTranslation("translation", { i18n });

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setChatLog((prevChatLog) => [
      ...prevChatLog,
      { role: "user", content: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    client
      .getChatCompletions(
        deploymentName,
        [...chatLog, { role: "user", content: message }],
        {
          azureExtensionOptions: {
            extensions: [
              {
                type: "azure_search",
                indexName: searchIndexName,
                endpoint: searchEndpoint,
                authentication: {
                  type: "api_key",
                  key: authentication,
                },
                // topNDocuments: 5,
                // inScope: true,
                // strictness: 3,
                // roleInformation:
                //   "You are an AI assistant that helps people find information.",
                // fieldsMapping: {},
                // queryType: "simple",
                // semanticConfiguration: "default",
              },
            ],
          },
        }
      )
      .then((res) => {
        if (res.choices[0]) {
          setChatLog((prevChatLog) => [
            ...prevChatLog,
            { role: "system", content: res.choices[0]?.message?.content || "" },
          ]);
        }
      })
      .catch((err) => {
        let messageCode = "";
        if (err?.code === RequestStatus.Exceeded)
          messageCode = t("toast.rate-limit-exceeded");
        else {
          if (
            err?.status === RequestStatus.BadRequest &&
            err?.code === ViolentCode.ContentFilter
          ) {
            messageCode = t("toast.standards-violation");
          } else messageCode = t("toast.generation-error");
        }
        toast.error(messageCode);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight + 500;
    }
  }, [chatLog]);

  if (!authState) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
      <div className="bg-gray-900 text-white text-center py-3 font-extrabold text-2xl space-x-1">
        <span className="text-transparent bg-gradient-to-r from-rose-500 to-rose-400 bg-clip-text">
          Paradise
        </span>
        <span className="text-transparent bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text">
          Assistant
        </span>
      </div>
      <div
        ref={chatContainerRef}
        className="flex-grow p-6 pt-4 pb-[120px] overflow-auto review-horizontal"
      >
        <div className="flex flex-col space-y-4">
          {chatLog.map((message, index: number) => (
            <div
              key={index}
              className={`flex items-start space-x-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role !== "user" && (
                <Image
                  width={48}
                  height={48}
                  src={chatBotAvatar || emptyAvatar}
                  alt="Avatar"
                  className="rounded-full h-[48px] w-[48px] aspect-square translate-y-5"
                  priority
                />
              )}
              <div
                className={`${
                  message.role === "user" ? "bg-purple-500" : "bg-gray-800"
                } rounded-lg p-4 text-white max-w-sm whitespace-pre-line`}
              >
                {filterReferenceFromResponse(message.content)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div key={chatLog.length} className="flex justify-start">
              <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                <TypingAnimation />
              </div>
            </div>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white">
        <div className="flex border border-t-gray-100">
          <input
            type="text"
            className="flex-grow px-4 py-3 bg-transparent text-white focus:outline-none"
            placeholder={`${t("assistant-feature.type-your-message")}...`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 focus:outline-none hover:text-rose-500 transition-colors duration-300"
          >
            <IoMdSend size={24} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatBotDialog;
