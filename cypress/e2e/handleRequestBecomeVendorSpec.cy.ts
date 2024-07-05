describe("handle request vendor", () => {
  it("tests handle request vendor directly", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("admin@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("admin@123");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("div:nth-of-type(3) > svg").click({ force: true });
    cy.wait(7000);
    cy.get("li:nth-of-type(2) path:nth-of-type(1)").click({ force: true });
    cy.wait(5000);
    cy.get("li:nth-of-type(2) path:nth-of-type(1)").click({ force: true });
    cy.wait(5000);
    return;
  });

  it("tests handle request vendor from details page", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("admin@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("admin@123");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("div:nth-of-type(3) > svg").click({ force: true });
    cy.wait(7000);
    cy.get("li:nth-of-type(1) svg").click({ force: true });
    cy.wait(7000);
    cy.get("div:nth-of-type(2) > button").click({ multiple: true });
    cy.wait(5000);
    cy.get("div:nth-of-type(2) > button").click({ multiple: true });
    cy.wait(5000);
    return;
  });
});
