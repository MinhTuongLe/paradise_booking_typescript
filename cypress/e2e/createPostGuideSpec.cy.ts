import "cypress-file-upload";

// create post guide
describe("create post guide", () => {
  it("tests create post guide failed because of error fields", () => {
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
    cy.visit("http://localhost:3000/post-guiders/mine");
    cy.wait(7000);
    cy.get("div.flex > div.justify-between button").click();
    cy.get("div.h-\\[35vh\\] input").click();
    cy.get("div.h-\\[35vh\\] input").type("HCM");
    cy.wait(5000);
    cy.get("div.leaflet-control-geosearch div > div").click();
    cy.wait(5000);
    cy.get("#address").click();
    cy.get("#address").type("Thu Duc city");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.get("div.justify-center button.bg-rose-500").click();
    return;
  });
  it("tests create post guide failed because of images data", () => {
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
    cy.visit("http://localhost:3000/post-guiders/mine");
    cy.wait(7000);
    cy.get("div.flex > div.justify-between button").click();
    cy.get("div.h-\\[35vh\\] input").click();
    cy.get("div.h-\\[35vh\\] input").type("HCM");
    cy.wait(5000);
    cy.get("div.leaflet-control-geosearch div > div").click();
    cy.wait(5000);
    cy.get("#address").click();
    cy.get("#address").type("Thu Duc city");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(2000);
    cy.get("#title").click();
    cy.get("#title").type("new post title");
    cy.get("#description").click();
    cy.get("#description").type("new post desc");
    cy.get("#schedule").click();
    cy.get("#schedule").type("- new scheudle");
    cy.get("div.grid input").click();
    cy.wait(2000);
    cy.get("li:nth-of-type(2)").click();
    cy.wait(2000);
    cy.get("li:nth-of-type(10)").click();
    cy.wait(2000);
    cy.get("div.flex-auto").click();
    cy.wait(2000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(2000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(2000);
    cy.get("label").click({ multiple: true });
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
    cy.wait(10000);
    return;
  });
  it("tests create post guide successfully", () => {
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
    cy.visit("http://localhost:3000/post-guiders/mine");
    cy.wait(7000);
    cy.get("div.flex > div.justify-between button").click();
    cy.get("div.h-\\[35vh\\] input").click();
    cy.get("div.h-\\[35vh\\] input").type("HCM");
    cy.wait(5000);
    cy.get("div.leaflet-control-geosearch div > div").click();
    cy.wait(5000);
    cy.get("#address").click();
    cy.get("#address").type("Thu Duc city");
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(2000);
    cy.get("#title").click();
    cy.get("#title").type("new post title");
    cy.get("#description").click();
    cy.get("#description").type("new post desc");
    cy.get("#schedule").click();
    cy.get("#schedule").type("- new scheudle");
    cy.get("div.grid input").click();
    cy.wait(2000);
    cy.get("li:nth-of-type(2)").click();
    cy.wait(2000);
    cy.get("li:nth-of-type(10)").click();
    cy.wait(2000);
    cy.get("div.flex-auto").click();
    cy.wait(2000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(2000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(2000);
    cy.get("label").click({ multiple: true });
    const filePath = "/images/test.png";
    cy.get("#multiImageUpload").attachFile(filePath);
    cy.wait(2000);
    cy.get("label").click({ multiple: true });
    const filePath2 = "/images/test-2.jpg";
    cy.get("#multiImageUpload").attachFile(filePath2);
    cy.wait(2000);
    cy.get("label").click({ multiple: true });
    const filePath3 = "/images/test-3.jpeg";
    cy.get("#multiImageUpload").attachFile(filePath3);
    cy.wait(2000);
    cy.get("label").click({ multiple: true });
    const filePath4 = "/images/test-4.jpg";
    cy.get("#multiImageUpload").attachFile(filePath4);
    cy.wait(2000);
    cy.get("label").click({ multiple: true });
    const filePath5 = "/images/test-5.jpg";
    cy.get("#multiImageUpload").attachFile(filePath5);
    cy.wait(2000);
    cy.get("div.justify-center button.bg-rose-500").click();
    cy.wait(10000);
    return;
  });
});

// update post guide
describe("update post guide", () => {
  it("tests update post guide failed because of error fields", () => {
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
    cy.visit("http://localhost:3000/post-guiders/mine");
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) img").click();
    cy.wait(10000);
    cy.get("div.max-w-\\[1200px\\]").click();
    cy.get("#title").clear();
    cy.get("div.max-w-\\[1200px\\]").click();
    cy.get("#schedule").clear();
    cy.get("#description").click();
    cy.get("#description").clear();
    cy.get("#address").click();
    cy.get("#address").clear();
    cy.get(
      "div.max-w-\\[1200px\\] > div:nth-of-type(1) div.grid-cols-12 > div:nth-of-type(2) > button"
    ).click();
    cy.wait(5000);
    return;
  });

  it("tests update post guide failed because of images data", () => {
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
    cy.visit("http://localhost:3000/post-guiders/mine");
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) img").click();
    cy.wait(10000);
    cy.get("div.max-w-\\[1200px\\]").click();
    cy.get("#title").click();
    cy.get("#title").type("new title 2");
    cy.get("#schedule").click();
    cy.get("#schedule").type("new schedule 2");
    cy.get("#description").click();
    cy.get("#description").type("new desc 2");
    cy.get("#address").click();
    cy.get("#address").type("to ngoc van");
    cy.get(
      "div.max-w-\\[1200px\\] > div:nth-of-type(1) > div > div:nth-of-type(1) div:nth-of-type(3) label"
    ).click();
    cy.get("label").click({ multiple: true, force: true });
    cy.wait(2000);
    const filePath6 = "/images/big-image.jpg";
    cy.get("#multiImageUpload").attachFile(filePath6);
    cy.wait(3000);
    cy.get(
      "div.max-w-\\[1200px\\] > div:nth-of-type(1) div.grid-cols-12 > div:nth-of-type(2) > button"
    ).click();
    cy.wait(10000);
    return;
  });

  it("tests update post guide successfully", () => {
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
    cy.visit("http://localhost:3000/post-guiders/mine");
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) img").click();
    cy.wait(10000);
    cy.get("div.max-w-\\[1200px\\]").click();
    cy.get("#title").click();
    cy.get("#title").type("new title 2");
    cy.get("#schedule").click();
    cy.get("#schedule").type("new schedule 2");
    cy.get("#description").click();
    cy.get("#description").type("new desc 2");
    cy.get("#address").click();
    cy.get("#address").type("to ngoc van");
    cy.get(
      "div.max-w-\\[1200px\\] > div:nth-of-type(1) > div > div:nth-of-type(1) div:nth-of-type(3) label"
    ).click();
    cy.get(
      "div.max-w-\\[1200px\\] > div:nth-of-type(1) div.grid-cols-12 > div:nth-of-type(2) > button"
    ).click();
    cy.wait(10000);
    return;
  });
});

// create schedule
describe("create schedule", () => {
  it("tests create schedule successfully", () => {
    cy.visit("http://localhost:3000/");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get("div.flex-row div.absolute > div > div:nth-of-type(1) > div").click({
      force: true,
    });
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.visit("http://localhost:3000/post-guiders/mine");
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) img").click();
    cy.wait(10000);
    cy.get("#price_per_person").click();
    cy.get("#price_per_person").type("10000");
    cy.get(
      "div.max-w-\\[1200px\\] > div:nth-of-type(2) > div > div:nth-of-type(1) > div > div.w-full > label.absolute"
    ).click();
    cy.get("#note").click();
    cy.get("#note").type("Ghi chu moi");
    cy.get("#max_guest").click();
    cy.get("#max_guest").type("2");
    cy.get(
      "div.max-w-\\[1200px\\] > div:nth-of-type(2) div:nth-of-type(2) > button"
    ).click();
    cy.wait(10000);
    return;
  });
});

// update schedule
describe("update schedule", () => {
  it("tests update schedule successfully", () => {
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
    cy.visit("http://localhost:3000/post-guiders/mine");
    cy.wait(10000);
    cy.get("div.grid > div:nth-of-type(1) img").click();
    cy.wait(10000);
    cy.get(
      "div:nth-of-type(3) > div > div:nth-of-type(2) button.bg-rose-500"
    ).click();
    cy.get("#max_guest").click();
    cy.get("#max_guest").type("3");
    cy.get("#price_per_person").click();
    cy.get("#price_per_person").type("200000");
    cy.get("#note").click();
    cy.get("#note").type("Ghi chu moi nhat");
    cy.get(
      "div.max-w-\\[1200px\\] > div:nth-of-type(2) div:nth-of-type(2) > button"
    ).click();
    cy.wait(10000);
    return;
  });
});

// delete post guide
describe("delete post guide", () => {
  it("tests delete post guide successfully", () => {
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
    cy.visit("http://localhost:3000/post-guiders/mine");
    cy.get("div.grid > div:nth-of-type(1) button").click();
    cy.get("button.bg-red-600").click();
    cy.wait(10000);
    return;
  });
});
