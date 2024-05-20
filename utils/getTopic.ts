import { type_selections } from "@/const";
import { Topic } from "@/enum";

export const getTopicName = (value: Topic) =>
  type_selections.filter((item) => item.value === value)[0].name;

export const getTopicImage = (value: Topic) =>
  type_selections.filter((item) => item.value === value)[0].image;

export const getTopicDescription = (value: Topic) =>
  type_selections.filter((item) => item.value === value)[0].description;
