// cypress/integration/loginModal.spec.ts
describe("Login Modal Test", () => {
  beforeEach(() => {
    // Load your application URL before each test
    cy.visit("http://localhost:3000");
  });

  it("Opens login modal, fills inputs, and submits", () => {
    // Click on the menu button to open the user menu
    cy.get(".flex > .py-3").click(); // Replace with your actual selector if needed

    // Click on the login option in the menu
    cy.contains(/đăng nhập|login/i).click(); // Regex to match "đăng nhập" case insensitive

    // Wait for the login modal to appear and verify it is visible
    cy.get(".fixed.inset-0.z-40 ").should("be.visible"); // Replace with your actual modal selector

    // Fill in email input
    cy.get("input#email").type("admin@gmail.com");

    // Fill in password input
    cy.get("input#password").type("admin@123");

    // Click on the continue button or submit the form
    cy.contains(/tiếp tục/i).click(); // Replace 'Tiếp tục' with your actual continue button text

    // Assert if the page contains "Tài khoản" text
    cy.contains(/tài khoản|accounts/i).should("be.visible");

    // Assert if the page contains "Báo cáo" text
    cy.contains(/báo cáo|reports/i).should("be.visible");
  });
});
