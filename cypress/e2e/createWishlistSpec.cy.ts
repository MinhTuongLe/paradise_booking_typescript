describe("add wishlist at home", () => {
  it("tests add wishlist at home", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click({ force: true });
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
    cy.get("div:nth-of-type(5) svg.fill-white").click({ force: true });
    cy.wait(5000);
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.wait(5000);
    cy.get("#title").click();
    cy.get("#title").type("new test wishlist");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(5000);
    return;
  });

  it("tests add wishlist at page", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click();
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
    cy.wait(5000);
    cy.get("div.pb-20 button").click();
    cy.get("#title").click();
    cy.get("#title").type("new test wishlist (1)");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(5000);
    return;
  });
});
