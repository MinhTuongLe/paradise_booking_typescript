describe("View Statistics Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng nhập|login/i).click();
    cy.get(".fixed.inset-0.z-40").should("be.visible");

    cy.get("input#email").type("leminhtuong09122002@gmail.com");
    cy.get("input#password").type("Mtl@091202");
    cy.contains(/tiếp tục|continue/i).click();

    cy.wait(3000);
  });

  it("View Statistics successfully", () => {
    cy.visit("http://localhost:3000/statistics/guider");

    cy.wait(5000);
  });
});
