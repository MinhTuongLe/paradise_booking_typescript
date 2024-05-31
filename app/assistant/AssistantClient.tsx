/* eslint-disable react/no-children-prop */
"use client";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import EmptyState from "@/components/EmptyState";
import { RootState } from "@/store/store";
import axios from "axios";
import { FormEvent, useState } from "react";
import TypingAnimation from "@/components/TypingAnimation";

function AssistantClient() {
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const { t } = useTranslation("translation", { i18n });

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

  const sendMessage = (message: any) => {
    // const url = "/api/chat";
    // const data = {
    //   model: "gpt-3.5-turbo-0301",
    //   messages: [{ role: "user", content: message }],
    // };
    // setIsLoading(true);
    // axios
    //   .post(url, data)
    //   .then((response) => {
    //     console.log(response);
    //     setChatLog((prevChatLog: any) => [
    //       ...prevChatLog,
    //       { type: "bot", message: response.data.choices[0].message.content },
    //     ]);
    //     setIsLoading(false);
    //   })
    //   .catch((error) => {
    //     setIsLoading(false);
    //     console.log(error);
    //   });
  };

  if (!authState) {
    return (
      <EmptyState
        title={t("general.unauthorized")}
        subtitle={t("general.please-login")}
      />
    );
  }

  return (
    <div className="bg-gray-800 w-[100vw] h-[100vh] -translate-y-[10vh] fixed">
      <div className="container mx-auto max-w-[700px] absolute left-[50%] -translate-x-[50%]">
        <div className="flex flex-col h-screen bg-gray-900">
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
            <span className="text-rose-500">Paradise</span> Assistant
          </h1>
          <div className="flex-grow p-6">
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
          <form onSubmit={handleSubmit} className="flex-none p-6">
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
