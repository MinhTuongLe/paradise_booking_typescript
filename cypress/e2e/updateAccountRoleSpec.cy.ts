describe("Update account role", () => {
  it("tests Update account role", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get("div.fixed > div > div > div.flex-row path").click();
    cy.get("div.fixed > div > div > div.flex-row path").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("admin@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("admin@123");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("div.flex-row > div.w-full div:nth-of-type(1) > svg").click({
      force: true,
    });
    cy.wait(5000);
    cy.get("tr:nth-of-type(1) select").select;
    cy.get("tr:nth-of-type(1) select").select;
    cy.get("tr:nth-of-type(1) select").select;
    cy.get("tr:nth-of-type(1) select").type("4");
    return;
  });
});
