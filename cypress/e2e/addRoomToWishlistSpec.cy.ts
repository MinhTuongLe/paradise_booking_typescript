describe("add place to wishlist", () => {
  it("tests add place to wishlist failed", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.get("div.mt-0 > div:nth-of-type(1) svg.fill-white").click({
      force: true,
    });
    cy.wait(5000);
    cy.get("svg.bg-\\[\\#05a569\\]").click({ force: true });
    return;
  });

  it("tests add place to wishlist successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.get("div:nth-of-type(5) svg.fill-white").click({ force: true });
    cy.wait(5000);
    cy.get("svg.bg-\\[\\#05a569\\] > path").click({ force: true });
    return;
  });

  it("tests add place to wishlist failed", () => {
    cy.visit("http://localhost:3000/listings/114");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) svg").click({ force: true });
    cy.get("body > div:nth-of-type(1) svg").click({ force: true });
    cy.get("div.absolute > div > div:nth-of-type(1) > div").click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("svg.fill-white > path").click({ force: true });
    cy.wait(5000);
    cy.get("svg.bg-\\[\\#05a569\\]").click({ force: true });
    return;
  });

  it("tests add place to wishlist successfully", () => {
    cy.visit("http://localhost:3000/listings/118");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) svg").click({ force: true });
    cy.get("body > div:nth-of-type(1) svg").click({ force: true });
    cy.get("div.absolute > div > div:nth-of-type(1) > div").click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("svg.fill-white").click({ force: true });
    cy.wait(5000);
    cy.get("svg.bg-\\[\\#05a569\\] > path").click({ force: true });
    return;
  });
});
