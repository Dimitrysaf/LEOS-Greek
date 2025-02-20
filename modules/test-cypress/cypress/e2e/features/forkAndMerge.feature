#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities of clone proposal in drafting instance

@ForkAndMergeScenarios
Feature: fork and merge features

  @nonSupportUserAccessToCloneProposal @local
  Scenario: test fork and merge of a act
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Fork Merge Testing" in create document page
    And  click on create button
    Then user is on act viewer page
    And  title of the act contains "Automation Fork Merge Testing" keyword
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on milestones tab in act view page
    When click on add button in milestones tab
    Then add milestone window is displayed
    When click on milestone type dropdown
    Then "For Interservice Consultation" option is selected by default
    Then milestone title textBox is disabled
    When click on option "Other" from milestone type dropdown
    And  type "Commission act" in milestone title textBox
    When click on create milestone button
    Then successful message contains "Milestone created"
    And  "Commission act" is showing under title column of row 1 of milestones table
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
    And  name of act 1 contains "Automation Fork Merge Testing"
    And  contribution status of act 1 contains "Sent for contribution"
    When click on act 1
    Then user is on act viewer page
    And  chip content container 1 of act header contains "Contribution"
    And  chip content container 2 of act header contains "LEOS"
    And  total number of annexes present in act viewer page is 1
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    And  enable track changes toggle bar is on in ribbon toolbar
    And  enable track changes is disabled
    And  see track changes toggle bar is on in ribbon toolbar
    And  see track changes is enabled
    And  show clean version button is not present in ribbon toolbar
    When mouseover and click on article 1
    Then ck editor window is displayed
    And  enable track changes is disabled
    And  see track changes is disabled
    When click close button of ck editor
    Then ck editor window is not displayed
    And  enable track changes is disabled
    And  see track changes is enabled

  @moveLabelWithTrackChanges @local
  Scenario: Basic test to move element inside legal act when track changes is on
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-clymts48h00018g73xyrc19ma-en.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on add button in annexes section
    Then total number of annexes present in act viewer page is 1
    When click on milestones tab in act view page
    When click on add button in milestones tab
    And  click on create milestone button
    Then successful message contains "Milestone created"
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "Send a copy for contribution" under milestone actions
    Then "Send a copy of the milestone for contribution" dialog box window is displayed
    When provide input "demo" dialog box window
    And  click on row 1 from the user list
    And  click on send for contribution button
    Then successful message contains "Copy sent for contribution"
    When click on workspace button in breadcrumb item
    Then user is on repository browser page
    When click on act 2
    Then user is on act viewer page
    And  chip content container 1 of act header contains "Contribution"
    And  chip content container 2 of act header contains "LEOS"
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  enable track changes toggle bar is on in ribbon toolbar
    When click on toc edit button
    And  click on "Article 1 - Scope 1. Text..." link in navigation pane
    And  drag node label "Article 1 - Scope 1. Text..." and drop to node label "Article 3 - Entry into force This Regulation" in navigation pane
    And  "Article  1" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  1" in navigation pane
    And  "Article  #" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  #" in navigation pane
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  "Article  1" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  1" in navigation pane
    And  "Article  3" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  3" in navigation pane
    And "Article 1" is showing as strikethrough in num of article 1 of bill
    And "MOVED to Article 3" is showing as soft move label in num of article 1 of bill
    And heading tag is not present for article 1 of bill
    And paragraph tag is not present for article 1 of bill
    And "Article 2" is showing as track changes deleted in num of article 2 of bill
    And "Article 1" is showing as track changes inserted in num of article 2 of bill
    And "Article 3" is showing as track changes deleted in num of article 3 of bill
    And "Article 2" is showing as track changes inserted in num of article 3 of bill
    And "Article 3" is showing as inserted in num of article 4 of bill
    And "MOVED from Article 1" is showing as soft move label in num of article 4 of bill
    And heading tag is present for article 4 of bill
    And paragraph tag is present for article 4 of bill
    When click on "Article 4 - Subject matter and scope" link in navigation pane
    Then article 5 is displayed
    When mouseover and click on article 5
    Then ck editor window is displayed
    When click at offset 8 in li 2 with data-akn-element "point" of li 3 with data-akn-element "paragraph" of article in edition mode
    And  do right click in li 2 with data-akn-element "point" of li 3 with data-akn-element "paragraph" of article in edition mode
    And  click on option "Move this point to..." in "cke_panel_frame" iframe
    Then background color of li 2 with data-akn-element "point" of li 3 with data-akn-element "paragraph" of article is "rgb(255, 248, 220)" in edition mode
    And  li 2 with data-akn-element "point" of li 3 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-attr-softaction" in edition mode
    When click at offset 190 in li 1 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    When do right click in li 2 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article in edition mode
    And  mouseover on option "Move here" in "cke_panel_frame" iframe
    And  click on sub option "As point" in "cke_panel_frame" iframe
    Then li 2 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-attr-softaction" with value "move_from" in edition mode
    And  li 2 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "NEW" in edition mode
    And  li 2 with data-akn-element "point" of li 4 with data-akn-element "paragraph" of article contains attribute "new" in edition mode
    And  li 2 with data-akn-element "point" of li 3 with data-akn-element "paragraph" of article contains attribute "data-akn-attr-softaction" with value "move_to" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  point 2 of list 1 of paragraph 3 of article 5 contains attribute "leos:action" with value "delete"
    And  point 2 of list 1 of paragraph 3 of article 5 contains attribute "leos:softaction" with value "move_to"
    And  point 2 of list 1 of paragraph 3 of article 5 contains attribute "leos:softmove_label" with value "MOVED to Article 4(4), point (b)"
    And  point 2 of list 1 of paragraph 3 of article 5 contains attribute "leos:origin" with value "ec"
    And  point 2 of list 1 of paragraph 3 of article 5 contains attribute "leos:softactionroot" with value "true"
    And  point 2 of list 1 of paragraph 4 of article 5 contains attribute "leos:softaction" with value "move_from"
    And  point 2 of list 1 of paragraph 4 of article 5 contains attribute "leos:softmove_label" with value "MOVED from Article 4(3), point (b)"
    And  point 2 of list 1 of paragraph 4 of article 5 contains attribute "leos:origin" with value "ec"
    And  point 2 of list 1 of paragraph 4 of article 5 contains attribute "leos:softactionroot" with value "true"
    When click on "Article 4 - Subject matter and scope" link in navigation pane
    Then article 5 is displayed
    When mouseover and click on article 5
    Then ck editor window is displayed
    When click at offset 12 of li 2 with data-akn-element "paragraph" of article in edition mode
    And  do right click in li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on option "Move this paragraph to..." in "cke_panel_frame" iframe
    Then background color of li 2 with data-akn-element "paragraph" of article is "rgb(255, 248, 220)" in edition mode
    And  li 2 with data-akn-element "paragraph" of article doesn't contain attribute "data-akn-attr-softaction" in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "class" with value "selectedMovedElement" in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    When click on "Article 8 - Disproportionate burden" link in navigation pane
    Then article 9 is displayed
    When mouseover and click on article 9
    Then ck editor window is displayed
    When click at offset 250 of li 1 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    Then li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-action-number" with value "insert" in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "2." in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "new" in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-tc-original-number" with value "NEW" in edition mode
    When do right click in li 2 with data-akn-element "paragraph" of article in edition mode
    And  mouseover on option "Move here" in "cke_panel_frame" iframe
    And  click on sub option "As paragraph" in "cke_panel_frame" iframe
    Then li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-attr-softaction" with value "move_from" in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-attr-softactionroot" with value "true" in edition mode
    And  li 2 with data-akn-element "paragraph" of article contains attribute "data-akn-num" with value "2." in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
    And  paragraph 2 of article 5 contains attribute "leos:action" with value "delete"
    And  paragraph 2 of article 5 contains attribute "leos:softaction" with value "move_to"
    And  paragraph 2 of article 5 contains attribute "leos:softmove_label" with value "MOVED to Article 8(2)"
    And  paragraph 2 of article 5 contains attribute "leos:origin" with value "ec"
    And  paragraph 2 of article 5 contains attribute "leos:softactionroot" with value "true"
    And  paragraph 2 of article 9 contains attribute "leos:softaction" with value "move_from"
    And  paragraph 2 of article 9 contains attribute "leos:softmove_label" with value "MOVED from Article 4(2)"
    And  paragraph 2 of article 9 contains attribute "leos:origin" with value "ec"
    And  paragraph 2 of article 9 contains attribute "leos:softactionroot" with value "true"

  @forkMerge @contributionPane @local
  Scenario: merge updated and moved elements from contribution
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-forkMerge-en.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on act viewer page
    When click on milestones tab in act view page
    When click on add button in milestones tab
    And  click on create milestone button
    Then successful message contains "Milestone created"
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "Send a copy for contribution" under milestone actions
    Then "Send a copy of the milestone for contribution" dialog box window is displayed
    When provide input "demo" dialog box window
    And  click on row 1 from the user list
    And  click on send for contribution button
    Then successful message contains "Copy sent for contribution"
    When click on workspace button in breadcrumb item
    Then user is on repository browser page
    When click on act 2
    Then user is on act viewer page
    And  chip content container 1 of act header contains "Contribution"
    And  chip content container 2 of act header contains "LEOS"
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  enable track changes toggle bar is on in ribbon toolbar
    When click on toc edit button
    And  click on "Article 1 - Scope 1. Text..." link in navigation pane
    And  drag node label "Article 1 - Scope 1. Text..." and drop to node label "Article 3 - Entry into force This Regulation" in navigation pane
    And  "Article  1" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  1" in navigation pane
    And  "Article  #" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  #" in navigation pane
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And  "MOVED" is showing as soft move label with soft move title " Article  1" in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Article  3" in navigation pane
    And "Article 1" is showing as strikethrough in num of article 1 of bill
    And "MOVED to Article 3" is showing as soft move label in num of article 1 of bill
    And heading tag is not present for article 1 of bill
    And paragraph tag is not present for article 1 of bill
    And "Article 3" is showing as inserted in num of article 4 of bill
    And "MOVED from Article 1" is showing as soft move label in num of article 4 of bill
    And heading tag is present for article 4 of bill
    And paragraph tag is present for article 4 of bill
    When click on toc edit button
    #And  click on "Chapter 1 - Chapter heading" link in navigation pane
    And  minimize "Chapter 1 - Chapter heading" link in navigation pane
    And  minimize "Chapter 2 - Chapter heading..." link in navigation pane
    And  drag node label "Chapter 1 - Chapter heading" and drop after node label "Chapter 2 - Chapter heading..." in navigation pane
    And  "Chapter  1" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Chapter  1" in navigation pane
    And  "Chapter  #" is showing as soft move title in navigation pane
    And  "MOVED" is showing as soft move label with soft move title " Chapter  #" in navigation pane
    When click on save and close button in navigation pane
    Then toc editing button is displayed and enabled
    And "Chapter 1" is showing as strikethrough in num of chapter 1 of bill
    And "MOVED to Chapter 3" is showing as soft move label in num of chapter 1 of bill
    And "Chapter 3" is showing as inserted in num of chapter 3 of bill
    And "MOVED from Chapter 1" is showing as soft move label in num of chapter 3 of bill
    When click on close button present in legal act page
    Then user is on act viewer page
    When click on milestones tab in act view page
    When click on add button in milestones tab
    And  click on create milestone button
    Then successful message contains "Contribution from Legal Service has been created"
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "Send contribution" under milestone actions
    And  click on confirm button in dialog confirm box window
    Then successful message contains "Contribution sent"
    When click on workspace button in breadcrumb item
    Then user is on repository browser page
    When click on act 1
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    When click on contributions pane accordion
    And  click on first contribution
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    When click on merge actions menu of "chapter" 1
    When click on merge action "Accept Change"
    And  click on apply changes
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 1
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 2
    Then check that "chapter" 1 is accepted
    Then check that "chapter" 3 is accepted
    When click on "Undo" in merge actions menu of "chapter" 1
    And  click on apply changes
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that there is no merge action on "chapter" 1
    Then check that there is no merge action on "chapter" 3
    When click on merge actions menu of "chapter" 1
    When click on merge action "Accept with Tracked Changes"
    And  click on apply changes
    Then check that "chapter" with id "movedXectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" 1 contains attribute "leos:action" with value "delete"
    Then check that "chapter" 1 contains attribute "leos:softaction" with value "move_to"
    Then check that "chapter" 1 contains attribute "leos:softmove_label" with value "MOVED to Chapter 3"
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 3
    Then check that "chapter" 3 contains attribute "leos:softaction" with value "move_from"
    Then check that "chapter" 3 contains attribute "leos:softmove_label" with value "MOVED from Chapter 1"
    Then check that "chapter" 1 is accepted with track changes
    Then check that "chapter" 3 is accepted with track changes
    When click on "Undo" in merge actions menu of "chapter" 1
    And  click on apply changes
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that there is no merge action on "chapter" 1
    When click on merge actions menu of "chapter" 1
    When click on merge action "Mark as processed"
    And  click on apply changes
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that "chapter" 1 is processed
    Then check that "chapter" 3 is processed
    When click on "Undo" in merge actions menu of "chapter" 1
    And  click on apply changes
    Then check that there is no merge action on "chapter" 1
    Then check that there is no merge action on "chapter" 3
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that "article" with id "eciggpqovxoa4EkrU" is at position 1
    Then check that "article" with id "ec5wMGDVg0j6wcxaL" is at position 2
    Then check that "article" with id "ecpHTv9uxSm6OsxU0" is at position 3
    When click on merge actions menu of "article" 2
    When click on merge action "Accept Change"
    And  click on apply changes
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that "article" with id "ec5wMGDVg0j6wcxaL" is at position 1
    Then check that "article" with id "ecpHTv9uxSm6OsxU0" is at position 2
    Then check that "article" with id "eciggpqovxoa4EkrU" is at position 3
    Then check that "article" 2 is accepted
    Then check that "article" 3 is accepted
    When click on "Undo" in merge actions menu of "article" 2
    And  click on apply changes
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that "article" with id "eciggpqovxoa4EkrU" is at position 1
    Then check that "article" with id "ec5wMGDVg0j6wcxaL" is at position 2
    Then check that "article" with id "ecpHTv9uxSm6OsxU0" is at position 3
    Then check that there is no merge action on "article" 2
    Then check that there is no merge action on "article" 3
    When click on merge actions menu of "article" 2
    When click on merge action "Accept with Tracked Changes"
    And  click on apply changes
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that "article" with id "movedXeciggpqovxoa4EkrU" is at position 1
    Then check that "article" 1 contains attribute "leos:action" with value "delete"
    Then check that "article" 1 contains attribute "leos:softaction" with value "move_to"
    Then check that "article" 1 contains attribute "leos:softmove_label" with value "MOVED to Article 3"
    Then check that "article" with id "ec5wMGDVg0j6wcxaL" is at position 2
    Then check that "article" with id "ecpHTv9uxSm6OsxU0" is at position 3
    Then check that "article" with id "eciggpqovxoa4EkrU" is at position 4
    Then check that "article" 4 contains attribute "leos:softaction" with value "move_from"
    Then check that "article" 4 contains attribute "leos:softmove_label" with value "MOVED from Article 1"
    Then check that "article" 2 is accepted with track changes
    Then check that "article" 3 is accepted with track changes
    When click on "Undo" in merge actions menu of "article" 2
    And  click on apply changes
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that "article" with id "eciggpqovxoa4EkrU" is at position 1
    Then check that "article" with id "ec5wMGDVg0j6wcxaL" is at position 2
    Then check that "article" with id "ecpHTv9uxSm6OsxU0" is at position 3
    Then check that there is no merge action on "article" 2
    Then check that there is no merge action on "article" 3
    When click on merge actions menu of "article" 2
    When click on merge action "Mark as processed"
    And  click on apply changes
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that "article" with id "eciggpqovxoa4EkrU" is at position 1
    Then check that "article" with id "ec5wMGDVg0j6wcxaL" is at position 2
    Then check that "article" with id "ecpHTv9uxSm6OsxU0" is at position 3
    Then check that "article" 2 is processed
    Then check that "article" 3 is processed
    When click on "Undo" in merge actions menu of "article" 2
    And  click on apply changes
    Then check that "chapter" with id "ectasxzT07u6ev8zH" is at position 1
    Then check that "chapter" with id "ecRdsDU6hHPKTgg5F" is at position 2
    Then check that "article" with id "eciggpqovxoa4EkrU" is at position 1
    Then check that "article" with id "ec5wMGDVg0j6wcxaL" is at position 2
    Then check that "article" with id "ecpHTv9uxSm6OsxU0" is at position 3
    Then check that there is no merge action on "article" 2
    Then check that there is no merge action on "article" 3