describe("update payment status guider", () => {
  it("tests update payment status guider", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click({
      force: true,
    });
    cy.wait(5000);
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/payments/guider");
    cy.wait(5000);
    cy.get("tr:nth-of-type(1) svg").click({
      force: true,
    });
    cy.wait(5000);
    return;
  });
});
