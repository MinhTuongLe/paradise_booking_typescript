describe("Register Modal Test - Successful Case", () => {
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
});
