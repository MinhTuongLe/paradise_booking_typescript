"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useGoogleLogout } from "react-google-login";
import { loadGapiInsideDOM } from "gapi-script";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/i18n";
import { Switch } from "@headlessui/react";

import useLoginModel from "@/hook/useLoginModal";
import useRegisterModal from "@/hook/useRegisterModal";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import { reset } from "@/components/slice/authSlice";
import { User } from "@/models/user";
import "../../styles/globals.css";
import { getUserName } from "@/utils/getUserInfo";
import { LoginType, Role } from "@/enum";
import { emptyAvatar, google_login_secret } from "@/const";
import ConfirmLogoutModal from "../modals/ConfirmLogoutModal";

interface UserMenuProps {
  authState: boolean;
  loggedUser: User | undefined;
}

const UserMenu: React.FC<UserMenuProps> = ({ authState, loggedUser }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const loginType = Cookie.get("loginType");
  const lang = Cookie.get("lang");
  const { t } = useTranslation("translation", { i18n });

  const registerModel = useRegisterModal();
  const loginModel = useLoginModel();
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState(lang || "vi");
  const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((value: boolean) => !value);
  }, []);

  const menuItemSelect = (item: string) => {
    router.push(item);
    if (isOpen) toggleOpen();
  };

  const handleChangeLanguage = () => {
    if (language === "en") setLanguage("vi");
    else setLanguage("en");
  };

  const { signOut } = useGoogleLogout({
    clientId: google_login_secret ?? "",
  });

  const handleLogout = () => {
    setIsOpenLogoutModal(false);
    if (Number(loginType) === LoginType.GoogleLogin) {
      signOut();
    }
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

  const handleGoogleLogoutClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    setIsOpenLogoutModal(true);
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

  useEffect(() => {
    if (loginModel.isOpen)
      (async () => {
        await loadGapiInsideDOM();
      })();
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    Cookie.set("lang", language);
    router.refresh();
  }, [language, router]);

  return (
    <>
      <ConfirmLogoutModal
        isOpen={isOpenLogoutModal}
        onClose={() => setIsOpenLogoutModal(false)}
        onLogout={handleLogout}
      />
      <div
        ref={menuRef}
        className="relative h-full"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex flex-row items-center gap-6 h-full">
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
          <div
            onClick={toggleOpen}
            className="py-3 md:px-5 md:border-[1px] flex flex-row items-center gap-3 sm:rounded-lg xl:rounded-full cursor-pointer hover:shadow-md transition"
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
                  src={emptyAvatar}
                />
              )}
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="absolute rounded-lg shadow-md w-3/4 lg:w-full lg:min-w-[200px] bg-white right-0 top-[100%] text-sm z-30">
            <div className="flex flex-col cursor-pointer">
              {authState && loggedUser ? (
                <>
                  {loggedUser.role !== Role.Admin && (
                    <MenuItem
                      label={t("navbar.my-bookings")}
                      submenuItems={[
                        {
                          label: t("navbar.my-reservations"),
                          onClick: () => menuItemSelect(`/reservations`),
                        },
                        {
                          label: t("navbar.my-wishlist"),
                          onClick: () => menuItemSelect("/favorites"),
                        },
                        {
                          label: t("navbar.my-booked-guiders"),
                          onClick: () => menuItemSelect(`/booked-guiders`),
                        },
                      ]}
                    />
                  )}
                  {loggedUser.role === Role.Vendor && (
                    <>
                      <MenuItem
                        label={t("navbar.my-assets")}
                        submenuItems={[
                          {
                            label: t("navbar.my-properties"),
                            onClick: () => menuItemSelect(`/properties`),
                          },
                          {
                            label: t("navbar.my-post-reviews"),
                            onClick: () =>
                              menuItemSelect(
                                `/post-reviews/mine/${loggedUser.id}`
                              ),
                          },
                        ]}
                      />
                      <MenuItem
                        label={t("navbar.my-revenue")}
                        submenuItems={[
                          {
                            label: t("navbar.payments"),
                            onClick: () => menuItemSelect("/payments/vendor"),
                          },
                          {
                            label: t("navbar.statistics"),
                            onClick: () => menuItemSelect("/statistics/vendor"),
                          },
                        ]}
                      />
                    </>
                  )}
                  {loggedUser.role === Role.User && (
                    <MenuItem
                      onClick={() =>
                        menuItemSelect(`/post-reviews/mine/${loggedUser.id}`)
                      }
                      label={t("navbar.my-post-reviews")}
                    />
                  )}
                  {loggedUser.role === Role.Guider && (
                    <>
                      <MenuItem
                        label={t("navbar.my-assets")}
                        submenuItems={[
                          {
                            label: t("navbar.my-post-reviews"),
                            onClick: () =>
                              menuItemSelect(
                                `/post-reviews/mine/${loggedUser.id}`
                              ),
                          },
                          {
                            label: t("navbar.my-post-guiders"),
                            onClick: () => menuItemSelect("/post-guiders/mine"),
                          },
                        ]}
                      />
                      <MenuItem
                        label={t("navbar.my-revenue")}
                        submenuItems={[
                          {
                            label: t("navbar.payments"),
                            onClick: () => menuItemSelect("/payments/guider"),
                          },
                          {
                            label: t("navbar.statistics"),
                            onClick: () => menuItemSelect("/statistics/guider"),
                          },
                        ]}
                      />
                    </>
                  )}
                  <MenuItem
                    label={t("navbar.general-settings")}
                    submenuItems={[
                      {
                        label: t("navbar.my-profile"),
                        onClick: () =>
                          menuItemSelect(`/users/${loggedUser.id}`),
                      },
                      {
                        label: t("navbar.change-password"),
                        onClick: () => menuItemSelect("/change-password"),
                      },
                    ]}
                  />
                  <hr />
                  {Number(loginType) === LoginType.NormalLogin ? (
                    <MenuItem
                      className="hover:bg-neutral-100 rounded-tl-lg rounded-bl-lg overflow-hidden transition font-semibold"
                      onClick={() => setIsOpenLogoutModal(true)}
                      label={t("navbar.logout")}
                    />
                  ) : (
                    <div
                      onClick={handleGoogleLogoutClick}
                      className="overflow-hidden px-4 py-3 hover:bg-neutral-100 transition font-semibold flex justify-between items-center capitalize cursor-pointer hover:rounded-tl-lg hover:rounded-bl-lg"
                    >
                      {t("navbar.logout")}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <MenuItem
                    className="overflow-hidden"
                    onClick={() => {
                      loginModel.onOpen();
                      if (isOpen) toggleOpen();
                    }}
                    label={t("navbar.login")}
                  />
                  <MenuItem
                    className="rounded-bl-lg rounded-br-lg overflow-hidden"
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
      </div>
    </>
  );
};

export default UserMenu;
