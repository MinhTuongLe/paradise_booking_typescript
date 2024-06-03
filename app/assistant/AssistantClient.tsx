/* eslint-disable react/no-children-prop */
"use client";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

import i18n from "@/i18n/i18n";
import EmptyState from "@/components/EmptyState";
import { RootState } from "@/store/store";
import TypingAnimation from "@/components/TypingAnimation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { RequestStatus, ViolentCode } from "@/enum";
import { client, deploymentName } from "@/const";

function AssistantClient() {
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const { t } = useTranslation("translation", { i18n });

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setChatLog((prevChatLog: any) => [
      ...prevChatLog,
      { type: "user", message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    client
      .getChatCompletions(deploymentName, [
        {
          role: "system",
          content:
            "You are a helpful assistant for helping users find solutions.",
        },
        { role: "user", content: "Hey there" },
        {
          role: "assistant",
          content: "Hello! How can I help you today?",
        },
        { role: "user", content: message },
      ])
      .then((res) => {
        if (res.choices[0]) {
          setChatLog((prevChatLog: any) => [
            ...prevChatLog,
            { type: "bot", message: res.choices[0]?.message?.content || "" },
          ]);
        }
      })
      .catch((err) => {
        let messageCode = "";
        if (err?.code === RequestStatus.Exceeded)
          messageCode =
            "Request exceeded rate limit. Please try again in 3 seconds";
        else {
          if (
            err?.status === RequestStatus.BadRequest &&
            err?.code === ViolentCode.ContentFilter
          ) {
            messageCode =
              "Message was found to violate our standards. Please check the wording";
          } else
            messageCode = "Error while generating answer. Please try again";
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
    <div className="bg-gray-800 w-[100vw] h-[100vh] fixed overflow-hidden -translate-y-[10vh]">
      <div className="container mx-auto max-w-[700px] absolute left-[50%] -translate-x-[50%]">
        <div className="flex flex-col h-screen bg-gray-900">
          <div className="bg-gray-900 text-white text-center py-3 font-bold text-6xl space-x-4">
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
              {chatLog.map((message: any, index: number) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      message.type === "user" ? "bg-purple-500" : "bg-gray-800"
                    } rounded-lg p-4 text-white max-w-sm`}
                  >
                    {message.message}
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
          <form
            onSubmit={handleSubmit}
            className="flex-none p-6 fixed w-full bottom-0 z-10 bg-gray-900"
          >
            <div className="flex rounded-lg border border-gray-700 bg-gray-800">
              <input
                type="text"
                className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
                placeholder={`${t("assistant-feature.type-your-message")}...`}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="bg-rose-500 rounded-lg px-8 py-3 text-white font-semibold focus:outline-none hover:bg-rose-600 transition-colors duration-300"
              >
                {t("general.send")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssistantClient;
