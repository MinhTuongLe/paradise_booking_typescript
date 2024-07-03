describe("update payment status vendor", () => {
  it("tests update payment status vendor", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.wait(5000);
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("mt09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/payments/vendor");
    cy.wait(5000);
    cy.get("tr:nth-of-type(1) path:nth-of-type(2)").click({ force: true });
    cy.wait(5000);
    return;
  });
});
