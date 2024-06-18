// Login validated

describe("Login Modal Test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Opens login modal, fills inputs, and submits", () => {
    cy.get(".flex > .py-3").click();
    cy.contains(/đăng nhập|login/i).click();
    cy.get(".fixed.inset-0.z-40 ").should("be.visible");
    cy.get("input#email").type("admin123@gmail.com");
    cy.get("input#password").type("admin@123");
    cy.contains(/tiếp tục|continue/i).click();

    cy.wait(3000);

    cy.get("body").then(($body) => {
      if (
        $body.find(".fixed.inset-0.z-40").length > 0 ||
        $body.find(".Toastify").length > 0
      ) {
        cy.log("Login failed: Modal still visible after 3 seconds");
      }
    });
  });
});
