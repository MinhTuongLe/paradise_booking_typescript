describe("edit wishlist at home", () => {
  it("tests edit wishlist at home", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("div.mt-0 > div:nth-of-type(2) svg.fill-white").click({
      force: true,
    });
    cy.wait(5000);
    cy.get("div.flex-auto > div > div:nth-of-type(1) div.gap-4 svg").click({
      force: true,
    });
    cy.get("input").click();
    cy.get("input").type("(2)");
    cy.wait(1000);
    cy.get("div.flex-auto > div > div:nth-of-type(1) svg").click({
      force: true,
    });
    cy.wait(5000);
    return;
  });

  it("tests edit wishlist at page", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/favorites");
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) div.font-semibold svg").click({
      force: true,
    });
    cy.get("input").click();
    cy.get("input").type("(2)");
    cy.wait(1000);
    cy.get("div.grid > div:nth-of-type(1) div.font-semibold svg").click({
      force: true,
    });
    cy.wait(5000);
    return;
  });
});
