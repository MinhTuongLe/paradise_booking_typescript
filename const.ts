import { FaCalendarAlt, FaCalendarCheck, FaCheckCircle } from "react-icons/fa";
import { MdCancel, MdIncompleteCircle, MdPending } from "react-icons/md";
import { AiOutlineCar, AiOutlineWifi } from "react-icons/ai";
import { BiCctv } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { FaFireExtinguisher } from "react-icons/fa";
import { GiButterflyFlower } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";
import { MdOutlineBathtub, MdOutlineCoffeeMaker } from "react-icons/md";
import { RiSafeLine } from "react-icons/ri";

import Dining from "@/public/assets/Dining.jpg";
import Entertainment from "@/public/assets/Entertainment.jpg";
import Accommodation from "@/public/assets/Accommodation.jpg";
import Transportation from "@/public/assets/Transportation.jpg";
import Shopping from "@/public/assets/Shopping.jpg";
import Health from "@/public/assets/Health.jpg";
import OtherServices from "@/public/assets/OtherServices.jpg";

export const LIMIT = 20;
export const SHRINK_LIMIT = 10;
export const MAX_COMMENT_LENGTH = 3;
export const maxPrice = 10000000;

export const BASE_URL = "http://localhost:3000";
export const API_URL_LOCAL = "http://localhost:8080/api/v1";
// export const API_URL = "http://54.255.194.221:8080/api/v1";
export const API_URL = "https://booking.workon.space/api/v1";

export const emptyImage =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg";
export const emptyAvatar = "/assets/avatar.png";

export const booking_status = [
  {
    id: 0,
    name: "all",
    icon: undefined,
    color: "#222",
  },
  {
    id: 1,
    name: "pending",
    icon: MdPending,
    color: "#ffa700",
  },
  {
    id: 2,
    name: "successful",
    icon: FaCheckCircle,
    color: "#05a569",
  },
  {
    id: 3,
    name: "checkin",
    icon: FaCalendarAlt,
    color: "#55bdbf",
  },
  {
    id: 4,
    name: "checkout",
    icon: FaCalendarCheck,
    color: "#58a1d8",
  },
  {
    id: 5,
    name: "completed",
    icon: MdIncompleteCircle,
    color: "#1975d3",
  },
  {
    id: 6,
    name: "cancel",
    icon: MdCancel,
    color: "#f44668",
  },
];

export const roles = [
  {
    id: 1,
    name: "user",
  },
  {
    id: 2,
    name: "vendor",
  },
  {
    id: 3,
    name: "admin",
  },
];

export const account_status = [
  {
    id: 1,
    name: "inactive",
  },
  {
    id: 2,
    name: "active",
  },
];

export const payment_methods = [
  {
    id: 1,
    name: "COD",
    color: "#3bbeab",
    background: "#ecf5f4",
  },
  {
    id: 2,
    name: "Momo",
    color: "#f43d8a",
    background: "#ffb5ca61",
  },
];

export const payment_statuses = [
  {
    id: 1,
    name: "unpaid",
    color: "#ffa700",
    background: "#fff4ea",
  },
  {
    id: 2,
    name: "paid",
    color: "#1975d3",
    background: "#e1ebf2",
  },
];

export const place_status = [
  {
    id: 3,
    name: "all",
  },
  {
    id: 1,
    name: "empty",
  },
  {
    id: 2,
    name: "reserved",
  },
];

export const classNames = (
  ...classes: (string | undefined | null | boolean)[]
) => {
  return classes.filter(Boolean).join(" ");
};

export const offers = [
  {
    label: "garden-view",
    icon: GiButterflyFlower,
  },
  {
    label: "hot-water",
    icon: BsFire,
  },

  {
    label: "wifi",
    icon: AiOutlineWifi,
  },
  {
    label: "coffee",
    icon: MdOutlineCoffeeMaker,
  },
  {
    label: "security-cameras-on-property",
    icon: BiCctv,
  },
  {
    label: "bathtub",
    icon: MdOutlineBathtub,
  },
  {
    label: "dedicated-workspace",
    icon: GrWorkshop,
  },
  {
    label: "safe",
    icon: RiSafeLine,
  },
  {
    label: "free-parking-on-premises",
    icon: AiOutlineCar,
  },
  {
    label: "fire-extinguisher",
    icon: FaFireExtinguisher,
  },
];

export const types = [
  {
    name: "content-that-is-dishonest-or-inaccurate",
    value: 1,
  },
  {
    name: "this-place-vendor-is-not-real",
    value: 2,
  },
  {
    name: "it-s-a-scam",
    value: 3,
  },
  {
    name: "offensive-content",
    value: 4,
  },
  {
    name: "other-problems",
    value: 5,
  },
];

export const post_review_types = [
  {
    id: 1,
    name: "For groups 1",
  },
  {
    id: 2,
    name: "For groups 2",
  },
  {
    id: 3,
    name: "For groups 3",
  },
  {
    id: 4,
    name: "For groups 4",
  },
  {
    id: 5,
    name: "For groups 5",
  },
  {
    id: 6,
    name: "For groups 6",
  },
  {
    id: 7,
    name: "For groups 7",
  },
  {
    id: 8,
    name: "For groups 8",
  },
  {
    id: 9,
    name: "For groups 9",
  },
  {
    id: 10,
    name: "For groups 10",
  },
];

export const max_guest_selections = [
  {
    name: "1 - 3 guests",
    value: 1,
  },
  {
    name: "4 - 10 guests",
    value: 2,
  },
  {
    name: "11 - 30 guests",
    value: 3,
  },
  {
    name: "Over 30 guests",
    value: 4,
  },
];

export const type_selections = [
  {
    name: "dining",
    value: 1,
    image: Dining,
    description: "dining-desc",
  },
  {
    name: "entertainment",
    value: 2,
    image: Entertainment,
    description: "entertainment-desc",
  },
  {
    name: "accommodation",
    value: 3,
    image: Accommodation,
    description: "accommodation-desc",
  },
  {
    name: "transportation",
    value: 4,
    image: Transportation,
    description: "transportation-desc",
  },
  {
    name: "shopping",
    value: 5,
    image: Shopping,
    description: "shopping-desc",
  },
  {
    name: "health",
    value: 6,
    image: Health,
    description: "health-desc",
  },
  {
    name: "other-services",
    value: 7,
    image: OtherServices,
    description: "other-services-desc",
  },
];

export const formatDateTimeType = {
  DMY_HMS: "DD/MM/YYYY HH:mm:ss",
};

export const formatDateType = {
  DMS: "DD/MM/YYYY",
  YMD: "YYYY-MM-DD",
};
