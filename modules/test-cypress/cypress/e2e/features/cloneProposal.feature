#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities of clone proposal in drafting instance

@CloneProposalScenarios
Feature: clone proposal regression features

  Background:
    Given navigate to edit drafting application with "User1"
    Then user is on home page

  @forkAndMerge @nonSupportUserAccessToCloneProposal @local
  Scenario: test fork and merge of a proposal
    When click on create proposal button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Fork Merge Testing" in create document page
    And  click on create button
    Then user is on proposal viewer page
    And  title of the proposal contains "Automation Fork Merge Testing" keyword
    When click on add button in annexes section
    Then total number of annexes present in proposal viewer page is 1
    When click on add button in financial statement section
    Then delete button of financial statement is displayed
    When click on milestones tab in proposal view page
    When click on add button in milestones tab
    Then add milestone window is displayed
    When click on milestone type dropdown
    Then "For Interservice Consultation" option is selected by default
    Then milestone title textBox is disabled
    When click on option "Other" from milestone type dropdown
    And  type "Commission proposal" in milestone title textBox
    When click on create milestone button
    Then successful message contains "Milestone created"
    And  "Commission proposal" is showing under title column of row 1 of milestones table
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    Then below options are displayed under milestone actions
      | MilestoneActions             |
      | View                         |
      | Send a copy for contribution |
      | Download                     |
    When click on option "Send a copy for contribution" under milestone actions
    Then "Send a copy of the milestone for contribution" dialog box window is displayed
    And  send for contribution button is displayed but disabled
    When provide input "demo" dialog box window
    And  click on row 1 from the user list
    Then send for contribution button is displayed and enabled
    When click on send for contribution button
    Then successful message contains "Copy sent for contribution"
    Then "Sent for contribution to DEMO Demo" is showing under title column of row 2 of milestones table
    And  "Sent for contribution" is showing under status column of row 2 of milestones table
    Given navigate to edit drafting application with "User3"
    Then  user is on home page
    When  click on view all acts button
    Then  user is on repository browser page
    And  name of proposal 1 contains "Automation Fork Merge Testing"
    And  contribution status of proposal 1 contains "Sent for contribution"
    When click on proposal 1
    Then user is on proposal viewer page
    And  chip content container 1 of proposal header contains "Contribution"
    And  chip content container 2 of proposal header contains "LEOS"
    And  total number of annexes present in proposal viewer page is 1
    And  delete button of financial statement is displayed
    When click on legal act link present in proposal viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is displayed
    And  enable track changes toggle bar is on in ribbon toolbar
    And  enable track changes is disabled
    And  see track changes toggle bar is on in ribbon toolbar
    And  see track changes is enabled
    When mouseover and click on article 1
    Then ck editor window is displayed
    And  enable track changes is disabled
    And  see track changes is disabled
    When click close button of ck editor
    Then ck editor window is not displayed
    And  enable track changes is disabled
    And  see track changes is enabled