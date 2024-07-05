import "cypress-file-upload";

describe("report", () => {
  const filePath = "/images/test.png";

  it("tests report place", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click();
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
    cy.get("div.order-first > div.flex span").click();
    cy.wait(5000);
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.get("textarea").click();
    cy.get("textarea").type("Vấn đề khác");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.get("div.flex-auto > div > div:nth-of-type(2) label").click();
    cy.wait(5000);
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });

  it("tests report post guide", () => {
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
    cy.visit("http://localhost:3000/post-guiders/15");
    cy.wait(7000);
    cy.get("div.order-first span").click();
    cy.wait(5000);
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.get("textarea").click();
    cy.get("textarea").type("Không có thông tin chính xác");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.get("div.flex-auto > div > div:nth-of-type(2) label").click();
    cy.wait(5000);
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });

  it("tests report post review", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click();
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
    cy.visit("http://localhost:3000/post-reviews/22");
    cy.wait(7000);
    cy.get("div.pb-20 div.px-4 > div.flex svg").click();
    cy.wait(5000);
    cy.get("div.flex > div.justify-between p").click();
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.get("body > div:nth-of-type(1) textarea").click();
    cy.get("body > div:nth-of-type(1) textarea").type("Thông tin sai lệch");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.get("div.flex-auto > div > div:nth-of-type(2) label").click();
    cy.wait(5000);
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });

  it("tests report post review comment", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.fixed > div > div > div.flex-row svg").click();
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
    cy.visit("http://localhost:3000/post-reviews/29");
    cy.wait(7000);
    cy.get("div.mx-auto > div:nth-of-type(2) > div.w-full svg").click();
    cy.wait(5000);
    cy.get("[data-testid='menu-comment-options'] p").click();
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.get("body > div:nth-of-type(1) textarea").click();
    cy.get("body > div:nth-of-type(1) textarea").type(
      "Thông tin không chính xác"
    );
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.get("div.flex-auto > div > div:nth-of-type(2) div.w-full").click();
    cy.get("div.flex-auto > div > div:nth-of-type(2) label").click();
    cy.wait(5000);
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });

  it("tests report account", () => {
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
    cy.visit("http://localhost:3000/users/100");
    cy.wait(7000);
    cy.get("div.xl\\:col-span-4 > div.w-full span").click();
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.get("textarea").click();
    cy.get("textarea").type("Thông tin không rõ ràng");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.get("div.flex-auto > div > div:nth-of-type(2) label").click();
    cy.wait(5000);
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });
});
