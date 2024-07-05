describe("update become vendor form", () => {
  it("tests update become vendor form failed", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.visit("http://localhost:3000/users/103");
    cy.wait(5000);
    cy.get("li:nth-of-type(2) > div").click();
    cy.wait(3000);
    cy.get("div.lg\\:col-span-8 > div").click();
    cy.get("#full_name").clear();
    cy.get("#username").click();
    cy.get("#username").clear();
    cy.get("#dob").click();
    cy.get("#phone").click();
    cy.get("#phone").clear();
    cy.get("#address").click();
    cy.get("#address").clear();
    cy.get("div:nth-of-type(2) > button").click();
    cy.wait(5000);
    return;
  });

  it("tests update become vendor form", () => {
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
    cy.visit("http://localhost:3000/users/103");
    cy.wait(5000);
    cy.get("li:nth-of-type(2) > div").click();
    cy.get("#full_name").click();
    cy.get("#full_name").type("updated");
    cy.get("#username").click();
    cy.get("#username").type("updated");
    cy.get("#phone").click();
    cy.get("#phone").clear();
    cy.get("#phone").type("0834090902");
    cy.get("#address").click();
    cy.get("#address").clear();
    cy.get("#address").type("Thủ Đức city, Hồ Chí Minh City");
    cy.get("div:nth-of-type(2) > button").click();
    cy.wait(5000);
    return;
  });
});
