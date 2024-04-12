#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in legal act in drafting instance

@LegalActScenarios
Feature: Legal Act Page Regression Features

    @legalActScenario_Citation @local
    Scenario: Edition of citation elements in legal Act
        Given navigate to edit drafting application
        Then user is on repository browser page
        When click on create proposal button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation Testing Citation Scenarios" in create document page
        And  click on create button
        Then user is on proposal viewer page
        When click on legal act link present in proposal viewer page
        Then user is on legal act page

        And  annotation side bar is present
        And  navigation pane is displayed
        And  toc editing button is available
        Then toggle bar moved to right
        Then below options are displayed
            | Versions                             |
            | Save this version                    |
            | Export this version                  |
            | Export this version with annotations |
            | Import                               |
            | Import from the Official Journal     |
            | View                                 |
            | See user guidance                    |
            | See navigation pane                  |
        When click on preamble toggle link
        When click on citation link present in navigation pane
        And  double click on citation 1
        And  wait for disappearance of the loading progress bar
        Then ck editor window is displayed
        And  get text from ck editor text box
        When add "New Text" and delete "Treaty " in the ck editor text box
        And  click on save close button of ck editor
        And  wait for disappearance of the loading progress bar
        Then ck editor window is not displayed
        And  "New Text" is added to citation 1 in legal act
        And  "Treaty" is deleted from citation 1 in legal act
        When mouseHover and click on show all action button and click on edit button of citation 2
        And  wait for disappearance of the loading progress bar
        Then ck editor window is displayed
        And  get text from ck editor text box
        When click on close button of ck editor
        And  wait for disappearance of the loading progress bar
        Then ck editor window is not displayed
        When click on close button present in legal act page
        Then user is on proposal viewer page