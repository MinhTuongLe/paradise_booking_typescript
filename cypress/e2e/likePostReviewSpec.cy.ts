describe("like post", () => {
  it("tests like post", () => {
    cy.visit("http://localhost:3000/post-reviews/29");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get("div.absolute > div > div:nth-of-type(1) > div").click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("[data-testid='like-button'] > span").click();
    return;
  });
});
