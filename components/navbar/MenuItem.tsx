"use client";

import React, { MouseEventHandler } from "react";

interface MenuItemProps {
  onClick: MouseEventHandler<HTMLDivElement> | undefined,
  label: string
  className?: string
}

const MenuItem: React.FC<MenuItemProps> = ({ onClick, label, className = undefined }) => {
  return (
    <div
      className={`px-4 py-3 hover:bg-neutral-100 transition font-semibold ${className || ''}`}
      onClick={onClick}
    >
      {label}
    </div>
  );
}

export default MenuItem;
