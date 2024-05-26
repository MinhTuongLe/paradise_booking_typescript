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
  Guider = 4,
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

export enum PostGuiderType {
  ArtAndCulture = 1,
  Entertainment = 2,
  FoodAndDrink = 3,
  Sports = 4,
  Tours = 5,
  Sightseeing = 6,
  Wellness = 7,
}

export enum AddNewPostGuiderStep {
  LOCATION = 1,
  INFO = 2,
  TOPIC = 3,
  IMAGES = 4,
}

export enum LoginType {
  NormalLogin = 1,
  GoogleLogin = 2,
}

export enum FormType {
  Create = 1,
  Update = 2,
}

export enum BookingGuiderStatus {
  Pending = 1,
  Confirmed = 2,
  Completed = 3,
  Cancel = 4,
}

export enum BookingRatingType {
  BookingRatingTypePlace = 1,
  BookingRatingTypeGuide = 2,
}

export enum BecomeGuiderStatus {
  Processing = "processing",
  Success = "success",
  Reject = "reject",
}

export enum RequestGuiderType {
  Accept = 1,
  Reject = 2,
}

export enum AmenityType {
  Place = 1,
  PostGuide = 2,
}
