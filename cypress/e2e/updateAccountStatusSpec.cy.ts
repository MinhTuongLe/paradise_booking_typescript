describe("Update account status", () => {
  it("tests Update account status", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div").click();
    cy.wait(5000);
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("admin@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("admin@123");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get(
      "div.flex-row > div.w-full > div > div > div:nth-of-type(1) path:nth-of-type(2)"
    ).click({ force: true });
    cy.wait(5000);
    cy.get("tr:nth-of-type(1) path").click();
    return;
  });
});
