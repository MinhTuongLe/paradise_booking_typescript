"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { IoNotifications } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { GoogleLogout } from "react-google-login";
import { loadGapiInsideDOM } from "gapi-script";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import { Switch } from "@headlessui/react";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import useRentModal from "@/hook/useRentModal";
import Notification from "@/components/Notification";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import { reset } from "@/components/slice/authSlice";
import { User } from "@/models/user";

import "../../styles/globals.css";
import { getRoleId, getUserName } from "@/utils/getUserInfo";
import { Role } from "@/enum";

interface UserMenuProps {
  authState: boolean;
  loggedUser: User | undefined;
}

const UserMenu: React.FC<UserMenuProps> = ({ authState, loggedUser }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loginType = Cookie.get("loginType");
  const lang = Cookie.get("lang");
  const pathname = usePathname();
  const { t } = useTranslation("translation", { i18n });

  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const rentModel = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [language, setLanguage] = useState(lang || "vi");
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value: boolean) => !value);
  }, []);

  const toggleNotification = useCallback(() => {
    setIsOpenNotification((value: boolean) => !value);
  }, []);

  const menuItemSelect = (item: string) => {
    router.push(item);
    if (isOpen) toggleOpen();
    if (isOpenNotification) toggleNotification();
  };

  const onRent = useCallback(() => {
    if (!loggedUser) {
      return loginModel.onOpen();
    }

    rentModel.onOpen();
  }, [loggedUser, loginModel, rentModel]);

  const handleChangeLanguage = () => {
    if (language === "en") setLanguage("vi");
    else setLanguage("en");
  };

  const handleLogout = () => {
    if (isOpen) toggleOpen();
    Cookie.remove("loggedUser");
    Cookie.remove("accessToken");
    Cookie.remove("expiresAt");
    Cookie.remove("userId");
    Cookie.remove("user_email");
    Cookie.remove("loginType");
    dispatch(reset());
    router.refresh();
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const logout = () => {
    console.log("LOGOUT SUCCESS");
    handleLogout();
  };

  useEffect(() => {
    if (loginModel.isOpen)
      (async () => {
        await loadGapiInsideDOM();
      })();
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    Cookie.set("lang", language);
  }, [language]);

  return (
    <div
      ref={menuRef}
      className="relative h-full"
      onClick={(e) => {
        e.stopPropagation();
        if (isOpenNotification) setIsOpenNotification(false);
      }}
    >
      <div className="flex flex-row items-center gap-6 h-full">
        {loggedUser?.role === getRoleId(Role.Vendor) && (
          <div
            className="hidden md:block text-sm font-semibold rounded-full hover:bg-neutral-100 transition cursor-pointer"
            onClick={onRent}
          >
            {t("navbar.paradise-your-home")}
          </div>
        )}
        <Switch
          checked={language === "vi"}
          onChange={handleChangeLanguage}
          className={`${
            language === "vi" ? "bg-rose-500" : "bg-gray-200"
          } relative flex px-4 py-1 rounded-full justify-center items-center`}
        >
          <span
            className={`text-sm font-medium ${
              language === "vi" ? "text-white" : "text-[#222]"
            }`}
          >
            {language.toUpperCase()}
          </span>
        </Switch>
        {/* {authState && (
          <div
            onClick={toggleNotification}
            className="md:hidden lg:flex flex-row items-center gap-3 cursor-pointer transition relative"
          >
            <IoNotifications size={20} />
          </div>
        )} */}
        {/* <div
          onClick={toggleNotification}
          className="md:hidden lg:flex flex-row items-center gap-3 cursor-pointer transition relative bg-rose-500 p-3 rounded-full hover:brightness-150"
        >
          <IoNotifications size={20} className="text-white" />
        </div> */}
        <div
          onClick={toggleOpen}
          className="py-3 md:px-5 md:border-[1px] flex flex-row items-center gap-3 sm:rounded-2xl xl:rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu size={24} />
          <div className="hidden md:flex md:justify-center md:items-center md:h-full">
            {loggedUser && loggedUser.avatar ? (
              <Avatar
                src={loggedUser.avatar}
                userName={loggedUser ? getUserName(loggedUser) : "User"}
              />
            ) : (
              <Image
                className="rounded-full"
                height="30"
                width="30"
                alt="Avatar"
                src="/assets/avatar.png"
              />
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute rounded-xl shadow-md w-3/4 lg:w-full lg:min-w-[200px] bg-white overflow-hidden right-0 top-[100%] text-sm z-30">
          <div className="flex flex-col cursor-pointer">
            {authState && loggedUser ? (
              <>
                {loggedUser.role !== getRoleId(Role.Admin) && (
                  <>
                    <MenuItem
                      onClick={() => menuItemSelect("/reservations")}
                      label={t("navbar.my-reservations")}
                    />
                    <MenuItem
                      onClick={() => menuItemSelect("/favorites")}
                      label={t("navbar.my-wishlist")}
                    />
                  </>
                )}
                {loggedUser.role === getRoleId(Role.Vendor) && (
                  <>
                    <MenuItem
                      onClick={() => menuItemSelect("/properties")}
                      label={t("navbar.my-properties")}
                    />
                    <MenuItem
                      onClick={() => menuItemSelect("/payments")}
                      label={t("navbar.payments")}
                    />
                    <MenuItem
                      onClick={() => menuItemSelect("/statistics")}
                      label={t("navbar.statistics")}
                    />
                  </>
                )}
                <MenuItem
                  onClick={() => menuItemSelect(`/interaction-diary`)}
                  label={t("navbar.interaction-diary")}
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/post-reviews/mine/1`)}
                  label={t("navbar.my-post-reviews")}
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/booked-guiders`)}
                  label={t("navbar.my-booked-guiders")}
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/post-guiders/mine`)}
                  label={t("navbar.my-post-guiders")}
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/users/${loggedUser.id}`)}
                  label={t("navbar.my-profile")}
                />
                <MenuItem
                  onClick={() => menuItemSelect("/change-password")}
                  label={t("navbar.change-password")}
                />
                <hr />
                {loginType === "1" ? (
                  <MenuItem
                    className=" px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                    onClick={handleLogout}
                    label={t("navbar.logout")}
                  />
                ) : (
                  <GoogleLogout
                    clientId="831989111939-4ejcpi2h7nlrbe07pddu42dje2ors07j.apps.googleusercontent.com"
                    buttonText={t("navbar.logout")}
                    onLogoutSuccess={logout}
                    icon={false}
                    className="customButtonLogout"
                  />
                )}
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => {
                    loginModel.onOpen();
                    if (isOpen) toggleOpen();
                  }}
                  label={t("navbar.login")}
                />
                <MenuItem
                  onClick={() => {
                    registerModel.onOpen();
                    if (isOpen) toggleOpen();
                  }}
                  label={t("navbar.register")}
                />
              </>
            )}
          </div>
        </div>
      )}
      {/* {isOpenNotification && (
        <div className="absolute rounded-xl shadow-md w-[24vw] bg-white overflow-hidden right-0 top-12 text-sm z-20">
          <div className="col-span-12 space-p-4 p-4 pr-2">
            <h1 className="text-2xl font-bold my-3">Notifications</h1>
            <hr />
            <div className="flex justify-between items-center my-3">
              <span className="text-lg font-bold truncate ">Before</span>
              <span
                className="text-md text-rose-500 cursor-pointer"
                onClick={() => {
                  menuItemSelect("/notifications");
                }}
              >
                View all
              </span>
            </div>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#FF5A5F]">
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
              <Notification
                id={1}
                content={"Thông báo từ Lê Minh Tường mới nhất"}
                avatar=""
                date={"11/11/2011"}
                closeIcon={false}
              />
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default UserMenu;
