"use client";

import React, { useRef, useState } from "react";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

interface MenuItemProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  label: string;
  className?: string;
  submenuItems?: {
    label: string;
    onClick: React.MouseEventHandler<HTMLDivElement>;
  }[];
}

const MenuItem: React.FC<MenuItemProps> = ({
  onClick,
  label,
  className,
  submenuItems,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const handleMouseEnter = () => {
    if (submenuItems) {
      setIsSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsSubmenuOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!submenuItems && onClick) {
      onClick(event);
    }
  };

  return (
    <div
      className={`relative ${className || ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`px-4 py-3 hover:bg-neutral-100 transition font-semibold flex justify-between items-center capitalize ${
          submenuItems ? "cursor-pointer" : ""
        }`}
        onClick={handleClick}
      >
        {label}
        {submenuItems && (isSubmenuOpen ? <AiOutlineUp /> : <AiOutlineDown />)}
      </div>
      {isSubmenuOpen && submenuItems && (
        <div
          ref={menuRef}
          className="absolute right-full top-0 mt-2 bg-white shadow-md rounded-tl-lg rounded-bl-lg z-20 lg:w-full lg:min-w-[250px] overflow-hidden"
        >
          {submenuItems.map((item, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-neutral-100 transition font-semibold capitalize"
              onClick={item.onClick}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
