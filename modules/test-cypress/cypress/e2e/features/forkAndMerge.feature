#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities of clone proposal in drafting instance

@ForkAndMergeScenarios
Feature: fork and merge features

  @forkMerge @local
  Scenario: merge updated and moved elements from contribution
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on upload button
    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "PROP_ACT-forkMerge-en.leg"
    Then active upload window label contains "Document metadata"
    And  document title input field is displayed
    When click on create button in upload document page
    Then user is on proposal viewer page
    When click on milestones tab in proposal view page
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
    When click on proposal 2
    Then user is on proposal viewer page
    And  chip content container 1 of proposal header contains "Contribution"
    And  chip content container 2 of proposal header contains "LEOS"
    When click on legal act link present in proposal viewer page
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
    And  click on "Chapter 1 - Chapter heading" link in navigation pane
    And  drag node label "Chapter 1 - Chapter heading" and drop to node label "Enacting Terms" in navigation pane
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
    Then user is on proposal viewer page
    When click on milestones tab in proposal view page
    When click on add button in milestones tab
    And  click on create milestone button
    Then successful message contains "Contribution from Legal Service has been created"
    And  "File ready" is showing under status column of row 1 of milestones table
    When click on three dots under actions column of row 1 of milestones table
    When click on option "Send contribution" under milestone actions
    And  click on confirm button
    Then successful message contains "Contribution sent"
    When click on workspace button in breadcrumb item
    Then user is on repository browser page
    When click on proposal 1
    Then user is on proposal viewer page
    When click on legal act link present in proposal viewer page
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


