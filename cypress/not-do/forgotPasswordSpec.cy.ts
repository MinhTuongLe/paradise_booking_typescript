// CHƯA ĐÚNG VÌ DYNAMIC DATA

describe("Forgot Password Modal Test - Successful Flow", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng nhập|login/i).click();
    cy.contains(/quên mật khẩu|forgot password/i).click();
    cy.get(".fixed.inset-0.z-40").should("be.visible");
  });

  it("Sends a verification code to the email successfully", () => {
    cy.get("input#email").type("admin@gmail.com");
    cy.contains(/gửi mã|send code/i).click();

    cy.wait(3000);
    cy.get(".Toastify__toast--success").should("be.visible");
    cy.get(".fixed.inset-0.z-40").should("exist");

    cy.contains(/mã bảo mật|secret code/i).should("be.visible");
  });

  it("Sends a verification code to the email failed", () => {
    cy.get("input#email").type("admin123@gmail.com");
    cy.contains(/gửi mã|send code/i).click();

    cy.wait(3000);
    cy.get(".Toastify__toast--error").should("be.visible");
    cy.get(".fixed.inset-0.z-40").should("exist");

    cy.contains(/mã bảo mật|secret code/i).should("be.visible");
  });

  it("Verifies the code failed", () => {
    cy.get("input#email").type("admin@gmail.com");
    cy.contains(/gửi mã|send code/i).click();
    cy.wait(3000);
    cy.get("input#secret_code").type("123456");
    cy.contains(/xác thực|verify/i).click();

    cy.wait(3000);
    cy.get(".Toastify__toast--error").should("be.visible");
    cy.get(".fixed.inset-0.z-40").should("exist");

    cy.contains(/mật khẩu mới|new password/i).should("be.visible");
  });
});
