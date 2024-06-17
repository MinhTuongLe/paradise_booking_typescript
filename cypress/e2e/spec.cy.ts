// cypress/integration/sample.spec.ts
describe("Sample Test", () => {
  it("Visits the app", () => {
    cy.visit("http://localhost:3000");
    cy.contains("Welcome to Next.js").should("be.visible");
  });
});
