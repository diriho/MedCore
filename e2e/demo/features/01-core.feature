Feature: 01 Core workflow
  A doctor signs in and opens a patient chart. The AI panel auto-loads a
  pre-visit summary alongside the chart — no manual trigger.

  Scenario: Doctor signs in and opens a patient chart
    Given I am on the home page
    When I fill "user id" with "DOC-001"
    And I fill "pin" with "4242"
    And I click the "sign in" button
    And I navigate to "/patients/PAT-001"
    Then I should see "Amina"
