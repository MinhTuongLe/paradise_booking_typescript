import { PostGuiderType } from "@/enum";
import { Topic } from "@/enum";

// Post Review
export type PostOwnerType = {
  user_name: string;
  avatar: string;
  fullname: string;
  full_name: string;
  email: string;
};

export type PostReview = {
  id: number;
  title: string;
  content: string;
  post_owner_id: number;
  lat: number;
  lng: number;
  topic: Topic;
  image: string;
  created_at: string;
  comments: CommentPostReviewType[];
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  country: string;
  state: string;
  district: string;
  post_owner: PostOwnerType;
  topic_id: Topic;
};

export type LikePostReviewType = {
  account_id: number;
  post_review_id: number;
  type: number;
};

export type CommentPostReviewItemType = {
  id: number;
  account_id: number;
  post_review_id: number;
  content: string;
  image?: string;
  video?: string;
  owner: PostOwnerType;
  date_comment: string;
};

export type CommentPostReviewType = {
  id: number;
  account_id: number;
  post_review_id: number;
  content: string;
  image?: string;
  video?: string;
  reply_comments: CommentPostReviewItemType[];
  owner: PostOwnerType;
  date_comment: string;
};

export type CommentType = {
  account_id: number;
  post_review_id: number;
  content: string;
  image?: string;
  video?: string;
};

export type ReplyCommentType = {
  account_id: number;
  source_comment_id: number;
  content: string;
  image?: string;
  video?: string;
};

// Post Guider
export type PostGuider = {
  id: number;
  post_owner_id: number;
  post_owner: PostOwnerType;
  topic_id: PostGuiderType;
  topic_name: string;
  title: string;
  description: string;
  cover: string;
  lat: number;
  lng: number;
  location: PostGuiderLocation;
  address: string;
};

export type PostGuiderLocation = {
  country: string;
  state: string;
  district: string;
};

export type UpdatePostGuiderDataSubmit = {
  topic_id: PostGuiderType | undefined;
  title: string | undefined;
  description: string | undefined;
  cover: string | undefined;
  lat: number | undefined;
  lng: number | undefined;
  address: string | undefined;
};
