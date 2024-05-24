"use client";
import { MdManageAccounts, MdReport } from "react-icons/md";
import { IoMdGitPullRequest } from "react-icons/io";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import CategoryBox from "../CategoryBox";
import Container from "../Container";
import { usePathname } from "next/navigation";

export const categories = [
  {
    label: "accounts",
    icon: MdManageAccounts,
  },
  {
    label: "requests",
    icon: IoMdGitPullRequest,
  },
  {
    label: "reports",
    icon: MdReport,
  },
];

function AdminNavbar({}) {
  const { t } = useTranslation("translation", { i18n });
  const pathName = usePathname()

  return (
    <Container>
      <div
        className="overflow-x-auto w-full scrollbar-none gap-6"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {categories.map((items, index) => (
          <CategoryBox
            key={index}
            icon={items.icon}
            label={t(`navbar.${items.label}`)}
            route={items.label}
            selected={pathName?.split('/')[1] === items.label}
          />
        ))}
      </div>
    </Container>
  );
}

export default AdminNavbar;
