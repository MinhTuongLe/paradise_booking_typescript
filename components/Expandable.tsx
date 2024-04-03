import React, { useState } from "react";

interface ExpandableProps {
  text: string;
  maxCharacters: number;
}

const Expandable: React.FC<ExpandableProps> = ({ text, maxCharacters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedText = isExpanded
    ? text
    : text.split(" ").slice(0, maxCharacters).join(" ");

  return (
    <div>
      <p
        className={`overflow-x-hidden ${
          isExpanded
            ? "whitespace-normal overflow-y-visible"
            : "overflow-y-hidden"
        }`}
        dangerouslySetInnerHTML={{
          __html: isExpanded ? text : truncatedText,
        }}
        style={{ WebkitLineClamp: isExpanded ? "none" : "5" }}
      ></p>
      {text.split(" ").length > maxCharacters && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-left text-rose-500 font-bold"
        >
          {isExpanded ? "Hide" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default Expandable;
