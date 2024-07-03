describe("statistics guider", () => {
  it("tests statistics guider", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/statistics/guider");
    cy.get("div.flex > input").click();
    cy.get("div.flex > input").type("2024-01-01");
    cy.get("div:nth-of-type(2) > button").click();
    cy.wait(5000);
    return;
  });
});
