"use client";

import React from "react";
import FooterColumn from "@/components/FooterColumn";

function Footer({}) {
  const itemData = [
    [
      "ABOUT",
      "Newsroom",
      "Learn about new features",
      "Letter from our founders",
      "Careers",
      "Investors",
    ],
    [
      "Support",
      "Help Center",
      "ParadiseCover",
      "Cancellation options",
      "Safety information",
      "Report a neighborhood concern",
    ],
    [
      "Community",
      "Newsroom",
      "Learn about new features",
      "Letter from our founders",
      "Careers",
      "Investors",
    ],
    [
      "Hosting",
      "Try hosting",
      "ParadiseCover for Hosts",
      "Explore hosting resources",
      "Safety information",
      "How to host responsibly",
    ],
  ];

  const footerColumns = itemData.map((item, index) => (
    <FooterColumn index={index} data={item} key={index} />
  ));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-y-10 px-32 py-14 bg-gray-100 text-gray-600 h-[30vh]">
      {footerColumns}
    </div>
  );
}

export default Footer;
