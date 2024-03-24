"use client";
import { MdManageAccounts, MdReport  } from "react-icons/md";
import { IoMdGitPullRequest } from "react-icons/io";

import CategoryBox from "../CategoryBox";
import Container from "../Container";

export const categories = [
  {
    label: "Accounts",
    icon: MdManageAccounts,
  },
  {
    label: "Requests",
    icon: IoMdGitPullRequest,
  },
  {
    label: "Reports",
    icon: MdReport ,
  },
];

function AdminNavbar({}) {
  return (
    <Container>
      <div
        className="overflow-x-auto w-full scrollbar-none gap-6"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {categories.map((items, index) => (
          <CategoryBox key={index} icon={items.icon} label={items.label} />
        ))}
      </div>
    </Container>
  );
}

export default AdminNavbar;
