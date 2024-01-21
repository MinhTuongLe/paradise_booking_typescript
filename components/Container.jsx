"use client";

import React from "react";

function Container({ children }) {
  return (
    <div className="max-w-[1800px] h-full mx-auto xl:px-20 md:px-2 sm:px-2 px-4">
      {children}
    </div>
  );
}

export default Container;
