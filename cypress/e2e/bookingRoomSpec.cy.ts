describe("booking room", () => {
  it("tests booking room", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get("div.fixed > div > div > div.flex-row svg").click({ force: true });
    cy.get("div.flex-row > div.relative > div > div > div").click();
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
    cy.visit("http://localhost:3000/listings/120");
    cy.wait(7000);
    cy.get("div.grid-cols-1 div:nth-of-type(3) > button").click();
    cy.wait(5000);
    cy.get("div.grid-cols-1 div:nth-of-type(3) > button").click();
    cy.wait(5000);
    cy.get("#full_name").click();
    cy.get("#full_name").type("Le Minh Tuong");
    cy.get("#phone").click();
    cy.get("#phone").type("0811022022");
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("textarea").click();
    cy.get("textarea").type("hello vendor");
    cy.get("div.w-1\\/3 > button").click();
    cy.wait(5000);
    return;
  });

  it("tests cancel booking room", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div").click();
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
    cy.visit("http://localhost:3000/reservations");
    cy.wait(7000);
    cy.get("div.grid svg").click();
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    cy.get("path:nth-of-type(2)").click({ force: true });
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    return;
  });
});
