#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in legal act in drafting instance

@LegalActScenarios
Feature: Legal Act Page Regression Features

    @legalActScenario_citation_recital @local
    Scenario: Add and removal of text in citation and recital element in legal Act
        Given navigate to edit drafting application
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
        And  toc editing button is available
        # And  annotation side bar is minimized
        When mousehover and click on citation 1
        Then ck editor window is displayed
        # When add " New Text " at offset 7 in citation 1 when ck editor is open
        And  select content from offset 7 till offset 14 in citation 1 when ck editor is open
        And  click delete button from keyboard when ck editor is open
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        # And  citation 1 contains "New Text"
        And  citation 1 doesnot contain "regard"
        When mousehover and click on citation 2
        # When mousehover on citation 2 and click on edit button from action menu
        Then ck editor window is displayed
        When click close button of ck editor
        Then ck editor window is not displayed
        When mousehover and click on recital 2
        Then ck editor window is displayed
#        When add " New Text " at offset 7 in recital 1 when ck editor is open
        And  select content from offset 0 till offset 7 in recital 2 when ck editor is open
        And  click delete button from keyboard when ck editor is open
        And  click save and close button of ck editor
        Then ck editor window is not displayed
        # And  recital 1 contains "New Text"
        And  recital 2 doesnot contain "Recital"
        When click on close button present in legal act page
        Then user is on proposal viewer page
        
    @splitParagraphArticleEditing @local
    Scenario: append text in existing paragraph and make same paragraph into two inside article
        Given navigate to edit drafting application
        Then user is on repository browser page
        When click on create proposal button
        Then user is on create new legislative document window
        When click on template "SJ-023" in create new legislative document window
        When click on next button in create document page
        And  provide document title "Automation ck editor testing scenario" in create document page
        And  click on create button
        Then user is on proposal viewer page
        When click on legal act link present in proposal viewer page
        Then user is on legal act page
        When mousehover article 1
        # Then "Text..." is present in content of paragraph 1 of article 1
        When open ck editor for article 1
        Then ck editor window is displayed
        When append " adding new data " at offset 8 in paragraph 1 of article 1 when ck editor is open
        # Then "Text...adding new data" is present in paragraph 1 of article 1 when ck editor is open
        And  click enter from keyboard when ck editor is open
        # Then "Text..." is present in paragraph 1 of article 1 when ck editor is open
        # And  "adding new data" is present in paragraph 1 of article 1 when ck editor is open
        And click save and close button of ck editor
        Then ck editor window is not displayed
        And  2 paragraphs are present in article 1
        # And "Text..." is present in content of paragraph 1 of article 1
        # And  "adding new data" is present in content of paragraph 2 of article 1
        When click on close button present in legal act page
        Then user is on proposal viewer page