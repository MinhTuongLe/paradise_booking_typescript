"use client";

import React from "react";
import FooterColumn from "@/components/FooterColumn";

function Footer({}) {
  const itemData = [
    [
      "about",
      "newsroom",
      "learn-about-new-features",
      "letter-from-our-founders",
      "careers",
      "investors",
    ],
    [
      "support",
      "help-center",
      "paradisecover",
      "cancellation-options",
      "safety-information",
      "report-a-neighborhood-concern",
    ],
    [
      "community",
      "newsroom",
      "learn-about-new-features",
      "letter-from-our-founders",
      "careers",
      "investors",
    ],
    [
      "hosting",
      "try-hosting",
      "paradisecover-for-hosts",
      "explore-hosting-resources",
      "safety-information",
      "how-to-host-responsibly",
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
