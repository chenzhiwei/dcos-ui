describe("Tracking Plugin Enabled [02w]", function() {

  beforeEach(function() {
    cy.configureCluster({
      mesos: "1-task-healthy",
      acl: true,
      plugins: "tracking-enabled"
    })
    .visitUrl({url: "/", identify: true});
  });

  context("Sidebar [02x]", function() {
    it("should have three sidebar icons [02y]", function() {
      cy.get(".sidebar-footer").find(".button").should("to.have.length", 3);
    })
  });

  context("Welcome Modal [02z]", function() {
    it("should not show modal when 'email' in localStorage [030]", function() {
      cy.get(".modal").should("not");
    });

    context("New User [037]", function() {
      beforeEach(function() {
        cy.clearLocalStorage().visit("http://localhost:4200/");
      });

      it("should show modal when no 'email' in localStorage [031]", function() {
        cy.get(".modal");
      });
    });

  });
});

describe("Tracking Plugin Disabled [03d]", function() {

  beforeEach(function() {
    cy.configureCluster({
      mesos: "1-task-healthy",
      acl: true,
      plugins: "tracking-disabled"
    })
    .clearLocalStorage()
    .visitUrl({url: "/"});
  });

  context("Sidebar [03c]", function() {
    it("should have no sidebar icons [03e]", function() {
      cy.get(".sidebar-footer").find(".button").should("to.have.length", 0);
    })
  });

  context("Welcome Modal [03f]", function() {
    it("should not show modal when no email in localStorage [03g]", function() {
      cy.get(".modal").should("not");
    });

    context("Email in localStorage [03h]", function() {
      beforeEach(function() {
        cy.visitUrl({url: "/", identify: true, fakeAnalytics: true});
      });

      it("should not show modal when 'email' in localStorage [03i]",
        function() {
          cy.get(".modal").should("not");
        }
      );
    });

  });
});
