"use client";

import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from "react";
import { IoMdClose } from "react-icons/io";

import Button from "../Button";
// import "../../styles/globals.css"

interface FiltersModalProps {
  isOpen: boolean;
  onClose: any;
  onSubmit: any;
  body: ReactNode;
  actionLabel: string;
  footer?: ReactNode;
  disabled?: boolean;
  secondaryAction?: any;
  secondaryActionLabel?: string;
  reset: any;
  classname?: string;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
  reset,
  classname = "",
}) => {
  const [showModal, setShowModal] = useState(isOpen);
  const filtersMenu = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen, reset]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersMenu.current && !filtersMenu.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filtersMenu, onClose]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
    if (reset) reset();
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [disabled, onClose, reset]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }
    if (onSubmit) onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [disabled, secondaryAction]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* <div
        className="justify-center items-center flex overflow-auto fixed inset-0 z-40 outline-none focus:outline-none bg-neutral-800/70"
        onClick={handleClose}
      >
        <div
          className={`${classname} w-full my-6 mx-auto max-h-[80vh] lg:h-auto md:h-auto overflow-auto scrollbar-none`}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`translate duration-300 h-full ${
              showModal ? "translate-y-0" : "translate-y-full"
            } ${showModal ? "opacity-100" : "opacity-0"}`}
          >
            <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
              <div className="flex items-center p-6 rounded-t justify-center border-b-[1px]">
                <div className="text-lg font-semibold">{title}</div>
              </div>
              <div className="p-6 flex-auto">{body}</div>
              <div className="flex flex-col gap-2 p-6 pt-0">
                <div className="flex flex-row items-center gap-4 w-full">
                  {secondaryAction && secondaryActionLabel && (
                    <Button
                      outline
                      disabled={disabled}
                      label={secondaryActionLabel}
                      onClick={handleSecondAction}
                    />
                  )}
                  {actionLabel && (
                    <Button
                      disabled={disabled}
                      label={actionLabel}
                      onClick={handleSubmit}
                    />
                  )}
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div
        ref={filtersMenu}
        className={`${classname} w-full mx-auto max-h-[80vh] lg:h-auto md:h-auto overflow-auto scrollbar-none border-[1px] rounded-xl shadow-sm hover:shadow-md`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`translate duration-300 h-full ${
            showModal ? "translate-y-0" : "translate-y-full"
          } ${showModal ? "opacity-100" : "opacity-0"}`}
        >
          <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg flex flex-col w-full bg-white outline-none focus:outline-none">
            <div className="p-6 flex-auto">{body}</div>
            <div className="flex flex-col gap-2 p-6 pt-0">
              <div className="flex flex-row items-center gap-4 w-full">
                {secondaryAction && secondaryActionLabel && (
                  <Button
                    outline
                    disabled={disabled}
                    label={secondaryActionLabel}
                    onClick={handleSecondAction}
                  />
                )}
                {actionLabel && (
                  <Button
                    disabled={disabled}
                    label={actionLabel}
                    onClick={handleSubmit}
                  />
                )}
              </div>
              {footer}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersModal;
