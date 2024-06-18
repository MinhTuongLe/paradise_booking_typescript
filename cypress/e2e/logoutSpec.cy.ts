describe("Logout Test", () => {
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

  it("Logout successfully", () => {
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng xuất|logout/i).click();
  });
});
