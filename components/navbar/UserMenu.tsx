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

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import useRentModal from "@/hook/useRentModal";
import Notification from "@/components/Notification";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import { reset } from "@/components/slice/authSlice";
import { User } from "@/models/user";

import "../../styles/globals.css";
import Cookies from "js-cookie";

interface UserMenuProps {
  authState: boolean;
  loggedUser: User | undefined;
}

const UserMenu: React.FC<UserMenuProps> = ({ authState, loggedUser }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const rentModel = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [language, setLanguage] = useState("vi");
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const loginType = Cookies.get("loginType");

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
    // window.location.reload();
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
        {loggedUser?.role === 2 && (
          <div
            className="hidden md:block text-sm font-semibold rounded-full hover:bg-neutral-100 transition cursor-pointer"
            onClick={onRent}
          >
            Paradise your Home
          </div>
        )}
        {/* <div
          // onClick={}
          className="md:hidden lg:flex flex-row items-center gap-3 cursor-pointer transition relative"
        >
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div
              className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:bg-rose-500 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-rose-500"
              onClick={handleChangeLanguage}
            ></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 w-[8px]">
              {language.toUpperCase()}
            </span>
          </label>
        </div>
        {authState && (
          <div
            onClick={toggleNotification}
            className="md:hidden lg:flex flex-row items-center gap-3 cursor-pointer transition relative"
          >
            <IoNotifications size={20} />
          </div>
        )} */}
        <div
          onClick={toggleNotification}
          className="md:hidden lg:flex flex-row items-center gap-3 cursor-pointer transition relative bg-rose-500 p-3 rounded-full hover:brightness-150"
        >
          <IoNotifications size={20} className="text-white" />
        </div>
        <div
          onClick={toggleOpen}
          className="py-3 md:h-[60%] lg:h-full md:px-5 md:border-[1px] flex flex-row items-center gap-3 sm:rounded-2xl xl:rounded-full cursor-pointer hover:shadow-md transition"
        >
          <AiOutlineMenu size={24} />
          <div className="hidden md:flex md:justify-center md:items-center md:h-full">
            {loggedUser && loggedUser.avatar ? (
              <Avatar src={loggedUser.avatar} userName={loggedUser.full_name} />
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
                {loggedUser.role !== 3 && (
                  <>
                    <MenuItem
                      onClick={() => menuItemSelect("/reservations")}
                      label="My reservations"
                    />
                    <MenuItem
                      onClick={() => menuItemSelect("/favorites")}
                      label="My wishlist"
                    />
                  </>
                )}
                {loggedUser.role === 2 && (
                  <>
                    <MenuItem
                      onClick={() => menuItemSelect("/properties")}
                      label="My properties"
                    />
                    <MenuItem
                      onClick={() => menuItemSelect("/payments")}
                      label="Payments"
                    />
                    <MenuItem
                      onClick={() => menuItemSelect("/statistics")}
                      label="Statistics"
                    />
                  </>
                )}
                <MenuItem
                  onClick={() => menuItemSelect(`/interaction-diary`)}
                  label="Interaction Diary"
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/post-reviews/mine/1`)}
                  label="My Post Reviews"
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/booked-guiders`)}
                  label="My Booked Guiders"
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/post-guiders/mine`)}
                  label="My Post Guiders"
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/users/${loggedUser.id}`)}
                  label="My profile"
                />
                <MenuItem
                  onClick={() => menuItemSelect("/change-password")}
                  label="Change Password"
                />
                <hr />
                {loginType === "1" ? (
                  <MenuItem
                    className=" px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                    onClick={handleLogout}
                    label="Logout"
                  />
                ) : (
                  <GoogleLogout
                    clientId="831989111939-4ejcpi2h7nlrbe07pddu42dje2ors07j.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={logout}
                    icon={false}
                    className="customButtonLogout"
                  />
                )}
              </>
            ) : (
              <>
                <MenuItem
                  onClick={() => menuItemSelect(`/interaction-diary`)}
                  label="Interaction Diary"
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/post-reviews/mine/1`)}
                  label="My Post Reviews"
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/booked-guiders`)}
                  label="My Booked Guiders"
                />
                <MenuItem
                  onClick={() => menuItemSelect(`/post-guiders/mine`)}
                  label="My Post Guiders"
                />
                <MenuItem
                  onClick={() => {
                    loginModel.onOpen();
                    if (isOpen) toggleOpen();
                  }}
                  label="Login"
                />
                <MenuItem
                  onClick={() => {
                    registerModel.onOpen();
                    if (isOpen) toggleOpen();
                  }}
                  label="Sign up"
                />
              </>
            )}
          </div>
        </div>
      )}
      {isOpenNotification && (
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
      )}
    </div>
  );
};

export default UserMenu;
