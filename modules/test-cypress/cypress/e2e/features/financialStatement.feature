#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in financial statement page in drafting instance

@financialStatementPageScenarios
Feature: financial statement page regression features

  Background:
    Given navigate to leos application with "User1"
    Then user is on home page

  @operationInFinancialStatement @local
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
    And  move the cursor position to offset 4 in pTag 1 of fs level in edition mode
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
    When user selects checkbox 1 of level "1.4."
    Then checkbox 1 of level "1.4." is selected
    When user selects checkbox 2 of level "1.4."
    Then checkbox 2 of level "1.4." is selected
    When user selects checkbox 3 of level "1.4."
    Then checkbox 3 of level "1.4." is selected
    When user selects checkbox 4 of level "1.4."
    Then checkbox 4 of level "1.4." is selected
    Then total number of selected checkbox inside level "1.4." is 4
    When user deselects checkbox 1 of level "1.4."
    Then checkbox 1 of level "1.4." is deselected
    And  total number of selected checkbox inside level "1.4." is 3
    When user deselects checkbox 2 of level "1.4."
    Then checkbox 2 of level "1.4." is deselected
    And  total number of selected checkbox inside level "1.4." is 2
    When user deselects checkbox 3 of level "1.4."
    Then checkbox 3 of level "1.4." is deselected
    And  total number of selected checkbox inside level "1.4." is 1
    When user deselects checkbox 4 of level "1.4."
    Then checkbox 4 of level "1.4." is deselected
    And  total number of selected checkbox inside level "1.4." is 0
    When user selects all the checkboxes of level "1.4."
    Then total number of selected checkbox inside level "1.4." is 4
    When user selects checkbox 1 of level "1.6."
    Then checkbox 1 of level "1.6." is selected
    And  total number of selected checkbox inside level "1.6." is 1
    When user selects checkbox 2 of level "1.6."
    Then checkbox 2 of level "1.6." is selected
    And  total number of selected checkbox inside level "1.6." is 2
    When user deselects checkbox 1 of level "1.6."
    Then checkbox 1 of level "1.6." is deselected
    And  total number of selected checkbox inside level "1.6." is 1
    When user deselects checkbox 2 of level "1.6."
    Then checkbox 2 of level "1.6." is deselected
    And  total number of selected checkbox inside level "1.6." is 0
    ##### Calendar field validation #####
    When click on calender field 1 of level "1.6."
    And  user selects "15.09.2023" from the calendar field 1
    And  click on calender field 2 of level "1.6."
    And  user selects "15.9.2025" from the calendar field 2
    Then calendar field 1 of level "1.6." has value "15.9.2023"
    And  calendar field 2 of level "1.6." has value "15.9.2025"
    When click on calender field 3 of level "1.6."
    And  user selects "15.10.2025" from the calendar field 3
    And  click on calender field 4 of level "1.6."
    And  user selects "15.11.2027" from the calendar field 4
    Then calendar field 3 of level "1.6." has value "2025"
    And  calendar field 4 of level "1.6." has value "2027"
    When click on close button on financial statement page
    Then user is on act viewer page
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
      | Legislative Financial and Digital Statement  [1.0.0] |
      | Annex 1  [1.0.0]                     |
    When click on close button in milestone explorer view
    Then user is on act viewer page
    When click on drafts tab in act view page
    Then active tab name is "Drafts"

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
    Then content of level 2 in financial statement page has below content
      | del | "[...]"                           |
      | ins | "text"                            |
    When click on finalise button in ribbon toolbar
    Then "Finalise Document" dialog box window is displayed
    And  dialog box body contains "All optional and tracked elements will be consolidated. Do you want to proceed?"
    When click on confirm button in dialog box window
    Then content of level 2 contains "text" in financial statement page
    When click on versions pane accordion
    And  last subversion of recent changes version card contains "1.0.1Document finalised"

  @repeatSubparagraphInFinancialStatement @local 
  Scenario: repeat subparagraph in financial statement document
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
    When click on insert after icon of repeatable subparagraph
    Then repeated subparagraph should exist
    When click on delete icon of repeated subparagraph
    Then "Delete Repeated Element: confirmation" dialog confirm box window is displayed
    When click on ok button in dialog box window
    Then repeated subparagraph should not exist
    And  click on delete icon of repeatable subparagraph 1 of level "3.2.1.1."
    Then "Delete Element: confirmation" dialog confirm box window is displayed
    When click on ok button in dialog box window
    Then repeatable subparagraph 1 of level "3.2.1.1." contains attribute name "leos:softaction" with value "del"
    When right click on repeatable subparagraph 1 of level "3.2.1.1."
    And  click on accept this change option under track changes action
    Then "Optional element: accept deletion not allowed" dialog confirm box window is displayed
    When click on ok button in dialog box window
    Then repeatable subparagraph 1 of level "3.2.1.1." contains attribute name "leos:softaction" with value "del"
    When right click on repeatable subparagraph 1 of level "3.2.1.1."
    And  click on reject this change option under track changes action
    Then repeatable subparagraph 1 of level "3.2.1.1." does not contain attribute name "leos:softaction" with value "del"
    When enable track changes
    Then enable track changes toggle bar is on in ribbon toolbar
    When click on insert after icon of repeatable subparagraph
    Then repeated subparagraph should exist
    When click on delete icon of repeated subparagraph
    Then "Delete Element: confirmation" dialog confirm box window is displayed
    When click on ok button in dialog box window
    Then repeated subparagraph should exist
    Then repeated subparagraph should have track changes action delete
    And  click on delete icon of repeatable subparagraph 1 of level "3.2.1.2."
    Then "Delete Element: confirmation" dialog confirm box window is displayed
    When click on ok button in dialog box window
    Then repeatable subparagraph 1 of level "3.2.1.2." contains attribute name "leos:softaction" with value "del"
    When right click on repeatable subparagraph 1 of level "3.2.1.2."
    And  click on accept this change option under track changes action
    Then "Optional element: accept deletion not allowed" dialog confirm box window is displayed
    When click on ok button in dialog box window
    Then repeatable subparagraph 1 of level "3.2.1.2." contains attribute name "leos:softaction" with value "del"
    When right click on repeatable subparagraph 1 of level "3.2.1.2."
    When click on reject this change option under track changes action
    Then repeatable subparagraph 1 of level "3.2.1.2." does not contain attribute name "leos:softaction" with value "del"




  @repeatSubparagraphGroupInFinancialStatement @local
  Scenario: repeat subparagraph group in financial statement document
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
    When click on insert group after icon of repeatable subparagraph
    Then repeated subparagraph group after should exist
    When click on insert group before icon of repeatable subparagraph
    Then repeated subparagraph group before should exist

  @LFDSConfiguration @local
  Scenario: LFDS configuration of document depending on template
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Testing LFDS configuration SJ-023" in create document page
    And  click on create button
    Then user is on act viewer page
    And  delete button of financial statement is displayed
    When click on delete button of financial statement
    Then "Legislative Financial and Digital Statement deletion: confirmation" dialog box window is displayed
    And  dialog box body contains "Are you sure you want to delete the Legislative Financial and Digital Statement?"
    And  dialog box body contains "The absence of digital dimensions should be explained in the Explanatory Memorandum"
    When click on delete button in dialog box window
    Then " There is no Legislative Financial and Digital Statement " is displayed
    And  add button is displayed under financial statement section
    When click on add button in financial statement section
    Then delete button of financial statement is displayed
    When click on home button
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-025" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Testing LFDS configuration SJ-025" in create document page
    And  click on create button
    Then user is on act viewer page
    And  " There is no Legislative Financial and Digital Statement " is displayed
    And  add button is displayed under financial statement section
    When click on add button in financial statement section
    Then delete button of financial statement is displayed
    When click on delete button of financial statement
    Then "Legislative Financial and Digital Statement deletion: confirmation" dialog box window is displayed
    And  dialog box body contains "Are you sure you want to delete the Legislative Financial and Digital Statement?"
    And  dialog box body doesn't contain "The absence of digital dimensions should be explained in the Explanatory Memorandum"
    When click on delete button in dialog box window
    Then " There is no Legislative Financial and Digital Statement " is displayed
    And  add button is displayed under financial statement section

  @SomeSceneriosWithPredefinedTable @local
  Scenario: Predefined table in financial statement document
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
    When click on financial statement link present in act viewer page
    Then user is on financial statement page
    When user scroll subparagraph 3 of landscape level 2 in financial statement page
    Then table 1 of content 1 of subparagraph 3 of landscape level 2 contains an attribute "leos:predefinedtable" with value "true"
    When click on edit icon of subparagraph 3 of landscape level 2 in financial statement page
    Then ck editor window is displayed
    And landscape level 2 contains an attribute "leos:deletable" with value "false"
    When click close button of ck editor
    Then ck editor window is not displayed
    When user scroll subparagraph 4 of landscape level 5 in financial statement page
    Then subparagraph 4 of landscape level 5 contains an attribute "leos:optional" with value "true"
    And  table 1 of content 1 of subparagraph 4 of landscape level 5 contains an attribute "leos:predefinedtable" with value "true"
    When click on edit icon of subparagraph 4 of landscape level 5 in financial statement page
    Then ck editor window is displayed
    And landscape level 5 contains an attribute "leos:deletable" with value "false"
    When click close button of ck editor
    Then ck editor window is not displayed








