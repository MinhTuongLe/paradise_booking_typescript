import { post_guider_types } from "@/const";
import { PostGuiderType } from "@/enum";

export const getPostGuiderTypeValue = (value: PostGuiderType) =>
  post_guider_types.filter((item) => item.value === value)[0].value;

export const getPostGuiderTypeName = (value: PostGuiderType) =>
  post_guider_types.filter((item) => item.value === value)[0].name;

export const getPostGuiderTypeImage = (value: PostGuiderType) =>
  post_guider_types.filter((item) => item.value === value)[0].image;

export const getPostGuiderTypeDescription = (value: PostGuiderType) =>
  post_guider_types.filter((item) => item.value === value)[0].description;
