Feature: 00 Warmup
  Two throwaway scenarios that absorb the Playwright 0-byte first-test bug.
  The custom reporter detects them by feature-slug prefix and discards the videos.

  Scenario: Warmup A
    Given I am on the home page

  Scenario: Warmup B
    Given I am on the home page
