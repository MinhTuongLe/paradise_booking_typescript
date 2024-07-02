describe("Post Review Comment Functionality", () => {
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

  it("Should show error when sending empty comment", () => {
    cy.visit("http://localhost:3000/post-reviews/29"); // Đổi URL thích hợp

    cy.wait(5000);

    // Gửi bình luận không nhập nội dung
    cy.get('[data-testid="send-comment-button"]').click();
    cy.wait(1000); // Đợi hiển thị toast
    cy.contains(/bình luận không được bỏ trống/i).should("exist");
  });

  it("Should add a comment successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29"); // Đổi URL thích hợp

    cy.wait(5000);

    // Gửi bình luận thành công
    const commentContent = "This is a test comment";
    cy.get('[data-testid="comment-textarea"]').type(commentContent);
    cy.get('[data-testid="send-comment-button"]').click();
    cy.wait(5000);
    cy.contains(commentContent).should("exist");
  });
});
