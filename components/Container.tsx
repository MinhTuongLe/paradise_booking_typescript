"use client";

import React from "react";

interface ContainerProps {
  children: any;
  notPadding?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, notPadding }) => {
  return (
    <div
      className={`max-w-[1800px] h-full mx-auto ${
        notPadding ? "" : "xl:px-20 md:px-2 sm:px-2 px-4"
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
