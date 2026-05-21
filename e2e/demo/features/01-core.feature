Feature: 01 Core workflow
  A doctor signs in, opens a patient chart, and asks the AI assistant for a summary.
  This is the headline demo: it covers the canonical journey from auth to AI assist.

  Scenario: Doctor opens a patient chart and asks for an AI summary
    Given I am on the home page
    When I fill "user id" with "DOC-001"
    And I fill "pin" with "4242"
    And I click the "sign in" button
    Then the URL should contain "/dashboard"
    When I navigate to "/patients/PAT-001"
    Then I should see "Amina"
    When I click the "AI summary" button
    Then I should see "summary"
