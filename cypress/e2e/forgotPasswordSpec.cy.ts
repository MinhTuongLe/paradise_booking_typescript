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

  it("Verifies the code successfully", () => {
    cy.get("input#email").type("admin@gmail.com");
    cy.contains(/gửi mã|send code/i).click();
    cy.wait(3000);
    cy.get("input#secret_code").type("123456");
    cy.contains(/xác thực|verify/i).click();

    cy.wait(3000);
    cy.get(".Toastify__toast--success").should("be.visible");
    cy.get(".fixed.inset-0.z-40").should("exist");

    cy.contains(/mật khẩu mới|new password/i).should("be.visible");
  });

  it("Resets the password successfully", () => {
    cy.get("input#email").type("admin@gmail.com");
    cy.contains(/gửi mã|send code/i).click();
    cy.wait(3000);
    cy.get("input#secret_code").type("123456");
    cy.contains(/xác thực|verify/i).click();
    cy.wait(3000);
    cy.get("input#new_password").type("admin123");
    cy.get("input#confirmPassword").type("admin123");
    cy.contains(/đặt lại mật khẩu|reset password/i).click();

    cy.wait(3000);

    cy.get(".Toastify__toast--success").should("be.visible");

    cy.get(".fixed.inset-0.z-40").should("not.exist");
    cy.contains(/đăng nhập|login/i).should("be.visible");
  });

  it("Sends a verification code to the email failed", () => {
    cy.get("input#email").type("admin@gmail.com");
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

  it("Fails to reset the password due to non-matching passwords", () => {
    cy.get("input#email").type("admin@gmail.com");
    cy.contains(/gửi mã|send code/i).click();
    cy.wait(3000);
    cy.get("input#secret_code").type("123456");
    cy.contains(/xác thực|verify/i).click();
    cy.wait(3000);
    cy.get("input#new_password").type("admin123");
    cy.get("input#confirmPassword").type("differentPassword");
    cy.contains(/đặt lại mật khẩu|reset password/i).click();

    cy.wait(3000);

    cy.get(".Toastify__toast--error").should("be.visible");

    cy.get(".fixed.inset-0.z-40").should("be.visible");
    cy.contains(/mật khẩu mới|new password/i).should("be.visible");
  });

  it("Fails to reset the password due to server error", () => {
    cy.get("input#email").type("admin@gmail.com");
    cy.contains(/gửi mã|send code/i).click();
    cy.wait(3000);
    cy.get("input#secret_code").type("123456");
    cy.contains(/xác thực|verify/i).click();
    cy.wait(3000);
    cy.get("input#new_password").type("admin123");
    cy.get("input#confirmPassword").type("admin123");

    cy.intercept("POST", "/api/reset-password", {
      statusCode: 500,
      body: { error: "Server error" },
    }).as("resetPassword");

    cy.contains(/đặt lại mật khẩu|reset password/i).click();
    cy.wait("@resetPassword");

    cy.wait(3000);

    cy.get(".Toastify__toast--error").should("be.visible");

    cy.get(".fixed.inset-0.z-40").should("be.visible");
    cy.contains(/mật khẩu mới|new password/i).should("be.visible");
  });
});
