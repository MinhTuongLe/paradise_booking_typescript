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
import { PostGuiderType, Topic } from "./enum";
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

export const key = "374f5e650a354f30bb9b71e07e9fd4bb";
export const endpoint = "https://leminhtuong091202.openai.azure.com/";
export const client = new OpenAIClient(endpoint, new AzureKeyCredential(key));
export const deploymentName = "ParadiseBookingApp";

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
    description:
      "Cung cấp các bữa ăn đa dạng và đặc sản địa phương trong suốt hành trình du lịch. Dịch vụ bao gồm nhà hàng, quán ăn và giao hàng tận nơi.",
  },
  {
    label: "drinks",
    value: "Drinks",
    icon: RiDrinks2Fill,
    description:
      "Cung cấp các loại đồ uống đặc sản địa phương và đồ uống giải khát. Dịch vụ bao gồm cả quán cà phê, quán bar và giao hàng tận nơi.",
  },
  {
    label: "transportation-service",
    value: "Transportation Service",
    icon: GiCaravan,
    description:
      "Đảm bảo phương tiện di chuyển an toàn và thuận tiện như xe buýt, xe công nghệ và thuê xe tự lái. Dịch vụ hỗ trợ đưa đón khách tại các điểm du lịch.",
  },
  {
    label: "devices",
    value: "Devices",
    icon: MdDevicesOther,
    description:
      "Cho thuê và bán các thiết bị hỗ trợ du lịch như máy ảnh, thiết bị GPS và sạc dự phòng. Dịch vụ bao gồm cả hướng dẫn sử dụng và hỗ trợ kỹ thuật.",
  },
  {
    label: "tickets",
    value: "Tickets",
    icon: IoTicketSharp,
    description:
      "Cung cấp vé tham quan các điểm du lịch, vé xem các buổi biểu diễn và vé tàu, xe cho hành trình du lịch. Đảm bảo sự tiện lợi và dễ dàng cho du khách.",
  },
  {
    label: "shopping",
    value: "Shopping",
    icon: HiShoppingCart,
    description:
      "Dẫn du khách tới các khu mua sắm nổi tiếng và chợ địa phương. Đảm bảo trải nghiệm mua sắm thú vị và tiện lợi.",
  },
  {
    label: "media",
    value: "Media",
    icon: MdPermMedia,
    description:
      "Cung cấp thông tin du lịch, hướng dẫn viên ảo và các ứng dụng hỗ trợ du lịch. Đảm bảo du khách cập nhật thông tin nhanh chóng và chính xác.",
  },
  {
    label: "entertainment",
    value: "Entertainment",
    icon: MdAttractions,
    description:
      "Cung cấp các hoạt động giải trí như xem phim, tham gia công viên giải trí và các buổi biểu diễn văn hóa. Đảm bảo du khách có những trải nghiệm vui vẻ và đáng nhớ.",
  },
  {
    label: "gifts",
    value: "Gifts",
    icon: FaGifts,
    description:
      "Cung cấp quà lưu niệm và đặc sản địa phương cho du khách mua làm quà. Đảm bảo mang đến những món quà ý nghĩa và độc đáo.",
  },
];
