/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { useDispatch, useSelector } from "react-redux";
import Cookie from "js-cookie";
import { reset } from "../slice/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdManageAccounts } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoIosLogOut } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import AdminNavbar from "./AdminNavbar";
import { BiFilterAlt } from "react-icons/bi";
import { RootState } from "@/store/store";

function Navbar() {
  const authState = useSelector((state: RootState) => state.authSlice.authState);
  const loggedUser = useSelector((state: RootState) => state.authSlice.loggedUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isShowed, setIsShowed] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // remove cookie if expired
    const expiredAt = Number(Cookie.get("expiresAt"));
    if (expiredAt) {
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (currentTimestamp >= expiredAt) {
        handleLogout();
        localStorage.removeItem("persist:root");
        console.log("ACCESS TOKEN IS EXPIRED!!!");
      }
    } else {
      dispatch(reset());
      localStorage.removeItem("persist:root");
      console.log("ACCESS TOKEN IS EXPIRED!!!");
    }
  }, []);

  const handleLogout = () => {
    Cookie.remove("loggedUser");
    Cookie.remove("accessToken");
    Cookie.remove("expiresAt");
    Cookie.remove("userId");
    Cookie.remove("user_email");
    dispatch(reset());
    router.push("/");
  };

  return (
    <>
      {pathname !== "/verify" && (
        <div className="fixed w-full bg-white z-10 shadow-sm h-[10vh] min-h-[82px]">
          <div className="py-4 border-b-[1px] h-full">
            <Container>
              <div className="flex flex-row items-center justify-between gap-3 h-full ">
                <Logo />
                {loggedUser?.role === 3 ? (
                  <div className={`${loggedUser?.role === 3 && "w-full"}`}>
                    <AdminNavbar />
                  </div>
                ) : (
                  <div className="hidden lg:block">
                    <Search />
                  </div>
                )}
                <UserMenu authState={authState} loggedUser={loggedUser || undefined} />
              </div>
            </Container>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
