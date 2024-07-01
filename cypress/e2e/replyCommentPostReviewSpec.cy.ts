describe("Post Review Reply Comment Functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000"); // Đổi URL thích hợp
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng nhập|login/i).click();
    cy.get(".fixed.inset-0.z-40").should("be.visible");

    cy.get("input#email").type("leminhtuong09122002@gmail.com"); // Đổi thông tin email
    cy.get("input#password").type("Mtl@091202"); // Đổi thông tin mật khẩu
    cy.contains(/tiếp tục|continue/i).click();

    cy.wait(3000);
  });

  it("Should show error when sending empty reply comment", () => {
    cy.visit("http://localhost:3000/post-reviews/29"); // Đổi URL thích hợp

    cy.wait(5000);

    // Gửi reply bình luận không nhập nội dung
    cy.get('[data-testid="toggle-reply-button"]').click();
    cy.get('[data-testid="send-reply-comment-button"]').click();
    cy.wait(1000); // Đợi hiển thị toast
    cy.contains(/bình luận không được bỏ trống/i).should("exist");
  });

  it("Should add a reply comment successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29"); // Đổi URL thích hợp

    cy.wait(5000);

    // Gửi reply bình luận thành công
    cy.get('[data-testid="toggle-reply-button"]').click();
    const replyContent = "This is a test reply";
    cy.get('[data-testid="reply-comment-textarea"]').type(replyContent);
    cy.get('[data-testid="send-reply-comment-button"]').click();
    cy.wait(5000);
    cy.contains(replyContent).should("exist");
  });
});
