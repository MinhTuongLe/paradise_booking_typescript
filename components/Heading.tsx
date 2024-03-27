"use client";

import React from "react";
import { SiYourtraveldottv } from "react-icons/si";

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  start?: boolean;
  isGuider?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  title,
  subtitle,
  center,
  start,
  isGuider,
}) => {
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div
        className={`text-2xl font-bold flex  ${
          start ? "justify-start" : "justify-center"
        }`}
      >
        {isGuider && (
          <div className="mr-4">  
            <SiYourtraveldottv size={24} />
          </div>
        )}
        <span>{title}</span>
      </div>
      {subtitle && !isGuider && (
        <div className="font-light text-neutral-500 mt-1">{subtitle}</div>
      )}
    </div>
  );
};

export default Heading;
