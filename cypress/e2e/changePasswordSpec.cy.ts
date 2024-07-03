describe("change password", () => {
  it("empty fields", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("20022190leminhtuong@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@09122002");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/change-password");
    cy.wait(5000);
    cy.get("div.grid > div:nth-of-type(2) > button").click();
    cy.wait(5000);
    return;
  });

  it("password confirm not match", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("20022190leminhtuong@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@09122002");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/change-password");
    cy.wait(5000);
    cy.get("#old_password").click();
    cy.get("#old_password").type("Mtl@09122002");
    cy.get("#new_password").click();
    cy.get("#new_password").type("Mtl@091202");
    cy.get("#confirmed_password").click();
    cy.get("#confirmed_password").type("Mtl@0912");
    cy.get("div.pb-20 > div").click();
    cy.get("div.grid > div:nth-of-type(2) > button").click();
    cy.wait(5000);
    return;
  });

  it("password new and old duplicate", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("20022190leminhtuong@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@09122002");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/change-password");
    cy.wait(5000);
    cy.get("#old_password").click();
    cy.get("#old_password").type("Mtl@09122002");
    cy.get("#new_password").click();
    cy.get("#new_password").type("Mtl@09122002");
    cy.get("div.grid > div:nth-of-type(2) > button").click();
    cy.wait(5000);
    return;
  });

  it("current password wrong", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("20022190leminhtuong@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@09122002");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/change-password");
    cy.wait(5000);
    cy.get("#old_password").click();
    cy.get("#old_password").type("Mtl@091202");
    cy.get("#new_password").click();
    cy.get("#new_password").type("Mtl@09122002");
    cy.get("#confirmed_password").click();
    cy.get("#confirmed_password").type("Mtl@09122002");
    cy.get("div.grid > div:nth-of-type(2) > button").click();
    cy.wait(5000);
    return;
  });

  it("tests change password successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("20022190leminhtuong@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@09122002");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/change-password");
    cy.wait(5000);
    cy.get("#old_password").click();
    cy.get("#old_password").type("Mtl@09122002");
    cy.get("#new_password").click();
    cy.get("#new_password").type("Mtl@091202");
    cy.get("#confirmed_password").click();
    cy.get("#confirmed_password").type("Mtl@091202");
    cy.get("div.grid > div:nth-of-type(2) > button").click();
    cy.wait(5000);
    cy.get("div.fixed svg").click({ force: true });
    cy.get("div.hover\\:bg-neutral-100 > div").click();
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("20022190leminhtuong@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    return;
  });
});
