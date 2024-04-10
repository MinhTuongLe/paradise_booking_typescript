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
    name: "All",
    icon: undefined,
    color: "#222",
  },
  {
    id: 1,
    name: "Pending",
    icon: MdPending,
    color: "#ffa700",
  },
  {
    id: 2,
    name: "Successful",
    icon: FaCheckCircle,
    color: "#05a569",
  },
  {
    id: 3,
    name: "Checkin",
    icon: FaCalendarAlt,
    color: "#55bdbf",
  },
  {
    id: 4,
    name: "Checkout",
    icon: FaCalendarCheck,
    color: "#58a1d8",
  },
  {
    id: 5,
    name: "Completed",
    icon: MdIncompleteCircle,
    color: "#1975d3",
  },
  {
    id: 6,
    name: "Cancel",
    icon: MdCancel,
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
    name: "Dining",
    value: 1,
  },
  {
    name: "Entertainment",
    value: 2,
  },
  {
    name: "Accommodation",
    value: 3,
  },
  {
    name: "Transportation",
    value: 4,
  },
  {
    name: "Shopping",
    value: 5,
  },
  {
    name: "Health",
    value: 6,
  },
  {
    name: "Other Services",
    value: 7,
  },
];

export const formatDateTimeType = {
  DMY_HMS: "DD/MM/YYYY HH:mm:ss",
};

export const formatDateType = {
  DMS: "DD/MM/YYYY",
};

export enum Topic {
  Dining = 1,
  Entertainment = 2,
  Accommodation = 3,
  Transportation = 4,
  Shopping = 5,
  Health = 6,
  OtherServices = 7,
}

export enum Like {
  Like = 1,
  Dislike = 2,
}

export enum Role {
  User = 1,
  Vendor = 2,
  Admin = 3,
}

export enum RentModalStep {
  BECOME_VENDOR = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
}

export enum ForgotPasswordStep {
  SEND_CODE = 1,
  VERIFY = 2,
  RESET_PASSWORD = 3,
}

export enum AddNewPostReviewStep {
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
}

export enum SearchModalOptions {
  LOCATION = 1,
  DATE = 2,
  INFO = 3,
  PRICE = 4,
}

export enum BookingMode {
  ForMySelf = 1,
  ForOther = 2,
}

export enum PropertyStep {
  GENERAL = 1,
  AMENITIES = 2,
  POLICIES = 3,
}

export enum AccountActive {
  Inactive = 1,
  Active = 2,
}

export enum PaymentMethods {
  COD = 1,
  Momo = 2,
}

export enum BookingStatus {
  All = 0,
  Pending = 1,
  Successful = 2,
  Checkin = 3,
  Checkout = 4,
  Completed = 5,
  Cancel = 6,
}

export enum CommentType {
  Parent = 1,
  Child = 2,
}
