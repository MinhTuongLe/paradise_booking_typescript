import { Dispatch, SetStateAction, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import i18n from "@/i18n/i18n";
import Icons from "../icons/Icons";
import "../../styles/globals.css";

interface MultiSelectionProps {
  tags: string[];
  title: string;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  disable?: boolean;
  isNotTranslate?: boolean;
}

const MultiSelection: React.FC<MultiSelectionProps> = ({
  tags,
  title,
  selected,
  setSelected,
  disable,
  isNotTranslate,
}) => {
  const { t } = useTranslation("translation", { i18n });

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTags = tags.filter(
    (item: string) =>
      item?.toLocaleLowerCase()?.includes(query.toLocaleLowerCase()?.trim()) &&
      !selected.includes(item)
  );

  const isDisable =
    !query?.trim() ||
    selected.filter(
      (item: string) =>
        item?.toLocaleLowerCase()?.trim() === query?.toLocaleLowerCase()?.trim()
    )?.length;

  return (
    <div className="grid place-items-center w-full">
      <div className="relative w-full h-68 text-sm">
        {selected?.length ? (
          <div className="bg-white w-full relative text-xs flex flex-wrap gap-1 p-2 mb-2">
            {selected.map((tag: string) => {
              return (
                <div
                  key={tag}
                  className="rounded-full w-fit py-1.5 px-3 border border-gray-400 bg-gray-50 text-gray-500
                  flex items-center gap-2"
                >
                  {isNotTranslate ? tag : t(`multiSelect.${tag}`)}
                  {!disable && (
                    <div
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() =>
                        setSelected(selected.filter((i) => i !== tag))
                      }
                    >
                      <Icons.Close />
                    </div>
                  )}
                </div>
              );
            })}
            {!disable && (
              <div className="w-full text-right">
                <span
                  className="text-gray-400 cursor-pointer"
                  onClick={() => {
                    setSelected([]);
                    inputRef.current?.focus();
                  }}
                >
                  {t("general.clear-all")}
                </span>
              </div>
            )}
          </div>
        ) : null}

        {!disable && (
          <>
            <div className="card flex items-center justify-between p-3 w-80 gap-2.5 w-full">
              <Icons.Search />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.trimStart())}
                placeholder={title}
                className="bg-transparent text-sm flex-1 caret-rose-500"
                onFocus={() => setMenuOpen(true)}
                onBlur={() => setMenuOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isDisable) {
                    setSelected((prev) => [...prev, query]);
                    setQuery("");
                    setMenuOpen(true);
                  }
                }}
              />
              <button
                className="text-sm disabled:text-gray-300 text-rose-500 disabled:cursor-not-allowed"
                disabled={isDisable as any}
                onClick={() => {
                  if (isDisable) {
                    return;
                  }
                  setSelected((prev) => [...prev, query]);
                  setQuery("");
                  inputRef.current?.focus();
                  setMenuOpen(true);
                }}
              >
                + {t("components.add")}
              </button>
            </div>

            {/* Menu's */}
            {menuOpen ? (
              <div className="z-10 card absolute w-full max-h-52 mt-2 p-1 flex overflow-y-auto scrollbar-thin scrollbar-track-slate-50 scrollbar-thumb-slate-200">
                <ul className="w-full">
                  {filteredTags?.length ? (
                    filteredTags.map((tag, i) => (
                      <li
                        key={tag}
                        className="p-2 cursor-pointer hover:bg-rose-50 hover:text-rose-500 rounded-md w-full"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setMenuOpen(true);
                          setSelected((prev) => [...prev, tag]);
                          setQuery("");
                        }}
                      >
                        {t(`multiSelect.${tag}`)}
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">
                      {t("components.no-options-available")}
                    </li>
                  )}
                </ul>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default MultiSelection;
