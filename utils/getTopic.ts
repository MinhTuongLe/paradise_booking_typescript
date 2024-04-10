import { Topic, type_selections } from "@/const";

export const getTopicValue = (value: Topic) =>
  type_selections.filter((item) => item.value === value)[0].value;
