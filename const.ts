import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaCheckCircle,
  FaGifts,
} from "react-icons/fa";
import {
  MdAttractions,
  MdCancel,
  MdDevicesOther,
  MdIncompleteCircle,
  MdPending,
  MdPermMedia,
} from "react-icons/md";
import { AiOutlineCar, AiOutlineWifi } from "react-icons/ai";
import { BiCctv } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { FaFireExtinguisher } from "react-icons/fa";
import { GiButterflyFlower, GiCaravan } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";
import { MdOutlineBathtub, MdOutlineCoffeeMaker } from "react-icons/md";
import { RiDrinks2Fill, RiSafeLine } from "react-icons/ri";
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

import Dining from "@/public/assets/post-review/Dining.jpg";
import Entertainment from "@/public/assets/post-review/Entertainment.jpg";
import Accommodation from "@/public/assets/post-review/Accommodation.jpg";
import Transportation from "@/public/assets/post-review/Transportation.jpg";
import Shopping from "@/public/assets/post-review/Shopping.jpg";
import Health from "@/public/assets/post-review/Health.jpg";
import OtherServices from "@/public/assets/post-review/OtherServices.jpg";
import ArtAndCulture from "@/public/assets/post-guider/ArtAndCulture.jpg";
import EntertainmentPostGuider from "@/public/assets/post-guider/Entertainment.jpg";
import FoodAndDrink from "@/public/assets/post-guider/FoodAndDrink.jpg";
import Sightseeing from "@/public/assets/post-guider/Sightseeing.jpg";
import Sports from "@/public/assets/post-guider/Sports.jpg";
import Tours from "@/public/assets/post-guider/Tours.jpg";
import Wellness from "@/public/assets/post-guider/Wellness.jpg";
import { PostGuiderType, ReportStatus, ReportTypes, Topic } from "./enum";
import { IoFastFoodSharp, IoTicketSharp } from "react-icons/io5";
import { HiShoppingCart } from "react-icons/hi";

export const LIMIT = 20;
export const SHRINK_LIMIT = 10;
export const MAX_COMMENT_LENGTH = 3;
export const maxPrice = 10000000;

export const BASE_URL = "http://localhost:3000";
export const API_URL_LOCAL = "http://localhost:8080/api/v1";
// export const API_URL = "http://54.255.194.221:8080/api/v1";
export const API_URL = "https://booking.workon.space/api/v1";

export const logo = "/assets/logo/logo.png";
export const emptyImage =
  "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg";
export const emptyAvatar = "/assets/empty-img/avatar.png";
export const wishlistCover = "/assets/general/wishlist_cover.png";
export const chatBotAvatar = "/assets/general/chatbot_avatar.png";
export const minRequiredImages = 5;

export const google_login_id = process.env.GOOGLE_OAUTH_CLIENT_ID;
export const google_secret = process.env.GOOGLE_CLIENT_SECRET;

export const key = process.env.AZURE_KEY;
export const endpoint = process.env.ENDPOINT;
export const client = new OpenAIClient(
  endpoint ?? "",
  new AzureKeyCredential(key ?? "")
);

export const deploymentName = process.env.DEPLOYMENT_NAME;
export const searchIndexName = process.env.SEARCH_INDEX_NAME;
export const searchEndpoint = process.env.SEARCH_ENDPOINT;
export const authentication = process.env.SEARCH_AUTHENTICATION;

export const minSearchTextLength = 0;

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
  {
    id: 4,
    name: "guider",
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
    value: "Garden view",
    icon: GiButterflyFlower,
  },
  {
    label: "hot-water",
    value: "Hot water",
    icon: BsFire,
  },

  {
    label: "wifi",
    value: "Wifi",
    icon: AiOutlineWifi,
  },
  {
    label: "coffee",
    value: "Coffee",
    icon: MdOutlineCoffeeMaker,
  },
  {
    label: "security-cameras-on-property",
    value: "Security cameras on property",
    icon: BiCctv,
  },
  {
    label: "bathtub",
    value: "Bathtub",
    icon: MdOutlineBathtub,
  },
  {
    label: "dedicated-workspace",
    value: "Dedicated workspace",
    icon: GrWorkshop,
  },
  {
    label: "safe",
    value: "Safe",
    icon: RiSafeLine,
  },
  {
    label: "free-parking-on-premises",
    value: "Free parking on premises",
    icon: AiOutlineCar,
  },
  {
    label: "fire-extinguisher",
    value: "Fire extinguisher",
    icon: FaFireExtinguisher,
  },
];

