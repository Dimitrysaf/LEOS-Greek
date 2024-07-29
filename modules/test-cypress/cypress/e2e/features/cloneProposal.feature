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

#  @moveLabelWithTrackChanges @local @focus
#  Scenario: Basic test to move element inside legal act when track changes is on
#    Given navigate to edit drafting application with "User1"
#    Then user is on home page
#    When click on upload button
#    Then active upload window label contains "Upload a legislative document"
#    When upload a leg file from a relative location "PROP_ACT-clymts48h00018g73xyrc19ma-en.leg"
#    Then active upload window label contains "Document metadata"
#    And  document title input field is displayed
#    When click on create button in upload document page
#    Then user is on proposal viewer page
#    When click on add button in annexes section
#    Then total number of annexes present in proposal viewer page is 1
#    When click on milestones tab in proposal view page
#    When click on add button in milestones tab
#    And  click on create milestone button
#    Then successful message contains "Milestone created"
#    And  "File ready" is showing under status column of row 1 of milestones table
#    When click on three dots under actions column of row 1 of milestones table
#    When click on option "Send a copy for contribution" under milestone actions
#    Then "Send a copy of the milestone for contribution" dialog box window is displayed
#    When provide input "demo" dialog box window
#    And  click on row 1 from the user list
#    And  click on send for contribution button
#    Then successful message contains "Copy sent for contribution"
#    When click on workspace button in breadcrumb item
#    Then user is on repository browser page
#    When click on proposal 2
#    Then user is on proposal viewer page
#    And  chip content container 1 of proposal header contains "Contribution"
#    And  chip content container 2 of proposal header contains "LEOS"
#    When click on legal act link present in proposal viewer page
#    Then user is on legal act page
#    And  annotation side bar is present
#    And  enable track changes toggle bar is on in ribbon toolbar
#    When click on toc edit button
#    And  click on "Article 1 - Scope 1. Text..." link in navigation pane
#    And  drag node label "Article 1 - Scope 1. Text..." and drop to node label "Article 3 - Entry into force This Regulation shall enter into force on the [...] day following that of its publication in the Official Journal of the European Union." in navigation pane
#    And  " Article  1" is showing as soft move title in navigation pane
#    And  "MOVED" is showing as soft move label with soft move title " Article  1" in navigation pane
#    And  " Article  #" is showing as soft move title in selected node in navigation pane
#    And  "MOVED" is showing as soft move label with soft move title " Article  #" in selected node in navigation pane
#    When click on save and close button in navigation pane
#    Then toc editing button is displayed and enabled
#    And  " Article  1" is showing as soft move title in navigation pane
#    And  "MOVED" is showing as soft move label with soft move title " Article  1" in navigation pane
#    And  " Article  3" is showing as soft move title in navigation pane
#    And  "MOVED" is showing as soft move label with soft move title " Article  3" in navigation pane
#    And "Article 1" is showing as moved num in article 1 of bill
#    And "MOVED to Article 3" is showing as soft move label in article 1 of bill
#    And heading tag is not present for article 1 of bill
#    And paragraph tag is not present for article 1 of bill
#    And "Article 2" is showing as deleted track changes in article 2 of bill
#    And "Article 1" is showing as inserted track changes in article 2 of bill
#    And "Article 3" is showing as deleted track changes in article 3 of bill
#    And "Article 2" is showing as inserted track changes in article 3 of bill
#    And num of article 4 of bill contains "Article 3" with action "insert"
#    And "MOVED from Article 1" is showing as soft move label in article 4 of bill
#    And heading tag is present for article 4 of bill
#    And paragraph tag is present for article 4 of bill
#    When click on "Article 4 - Subject matter and scope" link in navigation pane
#    Then article 5 is displayed
#    When mouseover and click on article 5
#    Then ck editor window is displayed
#    When click at offset 8 in li 2 with data-akn-element "point" of li 3 with data-akn-element "paragraph" of article in edition mode
#    And  do right click using mouse in edition mode
#    And  click on option "Move this point to..." in "cke_panel_frame" iframe
#    Then background color of li 2 with data-akn-element "point" of li 3 with data-akn-element "paragraph" of article is "cornsilk" in edition mode
#    And  li 2 with data-akn-element "point" of li 3 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-attr-softaction" in edition mode
#    When click at offset 190 in li 1 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article in edition mode
#    And  click enter from keyboard in edition mode
#    Then li 2 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
#    When do right click using mouse in edition mode
#    And  mouseover on option "Move here" in "cke_panel_frame" iframe
#    And  click on sub option "As point" in "cke_panel_frame" iframe
#    Then li 2 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-attr-softaction" with value "move_from" in edition mode
#    And  li 2 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "NEW" in edition mode
#    And  li 2 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article contains attribute "new" in edition mode
#    And  li 2 with data-akn-element "point" of li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-attr-softaction" with value "move_to" in edition mode
#    When click save and close button of ck editor
#    Then ck editor window is not displayed
#    And  point 2 of paragraph 3 of article 5 contains attribute "leos:action" with value "delete"
#    And  point 2 of paragraph 3 of article 5 contains attribute "leos:softaction" with value "move_to"
#    And  point 2 of paragraph 3 of article 5 contains attribute "leos:softmove_label" with value "MOVED to Article 4(4), point (b)"
#    And  point 2 of paragraph 3 of article 5 contains attribute "leos:origin" with value "ec"
#    And  point 2 of paragraph 3 of article 5 contains attribute "leos:softactionroot" with value "true"
#    And  point 2 of paragraph 4 of article 5 contains attribute "leos:action" with value "insert"
#    And  point 2 of paragraph 4 of article 5 contains attribute "leos:softaction" with value "move_from"
#    And  point 2 of paragraph 4 of article 5 contains attribute "leos:softmove_label" with value "MOVED from Article 4(3), point (b)"
#    And  point 2 of paragraph 4 of article 5 contains attribute "leos:origin" with value "ec"
#    And  point 2 of paragraph 4 of article 5 contains attribute "leos:softactionroot" with value "true"
#    When click on "Article 4 - Subject matter and scope" link in navigation pane
#    Then article 5 is displayed
#    When mouseover and click on article 5
#    Then ck editor window is displayed
#    When click at offset 12 of li 2 with data-akn-element "paragraph" of article in edition mode
#    And  do right click using mouse in edition mode
#    And  click on option "Move this paragraph to..." in "cke_panel_frame" iframe
#    Then background color of li 1 with data-akn-element "paragraph" of article is "cornsilk" in edition mode
#    And  li 1 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-attr-softaction" in edition mode
#    And  li 1 with data-akn-element "paragraph" of article contains attribute "class" with value "selectedMovedElement" in edition mode
#    When  click on "Article 8 - Disproportionate burden" link in navigation pane
#    Then article 9 is displayed
#    When mouseover and click on article 9
#    Then ck editor window is displayed
#    When click at offset 245 of li 3 with data-akn-element "paragraph" of article in edition mode
#    And  click enter from keyboard in edition mode
#    Then li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
#    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "4." in edition mode
#    And  li 4 with data-akn-element "paragraph" of article contains attribute "new" in edition mode
#    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "NEW" in edition mode
#    When do right click using mouse in edition mode
#    And  mouseover on option "Move here" in "cke_panel_frame" iframe
#    And  click on sub option "As paragraph" in "cke_panel_frame" iframe
#    Then li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-attr-softaction" with value "move_from" in edition mode
#    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-action" with value "insert" in edition mode
#    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-attr-softactionroot" with value "true" in edition mode
#    And  li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "4." in edition mode
#    When click save and close button of ck editor
#    Then ck editor window is not displayed
#    And  paragraph 2 of article 5 contains attribute "leos:action" with value "delete"
#    And  paragraph 2 of article 5 contains attribute "leos:softaction" with value "move_to"
#    And  paragraph 2 of article 5 contains attribute "leos:softmove_label" with value "MOVED to Article 8(4)"
#    And  paragraph 2 of article 5 contains attribute "leos:origin" with value "ec"
#    And  paragraph 2 of article 5 contains attribute "leos:softactionroot" with value "true"
#    And  paragraph 4 of article 9 contains attribute "leos:action" with value "insert"
#    And  paragraph 4 of article 9 contains attribute "leos:softaction" with value "move_from"
#    And  paragraph 4 of article 9 contains attribute "leos:softmove_label" with value "MOVED from Article 4(2)"
#    And  paragraph 4 of article 9 contains attribute "leos:origin" with value "ec"
#    And  paragraph 4 of article 9 contains attribute "leos:softactionroot" with value "true"