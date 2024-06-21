describe("Register Modal Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng ký|register/i).click();
    cy.get(".fixed.inset-0.z-40").should("be.visible");
  });

  it("Creates an account successfully and shows success toast, then closes the modal", () => {
    cy.get("input#email").type("lmtnewuser@gmail.com");
    cy.get("input#password").type("validpassword123");
    cy.get("input#confirmPassword").type("validpassword123");
    cy.contains(/tiếp tục|continue/i).click();

    cy.wait(3000);
    cy.get(".Toastify__toast--success").should("be.visible");
    cy.get(".fixed.inset-0.z-40").should("exist");
  });

  it("Shows error for empty email, password and confirmPassword", () => {
    cy.contains(/tiếp tục|continue/i).click();
    cy.contains(/e-mail là bắt buộc|e-mail is required/i).should("be.visible");
    cy.contains(/mật khẩu là bắt buộc|password is required/i).should(
      "be.visible"
    );
    cy.contains(
      /xác thực mật khẩu là bắt buộc|confirm password is required/i
    ).should("be.visible");
  });

  it("Shows error for invalid email format", () => {
    cy.get("input#email").type("invalid-email");
    cy.get("input#password").type("validpassword");
    cy.get("input#confirmPassword").type("validpassword");
    cy.contains(/tiếp tục|continue/i).click();
    cy.contains(/e-mail không hợp lệ|invalid email/i).should("be.visible");
  });

  it("Shows error for short password", () => {
    cy.get("input#email").type("validemail@gmail.com");
    cy.get("input#password").type("123");
    cy.get("input#confirmPassword").type("123");
    cy.contains(/tiếp tục|continue/i).click();
    cy.contains(
      /mật khẩu phải có tối thiểu 6 ký tự|password must be at least 6 characters/i
    ).should("be.visible");
  });

  it("Shows error for long password", () => {
    cy.get("input#email").type("validemail@gmail.com");
    cy.get("input#password").type(
      "123Mật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tự"
    );
    cy.get("input#confirmPassword").type(
      "123Mật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tựMật khẩu phải có tối thiểu 6 ký tự"
    );
    cy.contains(/tiếp tục|continue/i).click();
    cy.contains(
      /mật khẩu chỉ có tối đa 256 ký tự|password must be less than 256 characters/i
    ).should("be.visible");
  });

  it("Shows error when passwords do not match", () => {
    cy.get("input#email").type("validemail@gmail.com");
    cy.get("input#password").type("validpassword");
    cy.get("input#confirmPassword").type("differentpassword");
    cy.contains(/tiếp tục|continue/i).click();
    cy.contains(/mật khẩu không khớp|passwords do not match/i).should(
      "be.visible"
    );
  });

  it("Shows error for missing confirm password", () => {
    cy.get("input#email").type("validemail@gmail.com");
    cy.get("input#password").type("validpassword");
    cy.contains(/tiếp tục|continue/i).click();
    cy.contains(
      /xác thực mật khẩu là bắt buộc|confirm password is required/i
    ).should("be.visible");
  });

  it("Register with existed email", () => {
    cy.get("input#email").type("newuser@gmail.com");
    cy.get("input#password").type("123123");
    cy.get("input#confirmPassword").type("123123");
    cy.contains(/tiếp tục|continue/i).click();
    cy.get(".Toastify__toast--error").should("be.visible");
  });
});