export const place_report_types = [
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
    name: "amenities-or-services-not-as-advertised",
    value: 5,
  },
  {
    name: "place-does-not-meet-standards",
    value: 6,
  },
  {
    name: "legal-violations",
    value: 7,
  },
  {
    name: "discrimination",
    value: 8,
  },
  {
    name: "other-problems",
    value: 9,
  },
];

export const post_guide_report_types = [
  {
    name: "inaccurate-information",
    value: 1,
  },
  {
    name: "service-does-not-meet-expectations",
    value: 2,
  },
  {
    name: "safety-concerns",
    value: 3,
  },
  {
    name: "unprofessional-guide",
    value: 4,
  },
  {
    name: "unclear-pricing",
    value: 5,
  },
  {
    name: "other-problems",
    value: 6,
  },
];

export const account_report_types = [
  {
    name: "fraud-or-fake-information",
    value: 1,
  },
  {
    name: "harassment-or-threats",
    value: 2,
  },
  {
    name: "policy-violation",
    value: 3,
  },
  {
    name: "identity-theft",
    value: 4,
  },
  {
    name: "illegal-activities",
    value: 5,
  },
  {
    name: "unresponsive-or-irresponsible",
    value: 6,
  },
  {
    name: "other-problems",
    value: 7,
  },
];

export const post_review_comment_report_types = [
  {
    name: "spam",
    value: 1,
  },
  {
    name: "abusive-or-offensive-language",
    value: 2,
  },
  {
    name: "policy-violation",
    value: 3,
  },
  {
    name: "inappropriate-content",
    value: 4,
  },
  {
    name: "misleading-information",
    value: 5,
  },
];

export const type_selections = [
  {
    name: "dining",
    value: Topic.Dining,
    image: Dining,
    description: "dining-desc",
  },
  {
    name: "entertainment",
    value: Topic.Entertainment,
    image: Entertainment,
    description: "entertainment-desc",
  },
  {
    name: "accommodation",
    value: Topic.Accommodation,
    image: Accommodation,
    description: "accommodation-desc",
  },
  {
    name: "transportation",
    value: Topic.Transportation,
    image: Transportation,
    description: "transportation-desc",
  },
  {
    name: "shopping",
    value: Topic.Shopping,
    image: Shopping,
    description: "shopping-desc",
  },
  {
    name: "health",
    value: Topic.Health,
    image: Health,
    description: "health-desc",
  },
  {
    name: "other-services",
    value: Topic.OtherServices,
    image: OtherServices,
    description: "other-services-desc",
  },
];

export const formatDateTimeType = {
  DMY_HMS: "DD/MM/YYYY HH:mm:ss",
  DMY_HMS2: "DD-MM-YYYY HH:mm:ss",
  YMD_T_HMS: "YYYY-MM-DDTHH:mm:ss",
  YMD_HMS: "YYYY-MM-DD HH:mm:ss",
};

export const formatDateType = {
  DMY: "DD/MM/YYYY",
  DMY2: "DD-MM-YYYY",
  YMD: "YYYY-MM-DD",
  YDM: "YYYY-DD-MM",
};

export const formatTimeType = {
  HMS: "HH:mm:ss",
};

export const inputErrorTypes = [
  {
    id: "",
    message: "",
  },
];

export const post_guider_types = [
  {
    name: "artandculture",
    value: PostGuiderType.ArtAndCulture,
    image: ArtAndCulture,
    description: "artandculture-desc",
  },
  {
    name: "entertainment",
    value: PostGuiderType.Entertainment,
    image: Entertainment,
    description: "entertainment-desc",
  },
  {
    name: "foodanddrink",
    value: PostGuiderType.FoodAndDrink,
    image: FoodAndDrink,
    description: "foodanddrink-desc",
  },
  {
    name: "sightseeing",
    value: PostGuiderType.Sightseeing,
    image: Sightseeing,
    description: "sightseeing-desc",
  },
  {
    name: "sports",
    value: PostGuiderType.Sports,
    image: Sports,
    description: "sports-desc",
  },
  {
    name: "tours",
    value: PostGuiderType.Tours,
    image: Tours,
    description: "tours-desc",
  },
  {
    name: "wellnesss",
    value: PostGuiderType.Wellness,
    image: Wellness,
    description: "wellnesss-desc",
  },
];

