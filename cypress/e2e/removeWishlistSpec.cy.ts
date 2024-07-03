describe("remove wishlist at home", () => {
  it("tests remove wishlist at home", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row path").click();
    cy.wait(5000);
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("div.mt-0 > div:nth-of-type(1) svg.fill-white").click({
      force: true,
    });
    cy.get(
      "div.flex-auto > div > div:nth-of-type(1) svg.bg-rose-500 > path"
    ).click({ force: true });
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    return;
  });

  it("tests remove wishlist at page", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row path").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/favorites");
    cy.get("div.grid > div:nth-of-type(1) div.absolute > svg").click();
    cy.wait(2000);
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    return;
  });
});
