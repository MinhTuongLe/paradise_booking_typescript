export enum RouteKey {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  VerifyResetPassword,
  Profile,
  ChangeStatus,
  AccountRole,
  Accounts,
  PaymentList,
  Places,
  PlaceList,
  PlaceDetails,
  PlaceListByOwner,
  UserDetails,
  ChangePassword,
  PostReviews,
  PostReviewList,
  PostReviewListByUser,
  PostReviewDetails,
  AccountDetails,
  Bookings,
  BookingDetails,
  BookingList,
  UploadImage,
  PlacesDatesBooked,
  PlaceAmenities,
  PlacePolicies,
  PlaceCheckDateAvailable,
  PlaceStatusBooking,
  CancelBooking,
  BookingListManageReservation,
  Amenities,
  AmenitiesConfig,
  AmenitiesPlaceRemove,
  Policies,
  LikePostReview,
  CommentPostReview,
  ReplyCommentPostReview,
  DeleteCommentPostReview,
  DeleteReplyCommentPostReview,
  PostReviewComments,
  ConfirmBooking,
  PlaceWishlists,
  Wishlists,
  WishlistsByUser,
  WishlistPlaceList,
  WishlistDetails,
  DeleteWishlistPlace,
  BookingRatings,
  BookingRatingsByReservation,
  BookingRatingsByUser,
  BookingRatingsByPlace,
  BookingRatingsStatistic,
  PostGuiders,
  PostGuiderList,
  PostGuiderDetails,
  CalendarGuider,
  CalendarGuiderList,
}

export const apiRoutes = [
  {
    name: RouteKey.Login,
    path: "/login",
  },
  {
    name: RouteKey.Register,
    path: "/register",
  },
  {
    name: RouteKey.Profile,
    path: "/profile",
  },

  {
    name: RouteKey.ForgotPassword,
    path: "/forgot/password",
  },

  {
    name: RouteKey.VerifyResetPassword,
    path: "/verify_reset_password",
  },

  {
    name: RouteKey.ResetPassword,
    path: "/reset/password",
  },

  {
    name: RouteKey.ChangeStatus,
    path: "/change/status",
  },
  {
    name: RouteKey.AccountRole,
    path: "/account/role/:accountId",
  },
  {
    name: RouteKey.Accounts,
    path: "/accounts",
  },

  {
    name: RouteKey.UserDetails,
    path: "/profile/:userId",
  },
  {
    name: RouteKey.ChangePassword,
    path: "/change/password",
  },

  {
    name: RouteKey.PaymentList,
    path: "/payments/list_by_vendor",
  },
  {
    name: RouteKey.Places,
    path: "/places",
  },
  {
    name: RouteKey.PlaceList,
    path: "/places/list",
  },
  {
    name: RouteKey.PlaceListByOwner,
    path: "/places/owner/:vendor_id",
  },
  {
    name: RouteKey.PlaceDetails,
    path: "/places/:listingId",
  },
  {
    name: RouteKey.PostReviews,
    path: "/post_reviews",
  },
  {
    name: RouteKey.PostReviewList,
    path: "/post_reviews/list",
  },
  {
    name: RouteKey.PostReviewListByUser,
    path: "/post_reviews/list/:userId",
  },
  {
    name: RouteKey.PostReviewDetails,
    path: "/post_reviews/:postReviewId",
  },

  {
    name: RouteKey.AccountDetails,
    path: "/account/:accountId",
  },
  {
    name: RouteKey.Bookings,
    path: "/bookings",
  },
  {
    name: RouteKey.BookingDetails,
    path: "/bookings/:reservationId",
  },
  {
    name: RouteKey.BookingList,
    path: "/booking_list",
  },
  {
    name: RouteKey.UploadImage,
    path: "/upload",
  },
  {
    name: RouteKey.PlacesDatesBooked,
    path: "/places/dates_booked",
  },
  {
    name: RouteKey.PlaceAmenities,
    path: "/amenities/place/:listingId",
  },
  {
    name: RouteKey.PlacePolicies,
    path: "/policies/:listingId",
  },
  {
    name: RouteKey.PlaceCheckDateAvailable,
    path: "/places/check_date_available",
  },
  {
    name: RouteKey.CancelBooking,
    path: "/cancel_booking",
  },
  {
    name: RouteKey.BookingListManageReservation,
    path: "/bookings_list/manage_reservation",
  },
  {
    name: RouteKey.Amenities,
    path: "/amenities",
  },
  {
    name: RouteKey.AmenitiesConfig,
    path: "/amenities/config",
  },
  {
    name: RouteKey.AmenitiesPlaceRemove,
    path: "/amenities/place/remove",
  },
  {
    name: RouteKey.Policies,
    path: "/policies",
  },
  {
    name: RouteKey.LikePostReview,
    path: "/like_post_reviews",
  },
  {
    name: RouteKey.CommentPostReview,
    path: "/post_review/comment",
  },
  {
    name: RouteKey.ReplyCommentPostReview,
    path: "/reply_comments",
  },
  {
    name: RouteKey.DeleteCommentPostReview,
    path: "/comments/:commentId",
  },
  {
    name: RouteKey.DeleteReplyCommentPostReview,
    path: "/reply_comments/:replyCommentId",
  },
  {
    name: RouteKey.PostReviewComments,
    path: "/comments/:postReviewId",
  },
  {
    name: RouteKey.ConfirmBooking,
    path: "/confirm_booking",
  },
  {
    name: RouteKey.PlaceWishlists,
    path: "/place_wish_lists",
  },
  {
    name: RouteKey.Wishlists,
    path: "/wish_lists",
  },
  {
    name: RouteKey.WishlistDetails,
    path: "/wish_lists/:wishlistId",
  },
  {
    name: RouteKey.WishlistPlaceList,
    path: "/place_wish_lists/place",
  },
  {
    name: RouteKey.WishlistsByUser,
    path: "/wish_lists/user/:userId",
  },
  {
    name: RouteKey.DeleteWishlistPlace,
    path: "/place_wish_lists/:listingId/:wishlistId",
  },
  {
    name: RouteKey.BookingRatings,
    path: "/booking_ratings",
  },
  {
    name: RouteKey.BookingRatingsByReservation,
    path: "/booking_ratings/bookings/:reservationId",
  },
  {
    name: RouteKey.BookingRatingsByUser,
    path: "/booking_ratings/vendors/:userId",
  },
  {
    name: RouteKey.BookingRatingsByPlace,
    path: "/booking_ratings/places/:listingId",
  },
  {
    name: RouteKey.BookingRatingsStatistic,
    path: "/booking_ratings/statistics/:listingId",
  },
  {
    name: RouteKey.PostGuiders,
    path: "/post_guides",
  },
  {
    name: RouteKey.PostGuiderList,
    path: "/post_guides/list",
  },
  {
    name: RouteKey.PostGuiderDetails,
    path: "/post_guides/:postGuiderId",
  },
  {
    name: RouteKey.CalendarGuider,
    path: "/calendar_guiders",
  },
  {
    name: RouteKey.CalendarGuiderList,
    path: "/calendar_guiders/list",
  },
];
