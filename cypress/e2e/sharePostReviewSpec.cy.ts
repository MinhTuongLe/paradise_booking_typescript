describe("Share Post Guider Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng nhập|login/i).click();
    cy.get(".fixed.inset-0.z-40").should("be.visible");

    cy.get("input#email").type("leminhtuong09122002@gmail.com");
    cy.get("input#password").type("Mtl@091202");
    cy.contains(/tiếp tục|continue/i).click();

    cy.wait(3000);
  });

  it("Copy Link successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29");

    cy.wait(5000);

    cy.get(".flex.items-center.justify-between.cursor-pointer.relative")
      .first()
      .click();

    cy.get(".absolute.grid.grid-cols-2.space-x-4.px-6.py-5").should(
      "be.visible"
    );

    cy.contains(/sao chép liên kết/i).should("be.visible");
  });

  it("Share on Facebook successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29");

    cy.wait(5000);

    cy.get(".flex.items-center.justify-between.cursor-pointer.relative")
      .first()
      .click();

    cy.get(".absolute.grid.grid-cols-2.space-x-4.px-6.py-5").should(
      "be.visible"
    );

    cy.contains("Facebook").should("be.visible");
  });

  it("Share on Whatsapp successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29");

    cy.wait(5000);

    cy.get(".flex.items-center.justify-between.cursor-pointer.relative")
      .first()
      .click();

    cy.get(".absolute.grid.grid-cols-2.space-x-4.px-6.py-5").should(
      "be.visible"
    );

    cy.contains("Whatsapp").should("be.visible");
  });

  it("Share on Twitter successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29");

    cy.wait(5000);

    cy.get(".flex.items-center.justify-between.cursor-pointer.relative")
      .first()
      .click();

    cy.get(".absolute.grid.grid-cols-2.space-x-4.px-6.py-5").should(
      "be.visible"
    );

    cy.contains("Twitter").should("be.visible");
  });

  it("Share on Telegram successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29");

    cy.wait(5000);

    cy.get(".flex.items-center.justify-between.cursor-pointer.relative")
      .first()
      .click();

    cy.get(".absolute.grid.grid-cols-2.space-x-4.px-6.py-5").should(
      "be.visible"
    );

    cy.contains("Telegram").should("be.visible");
  });

  it("Share on Email successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29");

    cy.wait(5000);

    cy.get(".flex.items-center.justify-between.cursor-pointer.relative")
      .first()
      .click();

    cy.get(".absolute.grid.grid-cols-2.space-x-4.px-6.py-5").should(
      "be.visible"
    );

    cy.contains("Email").should("be.visible");
  });
});
