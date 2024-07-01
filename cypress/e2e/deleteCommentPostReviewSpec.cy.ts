describe("Delete Comment/Reply Comment Functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000"); // Thay URL thích hợp
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng nhập|login/i).click();
    cy.get(".fixed.inset-0.z-40").should("be.visible");

    cy.get("input#email").type("leminhtuong09122002@gmail.com"); // Thay thông tin email
    cy.get("input#password").type("Mtl@091202"); // Thay thông tin mật khẩu
    cy.contains(/tiếp tục|continue/i).click();

    cy.wait(3000);
  });

  it("Should delete a comment successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29"); // Thay URL thích hợp

    cy.wait(5000);

    // Tìm comment cần xoá và nhấn vào nút options
    cy.contains("This is the comment you want to delete")
      .parent()
      .within(() => {
        cy.get('[data-testid="menu-comment-options"]').click();
      });

    // Chọn và nhấn vào nút remove comment
    cy.get('[data-testid="remove-comment-button"]').click();

    cy.wait(5000);

    // Kiểm tra xem comment đã bị xoá thành công
    cy.contains("This is the comment you want to delete").should("not.exist");
  });

  it("Should delete a reply comment successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29"); // Thay URL thích hợp

    cy.wait(5000);

    // Tìm reply comment cần xoá và nhấn vào nút options
    cy.contains("This is the reply comment you want to delete")
      .parent()
      .within(() => {
        cy.get('[data-testid="menu-comment-options"]').click();
      });

    // Chọn và nhấn vào nút remove reply comment
    cy.get('[data-testid="remove-comment-button"]').click();

    cy.wait(5000);

    // Kiểm tra xem reply comment đã bị xoá thành công
    cy.contains("This is the reply comment you want to delete").should(
      "not.exist"
    );
  });
});
