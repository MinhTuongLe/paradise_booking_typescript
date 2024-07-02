describe("Handle request become guider Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng nhập|login/i).click();
    cy.get(".fixed.inset-0.z-40").should("be.visible");

    cy.get("input#email").type("admin@gmail.com");
    cy.get("input#password").type("admin@123");
    cy.contains(/tiếp tục|continue/i).click();

    cy.wait(3000);
  });

  it("Change password successfully", () => {
    cy.get(".flex > .py-3").click();
    cy.contains(/cài đặt chung|general settings/i).click();
    cy.contains(/đổi mật khẩu|change password/i).click();

    cy.get("input#old_password", { timeout: 10000 }).should("exist");

    cy.get("input#old_password").type("admin@123");
    cy.get("input#new_password").type("admin123");
    cy.get("input#confirmed_password").type("admin123");
    cy.contains(/lưu|save/i).click();

    cy.contains(/đổi mật khẩu thành công|change password successfully/i).should(
      "be.visible"
    );

    cy.get(".flex > .py-3").click();
    cy.contains(/đăng xuất|logout/i).click();
    cy.wait(3000);

    cy.get(".flex > .py-3").click();
    cy.contains(/đăng nhập|login/i).should("be.visible");

    cy.contains(/đăng nhập|login/i).click();
    cy.get("input#email").type("admin@gmail.com");
    cy.get("input#password").type("admin123");
    cy.contains(/tiếp tục|continue/i).click();

    cy.wait(3000);
  });
});
