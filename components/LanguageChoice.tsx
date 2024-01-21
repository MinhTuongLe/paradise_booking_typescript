import React from "react";

interface LanguageChoiceProps {
  id: string,
  country: string,
  flag: any
}

const LanguageChoice: React.FC<LanguageChoiceProps> = ({ id, country, flag }) => {
  return (
    <div className="mb-6 relative w-full flex justify-center items-center space-x-6">
      <span className="text-lg font-bold">{country}</span>
      <div>
        {flag}
        <input type="checkbox" />
      </div>
    </div>
  );
}

export default LanguageChoice;
