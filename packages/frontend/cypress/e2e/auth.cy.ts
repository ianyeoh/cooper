import { contract } from "@cooper/ts-rest/src/contract";
import { generateUser } from "./fakes";

const loginContract = contract.public.auth.login;

describe("auth", () => {
  it("rejects non-existent user", () => {
    cy.visit("http://localhost:3000/login");

    const user = generateUser();

    console.log(user);

    cy.get('[data-cy="username"]').type(user.username);
    cy.get('[data-cy="password"]').type(user.password);

    // Set an intercept on the login request
    cy.intercept("POST", loginContract.path).as("login");
    cy.get('[data-cy="submit"]').click();

    // Test that we get a 401 response
    cy.wait("@login").its("response.statusCode").should("eq", 401);

    // Test some sort of failed login feedback present in UI
    cy.contains("Invalid username or password");

    // Try to visit protected page
    cy.visit("http://localhost:3000/app");
    // Should fail, bring us back to login
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login");
    });
  });

  it("rejects login due to bad form entry", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('[data-cy="submit"]').click();

    // Very generic check, we don't care what text it contains because the message is tied to the Zod library
    cy.get('[data-cy="usernameFeedback"]').should("exist");
    cy.get('[data-cy="passwordFeedback"]').should("exist");

    // Try to visit protected page
    cy.visit("http://localhost:3000/app");
    // Should fail, bring us back to login
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login");
    });
  });

  it("allows switching from login to signup pages, vice versa", () => {
    cy.visit("http://localhost:3000/login");

    // Go to signup page from login
    cy.get('[data-cy="signup"]').click();
    // Did we get redirected to signup?
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/signup");
    });

    // Go to login page from signup
    cy.get('[data-cy="login"]').click();
    // Did we get redirected to login?
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login");
    });
  });

  it("rejects signup due to bad form entries", () => {
    cy.visit("http://localhost:3000/signup");

    // Submit without any values
    cy.get('[data-cy="submit"]').click();

    // Very generic check, we don't care what text it contains because the message is tied to the Zod library
    cy.get('[data-cy="usernameFeedback"]').should("exist");
    cy.get('[data-cy="firstNameFeedback"]').should("exist");
    cy.get('[data-cy="lastNameFeedback"]').should("exist");
    cy.get('[data-cy="passwordFeedback"]').should("exist");
    cy.get('[data-cy="confirmPasswordFeedback"]').should("exist");

    // We should still be on the signup page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/signup");
    });

    const user = generateUser();

    // Type in everything correctly but omit confirmPassword
    cy.get('[data-cy="username"]').type(user.username);
    cy.get('[data-cy="firstName"]').type(user.firstName);
    cy.get('[data-cy="lastName"]').type(user.lastName);
    cy.get('[data-cy="password"]').type(user.password);

    cy.get('[data-cy="submit"]').click();

    // Should display a message only for confirmPassword
    cy.get('[data-cy="usernameFeedback"]').should("not.exist");
    cy.get('[data-cy="firstNameFeedback"]').should("not.exist");
    cy.get('[data-cy="lastNameFeedback"]').should("not.exist");
    cy.get('[data-cy="passwordFeedback"]').should("not.exist");
    cy.get('[data-cy="confirmPasswordFeedback"]').should("exist");

    // We should still be on the signup page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/signup");
    });

    // Type in non-matching password in confirm field
    cy.get('[data-cy="confirmPassword"]').type(user.password + "extra-to-make-this-different");

    cy.get('[data-cy="submit"]').click();

    cy.get('[data-cy="confirmPasswordFeedback"]').should("exist");

    // We should still be on the signup page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/signup");
    });
  });

  it("allows signup, login should succeed", () => {
    cy.visit("http://localhost:3000/signup");

    const user = generateUser();

    cy.get('[data-cy="username"]').type(user.username);
    cy.get('[data-cy="firstName"]').type(user.firstName);
    cy.get('[data-cy="lastName"]').type(user.lastName);
    cy.get('[data-cy="password"]').type(user.password);
    cy.get('[data-cy="confirmPassword"]').type(user.password);

    cy.get('[data-cy="submit"]').click();

    // Should succeed, bring us back to login
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login");
    });

    // Login should succeed
    cy.get('[data-cy="username"]').type(user.username);
    cy.get('[data-cy="password"]').type(user.password);

    // Set an intercept on the login request
    cy.intercept("POST", loginContract.path).as("login");

    cy.get('[data-cy="submit"]').click();

    // Test that we get a 200 response
    cy.wait("@login").its("response.statusCode").should("eq", 200);

    // We should be redirected to main app page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/app");
    });
  });

  it("allows signup, login with bad password should fail", () => {
    cy.visit("http://localhost:3000/signup");

    const user = generateUser();

    cy.get('[data-cy="username"]').type(user.username);
    cy.get('[data-cy="firstName"]').type(user.firstName);
    cy.get('[data-cy="lastName"]').type(user.lastName);
    cy.get('[data-cy="password"]').type(user.password);
    cy.get('[data-cy="confirmPassword"]').type(user.password);

    cy.get('[data-cy="submit"]').click();

    // Should succeed, bring us back to login
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login");
    });

    // Login should fail
    cy.get('[data-cy="username"]').type(user.username);
    cy.get('[data-cy="password"]').type(user.password + "add-extra-to-invalidate");

    // Set an intercept on the login request
    cy.intercept("POST", loginContract.path).as("login");

    cy.get('[data-cy="submit"]').click();

    // Test that we get a 401 response
    cy.wait("@login").its("response.statusCode").should("eq", 401);

    // Try to access protected page
    cy.visit("http://localhost:3000/app");
    // Should fail, bring us back to login page
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq("/login");
    });
  });
});
