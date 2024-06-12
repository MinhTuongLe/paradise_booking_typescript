"use client";
import { MdManageAccounts, MdModeOfTravel, MdReport } from "react-icons/md";
import { IoMdGitPullRequest } from "react-icons/io";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import CategoryBox from "../CategoryBox";
import Container from "../Container";
import { usePathname } from "next/navigation";
import { TbHomeCog } from "react-icons/tb";

export const categories = [
  {
    label: "accounts",
    icon: MdManageAccounts,
    path: "accounts",
  },
  {
    label: "guider-requests",
    icon: MdModeOfTravel,
    path: "requests/guider",
  },
  {
    label: "vendor-requests",
    icon: TbHomeCog,
    path: "requests/vendor",
  },
  {
    label: "reports",
    icon: MdReport,
    path: "reports",
  },
];

function AdminNavbar({}) {
  const { t } = useTranslation("translation", { i18n });
  const pathName = usePathname();

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
            route={items.path}
            selected={
              pathName?.split("/")[1] === items.path ||
              pathName?.split("/")[1] + "/" + pathName?.split("/")[2] ===
                items.path
            }
          />
        ))}
      </div>
    </Container>
  );
}

export default AdminNavbar;
