"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { getUserName } from "@/utils/getUserInfo";
import { bot_id } from "@/const";

const ChatBot = () => {
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );

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
    <>
      <script
        async
        src={`https://api.cronbot.ai/v1/widgets/app/${bot_id}`}
      ></script>
    </>
  );
};

export default ChatBot;
