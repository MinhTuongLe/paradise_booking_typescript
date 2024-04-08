export type PostReview = {
  id: number;
  title: string;
  content: string;
  post_owner_id: number;
  lat: number;
  lng: number;
  topic: string;
  image: string;
  created_at: string;
  comments: CommentPostReviewType[];
  like_count: number
  comment_count: number
  is_liked: boolean
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
};

export type CommentPostReviewType = {
  account_id: number;
  post_review_id: number;
  content: string;
  image?: string;
  video?: string;
  reply_comments: CommentPostReviewItemType[];
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
