describe("add comment failed", () => {
  it("tests add comment failed", () => {
    cy.visit("http://localhost:3000/post-reviews/29");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative > div > div").click();
    cy.get("div.absolute > div > div:nth-of-type(1) > div").click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("div.mx-auto > div:nth-of-type(2) > div.space-x-2 svg").click({
      force: true,
    });
    return;
  });

  it("tests add comment successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get("div.absolute > div > div:nth-of-type(1) > div").click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("[data-testid='comment-textarea']").click();
    cy.get("[data-testid='comment-textarea']").type("test comment");
    cy.get("div.mx-auto > div:nth-of-type(2) > div.space-x-2 path").click({
      force: true,
    });
    return;
  });

  it("tests update comment failed", () => {
    cy.visit("http://localhost:3000/post-reviews/29");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative > div > div").click();
    cy.get("div.absolute > div > div:nth-of-type(1) > div").click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get(
      "div.w-full > div:nth-of-type(1) div.flex > div > div.space-x-4"
    ).click({ multiple: true });
    cy.get("div.px-4 div.w-full > div:nth-of-type(1) svg").click({
      force: true,
    });
    cy.get(
      "div.w-full > div:nth-of-type(1) [data-testid='update-comment-button']"
    ).click();
    cy.get("[data-testid='update-comment-textarea']").click();
    cy.get("[data-testid='update-comment-textarea']").clear();
    cy.get("div.px-4 div.w-full > div:nth-of-type(1) svg").click({
      force: true,
    });
    cy.get(
      "div.w-full > div:nth-of-type(1) [data-testid='update-comment-button']"
    ).click();
    return;
  });

  it("tests update comment success", () => {
    cy.visit("http://localhost:3000/post-reviews/29");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative img").click();
    cy.get("div.absolute > div > div:nth-of-type(1) > div").click();
    cy.wait(5000);
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("div.px-4 div.w-full > div:nth-of-type(1) svg").click({
      force: true,
    });
    cy.get(
      "div.w-full > div:nth-of-type(1) [data-testid='update-comment-button']"
    ).click({ multiple: true });
    cy.get("[data-testid='update-comment-textarea']").click();
    cy.get("[data-testid='update-comment-textarea']").type(
      "test comment updated"
    );
    cy.get("div.px-4 div.w-full > div:nth-of-type(1) svg").click({
      force: true,
    });
    cy.wait(5000);
    cy.get(
      "div.w-full > div:nth-of-type(1) [data-testid='update-comment-button']"
    ).click();
    return;
  });

  it("tests delete comment", () => {
    cy.visit("http://localhost:3000/post-reviews/29");
    cy.wait(5000);
    cy.get("body > div:nth-of-type(1) div.relative > div > div").click();
    cy.get("div.absolute > div > div:nth-of-type(1) > div").click();
    cy.wait(5000);
    cy.get("div.flex-auto > div").click();
    cy.get("#email").click();
    cy.get("#email").type("leminhtuong09122002@gmail.com");
    cy.get("#password").click();
    cy.get("#password").type("Mtl@091202");
    cy.get("div.justify-center div.flex-row > button").click();
    cy.wait(5000);
    cy.get("div.px-4 div.w-full > div:nth-of-type(1) svg").click({
      force: true,
    });
    cy.wait(5000);
    cy.get(
      "div.w-full > div:nth-of-type(1) [data-testid='remove-comment-button']"
    ).click();
    cy.get("button.bg-red-600").click();
    return;
  });
});
