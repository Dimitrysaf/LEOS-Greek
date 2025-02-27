#Author: Satyabrata Das
#Keywords Summary : Testing different comparison functionalities

@ComparisonFunctionality
Feature: Comparison Functionality Regression Features

  @comparison @articleComparisonFunctionality
  Scenario: comparison of different versions for article operations
    Given navigate to edit drafting application with "User1"
    Then user is on home page
    When click on Create act button
    Then user is on create new legislative document window
    When click on template "SJ-023" in create new legislative document window
    When click on next button in create document page
    And  provide document title "Automation Article Comparison Functionality Testing" in create document page
    And  click on create button
    Then user is on act viewer page
    When click on legal act link present in act viewer page
    Then user is on legal act page
    And  annotation side bar is present
    And  ribbon toolbar is maximized
    When click on insert before icon of article 2
    Then article 2 is displayed
    And  heading of article 2 contains "Article heading..."
    When click on delete icon of article 2
    Then "Delete Element: confirmation" dialog confirm box window is displayed
    When click on ok button in dialog box window
    When mouseover and click on article 1
    Then ck editor window is displayed
    When append " New Text " at offset 7 in numbered paragraph 1 of article in edition mode
    And  move the cursor position to offset 7 in paragraph 1 of article in edition mode
    And  click enter from keyboard in edition mode
    When click save and close button of ck editor
    When mouseover and click on article 1
    Then ck editor window is displayed
    When select content from offset 0 till offset 8 in numbered paragraph 2 of article in edition mode
    And  click delete button from keyboard in edition mode
    And  click save and close button of ck editor
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 7 of li 1 with data-akn-element "paragraph" of article in edition mode
    When click on paragraph mode icon present in ck editor panel
    And  click enter from keyboard in edition mode
    And  add content "Automation testing " to li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  click on increase indent icon present in ck editor panel
    And  add content "Automation testing 2" to li 1 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  click on increase indent icon present in ck editor panel
    And  add content "Text" to li 2 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  click on increase indent icon present in ck editor panel
    And  add content "Text2" to li 3 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click enter from keyboard in edition mode
    And  click on increase indent icon present in ck editor panel
    And  add content "Text3" to li 4 with data-akn-element "point" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    When mouseover and click on article 1
    Then ck editor window is displayed
    When click at offset 0 in li 1 with data-akn-element "indent" of li 2 with data-akn-element "paragraph" of article in edition mode
    And  click on decrease indent icon present in ck editor panel
    And  click save and close button of ck editor
    Then ck editor window is not displayed
    When click on versions pane accordion
    Then compare versions button is displayed in versions pane section
    When click on show more button in "Recent changes" eui-card
    And  user clicks on compare button from version pane
    Then compare section is displayed in ribbon toolbar
    And  eui-label " Select 2 versions to compare " is displayed in compared section of ribbon toolbar
    When tick on checkbox of major version "Version 0.1.0 - Document created"
    And  tick on checkbox of minor version "0.1.1 inserted" in "Recent changes" eui-card
    Then eui-label " Comparing 0.1.0 and 0.1.1 " is displayed in compared section of ribbon toolbar
    And  comparison container is displayed
    And  article 2 contains attribute "class" with value "leos-content-new" in comparison window
    And  span tag with attribute "leos-content-removed" of num tag of article 3 contains value " 2" in comparison window
    And  span tag with attribute "leos-content-new" of num tag of article 3 contains value " 3" in comparison window
    And  span tag with attribute "leos-content-removed" of num tag of article 4 contains value " 3" in comparison window
    And  span tag with attribute "leos-content-new" of num tag of article 4 contains value " 4" in comparison window
    When unTick on checkbox of minor version "0.1.1 inserted" in "Recent changes" eui-card
    And  tick on checkbox of minor version "0.1.3Article 1 updated" in "Recent changes" eui-card
    Then eui-label " Comparing 0.1.0 and 0.1.3 " is displayed in compared section of ribbon toolbar
    And  paragraph 1 of article 1 contains attribute "class" with value "leos-content-new" in comparison window
    And  span tag with attribute "leos-content-removed" of num tag of paragraph 2 of article 1 contains value "1." in comparison window
    And  span tag with attribute "leos-content-new" of num tag of paragraph 2 of article 1 contains value "2." in comparison window
    And  span tag with attribute "leos-content-removed" of content of paragraph 2 of article 1 contains value "Text..." in comparison window
    And  span tag with attribute "leos-content-removed" of num tag of paragraph 3 of article 1 contains value "2." in comparison window
    And  span tag with attribute "leos-content-new" of num tag of paragraph 3 of article 1 contains value "3." in comparison window
    When unTick on checkbox of minor version "0.1.3Article 1 updated" in "Recent changes" eui-card
    And  tick on checkbox of minor version "0.1.4Article 1 updated" in "Recent changes" eui-card
    Then eui-label " Comparing 0.1.0 and 0.1.4 " is displayed in compared section of ribbon toolbar
    And  paragraph 1 of article 1 contains attribute "class" with value "leos-content-new" in comparison window
    And  paragraph 2 of article 1 contains attribute "class" with value "leos-content-removed" in comparison window
    When unTick on checkbox of minor version "0.1.4Article 1 updated" in "Recent changes" eui-card
    And  tick on checkbox of minor version "0.1.5Article 1 updated" in "Recent changes" eui-card
    Then eui-label " Comparing 0.1.0 and 0.1.5 " is displayed in compared section of ribbon toolbar
    And  paragraph 1 of article 1 contains attribute "class" with value "leos-content-new" in comparison window
    And  paragraph 2 of article 1 contains attribute "class" with value "leos-content-removed" in comparison window
    And  paragraph 3 of article 1 contains attribute "class" with value "leos-content-new" in comparison window
    And  content of subparagraph 1 of list 1 of paragraph 3 of article 1 contains "Automation testing" in comparison window
    And  num tag of point 1 of list 1 of paragraph 3 of article 1 contains "(a)" in comparison window
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "Automation testing 2" in comparison window
    And  num tag of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "(i)" in comparison window
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "Text" in comparison window
    And  num tag of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "(1)" in comparison window
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "Text2" in comparison window
    And  num tag of indent 1 of list 1 of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "—" in comparison window
    And  content of indent 1 of list 1 of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "Text3" in comparison window
    And  num tag of paragraph 4 of article 1 contains attribute "class" with value "leos-content-removed" in comparison window
    When unTick on checkbox of minor version "0.1.5Article 1 updated" in "Recent changes" eui-card
    And  tick on checkbox of minor version "0.1.6Article 1 updated" in "Recent changes" eui-card
    Then eui-label " Comparing 0.1.0 and 0.1.6 " is displayed in compared section of ribbon toolbar
    And  paragraph 1 of article 1 contains attribute "class" with value "leos-content-new" in comparison window
    And  paragraph 2 of article 1 contains attribute "class" with value "leos-content-removed" in comparison window
    And  paragraph 3 of article 1 contains attribute "class" with value "leos-content-new" in comparison window
    And  content of subparagraph 1 of list 1 of paragraph 3 of article 1 contains "Automation testing" in comparison window
    And  num tag of point 1 of list 1 of paragraph 3 of article 1 contains "(a)" in comparison window
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "Automation testing 2" in comparison window
    And  num tag of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "(i)" in comparison window
    And  content of subparagraph 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "Text" in comparison window
    And  num tag of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "(1)" in comparison window
    And  content of point 1 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "Text2" in comparison window
    And  num tag of point 2 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "(2)" in comparison window
    And  content of point 2 of list 1 of point 1 of list 1 of point 1 of list 1 of paragraph 3 of article 1 contains "Text3" in comparison window
    And  num tag of paragraph 4 of article 1 contains attribute "class" with value "leos-content-removed" in comparison window
    When close the comparison section from the ribbon bar
    Then comparison container is not displayed
    And  compare section is not displayed in ribbon toolbar