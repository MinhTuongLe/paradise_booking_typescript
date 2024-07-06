describe("remove room in wishlist", () => {
  it("tests remove room in wishlist", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click({
      multiple: true,
    });
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
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) img").click();
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) button").click();
    cy.wait(5000);
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    return;
  });
});
