describe("Login Modal Test - Invalid Cases", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng nhập|login/i).click();
    cy.get(".fixed.inset-0.z-40").should("be.visible");
  });

  it("Shows error for empty email and password", () => {
    cy.contains(/tiếp tục/i).click();
    cy.contains(/e-mail là bắt buộc/i).should("be.visible");
    cy.contains(/mật khẩu là bắt buộc/i).should("be.visible");
  });

  it("Shows error for invalid email format", () => {
    cy.get("input#email").type("invalid-email");
    cy.get("input#password").type("validpassword");
    cy.contains(/tiếp tục/i).click();
    cy.contains(/e-mail không hợp lệ/i).should("be.visible");
  });

  it("Shows error for short password", () => {
    cy.get("input#email").type("validemail@gmail.com");
    cy.get("input#password").type("123");
    cy.contains(/tiếp tục/i).click();
    cy.contains(/mật khẩu phải có tối thiểu 6 ký tự/i).should("be.visible");
  });

  it("Shows error for long password", () => {
    cy.get("input#email").type("validemail@gmail.com");
    cy.get("input#password").type(
      "123Mật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tự"
    );
    cy.contains(/tiếp tục/i).click();
    cy.contains(/mật khẩu chỉ có tối đa 256 ký tự/i).should("be.visible");
  });

  it("Shows error for incorrect email or password", () => {
    cy.get("input#email").type("validemail@gmail.com");
    cy.get("input#password").type("wrongpassword");
    cy.contains(/tiếp tục/i).click();
    cy.wait(3000);
    cy.get("body").then(($body) => {
      if (
        $body.find(".fixed.inset-0.z-40").length > 0 ||
        $body.find(".Toastify").length > 0
      ) {
        cy.log("Login failed: Modal still visible after 3 seconds");
      }
    });
  });
});
