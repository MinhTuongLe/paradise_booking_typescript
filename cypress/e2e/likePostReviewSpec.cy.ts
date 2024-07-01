describe("Post Review Like Functionality", () => {
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

  it("Should like a post review", () => {
    cy.visit("http://localhost:3000/post-reviews/29");

    cy.wait(5000);

    cy.get('[data-testid="like-button"]').should("contain", "Thích");

    cy.get('[data-testid="like-button"]').click();

    cy.wait(5000);
    cy.get('[data-testid="like-count"]').then(($span) => {
      const likeCount = parseInt($span.text(), 10);
      cy.wrap(likeCount).should("be.gt", 0);
    });

    cy.get('[data-testid="like-button"]').click();

    cy.get('[data-testid="like-button"]').should("contain", "Thích");

    cy.get('[data-testid="like-count"]').then(($span) => {
      const likeCount = parseInt($span.text(), 10);
      cy.wrap(likeCount).should("be.lt", 1);
    });
  });
});