describe("booking post guide", () => {
  it("tests booking post guide", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("mt09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/post-guiders/16");
    cy.wait(10000);
    cy.get("div.bg-white > div.mt-4 > div:nth-of-type(1) button").click();
    cy.wait(5000);
    cy.get("#name").click();
    cy.get("#name").type("Le Minh Tuong");
    cy.get("#email").click();
    cy.get("#email").type("mt09122002@gmail.com");
    cy.get("#phone").click();
    cy.get("#phone").type("0987654327");
    cy.get("div.w-1\\/3 > button").click();
    cy.wait(10000);
    return;
  });

  it("tests cancel and delete booking post guide", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("mt09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/booked-guiders");
    cy.wait(10000);
    cy.get("div.grid svg").click({ force: true, multiple: true });
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    cy.get("div.grid svg").click({ force: true, multiple: true });
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    return;
  });
});
