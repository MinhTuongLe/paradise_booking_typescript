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

export const BASE_URL = "http://localhost:3000";
export const API_URL_LOCAL = "http://localhost:8081/api/v1";
// export const API_URL = "https://paradisebookingapp.up.railway.app/api/v1";
// export const API_URL = "http://54.255.194.221:8080/api/v1";
export const API_URL = "http://103.130.211.150:10040/api/v1";
// export const API_URL = "https://paradisebooking.onrender.com/api/v1";
export const LIMIT = 20;
export const SHRINK_LIMIT = 10;

export const booking_status = [
  {
    id: 0,
    name: "All",
    icon: undefined,
    color: "#222",
  },
  {
    id: 1,
    name: "Pending",
    icon: MdPending,
    // icon: <MdPending className="text-[24px]" color = "#ffa700" />,
    color: "#ffa700",
  },
  {
    id: 2,
    name: "Successful",
    icon: FaCheckCircle,
    // icon: <FaCheckCircle className="text-[24px]" color = "#05a569" />,
    color: "#05a569",
  },
  {
    id: 3,
    name: "Checkin",
    icon: FaCalendarAlt,
    // icon: <FaCalendarAlt className="text-[24px]" color = "#55bdbf" />,
    color: "#55bdbf",
  },
  {
    id: 4,
    name: "Checkout",
    icon: FaCalendarCheck,
    // icon: <FaCalendarCheck className="text-[24px]" color = "#58a1d8" />,
    color: "#58a1d8",
  },
  {
    id: 5,
    name: "Completed",
    icon: MdIncompleteCircle,
    // icon: <MdIncompleteCircle className="text-[24px]" color = "#1975d3" />,
    color: "#1975d3",
  },
  {
    id: 6,
    name: "Cancel",
    icon: MdCancel,
    // icon: <MdCancel className="text-[24px]" color = "#f44668" />,
    color: "#f44668",
  },
];

export const roles = [
  {
    id: 1,
    name: "User",
  },
  {
    id: 2,
    name: "Vendor",
  },
  {
    id: 3,
    name: "Admin",
  },
];

export const account_status = [
  {
    id: 1,
    name: "Inactive",
  },
  {
    id: 2,
    name: "Active",
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
    name: "Unpaid",
    color: "#ffa700",
    background: "#fff4ea",
  },
  {
    id: 2,
    name: "Paid",
    color: "#1975d3",
    background: "#e1ebf2",
  },
];

export const place_status = [
  {
    id: 3,
    name: "All",
  },
  {
    id: 1,
    name: "Empty",
  },
  {
    id: 2,
    name: "Reserved",
  },
];

export const classNames = (
  ...classes: (string | undefined | null | boolean)[]
) => {
  return classes.filter(Boolean).join(" ");
};

export const offers = [
  {
    label: "Garden view",
    icon: GiButterflyFlower,
  },
  {
    label: "Hot water",
    icon: BsFire,
  },

  {
    label: "Wifi",
    icon: AiOutlineWifi,
  },
  {
    label: "Coffee",
    icon: MdOutlineCoffeeMaker,
  },
  {
    label: "Security cameras on property",
    icon: BiCctv,
  },
  {
    label: "Bathtub",
    icon: MdOutlineBathtub,
  },
  {
    label: "Dedicated workspace",
    icon: GrWorkshop,
  },
  {
    label: "Safe",
    icon: RiSafeLine,
  },
  {
    label: "Free parking on premises",
    icon: AiOutlineCar,
  },
  {
    label: "Fire extinguisher",
    icon: FaFireExtinguisher,
  },
];

export const maxPrice = 10000000;

export const types = [
  {
    name: "Content that is dishonest or inaccurate",
    value: 1,
  },
  {
    name: "This place/vendor is not real",
    value: 2,
  },
  {
    name: "It's a scam",
    value: 3,
  },
  {
    name: "Offensive content",
    value: 4,
  },
  {
    name: "Other problems",
    value: 5,
  },
];

export const emptyImage =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg";

export const emptyAvatar = "/assets/avatar.png";
