import { m } from "framer-motion";

const enJSON = {
  general: {
    id: "Id",
    username: "Username",
    fullname: "Fullname",
    role: "Role",
    status: "Status",
    address: "Address",
    phone: "Phone",
    dob: "Dob",
    user: "User",
    vendor: "Vendor",
    admin: "Admin",
    guests: "Guests",
    beds: "Beds",
    bedrooms: "Bedrooms",
    cancel: "Cancel",
    save: "Save",
    unauthorized: "Unauthorized",
    "please-login": "Please login",
    "no-data-to-display": "No data to display.",
    "create-new": "Create new",
    place: "Place",
    "booking-id": "Booking ID",
    created: "Created",
    amount: "Amount",
    method: "Method",
    search: "Search",
    clear: "Clear",
    days: "Days",
    "any-week": "Any Week",
    anywhere: "Anywhere",
    filter: "Filter",
    comments: "Comments",
    "show-more-comments": "Show more comments",
    "no-comment-to-display": "No comment to display",
    rooms: "Rooms",
    "show-more-rooms": "Show more rooms",
    email: "E-mail",
    property: "property",
    description: "Description",
    update: "Update",
    from: "From",
    to: "To",
    name: "Name",
    reservation: "reservation",
    "clear-all": "Clear All",
    send: "Send",
    guest: "Guest",
    details: "Details",
    "uh-oh": "Uh Oh",
    "something-went-wrong": "Something went wrong!",
    "price-range": "Price Range",
    password: "Password",
    create: "Create",
    title: "Title",
    successfully: "Successfully",
    failed: "Failed",
    note: "Note",
    calendar: "Calendar",
  },
  "booking-status": {
    all: "All",
    pending: "Pending",
    successful: "Successful",
    checkin: "Checkin",
    checkout: "Checkout",
    completed: "Completed",
    cancel: "Cancel",
    confirmed: "Confirmed",
  },
  roles: {
    user: "user",
    vendor: "Vendor",
    admin: "Admin",
    guider: "Guider",
  },
  offers: {
    "garden-view": "Garden view",
    "hot-water": "Hot water",
    wifi: "Wifi",
    coffee: "Coffee",
    "security-cameras-on-property": "Security cameras on property",
    bathtub: "Bathtub",
    "dedicated-workspace": "Dedicated workspace",
    safe: "Safe",
    "free-parking-on-premises": "Free parking on premises",
    "fire-extinguisher": "Fire extinguisher",
  },
  "report-types": {
    "fraud-or-fake-information": "Fraud or Fake Information",
    "harassment-or-threats": "Harassment or Threats",
    "policy-violation": "Policy Violation",
    "identity-theft": "Identity Theft",
    "illegal-activities": "Illegal Activities",
    "unresponsive-or-irresponsible": "Unresponsive or Irresponsible",
    "content-that-is-dishonest-or-inaccurate":
      "Content that is Dishonest or Inaccurate",
    "this-place-vendor-is-not-real": "This Place/Vendor is Not Real",
    "it-s-a-scam": "It's a Scam",
    "offensive-content": "Offensive Content",
    "other-problems": "Other Problems",
    "place-does-not-meet-standards": "Place Does Not Meet Standards",
    "legal-violations": "Legal Violations",
    discrimination: "Discrimination",
    "amenities-or-services-not-as-advertised":
      "Amenities or Services Not as Advertised",
    "inaccurate-information": "Inaccurate Information",
    "service-does-not-meet-expectations": "Service Does Not Meet Expectations",
    "safety-concerns": "Safety Concerns",
    "unprofessional-guide": "Unprofessional Guide",
    "unclear-pricing": "Unclear Pricing",
    spam: "Spam",
    "abusive-or-offensive-language": "Abusive or Offensive Language",
    "inappropriate-content": "Inappropriate Content",
    "misleading-information": "Misleading Information",
  },
  "type-selections": {
    dining: "Dining",
    "dining-desc":
      "Discover local and international restaurants with typical dishes.",
    entertainment: "Entertainment",
    "entertainment-desc":
      "Looking for entertainment activities such as cinemas, events and parks.",
    accommodation: "Accommodation",
    "accommodation-desc":
      "Searching and booking hotel, apartment, homestay and motel worldwide.",
    transportation: "Transportation",
    "transportation-desc":
      "Book bus tickets, train, airport shuttle and car rental service.",
    shopping: "Shopping",
    "shopping-desc": "Discover local shops and rich shopping centers.",
    health: "Health",
    "health-desc":
      "Looking for medical services such as hospitals, clinics and gyms.",
    "other-services": "Other Services",
    "other-services-desc":
      "Discover other special services such as spa, tour and renting.",
  },
  "post-guider-types": {
    artandculture: "Art And Culture",
    "artandculture-desc": "Explore artistic and cultural experiences.",
    entertainment: "Entertainment",
    "entertainment-desc": "Enjoy entertaining activities and events.",
    foodanddrink: "Food And Drink",
    "foodanddrink-desc": "Discover culinary delights and beverages.",
    sightseeing: "Sightseeing",
    "sightseeing-desc": "Explore scenic views and landmarks.",
    sports: "Sports",
    "sports-desc": "Engage in sports and outdoor activities.",
    tours: "Tours",
    "tours-desc": "Embark on guided tours and adventures.",
    wellnesss: "Wellnesss",
    "wellnesss-desc": "Focus on health and well-being.",
  },
  "account-status": {
    inactive: "Inactive",
    active: "Active",
  },
  "payment-status": {
    unpaid: "Unpaid",
    paid: "Paid",
  },
  "place-status": {
    all: "All",
    empty: "Empty",
    reserved: "Reserved",
  },
  navbar: {
    "paradise-your-home": "Paradise your Home",
    "my-reservations": "My reservations",
    "my-wishlist": "My wishlist",
    "my-properties": "My properties",
    payments: "Payments",
    statistics: "Statistics",
    "my-post-reviews": "My Post Reviews",
    "my-booked-guiders": "My Booked Guiders",
    "my-post-guiders": "My Post Guiders",
    "my-profile": "My Profile",
    "change-password": "Change Password",
    logout: "Logout",
    login: "Login",
    register: "Register",
    accommodation: "Accommodation",
    "post-reviews": "Post reviews",
    "post-guiders": "Post guiders",
    accounts: "Accounts",
    requests: "Requests",
    reports: "Reports",
    assistant: "Assistant",
    "general-settings": "General settings",
    "my-assets": "My assets",
    "my-bookings": "My bookings",
    "my-revenue": "My revenue",
  },
  "account-feature": {},
  "change-password-feature": {
    "change-password": "Change password",
    "current-password": "Current password",
    "new-password": "New password",
    "confirm-password": "Confirm password",
  },
  "wishlist-feature": {
    "your-wishlist": "Your wishlist",
    "list-of-your-wishlist":
      "List of things you want to own or experience in the future!",
    "no-wishlist-to-display": "You don't have any wishlist to display",
    "create-a-new-one": "Create a new one",
    "list-of-places-in-your-wishlist": "List of places in your wishlist!",
    "delete-place": "Delete place",
  },
  "payment-feature": {},
  "post-reviews-feature": {
    "post-reviews-by-topics": "Post Reviews By Topics",
    "post-reviews-by-topics-desc":
      "Reviews about catering, entertainment and other things",
    "what-are-you-thinking": "What are you thinking?",
    "share-your-memorable-moments-here": "Share your memorable moments here",
    "no-post-review-found": "No Post Review found",
    "immediately-add-your-first-experience":
      "Immediately add your first experience",
  },
  "user-feature": {
    "your-bio": "Your Bio",
    "add-your-bio-here": "Add your bio here ...",
    "email-verification": "E-mail Verification",
    "verified-information": "verified Information",
    "your-verified-information": "Your verified Information",
    "profile-verification": "Profile Verification",
    "need-verification":
      "You need to verify the above information if you want to start listing your place for rent.",
    "become-a-vendor": "Become A Vendor",
    "become-a-guider": "Become A Guider",
    "report-this-vendor": "Report this vendor",
    "report-this-guider": "Report this guider",
    "profile-settings": "Profile Settings",
    profile: "Profile",
    "edit-profile": "Edit profile",
    about: "About",
    "profile-desc":
      "Your Paradise profile is an important part of every booking/reservation. Create a profile to help other Hosts/Hosts and guests learn about you.",
    "create-profile": "Create profile",
    "receive-comments": "Receive comments",
    "view-profile": "View profile",
    "show-more-post": "Show more post",
  },
  "property-feature": {
    properties: "Properties",
    "list-of-your-properties": "List of your properties",
    "search-place-id": "Search Place ID...",
    "check-available": "Check Available",
    "delete-property": "Delete property",
    "no-properties-found": "No Properties found",
    "empty-properties": "Looks like you have not any Properties",
    "general-information": "General Information",
    "amenities-information": "Amenities Information",
    "policies-information": "Policies Information",
    "max-guests": "Max Guest(s)",
    "price-per-night": "Price per Night",
    "amenities-settings": "Amenities Settings",
    "policies-settings": "Policies Settings",
    beds: "Bed(s)",
    bedrooms: "Bedroom(s)",
    "district-state-and-country": "District, State and Country",
    "total-price": "Total Price",
    "user-information": "User information",
    guestname: "Guestname",
    "content-from": "Content from",
    "booked-on": "Booked on",
    "payment-method": "Payment method",
    "property-rules": "Property Rules",
    "checkin-time": "Checkin Time",
    "checkout-time": "Checkout Time",
    "safe-rules": "Safe rules",
    content: "Content ...",
    "cancel-rules": "Cancel rules",
  },
  "reservation-feature": {
    reservations: "Reservations",
    "your-reservation-list": "Your reservation list",
    "reservation-status": "Reservation status",
    "empty-reservation": "You don't have any reservation to display",
    "booking-now": "Booking now",
    title: "Title...",
    "leave-contents": "Please leave your contents so we can improve",
    "express-satisfaction": "Express your level of satisfaction in stars",
    "content-to-vendor": "Content to vendor",
    "place-details": "Place Details",
    "booking-successfully":
      "Booking Successfully! Please check your email in 1 day to confirm.",
    "reservation-details": "Reservation Details",
  },
  "post-guider-feature": {
    "create-interesting-trips": "Create interesting trips",
    "add-a-photo-of-your-post": "Add a photo of your post",
    "tell-guests-what-the-place-youre-headed-to-looks-like":
      "Tell guests what the place you're headed to looks like",
    "select-your-tour-topic": "Select your tour topic",
    "what-is-the-purpose-of-the-trip-you-organize":
      "What is the purpose of the trip you organize",
    "share-some-basics-about-your-trip": "Share some basics about your trip",
    "share-your-trip-description": "Share your trip description",
    "the-place-will-become-a-place-for-your-trip":
      "The place will become a place for your trip",
    "help-guest-can-consider": "Help guest can consider",
    "post-guiders": "Post Guiders",
    "list-of-your-post-guiders": "List of your post guiders",
    "delete-post": "Delete post",
    "schedule-settings": "Schedule Settings",
    "schedule-information": "Schedule Information",
    "new-post-guiders": "New Post Guiders",
    "guiders-will-tell-you-the-information":
      "Guiders will tell you the information about them to make your trip more attractive",
    "calendar-information": "Calendar Information",
    "price-per-person": "Price per Person",
    free: "Free",
    person: "person",
    "for-up-to": "For up to",
    schedule: "Schedule",
    "trip-schedule": "Trip schedule",
    "schedule-desc":
      "Please describe in detail the trip itinerary you are aiming for",
    "itinerary-planning-hosted-by": "Itinerary planning hosted by",
    "things-you-will-do": "Things you will do",
    "you-will-receive": "You will receive",
    "meet-your-organizer": "Meet your organizer",
    "organize-experience-on-paradise-since":
      "Organize experience on Paradise since",
    "has-verified-identity": "Has verified identity",
    "hello-im": "Hello, I'm",
    "this-post-guider": "this post's guider",
    choose: "Choose",
    "ratings-by-clients-desc":
      "One of Paradise's favorite post based on ratings, reviews and trust",
    by: "By",
    "report-this-guider": "Report this Guider",
    with: "With",
    "post-guider-details": "Post Guider Details",
    "content-to-guider": "Content to guider",
    "booked-guider": "booked guider",
    "booked-guiders": "Booked guiders",
    "your-booked-guiders-list": "Your booked guiders list",
    "booked-guiders-status": "Booked guiders status",
    "reservation-details": "Booking details",
    "guide-by": "Guide by",
    "all-experiences": "All experiences",
    "no-calendar-to-booking": "No calendar to booking",
    "things-to-know": "Things to know",
    "guest-requirements": "Guest Requirements",
    "cancellation-policy": "Cancellation Policy",
    "items-should-be-carried": "Items Should Be Carried",
    "confirm-and-pay": "Confirm and Pay",
    "this-experience-is-held-in": "This experience is held in",
    "make-sure-right-language":
      "Make sure it is the right language for you before booking.",
    "no-people": "No People",
    "contact-to-guider": "Contact to guider",
    for: "For",
    people: "people",
    "display-a-list-of-the-entire-schedule":
      "Displays a list of the entire schedule for users to choose from.",
    "schedules-are-not-organized-with-individual-groups":
      "Schedules are not organized with individual groups to build good relationships between people.",
    "booking-now": "Booking Now",
  },
  components: {
    "click-to-upload": "Click to upload",
    delete: "Delete",
    night: "Night",
    "hosted-by": "Hosted by",
    "learn-more": "Learn more",
    "listing-info-desc":
      "Every booking includes free protection from Host cancellations, listing inaccuracies, and other issues like trouble checking in.",
    share: "Share",
    "copy-link": "Copy link",
    total: "Total",
    "check-availability": "Check Availability",
    reserve: "Reserve",
    "show-all": "Show all",
    "no-comment-to-display": "No comment to display",
    "ratings-by-clients": "Ratings by clients",
    "ratings-by-clients-desc":
      "One of Paradise's favorite places based on ratings, reviews and trust",
    "forgot-password": "Forgot password",
    "continue-with-google": "Continue with Google",
    "not-have-an-account": "Didn't have an Account?",
    "create-an-account": "Create an Account",
    continue: "Continue",
    "welcome-back": "Welcome Back",
    "login-desc": "Login to your Account!",
    "send-code": "Send Code",
    verify: "Verify",
    "reset-password": "Reset Password",
    "reset-your-password": "Reset your password",
    "login-here": "Login here",
    "new-password": "New Password",
    "confirm-password": "Confirm Password",
    "secret-code": "Secret Code",
    "welcome-to-paradise": "Welcome to Paradise",
    "already-have-an-account": "Already have an account?",
    "where-do-you-wanna-go": "Where do you wanna go?",
    "find-the-perfect-location": "Find the perfect location!",
    location: "Location",
    "when-do-you-plan-to-go": "When do you plan to go?",
    "make-sure-everyone-is-free": "Make sure everyone is free!",
    "more-information": "More information",
    "find-your-perfect-place": "Find your perfect place!",
    "how-many-guests-are-coming": "How many guests are coming?",
    "how-many-beds-per-room-do-you-need": "How many beds per room do you need?",
    "price-range-you-want": "Price range you want",
    "find-an-expense-that-right-for-you":
      "Find an expense that's right for you!",
    "create-new-wishlist": "Create new wishlist",
    "empty-wishlist": "You don't have any wishlist",
    "add-to-your-wishlist": "Add to your wishlist",
    "all-rooms-of": "All Rooms of",
    summary: "Summary",
    comments: "comments",
    "are-you-sure-to-delete-this": "Are you sure to delete this",
    "are-you-sure-to-cancel-this": "Are you sure to cancel this",
    post: "Post",
    next: "Next",
    back: "Back",
    update: "update",
    "select-post-type": "Select post type",
    "what-are-you-thinking-about-it": "What are you thinking about?",
    "add-to-your-post": "Add to your post",
    "what-type-of-your-post": "What type of your post?",
    "choose-for-it-a-suitable-type":
      "Choose for it a suitable type in the categories below",
    "where-is-your-place-located": "Where is your place located?",
    "help-guests-find-you": "Help guests find you!",
    "add-your-new-post-review": "Add your new post review",
    "edit-your-post-review": "Edit your post review",
    "choose-your-post-review-category": "Choose your post review category",
    "now-set-your-description": "Now, set your description",
    "what-is-your-place-description": "What is your place description?",
    "add-a-photo-of-your-place": "Add a photo of your place",
    "show-guests-what-your-place-looks-like":
      "Show guests what your place looks like!",
    "create-your-new-place": "Create your new place",
    "share-your-room-to-us": "Share your room to us",
    "share-some-information":
      "Share some information such as the location, capacity of your rent room",
    "make-your-room-outstanding": "Make your room outstanding",
    "add-an-outstanding-image-with-title-and-description":
      "Add an outstanding image with title and description",
    "finish-and-post": "Finish and post",
    "select-options-your-want-and-post": "Select options your want and post",
    "share-some-basics-about-your-place": "Share some basics about your place",
    "what-do-you-have": "What do you have?",
    "how-many-guest-do-you-allow": "How many guest do you allow?",
    "how-many-beds-do-you-have": "How many beds do you have?",
    "how-many-bedrooms-in-your-place": "How many bedrooms in your place?",
    "how-many-available-rooms-in-your-place":
      "How many available rooms in your place?",
    "available-rooms": "Available rooms",
    "properties-filter-by-date-range": "Properties Filter By Date Range",
    rooms: "rooms",
    original: "Original",
    booked: "Booked",
    remain: "Remain",
    "booking-history": "Booking History",
    "enter-data-to-filter": "Enter data to filter",
    wishlist: "wishlist",
    saved: "Saved",
    items: "item(s)",
    comment: "comment",
    "post-review": "post review",
    "edit-this-post": "Edit this post",
    "delete-this-post": "Delete this post",
    at: "At",
    like: "Like",
    "show-all-comments": "Show all comments",
    "hide-all-comments": "Hide all comments",
    "give-your-comment": "Give your comment ...",
    loading: "Loading ...",
    min: "Min",
    max: "Max",
    reply: "Reply",
    remove: "Remove",
    "see-details": "See details",
    "report-this-room": "Report this place",
    "where-you-ll-be": "Where you’ll be",
    "things-to-know": "Things to know",
    "house-rules": "House rules",
    "checkin-after": "Checkin after",
    "checkout-before": "Checkout before",
    maximum: "Maximum",
    "finish-your-booking": "Finish your booking",
    "your-booking-info": "Your booking info",
    "booking-for-myself": "Booking for myself",
    "booking-for-other": "Booking for other",
    "guest-name": "Guest Name",
    "payment-information": "Payment information",
    date: "Date",
    "place-max-guests": "Place max guest(s)",
    "contact-to-vendor": "Contact to vendor",
    "general-rule": "General rule",
    "we-ask-all-guests-to-remember":
      "We ask all guests to remember a few simple rules to be a great guest.",
    "comply-with-house-rules": "Comply with house rules",
    "maintain-the-house": "Maintain the house as if it were your home",
    "your-reservation-will-not-be-confirmed":
      "Your reservation will not be confirmed until the host/organizer accepts your request (within 24 hours).",
    "you-will-not-be-charged-until-then": "You will not be charged until then.",
    reservation: "Reservation",
    room: "Room",
    "price-details": "Price details",
    "service-fee": "Service fee",
    guests: "guest(s)",
    submit: "Submit",
    "all-post-of": "All post of",
    add: "Add",
    "no-options-available": "No options available",
    "no-data": "No data",
    "no-data-to-display": "No data to display",
    "my-booked-calendar": "My Booked Calendar",
    "no-calendar-booked-at-this-post": "No calendar booked at this post",
    report: "Report",
    "enter-details": "Please describe details",
    "why-report-place": "Why do you report this place?",
    "why-report-post-guide": "Why do you report this post-guide?",
    "why-report-account": "Why do you report this account?",
    "why-report-comment": "Why do you report this comment?",
    "report-not-shared-with-vendor": "This report isn't shared with vendor",
    "report-not-shared-with-guider": "This report isn't shared with guider",
    "report-not-shared-with-user": "This report isn't shared with user",
    "report-not-shared-with-owner": "This report isn't shared with owner",
    "describe-report-reason": "Describe details your report reason",
  },
  footer: {
    about: "ABOUT",
    newsroom: "Newsroom",
    "learn-about-new-features": "Learn about new features",
    "letter-from-our-founders": "Letter from our founders",
    careers: "Careers",
    investors: "Investors",
    support: "Support",
    "help-center": "Help Center",
    paradisecover: "ParadiseCover",
    "cancellation-options": "Cancellation options",
    "safety-information": "Safety information",
    "report-a-neighborhood-concern": "Report a neighborhood concern",
    community: "Community",
    hosting: "Hosting",
    "try-hosting": "Try hosting",
    "paradisecover-for-hosts": "ParadiseCover for Hosts",
    "explore-hosting-resources": "Explore hosting resources",
    "how-to-host-responsibly": "How to host responsibly",
  },
  toast: {
    "passwords-not-match": "Passwords not match",
    "change-password-successfully": "Change password successfully",
    "change-password-failed": "Change password failed",
    "please-enter-your-address": "Please enter your address",
    "create-place-successfully": "Create place successfully",
    "create-place-failed": "Create place failed",
    "uploading-photo-successfully": "Uploading photo successfully",
    "uploading-photo-failed": "Uploading photo failed",
    "copy-successfully": "Copy successfully",
    "add-place-to-wishlist": "Add place to wishlist",
    "this-place-is-now-in-this-wishlist": "This place is now in this wishlist",
    "update-wishlist-title-successfully": "Update wishlist title successfully",
    "update-wishlist-title-failed": "Update wishlist title failed",
    "delete-wishlist-successfully": "Delete wishlist successfully",
    "delete-wishlist-failed": "Delete wishlist failed",
    "feedback-successfully": "Feedback successfully",
    "feedback-failed": "Feedback failed",
    "update-profile-successfully": "Update profile successfully",
    "update-profile-failed": "Update profile failed",
    "comment-is-not-blank": "Comments is not blank",
    "update-place-successfully": "Update place successfully",
    "update-place-failed": "Update place failed",
    "delete-place-successfully": "Delete place successfully",
    "delete-place-failed": "Delete place failed",
    "comment-failed": "Comment failed",
    "delete-comment-failed": "Delete comment failed",
    "login-failed-with-google": "Login failed with Google",
    "date-range-is-invalid": "Date range is invalid",
    "register-successfully":
      "Register Successfully. Check your email to confirm your registration",
    "delete-post-review-successfully": "Delete post review successfully",
    "delete-post-review-failed": "Delete post review failed",
    "update-booking-status-successfully": "Update booking status successfully",
    "update-booking-status-failed": "Update booking status failed",
    "update-amenities-successfully": "Update amenities successfully",
    "update-amenities-failed": "Update amenities failed",
    "update-policies-successfully": "Update policies successfully",
    "update-policies-failed": "Update policies failed",
    "booking-failed": "Booking failed",
    "this-place-is-not-available-on-the-dates-you-selected":
      "This place is not available on the dates you selected",
    "create-new-wishlist-successfully": "Create new wishlist successfully",
    "create-new-wishlist-failed": "Create new wishlist failed",
    "update-post-review-successfully": "Update post review successfully",
    "update-post-review-failed": "Update post review failed",
    "please-upload-image-to-describe":
      "Please upload image to describe your experience",
    "create-post-review-successfully": "Create post review successfully",
    "create-post-review-failed": "Create post review failed",
    "check-your-email-to-get-reset-password-code":
      "Check your email to get reset password code",
    "verify-successfully": "Verify successfully",
    "verify-failed": "Verify failed",
    "reset-password-successfully": "Reset password successfully",
    "reset-password-failed": "Reset password failed",
    "update-account-status-successfully": "Update account status successfully",
    "update-account-status-failed": "Update account status failed",
    "update-account-role-successfully": "Update account role successfully",
    "update-account-role-failed": "Update account role failed",
    "this-reservation-is-processing":
      "Delete failed. This reservation is processing",
    "cancel-reservation-successfully": "Cancel reservation successfully",
    "cancel-reservation-failed": "Cancel reservation failed",
    "delete-reservation-successfully": "Delete reservation successfully",
    "delete-reservation-failed": "Delete reservation failed",
    "create-post-guider-successfully": "Create post guider successfully",
    "create-post-guider-failed": "Create post guider failed",
    "delete-post-successfully": "Delete post successfully",
    "delete-post-failed": "Delete post failed",
    "update-post-successfully": "Update post successfully",
    "update-post-failed": "Update post failed",
    "accepted-guider-request": "Accepted guider request!",
    "rejected-guider-request": "Rejected guider request!",
    "request-guider-successfully":
      "Request Successfully. Please wait a few days while we review your information!",
    "no-calendar-is-selected": "No calendar is selected",
    "no-guest-must-be-less-or-equal-to-max-guests-of-this-calendar":
      "No guest must be less or equal to max guest(s) of this calendar",
    "no-guest-must-be-less-or-equal-to-max-guests-of-this-place":
      "No guest must be less or equal to max guest(s) of this place",
    "create-new-calendar-successfully": "Create new calendar successfully",
    "create-new-calendar-failed": "Create new calendar failed",
    "update-calendar-successfully": "Update calendar successfully",
    "update-calendar-failed": "Update calendar failed",
    "delete-calendar-successfully": "Delete calendar successfully",
    "delete-calendar-failed": "Delete calendar failed",
    "rate-limit-exceeded":
      "Request exceeded rate limit. Please try again in 3 seconds",
    "standards-violation":
      "Message was found to violate our standards. Please check the wording",
    "generation-error": "Error while generating answer. Please try again",
  },
  "form-validation": {
    "is-required": "is required",
    invalid: "is invalid",
    "min-password-characters": "must have at least 6 characters",
    "max-password-characters": "with a maximum of 256 characters",
    "diff-password": "New password must different from old password",
  },
  "request-feature": {
    reason: "Reason",
    "goals-of-travel": "Goals of travel",
    languages: "Languages",
    action: "Action",
    bio: "Bio",
    "guider-form": "Guider form",
    "show-experience": "Show your experience to us",
    "why-become-guider": "Why do you want to become a guider?",
    "your-languages": "Your languages",
    accept: "Accept",
    reject: "Reject",
    "request-commit-desc":
      "Committed to providing accurate, quality information and adhering to website policies, ensuring a positive customer experience",
    "upgrade-to-guider": "Upgrade your account to guider",
    "get-guider-privileges": "You will get guider privileges",
  },
  multiSelect: {
    German: "German",
    English: "English",
    Spanish: "Spanish",
    French: "French",
    Italian: "Italian",
    Japanese: "Japanese",
    Korean: "Korean",
    Portuguese: "Portuguese",
    Russian: "Russian",
    Thai: "Thai",
    Vietnamese: "Vietnamese",
    Chinese: "Chinese",
    artandculture: "Art And Culture",
    entertainment: "Entertainment",
    foodanddrink: "Food And Drink",
    sightseeing: "Sightseeing",
    sports: "Sports",
    tours: "Tours",
    wellnesss: "Wellnesss",
  },
  "post-guider-amenities": {
    foods: "Foods",
    drinks: "Drinks",
    "transportation-service": "Transportation service",
    devices: "Devices",
    tickets: "Tickets",
    shopping: "Shopping",
    media: "Media",
    entertainment: "Entertainment",
    gifts: "Gifts",
  },
  "assistant-feature": {
    "type-your-message": "Type your message",
  },
};
export default enJSON;
