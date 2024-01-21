"use client";

import React from "react";

function Heading({ title, subtitle, center }) {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-2xl font-bold">{title}</div>
      {subtitle && (
        <div className="font-light text-neutral-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
}

export default Heading;
