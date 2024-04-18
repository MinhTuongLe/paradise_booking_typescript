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
  },
  "booking-status": {
    all: "All",
    pending: "Pending",
    successful: "Successful",
    checkin: "Checkin",
    checkout: "Checkout",
    completed: "Completed",
    cancel: "Cancel",
  },
  roles: {
    user: "user",
    vendor: "Vendor",
    admin: "Admin",
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
  types: {
    "content-that-is-dishonest-or-inaccurate":
      "Content that is dishonest or inaccurate",
    "this-place-vendor-is-not-real": "This place/vendor is not real",
    "it-s-a-scam": "It's a scam",
    "offensive-content": "Offensive content",
    "other-problems": "Other problems",
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
    "interaction-diary": "Interaction Diary",
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
    "report-this-vendor": "Report this vendor",
    "profile-settings": "Profile Settings",
    profile: "Profile",
    "edit-profile": "Edit profile",
    about: "About",
    "profile-desc":
      "Your Paradise profile is an important part of every booking/reservation. Create a profile to help other Hosts/Hosts and guests learn about you.",
    "create-profile": "Create profile",
    "receive-comments": "Receive comments",
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
};
export default enJSON;
