describe("Reply Comment Functionality", () => {
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

  it("Should edit a reply comment failed", () => {
    cy.visit("http://localhost:3000/post-reviews/29");

    cy.wait(5000);

    cy.contains("This is a test reply")
      .parent()
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.get('[data-testid="menu-comment-options"]').click();
      });

    cy.get('[data-testid="update-comment-button"]').click();

    cy.get('[data-testid="update-comment-textarea"]').clear();

    cy.get('[data-testid="menu-comment-options"]').click();

    cy.get('[data-testid="update-comment-button"]').click();

    cy.wait(1000);
    cy.contains(/bình luận không được bỏ trống/i).should("exist");
  });

  it("Should edit a reply comment successfully", () => {
    cy.visit("http://localhost:3000/post-reviews/29");

    cy.wait(5000);

    cy.contains("This is a test reply")
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.get('[data-testid="menu-comment-options"]').click();
      });

    cy.get('[data-testid="update-comment-button"]').click();

    const updatedCommentContent = "This is an updated comment";
    cy.get('[data-testid="update-comment-textarea"]')
      .clear()
      .type(updatedCommentContent);

    cy.contains(updatedCommentContent)
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.get('[data-testid="menu-comment-options"]').click();
      });

    cy.get('[data-testid="update-comment-button"]').click();

    cy.wait(5000);

    cy.contains(updatedCommentContent).should("exist");
  });
});
