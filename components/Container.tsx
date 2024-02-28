"use client";

import React, { ReactElement } from "react";

interface ContainerProps {
  children: ReactElement;
}

const Container:React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="max-w-[1800px] h-full mx-auto xl:px-20 md:px-2 sm:px-2 px-4">
      {children}
    </div>
  );
}

export default Container;
