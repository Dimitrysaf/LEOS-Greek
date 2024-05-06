#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in legal act in drafting instance

@LegalActScenarios
Feature: Legal Act Page Regression Features

    @citation_recital_editing @local
    Scenario: Add and removal of text in citation and recital element in legal Act
        Given navigate to edit drafting application with "User1"
        Then user is on repository browser page
        When click on create proposal button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation testing citation and recital scenarios" in create document page
        And  click on create button
        Then user is on proposal viewer page
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is displayed
        And  toc editing button is displayed and enabled
        # And  annotation side bar is minimized
        When mousehover and click on citation 1
        Then ck editor window is displayed
        When select content from offset 7 till offset 14 in citation 1 when ck editor is open
        And  click delete button from keyboard when ck editor is open
        And  add "New Text " at offset 7 in citation 1 when ck editor is open
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  citation 1 contains "New Text"
        And  citation 1 doesnot contain "regard"
        When mousehover and click on citation 2
        # When mousehover on citation 2 and click on edit button from action menu
        Then ck editor window is displayed
        When click close button of ck editor
        Then ck editor window is not displayed
        When mousehover and click on recital 2
        Then ck editor window is displayed
        When add " New Text " at offset 7 in recital 2 when ck editor is open
        And  select content from offset 0 till offset 7 in recital 2 when ck editor is open
        And  click delete button from keyboard when ck editor is open
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        And  recital 2 contains "New Text"
        And  recital 2 doesnot contain "Recital"
        When click on close button present in legal act page
        Then user is on proposal viewer page
        When click on close button on proposal viewer page
        Then user is on repository browser page

    @splittingParagraphInArticle @local
    Scenario: append text in existing paragraph and make same paragraph into two inside article
        Given navigate to edit drafting application with "User1"
        Then user is on repository browser page
        When click on create proposal button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation testing article ck editor scenario" in create document page
        And  click on create button
        Then user is on proposal viewer page
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is displayed
        And  toc editing button is displayed and enabled
        When mousehover and click on article 1
        # Then paragraph 1 of article 1 contains "Text..." when ck editor is open
        Then ck editor window is displayed
        When append " New Text " at offset 7 in paragraph 1 of article 1 when ck editor is open
        # Then paragraph 1 of article 1 contains "Text...New Text" when ck editor is open
        When move the cursor position to offset 7 in paragraph 1 of article 1 when ck editor is open
        And  click enter from keyboard when ck editor is open
        # Then paragraph 1 of article 1 contains "Text..." when ck editor is open
        # And  paragraph 2 of article 1 contains "New Text" when ck editor is open
        When click save and close button of ck editor
        Then ck editor window is not displayed
        And  2 paragraphs are present in article 1
        And  paragraph 1 of article 1 contains "Text..."
        And  paragraph 2 of article 1 contains "New Text"
        When click on close button present in legal act page
        Then user is on proposal viewer page

    @articleEditing @local
    Scenario: Addition of text and removal of text from article
        Given navigate to edit drafting application with "User1"
        Then user is on repository browser page
        When click on upload button
        Then active upload window label is "Upload a legislative document"
        When upload a leg file from a relative location "PROP_ACT-3210011215583606762-EN.leg"
        Then active upload window label is "Document metadata"
        And  document title input field is displayed
        When click on create button in upload document page
        Then user is on proposal viewer page
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is displayed
        And  toc editing button is displayed and enabled
        When click on toc edit button
        Then cancel button in navigation pane is displayed and enabled
        # Then below element lists are displayed in Elements menu
        #     | elementList |
        #     | Citation    |
        #     | Recital     |
        #     | Part        |
        #     | Title       |
        #     | Chapter     |
        #     | Section     |
        #     | Article     |
        When click on cancel button present in navigation pane
        Then toc editing button is displayed and enabled
        When mousehover and click on article 4
        Then ck editor window is displayed
        When click close button of ck editor
        #        When select content from offset 11 till offset 18 in numbered paragraph 1 of article when ck editor is open
        #        And  click delete button from keyboard when ck editor is open
        #        When append " New Text " at offset 22 in paragraph 1 of article 3 when ck editor is open
        #        When click save and close button of ck editor
        Then ck editor window is not displayed
    #        And  paragraph 1 of article 3 contains "New Text"
    #        And  paragraph 1 of article 3 doesnot contain "improve"

    @sampleDevTest @nonlocal
    Scenario: navigate to legal act page
        Given navigate to edit drafting application with "User1"
        Then user is on repository browser page
        When click on create proposal button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation testing article ck editor scenario" in create document page
        And  click on create button
        Then user is on proposal viewer page
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        And  annotation side bar is present
        And  ribbon toolbar is displayed
        And  toc editing button is displayed and enabled