export const languages = [
  {
    key: "de_DE",
    name: "German",
  },
  {
    key: "en",
    name: "English",
  },
  {
    key: "es_ES",
    name: "Spanish",
  },
  {
    key: "fr_FR",
    name: "French",
  },
  {
    key: "it_IT",
    name: "Italian",
  },
  {
    key: "ja_JP",
    name: "Japanese",
  },
  {
    key: "ko_KR",
    name: "Korean",
  },
  {
    key: "pt_PT",
    name: "Portuguese",
  },
  {
    key: "ru_RU",
    name: "Russian",
  },
  {
    key: "th_TH",
    name: "Thai",
  },
  {
    key: "vi_VN",
    name: "Vietnamese",
  },
  {
    key: "zh_CN",
    name: "Chinese",
  },
];

export const booking_guider_status = [
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
    name: "confirmed",
    icon: FaCheckCircle,
    color: "#05a569",
  },
  {
    id: 3,
    name: "completed",
    icon: MdIncompleteCircle,
    color: "#1975d3",
  },
  {
    id: 4,
    name: "cancel",
    icon: MdCancel,
    color: "#f44668",
  },
];

export const post_guider_amenities = [
  {
    label: "foods",
    value: "Foods",
    icon: IoFastFoodSharp,
    description: "foods-desc",
  },
  {
    label: "drinks",
    value: "Drinks",
    icon: RiDrinks2Fill,
    description: "drinks-desc",
  },
  {
    label: "transportation-service",
    value: "Transportation Service",
    icon: GiCaravan,
    description: "transportation-desc",
  },
  {
    label: "devices",
    value: "Devices",
    icon: MdDevicesOther,
    description: "devices-desc",
  },
  {
    label: "tickets",
    value: "Tickets",
    icon: IoTicketSharp,
    description: "tickets-desc",
  },
  {
    label: "shopping",
    value: "Shopping",
    icon: HiShoppingCart,
    description: "shopping-desc",
  },
  {
    label: "media",
    value: "Media",
    icon: MdPermMedia,
    description: "media-desc",
  },
  {
    label: "entertainment",
    value: "Entertainment",
    icon: MdAttractions,
    description: "entertainment-desc",
  },
  {
    label: "gifts",
    value: "Gifts",
    icon: FaGifts,
    description: "gifts-desc",
  },
];

export const become_guider_status = [
  {
    label: "all",
    value: null,
    icon: undefined,
    color: "#222",
  },
  {
    label: "processing",
    value: "processing",
    icon: MdPending,
    color: "#ffa700",
  },
  {
    label: "accept",
    value: "success",
    icon: FaCheckCircle,
    color: "#05a569",
  },
  {
    label: "reject",
    value: "reject",
    icon: MdCancel,
    color: "#f44668",
  },
];

export const report_status = [
  {
    label: "all",
    value: null,
    icon: undefined,
    color: "#222",
  },
  {
    label: "processing",
    value: ReportStatus.Processing,
    icon: MdPending,
    color: "#ffa700",
  },
  {
    label: "complete",
    value: ReportStatus.Complete,
    icon: FaCheckCircle,
    color: "#05a569",
  },
];

export const report_statuses = [
  {
    id: ReportStatus.Processing,
    name: "processing",
    color: "#ffa700",
    background: "#fff4ea",
  },
  {
    id: ReportStatus.Complete,
    name: "complete",
    color: "#1975d3",
    background: "#e1ebf2",
  },
];

export const report_object_types = [
  {
    name: "all",
    value: null,
  },
  {
    name: "user",
    value: ReportTypes.User,
  },
  {
    name: "vendor",
    value: ReportTypes.Vendor,
  },
  {
    name: "guider",
    value: ReportTypes.Guider,
  },
  {
    name: "place",
    value: ReportTypes.Place,
  },
  {
    name: "tour",
    value: ReportTypes.Tour,
  },
  {
    name: "post-review",
    value: ReportTypes.PostReview,
  },
  {
    name: "comment",
    value: ReportTypes.Comment,
  },
];
