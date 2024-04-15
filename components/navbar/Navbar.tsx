/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Cookie from "js-cookie";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { reset } from "../slice/authSlice";
import AdminNavbar from "./AdminNavbar";
import { RootState } from "@/store/store";
import { Role } from "@/enum";
import { getRoleId } from "@/utils/getUserInfo";

function Navbar() {
  const authState = useSelector(
    (state: RootState) => state.authSlice.authState
  );
  const loggedUser = useSelector(
    (state: RootState) => state.authSlice.loggedUser
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { t } = useTranslation("translation", { i18n });

  useEffect(() => {
    // remove cookie if expired
    const expiredAt = Number(Cookie.get("expiresAt"));
    if (expiredAt) {
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (currentTimestamp >= expiredAt) {
        handleLogout();
        localStorage.removeItem("persist:root");
        // console.log("ACCESS TOKEN IS EXPIRED!!!");
      }
    } else {
      dispatch(reset());
      localStorage.removeItem("persist:root");
      // console.log("ACCESS TOKEN IS EXPIRED!!!");
    }
  }, []);

  const handleLogout = () => {
    Cookie.remove("loggedUser");
    Cookie.remove("accessToken");
    Cookie.remove("expiresAt");
    Cookie.remove("userId");
    Cookie.remove("user_email");
    Cookie.remove("loginType");
    dispatch(reset());
    router.push("/");
  };

  return (
    <>
      <div className="fixed w-full bg-white z-10 shadow-sm h-[10vh] min-h-[82px]">
        <div className="border-b-[1px] h-full">
          <Container>
            <div className="flex flex-row items-center justify-between gap-3 h-full">
              <Logo />
              {(pathname === "/" ||
                pathname?.includes("/post-reviews") ||
                pathname?.includes("/post-guiders")) &&
              loggedUser?.role !== getRoleId(Role.Admin) ? (
                <div className="flex w-[40%] gap-8 items-center justify-center">
                  <span
                    onClick={() => router.push("/")}
                    className={`cursor-pointer ${
                      pathname === "/"
                        ? "text-rose-500 font-bold text-xl"
                        : "text-gray-400"
                    }`}
                  >
                    {t("navbar.accommodation")}
                  </span>
                  <span
                    onClick={() => router.push("/post-reviews")}
                    className={`cursor-pointer ${
                      pathname.includes("/post-reviews")
                        ? "text-rose-500 font-bold text-xl"
                        : "text-gray-400"
                    }`}
                  >
                    {t("navbar.post-reviews")}
                  </span>
                  <span
                    onClick={() => router.push("/post-guiders")}
                    className={`cursor-pointer ${
                      pathname.includes("/post-guiders")
                        ? "text-rose-500 font-bold text-xl"
                        : "text-gray-400"
                    }`}
                  >
                    {t("navbar.post-guiders")}
                  </span>
                </div>
              ) : (
                loggedUser?.role === getRoleId(Role.Admin) && (
                  <div className="w-full">
                    <AdminNavbar />
                  </div>
                )
              )}
              <UserMenu
                authState={authState}
                loggedUser={loggedUser || undefined}
              />
            </div>
            <div className="w-full justify-center flex items-center absolute bottom-0 left-0 translate-y-[75%]">
              <div className="w-[50%]">
                {pathname === "/" &&
                  loggedUser?.role !== getRoleId(Role.Admin) && (
                    <div className="hidden lg:block">
                      <Search />
                    </div>
                  )}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
}

export default Navbar;
