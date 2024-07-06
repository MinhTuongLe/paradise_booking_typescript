import "cypress-file-upload";

describe("create place", () => {
  it("tests create place error because of error fields", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.get('span.hover\\:\\"text-rose-500').click();
    cy.wait(5000);
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.wait(5000);
    cy.get("#address").click();
    cy.get("#address").type("thu duc");
    cy.wait(3000);
    cy.get("div.h-\\[35vh\\] input").click();
    cy.get("div.h-\\[35vh\\] input").type("hcm");
    cy.wait(3000);
    cy.get("div.leaflet-control-geosearch div > div").click();
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(3000);
    const filePath = "/images/test.png";
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath2 = "/images/test-2.jpg";
    cy.get("#multiImageUpload").attachFile(filePath2);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath3 = "/images/test-3.jpeg";
    cy.get("#multiImageUpload").attachFile(filePath3);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath4 = "/images/test-4.jpg";
    cy.get("#multiImageUpload").attachFile(filePath4);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath5 = "/images/test-5.jpg";
    cy.get("#multiImageUpload").attachFile(filePath5);
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(5000);
    return;
  });

  it("tests create place error because of images data", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.get('span.hover\\:\\"text-rose-500').click();
    cy.wait(5000);
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.wait(5000);
    cy.get("#address").click();
    cy.get("#address").type("thu duc");
    cy.wait(3000);
    cy.get("div.h-\\[35vh\\] input").click();
    cy.get("div.h-\\[35vh\\] input").type("hcm");
    cy.wait(3000);
    cy.get("div.leaflet-control-geosearch div > div").click();
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(3000);
    const filePath = "/images/test.png";
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath2 = "/images/test-2.jpg";
    cy.get("#multiImageUpload").attachFile(filePath2);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath3 = "/images/test-3.jpeg";
    cy.get("#multiImageUpload").attachFile(filePath3);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath4 = "/images/test-4.jpg";
    cy.get("#multiImageUpload").attachFile(filePath4);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath5 = "/images/test-5.jpg";
    cy.get("#multiImageUpload").attachFile(filePath5);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath6 = "/images/big-image.jpg";
    cy.get("#multiImageUpload").attachFile(filePath6);
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(3000);
    cy.get("#name").click();
    cy.get("#name").type("Test place title");
    cy.get("#description").click();
    cy.get("#description").type("Test place desc");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });

  it("tests create place successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.get('span.hover\\:\\"text-rose-500').click();
    cy.wait(5000);
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.wait(5000);
    cy.get("#address").click();
    cy.get("#address").type("thu duc");
    cy.wait(3000);
    cy.get("div.h-\\[35vh\\] input").click();
    cy.get("div.h-\\[35vh\\] input").type("hcm");
    cy.wait(3000);
    cy.get("div.leaflet-control-geosearch div > div").click();
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(3000);
    const filePath = "/images/test.png";
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath2 = "/images/test-2.jpg";
    cy.get("#multiImageUpload").attachFile(filePath2);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath3 = "/images/test-3.jpeg";
    cy.get("#multiImageUpload").attachFile(filePath3);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath4 = "/images/test-4.jpg";
    cy.get("#multiImageUpload").attachFile(filePath4);
    cy.wait(3000);
    cy.get("label").click({ multiple: true });
    const filePath5 = "/images/test-5.jpg";
    cy.get("#multiImageUpload").attachFile(filePath5);
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(3000);
    cy.get("#name").click();
    cy.get("#name").type("Test place title");
    cy.get("#description").click();
    cy.get("#description").type("Test place desc");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });
});

describe("update place", () => {
  it("tests update place field because of error fields", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.visit("http://localhost:3000/properties");
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) img").click();
    cy.wait(10000);
    cy.get("#name").click();
    cy.get("#name").clear();
    cy.get("#description").click();
    cy.get("#description").clear();
    cy.get("#address").click();
    cy.get("#address").clear();
    cy.get("div:nth-of-type(2) > button").click();
    cy.wait(5000);
    return;
  });

  it("tests update place field because of images data", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.visit("http://localhost:3000/properties");
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) img").click();
    cy.wait(10000);
    cy.get("div:nth-of-type(4) label").click();
    const filePath6 = "/images/big-image.jpg";
    cy.get("#multiImageUpload").attachFile(filePath6);
    cy.wait(3000);
    cy.get("div:nth-of-type(2) > button").click();
    cy.wait(10000);
    return;
  });

  it("tests update place successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.visit("http://localhost:3000/properties");
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) img").click();
    cy.wait(10000);
    cy.get("#name").click();
    cy.get("#name").type(" 2");
    cy.get("#description").click();
    cy.get("#description").type(" 2");
    cy.get("#price_per_night").click();
    cy.get("#price_per_night").type("100000");
    cy.get("div:nth-of-type(2) > button").click();
    cy.wait(10000);
    return;
  });
});

describe("delete place successfully", () => {
  it("tests delete place successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
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
    cy.visit("http://localhost:3000/properties");
    cy.get("div.grid > div:nth-of-type(1) button").click();
    cy.wait(3000);
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    return;
  });
});
