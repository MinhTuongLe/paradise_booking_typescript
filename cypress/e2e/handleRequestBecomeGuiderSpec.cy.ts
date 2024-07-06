describe("handle request guider 1", () => {
  it("tests handle request guider directly", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row path").click();
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
    cy.visit("http://localhost:3000/requests/guider");
    cy.wait(10000);
    cy.get("tr.bg-slate-100 rect:nth-of-type(2)").click({ force: true });
    cy.wait(5000);
    cy.get("tr.bg-slate-100 li:nth-of-type(2) path:nth-of-type(1)").click({
      force: true,
    });
    cy.wait(5000);
    return;
  });

  it("tests handle request guider from details page", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row path").click();
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
    cy.visit("http://localhost:3000/requests/guider");
    cy.wait(5000);
    cy.get("tr.bg-slate-100 li:nth-of-type(1) path").click();
    cy.wait(10000);
    cy.get("div:nth-of-type(2) > button").click({ multiple: true });
    cy.wait(5000);
    cy.get("div:nth-of-type(2) > button").click({ multiple: true });
    cy.wait(5000);
    return;
  });
});
