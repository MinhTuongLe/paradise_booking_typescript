import "cypress-file-upload";

const filePath = "/images/test.png";
const filePath2 = "/images/big-image.jpg";
describe("create post review", () => {
  it("tests create post review failed because of error fields", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/post-reviews/mine/103");
    cy.wait(10000);
    cy.get("div.mt-10 svg").click();
    cy.wait(5000);
    cy.get("div.h-\\[35vh\\] input").click();
    cy.wait(3000);
    cy.get("div.h-\\[35vh\\] input").type("HCM");
    cy.wait(3000);
    cy.get("div.leaflet-control-geosearch div > div").click();
    cy.wait(3000);
    cy.get("div.justify-center > div > div > div > div.flex-col button").click({
      multiple: true,
    });
    cy.wait(5000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(5000);
    return;
  });

  it("tests create post review failed because of image data", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/post-reviews/mine/103");
    cy.wait(10000);
    cy.get("div.mt-10 svg").click();
    cy.wait(5000);
    cy.get("div.h-\\[35vh\\] input").click();
    cy.wait(3000);
    cy.get("div.h-\\[35vh\\] input").type("HCM");
    cy.wait(3000);
    cy.get("div.leaflet-control-geosearch div > div").click();
    cy.wait(3000);
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.wait(3000);
    cy.get("#title").click();
    cy.get("#title").type("post review title");
    cy.get("body > div:nth-of-type(1) textarea").click();
    cy.get("body > div:nth-of-type(1) textarea").type("post review desc");
    cy.get(
      "div.text-md > div > div:nth-of-type(1) path:nth-of-type(1)"
    ).click();
    cy.get("div:nth-of-type(4) label").click();
    cy.wait(3000);
    cy.get("#multiImageUpload").attachFile(filePath2);
    cy.wait(5000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });

  it("tests create post review successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/post-reviews/mine/103");
    cy.wait(10000);
    cy.get("div.mt-10 svg").click();
    cy.wait(5000);
    cy.get("div.h-\\[35vh\\] input").click();
    cy.wait(3000);
    cy.get("div.h-\\[35vh\\] input").type("HCM");
    cy.wait(3000);
    cy.get("div.leaflet-control-geosearch div > div").click();
    cy.wait(3000);
    cy.get(
      "div.justify-center > div > div > div > div.flex-col button"
    ).click();
    cy.wait(3000);
    cy.get("#title").click();
    cy.get("#title").type("post review title");
    cy.get("body > div:nth-of-type(1) textarea").click();
    cy.get("body > div:nth-of-type(1) textarea").type("post review desc");
    cy.get(
      "div.text-md > div > div:nth-of-type(1) path:nth-of-type(1)"
    ).click();
    cy.get("div:nth-of-type(4) label").click();
    cy.wait(3000);
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.wait(5000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });
});

describe("update post review", () => {
  it("tests update post review failed because of error fields", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/post-reviews/mine/103");
    cy.wait(10000);
    cy.get(
      "div.pb-20 div > div:nth-of-type(2) div.px-4 > div:nth-of-type(1) svg"
    ).click({ force: true });
    cy.get("div.border-b-\\[1px\\] > span").click();
    cy.wait(5000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(5000);
    cy.get("#title").click();
    cy.get("#title").clear();
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(5000);
    return;
  });

  it("tests update post review failed because of image data", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/post-reviews/mine/103");
    cy.wait(10000);
    cy.get(
      "div.pb-20 div > div:nth-of-type(2) div.px-4 > div:nth-of-type(1) svg"
    ).click({ force: true });
    cy.get("div.border-b-\\[1px\\] > span").click();
    cy.wait(5000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(5000);
    cy.get("div:nth-of-type(4) label").click();
    cy.get("#multiImageUpload").attachFile(filePath2);
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(5000);
    return;
  });

  it("tests update post review successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/post-reviews/mine/103");
    cy.wait(10000);
    cy.get(
      "div.pb-20 div > div:nth-of-type(2) div.px-4 > div:nth-of-type(1) svg"
    ).click({ force: true });
    cy.get("div.border-b-\\[1px\\] > span").click();
    cy.wait(5000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(5000);
    cy.get("#title").click();
    cy.get("#title").type("post review title new");
    cy.get("body > div:nth-of-type(1) textarea").click();
    cy.get("body > div:nth-of-type(1) textarea").type("post review desc new");
    cy.get("div:nth-of-type(4) label").click();
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.wait(3000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });
});

describe("delete post review", () => {
  it("tests delete post review successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("div.flex-row > div.relative > div > div > div").click();
    cy.get(
      "div.flex-row div.absolute > div > div:nth-of-type(1) > div"
    ).click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/post-reviews/mine/103");
    cy.wait(10000);
    cy.get(
      "div.pb-20 div > div:nth-of-type(2) div.px-4 > div:nth-of-type(1) svg"
    ).click({ force: true });
    cy.get(
      "div.pb-20 div.px-4 > div:nth-of-type(1) div:nth-of-type(2) > span"
    ).click();
    cy.wait(2000);
    cy.get("button.bg-red-600").click();
    cy.wait(5000);
    return;
  });
});
