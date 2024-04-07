export type PostReview = {
    id: number
    title: string
    content: string
    post_owner_id: number
    lat: number
    lng: number
    topic: string
    image: string
    created_at: string
    comments: CommentPostReviewType[]
}

export type LikePostReviewType = {
    account_id: number
    post_review_id: number
    type: number
}

export type CommentPostReviewType = {
    account_id: number
    post_review_id: number
    content: string
    image?: string
    video?: string
}