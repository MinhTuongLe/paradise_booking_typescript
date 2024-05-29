const viJSON = {
  general: {
    id: "ID",
    username: "Tài khoản",
    fullname: "Họ tên",
    role: "Vai trò",
    status: "Trạng thái",
    address: "Địa chỉ",
    phone: "Số điện thoại",
    dob: "Ngày sinh",
    user: "Người dùng",
    vendor: "Chủ nhà",
    admin: "Quản trị viên",
    guests: "Khách",
    beds: "Giường",
    bedrooms: "Phòng ngủ",
    cancel: "Huỷ",
    save: "Lưu",
    unauthorized: "Không được phép",
    "please-login": "Vui lòng đăng nhập",
    "no-data-to-display": "Không có dữ liệu để hiển thị.",
    "create-new": "Tạo mới",
    place: "Địa điểm",
    "booking-id": "ID Đặt chỗ",
    created: "Ngày được tạo",
    amount: "Tổng cộng",
    method: "Phương thức",
    search: "Tìm kiếm",
    clear: "Xoá",
    days: "Ngày",
    "any-week": "Mọi thời điểm",
    anywhere: "Mọi nơi",
    filter: "Lọc",
    comments: "Bình luận",
    "show-more-comments": "Hiển thị thêm bình luận",
    "no-comment-to-display": "Không có bình luận để hiển thị",
    rooms: "Phòng",
    "show-more-rooms": "Hiển thị thêm phòng",
    email: "E-mail",
    property: "địa điểm",
    description: "Mô tả",
    update: "Cập nhật",
    from: "Từ",
    to: "Đến",
    name: "Tên",
    reservation: "đặt phòng",
    "clear-all": "Xoá hết",
    send: "Gửi",
    guest: "Khách",
    details: "Chi tiết",
    "uh-oh": "Ôi",
    "something-went-wrong": "Có lỗi xảy ra!",
    "price-range": "Khoảng giá",
    password: "Mật khẩu",
    create: "Tạo",
    title: "Tiêu đề",
    successfully: "Thành công",
    failed: "Thất bại",
    note: "Ghi chú",
    calendar: "Lịch trình",
  },
  "booking-status": {
    all: "Tất cả",
    pending: "Chờ xử lý",
    successful: "Thành công",
    checkin: "Nhận phòng",
    checkout: "Trả phòng",
    completed: "Hoàn thành",
    cancel: "Hủy",
    confirmed: "Đã xác nhận",
  },
  roles: {
    user: "Người dùng",
    vendor: "Chủ nhà",
    admin: "Quản trị viên",
    guider: "Hướng dẫn viên",
  },
  offers: {
    "garden-view": "Cảnh vườn",
    "hot-water": "Nước nóng",
    wifi: "Wifi",
    coffee: "Cà phê",
    "security-cameras-on-property": "Camera an ninh",
    bathtub: "Bồn tắm",
    "dedicated-workspace": "Không gian làm việc riêng",
    safe: "An toàn",
    "free-parking-on-premises": "Đậu xe miễn phí",
    "fire-extinguisher": "Bình chữa cháy",
  },
  types: {
    "content-that-is-dishonest-or-inaccurate":
      "Nội dung không trung thực hoặc không chính xác",
    "this-place-vendor-is-not-real": "Địa điểm/chủ nhà này không có thật",
    "it-s-a-scam": "Lừa đảo",
    "offensive-content": "Nội dung phản cảm",
    "other-problems": "Vấn đề khác",
  },
  "type-selections": {
    dining: "Dịch vụ ăn uống",
    "dining-desc":
      "Khám phá nhà hàng địa phương và quốc tế với các món ăn đặc trưng.",
    entertainment: "Giải trí",
    "entertainment-desc":
      "Tìm kiếm các hoạt động giải trí như rạp chiếu phim, sự kiện và công viên.",
    accommodation: "Chỗ ở",
    "accommodation-desc":
      "Tìm kiếm và đặt phòng khách sạn, căn hộ, nhà trọ và nhà nghỉ trên toàn thế giới.",
    transportation: "Vận chuyển",
    "transportation-desc":
      "Đặt vé xe buýt, xe lửa, dịch vụ đưa đón sân bay và thuê xe.",
    shopping: "Mua sắm",
    "shopping-desc":
      "Khám phá cửa hàng địa phương và các trung tâm mua sắm phong phú.",
    health: "Sức khỏe",
    "health-desc":
      "Tìm kiếm các dịch vụ y tế như bệnh viện, phòng khám và phòng tập gym.",
    "other-services": "Dịch vụ khác",
    "other-services-desc":
      "Khám phá các dịch vụ đặc biệt khác như spa, tour và cho thuê.",
  },
  "post-guider-types": {
    artandculture: "Nghệ thuật và Văn hóa",
    "artandculture-desc": "Khám phá những trải nghiệm nghệ thuật và văn hóa.",
    entertainment: "Giải trí",
    "entertainment-desc": "Thưởng thức các hoạt động và sự kiện giải trí.",
    foodanddrink: "Ẩm thực",
    "foodanddrink-desc": "Khám phá những món ăn và đồ uống ngon.",
    sightseeing: "Tham quan",
    "sightseeing-desc": "Khám phá các cảnh đẹp và các điểm tham quan.",
    sports: "Thể thao",
    "sports-desc": "Tham gia vào các hoạt động thể thao và ngoại ô.",
    tours: "Tour",
    "tours-desc":
      "Bắt đầu các chuyến tham quan và cuộc phiêu lưu được hướng dẫn.",
    wellnesss: "Sức khỏe và Làm đẹp",
    "wellnesss-desc": "Tập trung vào sức khỏe và sự phát triển tốt đẹp.",
  },
  "account-status": {
    inactive: "Không hoạt động",
    active: "Hoạt động",
  },
  "payment-status": {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
  },
  "place-status": {
    all: "Tất cả",
    empty: "Trống",
    reserved: "Đã đặt trước",
  },
  navbar: {
    "paradise-your-home": "Paradise của bạn",
    "my-reservations": "Đặt phòng",
    "my-wishlist": "Danh sách yêu thích",
    "my-properties": "Phòng của tôi",
    payments: "Thanh toán",
    statistics: "Thống kê",
    "my-post-reviews": "Bài đánh giá",
    "my-booked-guiders": "Hướng dẫn viên đã đặt",
    "my-post-guiders": "Bài đăng hướng dẫn viên",
    "my-profile": "Hồ sơ",
    "change-password": "Đổi mật khẩu",
    logout: "Đăng xuất",
    login: "Đăng nhập",
    register: "Đăng ký",
    accommodation: "Chỗ ở",
    "post-reviews": "Bài đánh giá",
    "post-guiders": "Hướng dẫn viên",
    accounts: "Tài khoản",
    requests: "Yêu cầu",
    reports: "Báo cáo",
  },
  "account-feature": {
    "account-table": "Tài khoản",
  },
  "change-password-feature": {
    "change-password": "Đổi mật khẩu",
    "current-password": "Mật khẩu hiện tại",
    "new-password": "Mật khẩu mới",
    "confirm-password": "Xác nhận mật khẩu",
  },
  "wishlist-feature": {
    "your-wishlist": "Danh sách yêu thích của bạn",
    "list-of-your-wishlist":
      "Danh sách những điều bạn muốn sở hữu hoặc trải nghiệm trong tương lai!",
    "no-wishlist-to-display":
      "Bạn không có bất kỳ danh sách yêu thích nào để hiển thị",
    "create-a-new-one": "Tạo mới",
  },
  "payment-feature": {},
  "post-reviews-feature": {
    "post-reviews-by-topics": "Bài đánh giá theo chủ đề",
    "post-reviews-by-topics-desc":
      "Đánh giá về dịch vụ ẩm thực, giải trí và những thứ khác",
    "what-are-you-thinking": "Bạn đang nghĩ gì?",
    "share-your-memorable-moments-here":
      "Chia sẻ khoảnh khắc đáng nhớ của bạn tại đây",
    "no-post-review-found": "Không tìm thấy bài đánh giá nào",
    "immediately-add-your-first-experience":
      "Hãy thêm trải nghiệm đầu tiên của bạn ngay",
  },
  "user-feature": {
    "your-bio": "Tiểu sử của bạn",
    "add-your-bio-here": "Thêm tiểu sử của bạn tại đây ...",
    "email-verification": "Xác thực E-mail",
    "verified-information": "Thông tin đã xác thực của",
    "your-verified-information": "Thông tin đã xác thực của bạn",
    "profile-verification": "Xác thực hồ sơ",
    "need-verification":
      "Bạn cần xác minh thông tin trên nếu bạn muốn bắt đầu đăng địa điểm cho thuê.",
    "become-a-vendor": "Trở thành Chủ nhà",
    "become-a-guider": "Trở thành Hướng dẫn viên",
    "report-this-vendor": "Báo cáo chủ nhà này",
    "report-this-guider": "Báo cáo hướng dẫn viên này",
    "profile-settings": "Cài đặt Hồ sơ",
    profile: "Hồ sơ",
    "edit-profile": "Chỉnh sửa hồ sơ",
    about: "Về",
    "profile-desc":
      "Hồ sơ Paradise của bạn là một phần quan trọng trong mọi lượt đặt phòng/đặt chỗ. Hãy tạo một hồ sơ để giúp các Chủ nhà/Chủ nhà khác và khách tìm hiểu về bạn.",
    "create-profile": "Tạo hồ sơ",
    "receive-comments": "Bình luận nhận được",
    "view-profile": "Xem hồ sơ",
    "show-more-post": "Hiện thêm bài viết",
  },
  "property-feature": {
    properties: "Địa điểm",
    "list-of-your-properties": "Danh sách địa điểm của bạn",
    "search-place-id": "Tìm kiếm ID địa điểm...",
    "check-available": "Kiểm tra tình trạng",
    "delete-property": "Xoá địa điểm",
    "no-properties-found": "Không tìm thấy địa điểm",
    "empty-properties": "Dường như bạn không có bất kỳ địa điểm nào",
    "general-information": "Thông tin Chung",
    "amenities-information": "Thông tin Tiện ích",
    "policies-information": "Thông tin Chính sách",
    "max-guests": "Số Khách Tối Đa",
    "price-per-night": "Giá mỗi Đêm",
    "amenities-settings": "Cài Đặt Tiện ích",
    "policies-settings": "Cài Đặt Chính sách",
    beds: "Giường",
    bedrooms: "Phòng Ngủ",
    "district-state-and-country": "Quận/Huyện, Tỉnh/Thành phố và Quốc gia",
    "total-price": "Tổng",
    "user-information": "Thông tin Người Dùng",
    guestname: "Tên Khách",
    "content-from": "Bình luận bởi",
    "booked-on": "Đặt vào",
    "payment-method": "Phương thức Thanh toán",
    "property-rules": "Quy định của Địa điểm",
    "checkin-time": "Giờ nhận phòng",
    "checkout-time": "Giờ trả phòng",
    "safe-rules": "Quy định an toàn",
    content: "Nội dung ...",
    "cancel-rules": "Quy định huỷ đặt phòng",
  },
  "reservation-feature": {
    reservations: "Đặt phòng",
    "your-reservation-list": "Danh sách đặt phòng của bạn",
    "reservation-status": "Trạng thái đặt phòng",
    "empty-reservation": "Bạn không có lịch đặt phòng nào để hiển thị",
    "booking-now": "Đặt phòng ngay",
    title: "Tiêu đề...",
    "leave-contents":
      "Vui lòng để lại bình luận của bạn để chúng tôi có thể cải thiện",
    "express-satisfaction": "Thể hiện mức độ hài lòng của bạn bằng số sao",
    "content-to-vendor": "Nội dung gửi tới chủ nhà",
    "place-details": "Thông tin Địa điểm",
    "booking-successfully":
      "Đặt phòng thành công! Vui lòng kiểm tra email trong vòng 1 ngày để xác nhận.",
    "reservation-details": "Thông tin Đặt phòng",
  },
  "post-guider-feature": {
    "create-interesting-trips": "Tạo các chuyến đi thú vị",
    "add-a-photo-of-your-post": "Thêm hình ảnh của bài đăng của bạn",
    "tell-guests-what-the-place-youre-headed-to-looks-like":
      "Kể cho khách biết nơi bạn đang đến trông như thế nào",
    "select-your-tour-topic": "Chọn chủ đề của chuyến đi của bạn",
    "what-is-the-purpose-of-the-trip-you-organize":
      "Mục đích của chuyến đi bạn tổ chức là gì",
    "share-some-basics-about-your-trip":
      "Chia sẻ một số điều cơ bản về chuyến đi của bạn",
    "share-your-trip-description": "Chia sẻ mô tả chuyến đi của bạn",
    "the-place-will-become-a-place-for-your-trip":
      "Nơi đó sẽ trở thành một điểm đến trong chuyến đi của bạn",
    "help-guest-can-consider": "Giúp khách hàng có thể xem xét",
    "post-guiders": "Bài đăng hướng dẫn viên",
    "list-of-your-post-guiders": "Danh sách bài đăng của bạn",
    "delete-post": "Xoá bài đăng",
    "schedule-settings": "Cài đặt lịch trình",
    "schedule-information": "Thông tin lịch trình",
    "new-post-guiders": "Hướng Dẫn Viên Mới",
    "guiders-will-tell-you-the-information":
      "Hướng dẫn viên sẽ cung cấp thông tin về họ để làm cho chuyến đi của bạn thêm hấp dẫn",
    "calendar-information": "Thông tin lịch trình",
    "price-per-person": "Giá cho mỗi người",
    free: "Còn trống",
    person: "người",
    "for-up-to": "Dành cho lên đến",
    schedule: "Lịch trình",
    "trip-schedule": "Lịch trình chuyến đi",
    "schedule-desc": "Hãy mô tả chi tiết lịch trình chuyến đi mà bạn hướng đến",
    "itinerary-planning-hosted-by": "Lên kế hoạch hành trình được tổ chức bởi",
    "things-you-will-do": "Những việc bạn sẽ làm",
    "you-will-receive": "Bạn sẽ nhận được",
    "meet-your-organizer": "Gặp Hướng dẫn viên của bạn",
    "organize-experience-on-paradise-since":
      "Tổ chức trải nghiệm trên Paradise từ",
    "has-verified-identity": "Đã xác minh danh tính",
    "hello-im": "Xin chào, tôi là",
    "this-post-guider": "chủ bài đăng này",
    choose: "Chọn",
    "ratings-by-clients-desc":
      "Một trong những bài đăng yêu thích của Paradise dựa trên đánh giá, đánh giá và niềm tin",
    by: "Bởi",
    "report-this-guider": "Báo cáo hướng dẫn viên này",
    with: "Với",
    "post-guider-details": "Chi tiết bài đăng",
    "content-to-guider": "Nội dung gửi tới hướng dẫn viên",
    "booked-guider": "hướng dẫn viên đã đặt",
    "booked-guiders": "Hướng dẫn viên đã đặt",
    "your-booked-guiders-list": "Danh sách hướng dẫn viên đã đặt của bạn",
    "booked-guiders-status": "Trạng thái đặt",
    "reservation-details": "Thông tin đặt hướng dẫn viên",
    "guide-by": "Hướng dẫn bởi",
    "all-experiences": "Tất cả trải nghiệm",
    "no-calendar-to-booking": "Không có lịch để đặt chỗ",
    "things-to-know": "Những điều cần biết",
    "guest-requirements": "Yêu cầu khách hàng",
    "cancellation-policy": "Chính sách hủy bỏ",
    "items-should-be-carried": "Các vật phẩm cần mang theo",
    "confirm-and-pay": "Xác nhận và thanh toán",
    "this-experience-is-held-in": "Trải nghiệm này được tổ chức tại",
    "make-sure-right-language":
      "Hãy chắc chắn rằng đó là ngôn ngữ phù hợp với bạn trước khi đặt chỗ.",
    "no-people": "Không có người",
    "contact-to-guider": "Liên hệ với hướng dẫn viên",
    for: "Cho",
    people: "người",
    "display-a-list-of-the-entire-schedule":
      "Hiển thị danh sách toàn bộ lịch trình để người dùng lựa chọn.",
    "schedules-are-not-organized-with-individual-groups":
      "Lịch trình không được tổ chức theo nhóm riêng lẻ để xây dựng mối quan hệ tốt giữa mọi người.",
  },
  components: {
    "click-to-upload": "Nhấn để tải lên",
    delete: "Xoá",
    night: "Đêm",
    "hosted-by": "Được quản lý bởi",
    "learn-more": "Tìm hiểu thêm",
    "listing-info-desc":
      "Mỗi đặt phòng bao gồm bảo vệ miễn phí khỏi việc chủ nhà hủy đặt phòng, thông tin không chính xác về danh sách và các vấn đề khác như gặp khó khăn khi nhận phòng.",
    share: "Chia sẻ",
    "copy-link": "Sao chép liên kết",
    total: "Tổng",
    "check-availability": "Kiểm tra tính khả dụng",
    reserve: "Đặt",
    "show-all": "Hiển thị tất cả",
    "no-comment-to-display": "Không có bình luận để hiển thị",
    "ratings-by-clients": "Đánh giá từ khách hàng",
    "ratings-by-clients-desc":
      "Một trong những địa điểm yêu thích của Paradise dựa trên đánh giá, đánh giá và niềm tin",
    "forgot-password": "Quên mật khẩu",
    "continue-with-google": "Tiếp tục với Google",
    "not-have-an-account": "Chưa có tài khoản?",
    "create-an-account": "Tạo tài khoản",
    continue: "Tiếp tục",
    "welcome-back": "Chào mừng trở lại",
    "login-desc": "Đăng nhập vào tài khoản của bạn!",
    "send-code": "Gửi Mã",
    verify: "Xác thực",
    "reset-password": "Thiết lập lại mật khẩu",
    "reset-your-password": "Thiết lập lại mật khẩu của bạn",
    "login-here": "Đăng nhập tại đây",
    "new-password": "Mật khẩu mới",
    "confirm-password": "Xác thực mật khẩu",
    "secret-code": "Mã bảo mật",
    "welcome-to-paradise": "Chào mừng tới Paradise",
    "already-have-an-account": "Đã có tài khoản?",
    "where-do-you-wanna-go": "Bạn muốn đi đâu?",
    "find-the-perfect-location": "Tìm địa điểm hoàn hảo!",
    location: "Địa điểm",
    "when-do-you-plan-to-go": "Bạn dự định đi khi nào?",
    "make-sure-everyone-is-free": "Đảm bảo mọi người đều rảnh!",
    "more-information": "Thông tin thêm",
    "find-your-perfect-place": "Tìm nơi hoàn hảo cho bạn!",
    "how-many-guests-are-coming": "Có bao nhiêu khách đến?",
    "how-many-beds-per-room-do-you-need": "Bạn cần bao nhiêu giường mỗi phòng?",
    "price-range-you-want": "Khoảng giá bạn muốn",
    "find-an-expense-that-right-for-you": "Tìm một chi phí phù hợp với bạn!",
    "create-new-wishlist": "Tạo danh sách yêu thích mới",
    "empty-wishlist": "Bạn không có bất kỳ danh sách yêu thích nào",
    "add-to-your-wishlist": "Thêm vào danh sách yêu thích của bạn",
    "all-rooms-of": "Tất cả phòng của",
    summary: "Tổng cộng",
    comments: "bình luận",
    "are-you-sure-to-delete-this": "Bạn có chắc chắn muốn xoá",
    "are-you-sure-to-cancel-this": "Bạn có chắc chắn muốn huỷ",
    post: "Đăng",
    next: "Tiếp",
    back: "Quay lại",
    update: "cập nhật",
    "select-post-type": "Loại bài đăng",
    "what-are-you-thinking-about-it": "Bạn đang nghĩ gì về nó?",
    "add-to-your-post": "Thêm vào bài đăng của bạn",
    "what-type-of-your-post": "Loại bài đăng của bạn là gì?",
    "choose-for-it-a-suitable-type":
      "Chọn một loại phù hợp trong các danh mục dưới đây",
    "where-is-your-place-located": "Bạn đang ở đâu?",
    "help-guests-find-you": "Giúp khách hàng tìm thấy bạn!",
    "add-your-new-post-review": "Thêm bài đánh giá mới của bạn",
    "edit-your-post-review": "Chỉnh sửa bài đánh giá của bạn",
    "choose-your-post-review-category": "Chọn danh mục bài đánh giá của bạn",
    "now-set-your-description": "Bây giờ, đặt mô tả của bạn",
    "what-is-your-place-description": "Mô tả của bạn về nơi ở là gì?",
    "add-a-photo-of-your-place": "Thêm một ảnh về nơi của bạn",
    "show-guests-what-your-place-looks-like":
      "Cho khách biết nơi của bạn trông như thế nào!",
    "create-your-new-place": "Tạo địa điểm mới của bạn",
    "share-your-room-to-us": "Chia sẻ phòng của bạn với chúng tôi",
    "share-some-information":
      "Chia sẻ một số thông tin như vị trí, sức chứa của phòng thuê của bạn",
    "make-your-room-outstanding": "Làm cho phòng của bạn nổi bật",
    "add-an-outstanding-image-with-title-and-description":
      "Thêm một hình ảnh nổi bật với tiêu đề và mô tả",
    "finish-and-post": "Hoàn thành và đăng",
    "select-options-your-want-and-post": "Chọn các tùy chọn bạn muốn và đăng",
    "share-some-basics-about-your-place":
      "Chia sẻ một số thông tin cơ bản về nơi của bạn",
    "what-do-you-have": "Bạn có gì?",
    "how-many-guest-do-you-allow": "Bạn cho phép bao nhiêu khách?",
    "how-many-beds-do-you-have": "Bạn có bao nhiêu giường?",
    "how-many-bedrooms-in-your-place":
      "Bạn có bao nhiêu phòng ngủ trong nơi của bạn?",
    "how-many-available-rooms-in-your-place":
      "Có bao nhiêu phòng trống trong nơi của bạn?",
    "available-rooms": "Phòng trống",
    "properties-filter-by-date-range":
      "Bộ lọc các địa điểm theo khoảng thời gian",
    rooms: "phòng",
    original: "Ban đầu",
    booked: "Đã đặt",
    remain: "Còn lại",
    "booking-history": "Lịch sử đặt phòng",
    "enter-data-to-filter": "Nhập dữ liệu để lọc",
    wishlist: "danh sách yêu thích",
    saved: "Đã lưu",
    items: "mục",
    comment: "bình luận",
    "post-review": "bài đánh giá",
    "edit-this-post": "Chỉnh sửa bài đăng",
    "delete-this-post": "Xoá bài đăng",
    at: "Tại",
    like: "Thích",
    "show-all-comments": "Hiển thị tất cả bình luận",
    "hide-all-comments": "Ẩn tất cả bình luận",
    "give-your-comment": "Để lại bình luận của bạn ...",
    loading: "Đang tải ...",
    min: "Tối thiểu",
    max: "Tối đa",
    reply: "Trả lời",
    remove: "Xoá",
    "see-details": "Chi tiết",
    "report-this-room": "Báo cáo địa điểm này",
    "where-you-ll-be": "Nơi bạn sẽ đến",
    "things-to-know": "Những điều cần biết",
    "house-rules": "Quy định nhà",
    "checkin-after": "Nhận phòng sau",
    "checkout-before": "Trả phòng trước",
    maximum: "Tối đa",
    "finish-your-booking": "Hoàn tất đặt phòng của bạn",
    "your-booking-info": "Thông tin đặt phòng của bạn",
    "booking-for-myself": "Đặt phòng cho bản thân",
    "booking-for-other": "Đặt phòng cho người khác",
    "guest-name": "Tên khách",
    "payment-information": "Thông tin thanh toán",
    date: "Ngày",
    "place-max-guests": "Số khách tối đa",
    "contact-to-vendor": "Liên hệ với nhà cung cấp",
    "general-rule": "Quy tắc chung",
    "we-ask-all-guests-to-remember":
      "Chúng tôi yêu cầu tất cả khách nhớ một số quy tắc đơn giản để trở thành một khách hàng tuyệt vời.",
    "comply-with-house-rules": "Tuân thủ các quy định nhà",
    "maintain-the-house": "Duy trì ngôi nhà như thể đó là nhà của bạn",
    "your-reservation-will-not-be-confirmed":
      "Đặt phòng của bạn sẽ không được xác nhận cho đến khi chủ nhà/tổ chức chấp nhận yêu cầu của bạn (trong vòng 24 giờ).",
    "you-will-not-be-charged-until-then":
      "Bạn sẽ không bị tính phí cho đến khi đó.",
    reservation: "Đặt phòng",
    room: "Phòng",
    "price-details": "Chi tiết giá",
    "service-fee": "Phí dịch vụ",
    guests: "khách",
    submit: "Gửi",
    "all-post-of": "Tất cả bài viết của",
    add: "Thêm",
    "no-options-available": "Không có lựa chọn",
  },
  footer: {
    about: "GIỚI THIỆU",
    newsroom: "Phòng tin tức",
    "learn-about-new-features": "Tìm hiểu về các tính năng mới",
    "letter-from-our-founders": "Thư từ những người sáng lập của chúng tôi",
    careers: "Cơ hội nghề nghiệp",
    investors: "Nhà đầu tư",
    support: "Hỗ trợ",
    "help-center": "Trung tâm trợ giúp",
    paradisecover: "ParadiseCover",
    "cancellation-options": "Tùy chọn hủy",
    "safety-information": "Thông tin an toàn",
    "report-a-neighborhood-concern": "Báo cáo một vấn đề về khu phố",
    community: "Cộng đồng",
    hosting: "Đăng ký trở thành Host",
    "try-hosting": "Thử đăng ký trở thành Host",
    "paradisecover-for-hosts": "ParadiseCover cho Host",
    "explore-hosting-resources": "Khám phá các tài nguyên cho Host",
    "how-to-host-responsibly": "Cách trở thành Host có trách nhiệm",
    "no-data": "Dữ liệu rỗng",
    "no-data-to-display": "Không có dữ liệu để hiển thị",
    "my-booked-calendar": "Lịch trình được đặt",
    "no-calendar-booked-at-this-post": "Bài đăng này không có lịch trình",
  },
  toast: {
    "passwords-not-match": "Mật khẩu không khớp",
    "change-password-successfully": "Thay đổi mật khẩu thành công",
    "change-password-failed": "Thay đổi mật khẩu thất bại",
    "please-enter-your-address": "Vui lòng nhập địa chỉ của bạn",
    "create-place-successfully": "Tạo địa điểm thành công",
    "create-place-failed": "Tạo địa điểm thất bại",
    "uploading-photo-successfully": "Tải ảnh lên thành công",
    "uploading-photo-failed": "Tải ảnh lên thất bại",
    "copy-successfully": "Sao chép thành công",
    "add-place-to-wishlist": "Thêm địa điểm vào danh sách yêu thích",
    "this-place-is-now-in-this-wishlist":
      "Địa điểm này hiện đã có trong danh sách yêu thích này",
    "update-wishlist-title-successfully":
      "Cập nhật tiêu đề danh sách yêu thích thành công",
    "update-wishlist-title-failed":
      "Cập nhật tiêu đề danh sách yêu thích thất bại",
    "delete-wishlist-successfully": "Xóa danh sách yêu thích thành công",
    "delete-wishlist-failed": "Xóa danh sách yêu thích thất bại",
    "feedback-successfully": "Phản hồi thành công",
    "feedback-failed": "Phản hồi thất bại",
    "update-profile-successfully": "Cập nhật hồ sơ thành công",
    "update-profile-failed": "Cập nhật hồ sơ thất bại",
    "comment-is-not-blank": "Bình luận không được bỏ trống",
    "update-place-successfully": "Cập nhật địa điểm thành công",
    "update-place-failed": "Cập nhật địa điểm thất bại",
    "delete-place-successfully": "Xóa địa điểm thành công",
    "delete-place-failed": "Xóa địa điểm thất bại",
    "comment-failed": "Bình luận thất bại",
    "delete-comment-failed": "Xóa bình luận thất bại",
    "login-failed-with-google": "Đăng nhập thất bại với Google",
    "date-range-is-invalid": "Phạm vi ngày không hợp lệ",
    "register-successfully":
      "Đăng ký thành công. Kiểm tra email của bạn để xác nhận đăng ký",
    "delete-post-review-successfully": "Xóa bài đánh giá thành công",
    "delete-post-review-failed": "Xóa bài đánh giá thất bại",
    "update-booking-status-successfully":
      "Cập nhật trạng thái đặt phòng thành công",
    "update-booking-status-failed": "Cập nhật trạng thái đặt phòng thất bại",
    "update-amenities-successfully": "Cập nhật tiện nghi thành công",
    "update-amenities-failed": "Cập nhật tiện nghi thất bại",
    "update-policies-successfully": "Cập nhật chính sách thành công",
    "update-policies-failed": "Cập nhật chính sách thất bại",
    "booking-failed": "Đặt phòng thất bại",
    "this-place-is-not-available-on-the-dates-you-selected":
      "Địa điểm này không khả dụng vào các ngày bạn đã chọn",
    "create-new-wishlist-successfully":
      "Tạo danh sách mong muốn mới thành công",
    "create-new-wishlist-failed": "Tạo danh sách mong muốn mới thất bại",
    "update-post-review-successfully": "Cập nhật bài đánh giá thành công",
    "update-post-review-failed": "Cập nhật bài đánh giá thất bại",
    "please-upload-image-to-describe":
      "Vui lòng tải lên hình ảnh để mô tả trải nghiệm của bạn",
    "create-post-review-successfully": "Tạo bài đánh giá thành công",
    "create-post-review-failed": "Tạo bài đánh giá thất bại",
    "check-your-email-to-get-reset-password-code":
      "Kiểm tra email của bạn để nhận mã đặt lại mật khẩu",
    "verify-successfully": "Xác minh thành công",
    "verify-failed": "Xác minh thất bại",
    "reset-password-successfully": "Đặt lại mật khẩu thành công",
    "reset-password-failed": "Đặt lại mật khẩu thất bại",
    "update-account-status-successfully":
      "Cập nhật trạng thái tài khoản thành công",
    "update-account-status-failed": "Cập nhật trạng thái tài khoản thất bại",
    "update-account-role-successfully": "Cập nhật vai trò tài khoản thành công",
    "update-account-role-failed": "Cập nhật vai trò tài khoản thất bại",
    "this-reservation-is-processing":
      "Xóa thất bại. Đặt phòng này đang được xử lý",
    "cancel-reservation-successfully": "Hủy đặt phòng thành công",
    "cancel-reservation-failed": "Hủy đặt phòng thất bại",
    "delete-reservation-successfully": "Xóa đặt phòng thành công",
    "delete-reservation-failed": "Xóa đặt phòng thất bại",
    "create-post-guider-successfully": "Tạo bài đăng thành công",
    "create-post-guider-failed": "Tạo bài đăng thất bại",
    "delete-post-successfully": "Xoá bài đăng thành công",
    "delete-post-failed": "Xoá bài đăng thất bại",
    "update-post-successfully": "Cập nhật bài đăng thành công",
    "update-post-failed": "Cập nhật bài đăng thất bại",
    "accepted-guider-request": "Duyệt yêu cầu trở thành hướng dẫn viên!",
    "rejected-guider-request": "Từ chối yêu cầu trở thành hướng dẫn viên!",
    "request-guider-successfully":
      "Gửi yêu cầu thành công. Vui lòng chờ vài ngày trong khi chúng tôi xem xét hồ sơ của bạn!",
    "no-calendar-is-selected": "Chọn 1 lịch trình để đặt lịch",
    "no-guest-must-be-less-or-equal-to-max-guests-of-this-calendar":
      "Số lượng khách không được lớn hơn quy định cho lịch trình này",
    "create-new-calendar-successfully": "Tạo lịch mới thành công",
    "create-new-calendar-failed": "Tạo lịch mới thất bại",
    "update-calendar-successfully": "Cập nhật lịch thành công",
    "update-calendar-failed": "Cập nhật lịch thất bại",
    "delete-calendar-successfully": "Xóa lịch thành công",
    "delete-calendar-failed": "Xóa lịch thất bại",
  },
  "form-validation": {
    "is-required": "là bắt buộc",
    invalid: "không hợp lệ",
    "min-password-characters": "phải có tối thiểu 6 ký tự",
    "max-password-characters": "chỉ có tối đa 256 ký tự",
    "diff-password": "Mật khẩu mới phải khác với mật khẩu cũ",
  },
  "request-feature": {
    reason: "Lý do",
    "goals-of-travel": "Mục tiêu của chuyến đi",
    languages: "Ngôn ngữ",
    action: "Hành động",
    bio: "Tiểu sử",
    "guider-form": "Đơn hướng dẫn viên",
    "show-experience": "Cho chúng tôi thấy kinh nghiệm của bạn",
    "why-become-guider": "Tại sao bạn muốn trở thành hướng dẫn viên?",
    "your-languages": "Ngôn ngữ của bạn",
    accept: "Duyệt",
    reject: "Từ chối",
    "request-commit-desc":
      "Cam kết cung cấp thông tin chính xác, chất lượng và tuân thủ chính sách của website, đảm bảo trải nghiệm tích cực cho khách hàng",
    "upgrade-to-guider": "Nâng cấp tài khoản của bạn thành Hướng dẫn viên",
    "get-guider-privileges":
      "Bạn sẽ nhận được những đặc quyền của Hướng dẫn viên",
  },
  multiSelect: {
    German: "Tiếng Đức",
    English: "Tiếng Anh",
    Spanish: "Tiếng Tây Ban Nha",
    French: "Tiếng Pháp",
    Italian: "Tiếng Ý",
    Japanese: "Tiếng Nhật",
    Korean: "Tiếng Hàn",
    Portuguese: "Tiếng Bồ Đào Nha",
    Russian: "Tiếng Nga",
    Thai: "Tiếng Thái",
    Vietnamese: "Tiếng Việt",
    Chinese: "Tiếng Trung",
    artandculture: "Nghệ thuật và Văn hóa",
    entertainment: "Giải trí",
    foodanddrink: "Ẩm thực",
    sightseeing: "Tham quan",
    sports: "Thể thao",
    tours: "Tour",
    wellnesss: "Sức khỏe và Làm đẹp",
  },
  "post-guider-amenities": {
    foods: "Thức ăn",
    drinks: "Đồ uống",
    "transportation-service": "Dịch vụ vận chuyển",
    devices: "Thiết bị",
    tickets: "Vé",
    shopping: "Mua sắm",
    media: "Truyền thông",
    entertainment: "Giải trí",
    gifts: "Quà tặng",
  },
};
export default viJSON;
