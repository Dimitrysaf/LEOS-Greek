#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities related to create act in drafting instance

@createProposalScenarios
Feature: create act regression features

  @createProposalFromTemplate
  Scenario Outline: user is able to create the act using different templates successfully
    Given navigate to leos application with "username1"
    Then user is on home page
    When click on create act button
    Then user is on create new legislative document window
    When click on template "<templateProposal>" in create new legislative document window
    When click on next button in create document page
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    And  provide document title "<oldProposalName>" in create document page
    And  click on create button
    Then user is on act view page
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on close button on act viewer page
    Then user is on repository browser page
    Examples:
      | templateProposal | oldProposalName              | NewProposalName              |
      | SJ-023           | Automation Testing SJ-023 v1 | Automation Testing SJ-023 v2 |
#            | SJ-024           | Automation Testing SJ-024 v1 | Automation Testing SJ-024 v2 |
#            | SJ-025           | Automation Testing SJ-025 v1 | Automation Testing SJ-025 v2 |
#            | SJ-026           | Automation Testing SJ-026 v1 | Automation Testing SJ-026 v2 |
#            | SJ-019           | Automation Testing SJ-019 v1 | Automation Testing SJ-019 v2 |