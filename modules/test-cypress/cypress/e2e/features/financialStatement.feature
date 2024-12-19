#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in financial statement page in drafting instance

@financialStatementPageScenarios
Feature: financial statement page regression features

  Background:
    Given navigate to edit drafting application with "User1"
    Then user is on home page

  @addAndDeleteFinancialStatement @local
  Scenario: add section for financial statement document on Proposal Screen
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Testing FS" in create document page
    And  click on create button
    Then user is on act viewer page
    And  title of the act contains "Automation Testing FS" keyword
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on milestones tab in act view page
    And  click on add button in milestones tab
    Then add milestone window is displayed
    When click on create milestone button
    Then successful message contains "Milestone created"
    And  "For Interservice Consultation" is showing under title column of row 1 of milestones table
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "View" under milestone actions
    Then user is on milestone explorer window
    And  milestone explorer window contains below tabs
      | TabName                              |
      | Explanatory Memorandum  [1.0.0]      |
      | Legal Act  [1.0.0]                   |
      | Digital Financial Statement  [1.0.0] |
      | Annex 1  [1.0.0]                     |
    When click on close button in milestone explorer view
    Then user is on act viewer page
    When click on drafts tab in act view page
    Then active tab name is "Drafts"
    When click on financial statement link present in act viewer page
    Then user is on financial statement page
    And  doctype is "LEGISLATIVE FINANCIAL AND DIGITAL STATEMENT"
    And  annotation side bar is present
    And  content of level 2 contains "[...]" in financial statement page
    When mouseover and click on level 2 in financial statement page
    Then ck editor window is displayed
    And  pTag 1 of level contains "[...]" in edition mode
    And  internal reference icon is present in ck editor panel
    When select content from offset 0 to 5 of p tag 1 of level in edition mode
    And  click delete button from keyboard in edition mode
    And  append "text" at p tag 1 of level in edition mode
    When click on internal reference icon present in ck editor panel
    Then cke dialog window is displayed with title "Internal reference"
    When click on "Having regard to the proposal from the European..." link in citations on the left side of internal reference window
    And  click on ok button in cke dialog window
    And  click save and close button of ck editor
    Then "second citation" is added as internal reference 1 of content of level 2
    Then content of level 2 contains "text" in financial statement page
    When click on edit icon of level 2 in financial statement page
    Then ck editor window is displayed
    And  header of level in financial statement is not editable in ck editor text box
    When click at offset 4 in pTag 1 with data-akn-element "subparagraph" of li with data-akn-element "level" of ol with data-akn-element "level" in edition mode
    When click enter from keyboard in edition mode
    And  append "Text..." to p tag 2 with data akn element subparagraph of level in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    And  content of subparagraph 1 of level 2 contains "text" in financial statement page
    And  content of subparagraph 2 of level 2 contains "Text..." in financial statement page
    When click on close button on financial statement page
    Then user is on act viewer page

  @finaliseFinancialStatement @local
  Scenario: finalise financial statement document
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Testing FS" in create document page
    And  click on create button
    Then user is on act viewer page
    And  title of the act contains "Automation Testing FS" keyword
    When click on financial statement link present in act viewer page
    Then user is on financial statement page
    And  doctype is "LEGISLATIVE FINANCIAL AND DIGITAL STATEMENT"
    And  content of level 2 contains "[...]" in financial statement page
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When mouseover and click on level 2 in financial statement page
    Then ck editor window is displayed
    And  pTag 1 of level contains "[...]" in edition mode
    When select content from offset 0 to 5 of p tag 1 of level in edition mode
    And  click delete button from keyboard in edition mode
    And  append "text" at p tag 1 of level in edition mode
    And  click save and close button of ck editor
    Then content of level 2 has below content
      | del | "[...]"                           |
      | ins | "text"                            |
    When click on finalise button in ribbon toolbar
    Then "Finalise Document" dialog box window is displayed
    And  dialog box body contains "All optional and tracked elements will be consolidated. Do you want to proceed?"
    When click on confirm button in dialog box window
    Then content of level 2 contains "text" in financial statement page
    When click on versions pane accordion
    And  last subversion of recent changes version card contains "1.0.1Document finalised"