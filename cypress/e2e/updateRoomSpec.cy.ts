import "cypress-file-upload";

describe("update place", () => {
  it("tests update place failed because of form fields", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("mt09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/properties/118");
    cy.wait(10000);
    cy.get("#description").clear();
    cy.get("#name").clear();
    cy.get("div.pb-20 > div > div > div").click();
    cy.get("div:nth-of-type(2) > button").click();
    cy.wait(5000);
    return;
  });

  it("tests update place failed", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("mt09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/properties/118");
    cy.wait(10000);
    cy.get(
      "div.pb-20 > div > div > div > div:nth-of-type(1) div:nth-of-type(4) svg"
    ).click();
    cy.get("div:nth-of-type(4) label").click();
    cy.wait(5000);
    const filePath = "/images/big-image.jpg";
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.wait(5000);
    cy.get("div:nth-of-type(2) > button").click();
    cy.wait(10000);
    return;
  });

  it("tests update place", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("mt09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/properties/118");
    cy.wait(10000);
    cy.get("#name").click();
    cy.get("#name").type("Hoàng Diệu 2, Linh Chiểu, Thủ Đức");
    cy.get("#description").click();
    cy.get("#description").type("Hoàng Diệu 2, Linh Chiểu, Thủ Đức");
    cy.get("#max_guest").click();
    cy.get("#max_guest").type("2");
    cy.get("#price_per_night").click();
    cy.get("#price_per_night").type("1000000");
    cy.get("#num_bed").click();
    cy.get("#num_bed").type("2");
    cy.get("#bed_room").click();
    cy.get("#bed_room").type("3");
    cy.get("#address").click();
    cy.get(
      "div.pb-20 > div > div > div > div:nth-of-type(1) div:nth-of-type(4) svg"
    ).click({ force: true });
    cy.get("div:nth-of-type(4) label").click();
    const filePath = "/images/test.png";
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.wait(5000);
    cy.get("div:nth-of-type(2) > button").click();
    cy.wait(10000);
    return;
  });
});
