"use client";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import useRentModal from "@/hook/useRentModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";
import Cookie from "js-cookie";

import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import { IoNotifications } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { reset } from "@/components/slice/authSlice";

function UserMenu({ authState, loggedUser }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const rentModel = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenNotification, setIsOpenNotification] = useState(false);
  const [language, setLanguage] = useState("vi");
  const menuRef = useRef(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const toggleNotification = useCallback(() => {
    setIsOpenNotification((value) => !value);
  }, []);

  const menuItemSelect = (item) => {
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
    dispatch(reset());
    router.refresh();
    // window.location.reload();
    router.push("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

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
        {loggedUser.role === 2 && (
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
          onClick={toggleOpen}
          className="md:h-[60%] lg:h-full md:px-5 md:border-[1px] flex flex-row items-center gap-3 sm:rounded-2xl xl:rounded-full cursor-pointer hover:shadow-md transition"
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
        <div className="absolute rounded-xl shadow-md w-3/4 lg:w-full lg:min-w-[160px] bg-white overflow-hidden right-0 top-[100%] text-sm z-30">
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
                  onClick={() => menuItemSelect(`/users/${loggedUser.id}`)}
                  label="My profile"
                />
                <MenuItem
                  onClick={() => menuItemSelect("/change-password")}
                  label="Change Password"
                />
                <hr />
                <MenuItem
                  className=" px-4 py-3 hover:bg-neutral-100 transition font-semibold"
                  onClick={handleLogout}
                  label="Logout"
                />
              </>
            ) : (
              <>
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
}

export default UserMenu;
