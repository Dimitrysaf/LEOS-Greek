#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in cover page in drafting instance

@CoverPageScenarios
Feature: cover page Regression Features

    Background:
        Given navigate to edit drafting application with "User1"
        Then user is on home page
        When click on Create act button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation Cover Page Testing" in create document page
        And  click on create button
        Then user is on act viewer page

    @coverPage @local
    Scenario: edition of title in cover page 
        And  title of the act contains "Automation Cover Page Testing" keyword
        When click on legal act link present in act viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is maximized
        And  toc editing button is displayed and enabled
        And  preface long title docPurpose contains "Automation Cover Page Testing"
        When click on versions pane accordion
        Then compare versions button is displayed in versions pane section
        And  search button is displayed in versions pane section
        And  navigation pane is minimized
        And  "No changes after last version" subtitle is displayed under recent changes version card
        And  last version card header title contains "Version 0.1.0 - Document created"
        When click on close button present in legal act page
        Then user is on act viewer page
        When click on cover page link present in act viewer page
        Then user is on cover page
        And  annotation side bar is present
        When click on versions pane accordion
        Then navigation pane is minimized
        And  "No changes after last version" subtitle is displayed under recent changes version card
        And  last version card header title contains "Version 0.1.0 - Document created"
        When click on navigation pane accordion
        And  only title element is present in navigation pane
        When click on title link in navigation pane
        Then long title docPurpose of cover page is "Automation Cover Page Testing"
        When click on long title of doc purpose
        Then ck editor window is displayed
        And  15 plugins are available in ck editor window
        And  save button is disabled in ck editor
        And  save close button is disabled in ck editor
        And  close button is enabled in ck editor
        And  cut button is disabled in ck editor
        And  copy button is disabled in ck editor
        And  paste button is enabled in ck editor
        And  undo button is disabled in ck editor
        And  redo button is disabled in ck editor
        And  subscript button is enabled in ck editor
        And  superscript button is enabled in ck editor
        And  special character button is enabled in ck editor
        And  show blocks button is enabled in ck editor
        And  source button is enabled in ck editor
        When replace content "Automation Testing Cover Page" with the existing content in cover page long title 
        And  click save and close button of ck editor
        Then long title docPurpose of cover page is "Automation Testing Cover Page"
        When click on versions pane accordion
        Then compare versions button is displayed in versions pane section
        And  search button is displayed in versions pane section
        And  navigation pane is minimized
        And  last subversion of recent changes version card contains "0.1.1Document title updated"
        And  last version card header title contains "Version 0.1.0 - Document created"
        When click on close button present in cover page
        Then user is on act viewer page
        And  title of the act contains "Automation Testing Cover Page" keyword
        When click on home button
        Then user is on home page
        And  my latest activity table is displayed
        And  name of the proposal in row 1 of my latest activity table contains "Automation Testing Cover Page"
        When click on proposal 1 in my latest activity table
        Then user is on act viewer page
        When click on favourite icon
        Then favourite icon is selected
        When click on home button
        Then user is on home page
        And  my favourites table is displayed
        And  name of the proposal in row 1 of my favourites table contains "Automation Testing Cover Page"
        When click on proposal 1 in my favourites table
        Then user is on act viewer page
        When click on legal act link present in act viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is maximized
        And  toc editing button is displayed and enabled
        And  preface long title docPurpose contains "Automation Testing Cover Page"
        When click on versions pane accordion
        Then compare versions button is displayed in versions pane section
        And  search button is displayed in versions pane section
        And  navigation pane is minimized
        And  last subversion of recent changes version card contains "0.1.1Document title updated"
        And  last version card header title contains "Version 0.1.0 - Document created"
        When click on home link in breadcrumb item
        Then user is on home page
