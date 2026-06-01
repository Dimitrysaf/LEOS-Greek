#Author: Satyabrata Das
#Keywords Summary : Testing different functionalities in legal act in drafting instance

@LegalActScenarios
Feature: Legal Act Page Regression Features

  @articleWithSingleNumberedParagraph @local
  Scenario: Article with single paragraph cannot be numbered
    Given navigate to leos application with "username1"
    Then user is on home page
    When click on upload button
#    Then active upload window label contains "Upload a legislative document"
    When upload a leg file from a relative location "src/support/resources/fixtures/legFiles/PROP_ACT-3210011215583606762-EN.leg"
#    Then active upload window label contains "Document metadata"
#    And  document title input field is displayed
    When tick guidance approval checkbox in create document page
    When click on next button in create document page
    When click on create button in upload document page
    Then user is on act view page
    When click on legal act link present in act viewer page
    Then user is on legal act page
#    And  annotation side bar is present
#    And  ribbon toolbar is maximized
    When mouseover and click on article 1
    Then ck editor window is displayed
    When append "New Text" at offset 7 in numbered paragraph 1 of article in edition mode
#    Then numbered paragraph 1 of article contains "Text...New Text" in edition mode
#    When click save and close button of ck editor
#    Then drafting rule violations dialog box displayed with message "Articles with a single paragraph cannot be numbered."
#    Then click dialog ok button
    When move the cursor position to offset 7 in paragraph 1 of article in edition mode
    And  click enter from keyboard in edition mode
#    Then numbered paragraph 1 of article contains "Text..." in edition mode
#    And  numbered paragraph 2 of article contains "New Text" in edition mode
    When click save and close button of ck editor
    Then ck editor window is not displayed
#    When mouseover and click on article 1
#    Then ck editor window is displayed
#    When move the cursor position to offset 7 in paragraph 1 of article in edition mode
#    And  click delete button from keyboard in edition mode
#    Then numbered paragraph 1 of article contains "Text... New Text" in edition mode
#    When click save and close button of ck editor
#    Then drafting rule violations dialog box displayed with message "Articles with a single paragraph cannot be numbered."
#    Then click dialog ok button
#    When click at offset 8 of child 2 of li 1 with data-akn-element "paragraph" of article in edition mode
#    And  click enter from keyboard in edition mode
#    When click save and close button of ck editor
#    Then drafting rule violations dialog box displayed with message "Articles with a single paragraph cannot be numbered."
#    Then click dialog ok button
#    When append "New Text" at offset 0 in numbered paragraph 2 of article in edition mode
#    And  click save and close button of ck editor
#    Then ck editor window is not displayed

#    When click on toc edit button
##    Then cancel button is displayed and enabled in navigation pane
##    Then below element lists are displayed in Elements menu
##      | ElementList |
##      | Citation    |
##      | Recital     |
##      | Part        |
##      | Title       |
##      | Chapter     |
##      | Section     |
##      | Article     |
#    When drag element "Article" from element tree list and drop after node label "Article 2 - Definitions Text..." in navigation pane
##    Then enacting terms contains node label "Article # - Article heading... Text..." and showing as bold
##    And  wait for 1000 milliseconds
##    When click on three vertical dots for the element contains text "Article # - Article heading... Text..." in toc
##    And  click on delete option from eui dropdown content
##    Then "Delete Element: confirmation" dialog confirm box window is displayed
##    When click on ok button in dialog box window
##    Then enacting terms doesn't contain new element in navigation pane
##    When drag element "Article" from element tree list and drop before node label "Article 2 - Definitions Text..." in navigation pane
##    Then enacting terms contains node label "Article # - Article heading... Text..." and showing as bold
#    When click on save and close button in navigation pane
#    Then toc editing button is displayed and enabled
